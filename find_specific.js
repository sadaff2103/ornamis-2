const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('Four Heart Magnetic Gold Plated Chain With P.jpg')) {
                console.log(`FOUND in ${fullPath}`);
            }
        }
    });
};

walk('c:/Users/sadaf/OneDrive/Desktop/ornamis-2/src');
console.log('Search finished.');
