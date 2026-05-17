const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    let result = data;

    // Resurslar icon
    result = result.replace(
        /<div class="dashboard-block" onclick="showResourcesPanel()">\s*<div class="icon">.*?<\/div>/,
        '<div class="dashboard-block" onclick="showResourcesPanel()">\n                        <div class="icon">📚</div>'
    );

    // Sinif İdarəçiliyi icon (escape special chars just in case)
    result = result.replace(
        /<div class="dashboard-block" onclick="showClassManagementPanel()">\s*<div class="icon">.*?<\/div>/,
        '<div class="dashboard-block" onclick="showClassManagementPanel()">\n                        <div class="icon">👥</div>'
    );

    // Sinif Divarı icon
    result = result.replace(
        /<div class="dashboard-block" onclick="showClassWallPanel()">\s*<div class="icon">.*?<\/div>/,
        '<div class="dashboard-block" onclick="showClassWallPanel()">\n                        <div class="icon">💬</div>'
    );

    // Canlı Dərs icon
    result = result.replace(
        /<div class="dashboard-block" onclick="showLiveClassPanel()">\s*<div class="icon">.*?<\/div>/,
        '<div class="dashboard-block" onclick="showLiveClassPanel()">\n                        <div class="icon">📹</div>'
    );

    fs.writeFile(filePath, result, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Successfully fixed dashboard icons in index.html');
        }
    });
});
