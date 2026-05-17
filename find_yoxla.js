const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    const lines = data.split('\n');
    lines.forEach((line, index) => {
        if (line.toLowerCase().includes('yoxla')) {
            console.log(`Line ${index + 1}: ${line.trim()}`);
        }
        if (line.includes('z n')) {
            console.log(`Line ${index + 1} (z n match): ${line.trim()}`);
        }
    });
});
