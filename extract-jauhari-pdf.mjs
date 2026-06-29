// extract-jauhari-pdf.mjs
// Extracts all pages from Jauhari.pdf as PNG images using pdfjs-dist + canvas

import { createCanvas } from 'canvas';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PDF_PATH = 'C:/Users/sadaf/Downloads/Jauhari.pdf';
const OUT_DIR = join(__dirname, 'public/jewelry/jauhari');

mkdirSync(OUT_DIR, { recursive: true });

const pdfData = new Uint8Array(readFileSync(PDF_PATH));
const loadingTask = pdfjsLib.getDocument({ data: pdfData, useSystemFonts: true });

const pdf = await loadingTask.promise;
console.log(`PDF has ${pdf.numPages} pages`);

for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.5 });

    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');

    await page.render({
        canvasContext: ctx,
        viewport,
    }).promise;

    const outPath = join(OUT_DIR, `jauhari-page-${String(pageNum).padStart(3, '0')}.png`);
    writeFileSync(outPath, canvas.toBuffer('image/png'));
    console.log(`Saved page ${pageNum} → ${outPath}`);
}

console.log('✅ Done! All pages extracted.');
