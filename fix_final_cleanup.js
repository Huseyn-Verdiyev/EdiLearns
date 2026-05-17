const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    let result = data;

    // Fix remaining typos from previous fix
    result = result.replace(/linear-linear-gradient/g, 'linear-gradient');
    result = result.replace(/form-göroup/g, 'form-group');
    result = result.replace(/\uFFFDÜnsiyyət/g, 'Ünsiyyət');
    result = result.replace(/Ünsiyyət/g, 'Ünsiyyət'); // explicit replacement char if copy-pasted works
    result = result.replace(/Ünsiyyət/g, 'Ünsiyyət'); // Cleanup potentially resulting string

    // Fix any other form-g* patterns just in case
    result = result.replace(/göroup/g, 'group');

    fs.writeFile(filePath, result, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Successfully fixed final issues in index.html');
        }
    });
});
