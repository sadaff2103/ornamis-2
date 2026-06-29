// extract-jpeg-from-pdf.js
// Extracts embedded JPEG images from PDF binary using magic byte scanning
const fs = require('fs');
const path = require('path');

const PDF_PATH = 'C:/Users/sadaf/Downloads/Jauhari.pdf';
const OUT_DIR = path.join(__dirname, 'public/jewelry/jauhari');

fs.mkdirSync(OUT_DIR, { recursive: true });

const data = fs.readFileSync(PDF_PATH);
console.log(`PDF size: ${(data.length / 1024 / 1024).toFixed(2)} MB`);

const JPEG_SOI = Buffer.from([0xFF, 0xD8, 0xFF]); // JPEG start
const JPEG_EOI = Buffer.from([0xFF, 0xD9]);        // JPEG end

let count = 0;
let pos = 0;

while (pos < data.length - 2) {
    // Find JPEG start marker
    const startIdx = data.indexOf(JPEG_SOI, pos);
    if (startIdx === -1) break;

    // Find JPEG end marker
    const endIdx = data.indexOf(JPEG_EOI, startIdx + 4);
    if (endIdx === -1) { pos = startIdx + 1; continue; }

    const imgData = data.slice(startIdx, endIdx + 2);

    // Only save images larger than 10KB (skip tiny thumbnails/icons)
    if (imgData.length > 10000) {
        count++;
        const fileName = `jauhari-${String(count).padStart(3, '0')}.jpg`;
        const outPath = path.join(OUT_DIR, fileName);
        fs.writeFileSync(outPath, imgData);
        console.log(`Extracted: ${fileName} (${(imgData.length / 1024).toFixed(1)} KB)`);
    }

    pos = endIdx + 2;
}

console.log(`\n✅ Done! Extracted ${count} JPEG images to public/jewelry/jauhari/`);
