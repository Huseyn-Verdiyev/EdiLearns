const fs = require('fs');

try {
    let content = fs.readFileSync('index.html', 'utf8');

    // Mappings of text (with replacement chars) to correct icon + text
    // Note: The replacement char \uFFFD might appear as one or two chars depending on damage
    // We will Regex match the text part and replace the icon before tit.

    const restorations = [
        { key: /[\uFFFD]+\s*Resurslar/, val: '📚 Resurslar' },
        { key: /[\uFFFD]+\s*Kitablar/, val: '📖 Kitablar' },
        { key: /[\uFFFD]+\s*Xallar/, val: '💎 Xallar' },
        { key: /[\uFFFD]+\s*Bəcəriklər/, val: '🌳 Bəcəriklər' },
        { key: /[\uFFFD]+\s*Tövsiyələr/, val: '💡 Tövsiyələr' },
        { key: /[\uFFFD]+\s*EduBot/, val: '🤖 EduBot' },
        { key: /[\uFFFD]+\s*Xəbərlər/, val: '📰 Xəbərlər' },
        { key: /[\uFFFD]+\s*Dostlar/, val: '👥 Dostlar' },
        { key: /[\uFFFD]+\s*Söhbət/, val: '💬 Söhbət' },
        { key: /[\uFFFD]+\s*Canlı Dərs/, val: '📹 Canlı Dərs' },
        // Line 205 might be just one replacement char + span
        { key: />[\uFFFD]+\s*<span id="streak-count"/, val: '>🔥 <span id="streak-count"' }
    ];

    for (const item of restorations) {
        content = content.replace(item.key, item.val);
    }

    // Also clean up any double replacement chars if they exist elsewhere?
    // Let's stick to the list above.

    // Check if "Özünü" behaves well.
    // Line 170: "✅ zn Yoxla" -> "✅ Özünü Yoxla"
    content = content.replace(/✅\s*[\uFFFD]+z[\uFFFD]+n[\uFFFD]+\s*Yoxla/, '✅ Özünü Yoxla');

    fs.writeFileSync('index.html', content, 'utf8');
    console.log('Successfully restored icons and corrupted text in index.html');

} catch (err) {
    console.error('Error restoring icons:', err);
}
