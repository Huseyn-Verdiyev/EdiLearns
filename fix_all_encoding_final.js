const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    let result = data;

    // 1. Common Word Fixes (Context-aware)
    result = result.replace(/B\uFFFDt\uFFFDn/g, 'Bütün');
    result = result.replace(/b\uFFFDt\uFFFDn/g, 'bütün');
    result = result.replace(/Tarix\uFFFDəsi/g, 'Tarixçəsi');
    result = result.replace(/Se\uFFFDilmiş/g, 'Seçilmiş');
    result = result.replace(/M\uFFFDkafat/g, 'Mükafat');
    result = result.replace(/K\uFFFDmək\uFFFDji/g, 'Köməkçisi'); // Check context specifically
    result = result.replace(/K\uFFFDmək\uFFFDi/g, 'Köməkçi');
    result = result.replace(/T\uFFFDvsiyələr/g, 'Tövsiyələr');
    result = result.replace(/(\s)Ü\uFFFD\uFFFDn(\s)/g, '$1Üçün$2');
    result = result.replace(/(\s)\uFFFD\uFFFD\uFFFDn(\s)/g, '$1üçün$2');
    result = result.replace(/Mağazas\uFFFD/g, 'Mağazası');
    result = result.replace(/Ə\uFFFDlavə/g, 'Əlavə');
    result = result.replace(/M\uFFFDəllif/g, 'Müəllif');

    // 2. Fix Double Replacement Chars acting as garbage spaces/icons
    // Often appears as 🛍️ -> 🛍️
    // We'll replace \uFFFD\uFFFD with empty string if it follows an emoji or looks like garbage
    // Or replace with space if valid

    // Clean up specific icon garbage
    result = result.replace(/🛍️\uFFFD\uFFFD/g, '🛍️ ');
    result = result.replace(/👤\uFFFD\uFFFD/g, '👤 ');
    result = result.replace(/🎨\uFFFD\uFFFD/g, '🎨 ');
    result = result.replace(/🔬\uFFFD\uFFFD/g, '🔬 ');
    result = result.replace(/🤖\uFFFD\uFFFD/g, '🤖 ');
    result = result.replace(/🌍\uFFFD\uFFFD\uFFFD/g, '🌍 ');
    result = result.replace(/🤔\uFFFD\uFFFD/g, '🤔 ');
    result = result.replace(/📜\uFFFD\uFFFD/g, '📜 ');
    result = result.replace(/📝\uFFFD\uFFFD/g, '📝 ');

    // Other headers
    result = result.replace(/\uFFFD/g, ' '); // Clean up standalone garbage
    result = result.replace(/\uFFFD\uFFFD/g, ' '); // Generic double garbage -> space

    // Specific leftover fixes seen in logs
    result = result.replace(/Məktəb\uFFFD/g, 'Məktəb');
    result = result.replace(/S\uFFFDhbəti/g, 'Söhbəti');

    fs.writeFile(filePath, result, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Successfully cleaned index.html');
        }
    });
});
