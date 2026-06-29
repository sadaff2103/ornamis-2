// Update Giva products with real image paths
const fs = require('fs');
const path = require('path');

try {
    const filePath = path.join(__dirname, 'src', 'components', 'pages', 'GivaStorePage.tsx');
    console.log('Reading file:', filePath);

    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    let content = fs.readFileSync(filePath, 'utf8');
    console.log('File read successfully. Length:', content.length);

    // Map product IDs to actual image files from the giva folder
    const imageMap = {
        'GV-001': '/jewelry/download (1).jpg',
        'GV-002': '/jewelry/download (2).jpg',
        'GV-003': '/jewelry/download (3).jpg',
        'GV-004': '/jewelry/download (4).jpg',
        'GV-005': '/jewelry/download (5).jpg',
        'GV-006': '/jewelry/download (6).jpg',
        'GV-007': '/jewelry/download (7).jpg',
        'GV-008': '/jewelry/download (8).jpg',
        'GV-009': '/jewelry/download (9).jpg',
        'GV-010': '/jewelry/download (10).jpg',
        'GV-011': '/jewelry/download (11).jpg',
        'GV-012': '/jewelry/download (12).jpg',
        'GV-013': '/jewelry/download (13).jpg',
        'GV-014': '/jewelry/download (14).jpg',
        'GV-015': '/jewelry/download (15).jpg',
        'GV-016': '/jewelry/download (16).jpg',
        'GV-017': '/jewelry/download (17).jpg',
        'GV-018': '/jewelry/download (18).jpg',
        'GV-019': '/jewelry/download (19).jpg',
        'GV-020': '/jewelry/download (20).jpg',
        'GV-021': '/jewelry/download 22.jpg',
        'GV-022': '/jewelry/18K Gold Beaded Bow Bracelet Pack.jpg',
        'GV-023': '/jewelry/25 Anillos de compromiso en forma de corona que tu princesa interior desea recibir.jpg',
        'GV-024': '/jewelry/AD Sea Green Pendant Set Images.jpg',
        'GV-025': '/jewelry/Aestetic koream purple.jpg',
        'GV-026': '/jewelry/Alloy Brass White, Gold Jewellery Set.jpg',
        'GV-027': '/jewelry/Andkiss Rhinestone Heart Stud Earrings Valentines.jpg',
        'GV-028': '/jewelry/Beauty and the Beast Bracelet Birthday Gift Rose Charm Bracelets.jpg',
        'GV-029': '/jewelry/Cubic Zirconia Flower Drop Earrings.jpg',
        'GV-030': '/jewelry/Delicate Bloom Rhinestone Leaf Bracelet.jpg',
        'GV-031': '/jewelry/Elegant Pink Floral Butterfly Choker.jpg',
        'GV-032': '/jewelry/Ethereal  Necklace Set.jpg',
        'GV-033': '/jewelry/Evergreen Halo Set.jpg',
        'GV-034': '/jewelry/Floral Elegance_ Lab Grown Diamond Necklace with Round Cut Sparkle.jpg',
        'GV-035': '/jewelry/Flower Petal Necklace Earring.jpg',
        'GV-036': '/jewelry/Four Heart Magnetic Gold Plated Chain With P.jpg',
        'GV-037': '/jewelry/GIVA 925 Silver Bhumi Silver One in a Trillium Necklace.jpg',
        'GV-038': '/jewelry/GIVA 925 Silver Heart Lock Bracelet Anklet Pendant.jpg',
        'GV-039': '/jewelry/GIVA 925 Sterling Silver Blue Daisy Set.jpg',
        'GV-040': '/jewelry/GIVA Bestsellers.jpg',
        'GV-041': '/jewelry/GIVA GPay Signature Collection.jpg',
        'GV-042': '/jewelry/INDIAN JEWELLERY.jpg',
        'GV-043': '/jewelry/Jewelry (1).jpg',
        'GV-044': '/jewelry/Lulu Dainty Twist Adjustable Ring in Rose Gold.jpg',
        'GV-045': '/jewelry/Mother of Pearl Fou.jpg',
        'GV-046': '/jewelry/Original Silk Sterling Silver Zircon Butterfly Tassel Charm Bracelet.jpg',
        'GV-047': '/jewelry/Pear shape diamond Halo Teardrop earrings.jpg',
        'GV-048': '/jewelry/Pretty jewellery.jpg',
        'GV-049': '/jewelry/Pretty ring.jpg',
        'GV-050': '/jewelry/Real Rose Necklace, Real Flower Necklace, Tiny Minimalistic Necklace, Valentine\'s Day Gift Simple Gold Necklace, Resin Jewelry, Gift for Her - Etsy.jpg',
        'GV-051': '/jewelry/Rhinestone Drop Earrings.jpg',
        'GV-052': '/jewelry/Rose Gold Infinity Necklace.jpg',
        'GV-053': '/jewelry/Rose gold marquise cubic.jpg',
        'GV-054': '/jewelry/Silver Golden Glinting Joy Zircon Earrings _ Gifts for Girlfriend, Gifts for Women and Girls.jpg',
        'GV-055': '/jewelry/Silver Rose Gold Forever Elegant Jhumki _ Gifts for Girlfriend, Gifts for Women and Girls.jpg',
        'GV-056': '/jewelry/Silver Rose Gold.jpg',
        'GV-057': '/jewelry/Simple Elegant Acrylic Twist Wave Geometric Bangle.jpg',
        'GV-058': '/jewelry/Some of our favourite diamond earrin.jpg',
        'GV-059': '/jewelry/The prettiest Silver Jeweller.jpg',
        'GV-060': '/jewelry/Unique Engagement Rings We\'re Loving.jpg',
    };

    console.log(`Starting to replace ${Object.keys(imageMap).length} product images...`);
    let replacementCount = 0;

    // Replace each product's imageUrl using a simpler approach
    // Replace picsum URLs with local paths
    Object.keys(imageMap).forEach(productId => {
        const imageUrl = imageMap[productId];
        // Look for the specific product and replace its imageUrl
        const picsumPattern = new RegExp(`(id:\\s*"${productId}"[\\s\\S]*?imageUrl:\\s*)"https://picsum\\.photos/800/800\\?random=\\d+"`, 'g');
        const beforeLength = content.length;
        content = content.replace(picsumPattern, `$1"${imageUrl}"`);
        if (content.length !== beforeLength) {
            replacementCount++;
            console.log(`Replaced image for ${productId}`);
        }
    });

    console.log(`Replaced ${replacementCount} images`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated all ${replacementCount} Giva product images with real paths`);
} catch (error) {
    console.error('❌ Error updating images:', error.message);
    console.error(error.stack);
    process.exit(1);
}
