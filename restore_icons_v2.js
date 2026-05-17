const fs = require('fs');

try {
    let content = fs.readFileSync('index.html', 'utf8');

    // Mappings of partial/corrupted text to correct icon + text
    // We use . (dot) to match any char including replacement char \uFFFD

    const restorations = [
        { key: /[\uFFFD\s]+Resurslar/, val: '📚 Resurslar' },
        { key: /[\uFFFD\s]+Kitablar/, val: '📖 Kitablar' },
        { key: /[\uFFFD\s]+Xallar/, val: '💎 Xallar' },
        { key: /[\uFFFD\s]+Bəcəriklər/, val: '🌳 Bəcəriklər' },

        // "Tvsiyələr" might be T\uFFFDvsiy\uFFFDl\uFFFDr or similar
        { key: /[\uFFFD\s]+T.vsiy.l.r/, val: '💡 Tövsiyələr' },
        { key: /[\uFFFD\s]+EduBot/, val: '🤖 EduBot' },
        { key: /[\uFFFD\s]+Xəbərlər/, val: '📰 Xəbərlər' },
        { key: /[\uFFFD\s]+Dostlar/, val: '👥 Dostlar' },

        // "Shbət" -> S.hb.t
        { key: /[\uFFFD\s]+S.hb.t/, val: '💬 Söhbət' },
        { key: /[\uFFFD\s]+Canlı Dərs/, val: '📹 Canlı Dərs' },

        // "Özünü" -> .z.n.
        { key: /[\uFFFD\s]+.z.n.\s+Yoxla/, val: '✅ Özünü Yoxla' },

        // Streak count: " <span" or similar. 
        // Be careful not to replace too much.
        // Look for the ID
        { key: /[\uFFFD\s]+<span id="streak-count"/, val: '🔥 <span id="streak-count"' }
    ];

    for (const item of restorations) {
        content = content.replace(item.key, item.val);
    }

    fs.writeFileSync('index.html', content, 'utf8');
    console.log('Successfully aggressively restored icons and corrupted text in index.html');

} catch (err) {
    console.error('Error repairing icons:', err);
}
