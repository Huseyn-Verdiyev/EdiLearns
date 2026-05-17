const fs = require('fs');

const win1252Map = {
    0x20AC: 0x80, // €
    0x201A: 0x82, // ‚
    0x0192: 0x83, // ƒ
    0x201E: 0x84, // „
    0x2026: 0x85, // …
    0x2020: 0x86, // †
    0x2021: 0x87, // ‡
    0x02C6: 0x88, // ˆ
    0x2030: 0x89, // ‰
    0x0160: 0x8A, // Š
    0x2039: 0x8B, // ‹
    0x0152: 0x8C, // Œ
    0x017D: 0x8E, // Ž
    0x2018: 0x91, // ‘
    0x2019: 0x92, // ’
    0x201C: 0x93, // “
    0x201D: 0x94, // ”
    0x2022: 0x95, // •
    0x2013: 0x96, // –
    0x2014: 0x97, // —
    0x02DC: 0x98, // ˜
    0x2122: 0x99, // ™
    0x0161: 0x9A, // š
    0x203A: 0x9B, // ›
    0x0153: 0x9C, // œ
    0x017E: 0x9E, // ž
    0x0178: 0x9F  // Ÿ
};

try {
    const content = fs.readFileSync('index.html', 'utf8');
    const buffer = Buffer.alloc(content.length);
    let bufIdx = 0;

    for (let i = 0; i < content.length; i++) {
        const code = content.charCodeAt(i);
        let byteVal = code;

        // Map reverse Win1252 special ranges
        if (win1252Map[code]) {
            byteVal = win1252Map[code];
        } else if (code > 0xFF) {
            // Characters that are NOT in Win1252 map and > 255.
            // This suggests they might be valid UTF-8 chars that were NOT corrupted?
            // Or they are part of a double-corruption.
            // However, typical Mojibake results in chars < 256 OR these specific Win1252 extras.
            // If we encounter "Ə" (U+018F) which I fixed previously?
            // My previous script fixed "Æ" -> "Ə".
            // If I run this script on ALREADY repaired chars like "Ə" (U+018F),
            // U+018F is NOT in win1252Map.
            // If I forcefully cast to byte, 0x18F & 0xFF = 0x8F.
            // 0x8F is a control char.
            // Valid "Ə" in UTF-8 is bytes C6 8F.
            // If "Ə" is ALREADY a character in string, I should probably keep it?
            // NO, the corruption is global. The "Ə" I manually fixed might be in a different state.
            // Actually, I manually replaced "Æ" (0xC6) with "Ə" (U+018F).
            // "Æ" corresponds to byte 0xC6.
            // In the original corruption: "Ə" (bytes C6 8F).
            // C6 -> "Æ" (Win1252)
            // 8F -> undefined (Win1252) -> passed through as \u008F usually?
            // My previous script replaced "Æ" with "Ə". It likely left the trailing 0x8F hanging?
            // Let's check hex dump line 113: `0x8f`.
            // Line 112 was `Ə` (0x18f).
            // So I have `Ə` followed by `0x8f`.
            // This confirm my suspicion. "Ə" (U+018F) should be TWO bytes: C6 8F.
            // My clean up script replaced C6 with U+018F, but left 8F alone.
            // So now I have U+018F 0x8F.
            // This is messy.

            // STRATEGY: 
            // 1. Revert my specific manual fixes roughly?
            //    "Ə" -> back to 0xC6? (Since 0x8F is next to it).
            //    "ə" (U+0259) -> bytes C9 99.
            //    If I have "ə", check if next is 0x99.
            //    "ö" (U+00F6) -> C3 B6.
            //    "ü" (U+00FC) -> C3 BC.
            //    "ç" (U+00E7) -> C3 A7. 
            //    "ş" (U+015F) -> C5 9F.
            //    "ı" (U+0131) -> C4 B1.
            //    "ğ" (U+011F) -> C4 9F.

            // Actually, simply treating them as > 0xFF means they are likely the result of my previous fix.
            // I should probbaly SKIP this global fix for chars I already fixed?
            // But the FILE is mixed now.

            // IMPORTANT: The corrupt icons are STILL corrupted because I didn't fix them.
            // They are sequences of chars < 0xFF (mostly) + Win1252 specials.
            // Use the "Recover" approach only for the corrupted sequences?
            // No, the WHOLE FILE (except what I touched) is corrupted.
            // What if I undo my 'fix_encoding.js' logic by replacing back?

            // "Ə" -> "\u00C6"
            // "ə" -> "\u00E9\u2122" (É™ -> C3 A9 E2 84 A2? No.)
            // "ə" bytes C9 99.
            // C9 -> É
            // 99 -> ™
            // So "ə" was "É™".

            // I should revert "ə" to 0xC9 (É) and 0x99 (™)??
            // NO. I replaced "É™" with "ə".
            // So "ə" is now U+0259.
            // The bytes for "ə" are C9 99.
            // Use Buffer.from('ə') -> <Buffer c9 99> (UTF-8).
            // If I just write valid UTF-8 chars into the buffer, I am fine.

            // BUT, the corrupt icons are SPLIT across multiple 'chars'.
            // e.g. House is F0 9F 8F A0.
            // F0 -> ð (0xF0)
            // 9F -> Ÿ (0x178 -> mapped to 0x9F)
            // 8F -> 0x8F
            // A0 -> 0xA0

            // So if I encounter a high char like `ə` (U+0259), it's already good!
            // I should write its UTF-8 bytes to the buffer?
            // Yes.

            const charBuf = Buffer.from(String.fromCharCode(code), 'utf8');
            for (const b of charBuf) {
                buffer[bufIdx++] = b;
            }
            continue;
        }

        buffer[bufIdx++] = byteVal;
    }

    // Slice the buffer to actual used length
    const resultBuffer = buffer.slice(0, bufIdx);

    // Decode properly as UTF-8
    const fixedContent = resultBuffer.toString('utf8');

    fs.writeFileSync('index.html', fixedContent, 'utf8');
    console.log('Successfully repaired Mojibake in index.html');

} catch (err) {
    console.error('Error repairing:', err);
}
