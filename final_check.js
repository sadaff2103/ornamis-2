const fs = require('fs');
const path = require('path');
const dataDir = 'c:/Users/sadaf/OneDrive/Desktop/ornamis-2/src/data';
const files = fs.readdirSync(dataDir);
files.forEach(file => {
    if (!file.endsWith('.ts')) return;
    const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
        const match = line.match(/\/jewelry\/[^"']*/);
        if (match && match[0].includes(' ')) {
            console.log(`${file}:${i + 1}: ${match[0]}`);
        }
    });
});
console.log('Search finished.');
