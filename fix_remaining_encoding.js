const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    let result = data;

    // Fix system-wide typos/corruptions
    result = result.replace(/görid/g, 'grid');
    result = result.replace(/backgöround/g, 'background');
    result = result.replace(/göradient/g, 'linear-gradient'); // Correcting based on context 'linear-göradient'

    // Fix specific Azerbaijani characters and corruptions using Replacement Character \uFFFD
    result = result.replace(/Bəcəriklər/g, 'Bacarıqlar');
    result = result.replace(/Sinif İdarəiliyi/g, 'Sinif İdarəçiliyi');
    result = result.replace(/Sinif İdarə\uFFFDiliyi/g, 'Sinif İdarəçiliyi');
    result = result.replace(/Üçünsiyyət/g, 'Ünsiyyət');
    result = result.replace(/Ü\uFFFDünsiyyət/g, 'Ünsiyyət');
    result = result.replace(/Şagird Əlavə Et/g, 'Şagird Əlavə Et');
    result = result.replace(/Şagird Ə\uFFFDlavə Et/g, 'Şagird Əlavə Et');

    result = result.replace(/Keid Et/g, 'Keçid Et');
    result = result.replace(/Ke\uFFFDid Et/g, 'Keçid Et');

    result = result.replace(/kiik/g, 'kiçik');
    result = result.replace(/ki\uFFFDik/g, 'kiçik');

    result = result.replace(/Gndər/g, 'Göndər');
    result = result.replace(/G\uFFFDndər/g, 'Göndər');

    result = result.replace(/Sinif sein/g, 'Sinif seçin');
    result = result.replace(/Sinif se\uFFFDin/g, 'Sinif seçin');

    result = result.replace(/Aıqlama/g, 'Açıqlama');
    result = result.replace(/A\uFFFDıqlama/g, 'Açıqlama');

    result = result.replace(/ mqayisə /g, ' müqayisə ');
    result = result.replace(/ m\uFFFDqayisə /g, ' müqayisə ');

    result = result.replace(/statistikalarını gr/g, 'statistikalarını gör');
    result = result.replace(/statistikalarını g\uFFFDr/g, 'statistikalarını gör');

    // Specific missing chars based on context
    result = result.replace(/b\uFFFDlməsi/g, 'bölməsi');
    result = result.replace(/\uFFFD\uFFFD\uFFFDn/g, 'üçün');
    result = result.replace(/g\uFFFDr\uFFFDn\uFFFDr/g, 'görünür');

    result = result.replace(/İstifadəi/g, 'İstifadəçi');
    result = result.replace(/İstifadə\uFFFDi/g, 'İstifadəçi');

    result = result.replace(/Shbəti/g, 'Söhbəti');
    result = result.replace(/S\uFFFDhbəti/g, 'Söhbəti');

    result = result.replace(/Yksəlişi/g, 'Yüksəlişi');
    result = result.replace(/Y\uFFFDksəlişi/g, 'Yüksəlişi');

    // Fix sidebar close button specifically
    result = result.replace(/<button class="sidebar-close-btn" onclick="closeMobileSidebar()">[\s\S]*?<\/button>/, '<button class="sidebar-close-btn" onclick="closeMobileSidebar()">&times;</button>');

    fs.writeFile(filePath, result, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Successfully fixed encoding issues in index.html');
        }
    });
});
