const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

// Find the line with "Resurslar" (around line 161)
const line = lines.find(l => l.includes('nav-res'));

if (line) {
    console.log('Line content:', line);
    console.log('Hex dump:');
    for (let i = 0; i < line.length; i++) {
        console.log(`${i}: ${line.charCodeAt(i).toString(16)}`);
    }
} else {
    console.log('Line not found');
}
