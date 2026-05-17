const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

// Find the line with the house icon (around line 159)
const line = lines.find(l => l.includes('nav-main'));

if (line) {
    console.log('Line content:', line);
    console.log('Hex dump:');
    for (let i = 0; i < line.length; i++) {
        console.log(`${i}: ${line[i]} -> ${line.charCodeAt(i).toString(16)}`);
    }
} else {
    console.log('Line not found');
}
