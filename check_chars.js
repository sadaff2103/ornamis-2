const fs = require('fs');
const content = fs.readFileSync('c:/Users/sadaf/OneDrive/Desktop/ornamis-2/src/data/givaProducts.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.includes('GV-036')) {
        console.log(`Line ${i + 1}: ${line}`);
        const match = line.match(/imageUrl: "(.*?)"/);
        if (match) {
            const url = match[1];
            console.log(`URL: ${url}`);
            let hex = '';
            for (let j = 0; j < url.length; j++) {
                hex += url.charCodeAt(j).toString(16) + ' ';
            }
            console.log(`Hex: ${hex}`);
        }
    }
});
