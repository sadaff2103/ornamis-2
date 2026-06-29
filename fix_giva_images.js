// Script to replace all Giva image URLs with working placeholders
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'pages', 'GivaStorePage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Use a generic placeholder API for jewelry images
const baseUrl = 'https://picsum.photos/800/800?random=';

// Replace all /jewelry/ image paths with placeholder URLs
let counter = 1;
content = content.replace(/imageUrl:\s*"\/jewelry\/[^"]+"/g, () => {
    const url = `${baseUrl}${counter}`;
    counter++;
    return `imageUrl: "${url}"`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`✅ Updated ${counter - 1} image URLs in GivaStorePage.tsx`);
