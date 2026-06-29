// ─── Jauhari Jewellery — Complete Product Catalog ───────────────────────────
// 95 catalog images → 34 distinct product groups (hand-verified, all angles)
// ─────────────────────────────────────────────────────────────────────────────

export interface JProduct {
    id: string;
    name: string;
    category: string;
    description: string;
    price: string;
    priceValue: number;
    metal: string;
    gemstone?: string;
    images: string[];          // first image is the primary / hero
    weight?: string;
    isExclusive?: boolean;
    isLimited?: boolean;
    material: string[];
    style: string[];
    tryOnEnabled?: boolean;
}

const BASE = "/jewelry/jauhari/";

export const jauhariProducts: JProduct[] = [

    // ════════════════════════════════════════════════════════════
    //  RINGS  (12 products)
    // ════════════════════════════════════════════════════════════

    {
        id: "JH-R001",
        name: "CZ Solitaire Ring",
        category: "Rings",
        description:
            "Elegant 22K two-tone gold solitaire ring featuring a brilliant oval CZ centre stone flanked by a pavé row of accent stones. Tag: G.Wt 4.818g, N.Wt 4.518g, 22% wastage. Timeless design that transitions from daywear to evening with effortless grace.",
        price: "₹74,500",
        priceValue: 74500,
        metal: "Gold",
        gemstone: "CZ",
        weight: "4.818g",
        images: [
            BASE + "jauhari-001.jpg",
            BASE + "jauhari-002.jpg",
            BASE + "jauhari-003.jpg",
        ],
        isExclusive: true,
        material: ["Gold", "CZ"],
        style: ["Classic", "Solitaire"],
    },

    {
        id: "JH-R002",
        name: "Geometric Zigzag Diamond Ring",
        category: "Rings",
        description:
            "A bold 18K rose gold ring crafted in a graphic zigzag silhouette, paved from shoulder to shoulder with brilliant-cut diamonds. Two angles reveal the architectural depth of the design — every facet catches the light. A strong statement piece for the modern woman.",
        price: "₹1,45,000",
        priceValue: 145000,
        metal: "Rose Gold",
        gemstone: "Diamond",
        weight: "6.2g",
        images: [
            BASE + "jauhari-025.jpg",
            BASE + "jauhari-026.jpg",
        ],
        isExclusive: true,
        material: ["Rose Gold", "Diamond"],
        style: ["Modern", "Statement", "Geometric"],
    },

    {
        id: "JH-R003",
        name: "Mother of Pearl Clover Ring",
        category: "Rings",
        description:
            "Delicate 18K rose gold ring with a four-leaf clover motif inlaid with lustrous mother-of-pearl panels. Diamond halos frame each petal, creating a dreamy floral centerpiece. Perfect for romantic celebrations and spring occasions.",
        price: "₹98,000",
        priceValue: 98000,
        metal: "Rose Gold",
        gemstone: "Mother of Pearl",
        images: [
            BASE + "jauhari-027.jpg",
            BASE + "jauhari-028.jpg",
            BASE + "jauhari-029.jpg",
        ],
        material: ["Rose Gold", "Mother of Pearl", "Diamond"],
        style: ["Floral", "Romantic"],
    },

    {
        id: "JH-R004",
        name: "Rose Gold Diamond Floral Crown Ring",
        category: "Rings",
        description:
            "An architectural masterpiece in 18K rose gold — an intricate crown ring featuring pear, marquise and round brilliant-cut diamonds woven into an open lattice design. The double-row diamond band adds an extra layer of brilliance. The ultimate contemporary bridal or cocktail ring.",
        price: "₹1,69,000",
        priceValue: 169000,
        metal: "Rose Gold",
        gemstone: "Diamond",
        images: [
            BASE + "jauhari-036.jpg",
            BASE + "jauhari-037.jpg",
        ],
        isLimited: true,
        material: ["Rose Gold", "Diamond"],
        style: ["Bridal", "Statement"],
    },

    {
        id: "JH-R005",
        name: "Oval Ruby Solitaire Ring",
        category: "Rings",
        description:
            "A classic 22K yellow gold ring cradling a rich oval natural ruby solitaire with a full pavé halo. Three angles showcase the deep crimson gem and the intricate setting. A timeless symbol of passion and tradition.",
        price: "₹1,25,000",
        priceValue: 125000,
        metal: "Gold",
        gemstone: "Ruby",
        images: [
            BASE + "jauhari-038.jpg",
            BASE + "jauhari-039.jpg",
            BASE + "jauhari-040.jpg",
        ],
        isExclusive: true,
        material: ["Gold", "Ruby"],
        style: ["Classic", "Traditional"],
    },

    {
        id: "JH-R006",
        name: "Emerald Three-Stone Ring",
        category: "Rings",
        description:
            "Statement 22K yellow gold ring set with three vivid natural emeralds — a large oval centre flanked by two square-cut side stones. Each emerald is bezel-set to protect its brilliant green. A Heritage piece that captures true Hyderabadi jewellery tradition.",
        price: "₹1,85,000",
        priceValue: 185000,
        metal: "Gold",
        gemstone: "Emerald",
        images: [
            BASE + "jauhari-041.jpg",
            BASE + "jauhari-042.jpg",
        ],
        isExclusive: true,
        material: ["Gold", "Emerald"],
        style: ["Statement", "Traditional"],
    },

    {
        id: "JH-R007",
        name: "Ruby Polki Starburst Ring",
        category: "Rings",
        description:
            "A magnificent 22K gold ring featuring a ruby cabochon surrounded by an uncut polki diamond starburst halo. The raw, earthy facets of polki diamonds create an organic warmth that perfectly frames the vibrant ruby. Rooted in Mughal jewellery tradition.",
        price: "₹2,10,000",
        priceValue: 210000,
        metal: "Gold",
        gemstone: "Ruby, Polki Diamond",
        images: [
            BASE + "jauhari-043.jpg",
            BASE + "jauhari-044.jpg",
        ],
        isExclusive: true,
        material: ["Gold", "Ruby", "Polki Diamond"],
        style: ["Traditional", "Heritage"],
    },

    {
        id: "JH-R008",
        name: "Rose Gold CZ Latticework Band",
        category: "Rings",
        description:
            "A graceful 18K rose gold band ring with a geometric latticework pattern studded throughout with brilliant CZ stones. The openwork lattice construction keeps it light and wearable, yet visually rich. Ideal for everyday luxury.",
        price: "₹65,000",
        priceValue: 65000,
        metal: "Rose Gold",
        gemstone: "CZ",
        images: [
            BASE + "jauhari-045.jpg",
            BASE + "jauhari-046.jpg",
        ],
        material: ["Rose Gold", "CZ"],
        style: ["Geometric", "Everyday"],
    },

    {
        id: "JH-R009",
        name: "Rose Gold Double-Chevron CZ Ring",
        category: "Rings",
        description:
            "Sleek 18K rose gold ring with two rows of V-shaped chevron channels each fully paved with bright CZ stones. The chevron motif creates a dynamic, directional look modernised by the warm rose gold setting. Three angles reveal the depth.",
        price: "₹72,000",
        priceValue: 72000,
        metal: "Rose Gold",
        gemstone: "CZ",
        images: [
            BASE + "jauhari-047.jpg",
            BASE + "jauhari-048.jpg",
            BASE + "jauhari-049.jpg",
        ],
        material: ["Rose Gold", "CZ"],
        style: ["Modern", "Everyday"],
        tryOnEnabled: true,
    },

    {
        id: "JH-R010",
        name: "Rose Gold Diamond Cluster Ring",
        category: "Rings",
        description:
            "A beautiful 18K rose gold ring featuring two bloom-shaped diamond clusters set with brilliant-cut and marquise diamonds. Shown from two angles to reveal the volume and sparkle of the layered floral design.",
        price: "₹1,38,000",
        priceValue: 138000,
        metal: "Rose Gold",
        gemstone: "Diamond",
        images: [
            BASE + "jauhari-050.jpg",
            BASE + "jauhari-051.jpg",
        ],
        material: ["Rose Gold", "Diamond"],
        style: ["Floral", "Romantic"],
    },

    {
        id: "JH-R011",
        name: "Rose Gold Diamond Double-Flower Ring",
        category: "Rings",
        description:
            "A charming 18K rose gold ring with two interlocking diamond flowers sharing a single shank. Brilliant-cut and pear-cut diamonds form the petals, while round stones fill the centre. Two images reveal its intricate depth.",
        price: "₹1,52,000",
        priceValue: 152000,
        metal: "Rose Gold",
        gemstone: "Diamond",
        images: [
            BASE + "jauhari-052.jpg",
            BASE + "jauhari-053.jpg",
        ],
        isLimited: true,
        material: ["Rose Gold", "Diamond"],
        style: ["Floral", "Bridal"],
    },

    {
        id: "JH-R012",
        name: "Platinum Diamond Bezel Band",
        category: "Rings",
        description:
            "Elegant PT 950 platinum band ring with a single brilliant-cut diamond set in a sleek flush/bezel setting. Tag: G.Wt 3.660g, N.Wt 3.010g. The brushed platinum surface flanks a glowing rose gold inlay strip — the perfect minimalist wedding or anniversary band.",
        price: "₹82,000",
        priceValue: 82000,
        metal: "Platinum",
        gemstone: "Diamond",
        weight: "3.66g",
        images: [
            BASE + "jauhari-069.jpg",
            BASE + "jauhari-070.jpg",
            BASE + "jauhari-071.jpg",
            BASE + "jauhari-072.jpg",
        ],
        material: ["Platinum", "Rose Gold", "Diamond"],
        style: ["Minimalist", "Wedding"],
    },

    // ════════════════════════════════════════════════════════════
    //  NECKLACES  (9 products)
    // ════════════════════════════════════════════════════════════

    {
        id: "JH-N-SPECIAL",
        name: "Diamond Solitaire Special Necklace",
        category: "Necklaces",
        description: "A breathtaking high-brilliance diamond solitaire necklace set in 18K white gold. Featuring a master-cut centre stone with exceptional fire and clarity. This special edition piece is optimized for our Virtual Try-On experience.",
        price: "₹2,45,000",
        priceValue: 245000,
        metal: "White Gold",
        gemstone: "Diamond",
        images: [
            "diamond-necklace-special.png",
        ],
        isExclusive: true,
        material: ["White Gold", "Diamond"],
        style: ["Luxury", "Solitaire", "Modern"],
        tryOnEnabled: true,
    },

    {
        id: "JH-N001",
        name: "Ruby Polki Fringe Necklace",
        category: "Necklaces",
        description:
            "A regal 22K uncut polki & ruby statement necklace with cascading fringe drops — each terminating in a ruby briolette. The polki diamonds are set in the traditional Hyderabadi kundan style, creating a spectacular heirloom piece worthy of royalty.",
        price: "₹4,85,000",
        priceValue: 485000,
        metal: "Gold",
        gemstone: "Ruby, Polki Diamond",
        images: [
            BASE + "jauhari-004.jpg",
            BASE + "jauhari-005.jpg",
            BASE + "jauhari-006.jpg",
        ],
        isExclusive: true,
        material: ["Gold", "Ruby", "Polki Diamond"],
        style: ["Traditional", "Bridal", "Heritage"],
    },

    {
        id: "JH-N002",
        name: "Rainbow Marquise Charm Necklace",
        category: "Necklaces",
        description:
            "A playful 18K rose gold necklace strung with rainbow-hued marquise gemstone charms in vibrant multi-colour. Each stone floats between delicate gold links, creating a festive shimmer. Three angles reveal the movement and colour range.",
        price: "₹1,15,000",
        priceValue: 115000,
        metal: "Rose Gold",
        gemstone: "Multi-Gemstone",
        images: [
            BASE + "jauhari-019.jpg",
            BASE + "jauhari-020.jpg",
            BASE + "jauhari-021.jpg",
        ],
        material: ["Rose Gold", "Multi-Gemstone"],
        style: ["Playful", "Colorful"],
    },

    {
        id: "JH-N003",
        name: "Multi-Strand Ruby Bead Necklace",
        category: "Necklaces",
        description:
            "A rich multi-strand necklace woven from natural ruby beads and gold spacers, finished with a gold clasp. The layered strands create a vivid red cascade ideal for traditional and bridal styling. Three close-up angles showcase bead quality.",
        price: "₹2,25,000",
        priceValue: 225000,
        metal: "Gold",
        gemstone: "Ruby",
        images: [
            BASE + "jauhari-030.jpg",
            BASE + "jauhari-031.jpg",
            BASE + "jauhari-032.jpg",
        ],
        isExclusive: true,
        material: ["Gold", "Ruby"],
        style: ["Traditional", "Bridal"],
    },

    {
        id: "JH-N004",
        name: "Delicate Diamond Pendant Necklace",
        category: "Necklaces",
        description:
            "A whisper-thin 18K gold chain suspending a brilliant-cut diamond solitaire pendant. Three angles capture the pendant's gentle movement and the diamond's sparkle. An understated everyday luxury.",
        price: "₹68,000",
        priceValue: 68000,
        metal: "Gold",
        gemstone: "Diamond",
        images: [
            BASE + "jauhari-033.jpg",
            BASE + "jauhari-034.jpg",
            BASE + "jauhari-035.jpg",
        ],
        material: ["Gold", "Diamond"],
        style: ["Minimalist", "Everyday"],
    },

    {
        id: "JH-N005",
        name: "Rose Gold Diamond Graduated Halo Necklace",
        category: "Necklaces",
        description:
            "A spectacular 18K rose gold necklace where round diamond halo clusters graduate in size from shoulder to décolletage, terminating in three cascading pear-drop pendants. Two mannequin shots reveal how beautifully it drapes.",
        price: "₹3,45,000",
        priceValue: 345000,
        metal: "Rose Gold",
        gemstone: "Diamond",
        images: [
            BASE + "jauhari-060.jpg",
            BASE + "jauhari-061.jpg",
        ],
        isLimited: true,
        material: ["Rose Gold", "Diamond"],
        style: ["Bridal", "Statement"],
    },

    {
        id: "JH-N006",
        name: "Rose Gold Diamond Pear-Cluster Fringe Necklace",
        category: "Necklaces",
        description:
            "An elegant 18K rose gold necklace with a sculpted chain of chevron links each suspending a chandelier of mixed diamond drops — round clusters and pear-shaped diamond terminals. Shown on a mannequin in two angles to reveal the dramatic cascade.",
        price: "₹2,95,000",
        priceValue: 295000,
        metal: "Rose Gold",
        gemstone: "Diamond",
        images: [
            BASE + "jauhari-056.jpg",
            BASE + "jauhari-057.jpg",
        ],
        isExclusive: true,
        material: ["Rose Gold", "Diamond"],
        style: ["Statement", "Bridal"],
    },

    {
        id: "JH-N007",
        name: "Emerald & Diamond Fan-Drop Necklace",
        category: "Necklaces",
        description:
            "A breathtaking 18K rose gold necklace with a link chain from which hang alternating diamond fan-drops and marquise clusters, anchored by a square emerald centre flanked by floral diamond motifs. Worn on mannequin in two angles. Matches the Emerald Diamond Chandelier Earrings perfectly as a set.",
        price: "₹5,20,000",
        priceValue: 520000,
        metal: "Rose Gold",
        gemstone: "Emerald, Diamond",
        images: [
            BASE + "jauhari-065.jpg",
            BASE + "jauhari-066.jpg",
        ],
        isExclusive: true,
        material: ["Rose Gold", "Emerald", "Diamond"],
        style: ["Bridal", "Heritage", "Statement"],
    },

    {
        id: "JH-N008",
        name: "Pink Pearl Multi-Strand Necklace",
        category: "Necklaces",
        description:
            "A graceful multi-strand necklace of pink freshwater pearls and brushed silver/gold beads threaded on a delicate gold chain. Two close-up angles reveal the pastel pearl lustre and bead detail. Effortlessly elegant for daytime and festive occasions.",
        price: "₹95,000",
        priceValue: 95000,
        metal: "Gold",
        gemstone: "Pearl",
        images: [
            BASE + "jauhari-088.jpg",
            BASE + "jauhari-089.jpg",
        ],
        material: ["Gold", "Pearl"],
        style: ["Classic", "Feminine"],
    },

    // ════════════════════════════════════════════════════════════
    //  EARRINGS  (8 products)
    // ════════════════════════════════════════════════════════════

    {
        id: "JH-E001",
        name: "Ruby Polki Cluster Earrings",
        category: "Earrings",
        description:
            "Magnificent 22K gold cluster drop earrings combining uncut polki diamonds with natural ruby cabochons in a traditional Hyderabadi setting. Three images reveal the richness of the stones and the handcrafted gold work.",
        price: "₹2,85,000",
        priceValue: 285000,
        metal: "Gold",
        gemstone: "Ruby, Polki Diamond",
        images: [
            BASE + "jauhari-007.jpg",
            BASE + "jauhari-008.jpg",
            BASE + "jauhari-009.jpg",
        ],
        isExclusive: true,
        material: ["Gold", "Ruby", "Polki Diamond"],
        style: ["Traditional", "Bridal"],
    },

    {
        id: "JH-E002",
        name: "Rose Gold Diamond Chandelier Earrings",
        category: "Earrings",
        description:
            "Long 18K rose gold chandelier earrings with three tiers of diamond clusters suspended from diamond pavé tops. The graduated cascades of round, marquise and pear-cut diamonds create a magnificent sweep of light. Two angles showcase the movement.",
        price: "₹1,95,000",
        priceValue: 195000,
        metal: "Rose Gold",
        gemstone: "Diamond",
        images: [
            BASE + "jauhari-054.jpg",
            BASE + "jauhari-055.jpg",
        ],
        isLimited: true,
        material: ["Rose Gold", "Diamond"],
        style: ["Statement", "Bridal"],
    },

    {
        id: "JH-E003",
        name: "Rose Gold Triple-Drop Halo Earrings",
        category: "Earrings",
        description:
            "A sophisticated pair of 18K rose gold earrings with a scalloped diamond-pavé top and three dangling diamond cluster drops. Best worn for bridal or formal occasions. Two close-up angles reveal the sparkle depth.",
        price: "₹1,42,000",
        priceValue: 142000,
        metal: "Rose Gold",
        gemstone: "Diamond",
        images: [
            BASE + "jauhari-058.jpg",
            BASE + "jauhari-059.jpg",
        ],
        material: ["Rose Gold", "Diamond"],
        style: ["Formal", "Bridal"],
    },

    {
        id: "JH-E004",
        name: "Emerald & Diamond Chandelier Earrings",
        category: "Earrings",
        description:
            "Spectacular 18K rose gold long chandelier earrings with a square emerald top framed by a diamond-pavé pear halo, leading to cascading diamond branches that end in fan-shaped diamond terminals with teardrop drops. Three shot angles. Pairs perfectly with the Emerald Fan-Drop Necklace.",
        price: "₹3,20,000",
        priceValue: 320000,
        metal: "Rose Gold",
        gemstone: "Emerald, Diamond",
        images: [
            BASE + "jauhari-062.jpg",
            BASE + "jauhari-063.jpg",
            BASE + "jauhari-064.jpg",
        ],
        isExclusive: true,
        material: ["Rose Gold", "Emerald", "Diamond"],
        style: ["Statement", "Bridal", "Heritage"],
    },

    {
        id: "JH-E005",
        name: "Rose Gold Diamond Pear-Cluster Studs",
        category: "Earrings",
        description:
            "A gorgeous pair of 18K rose gold stud earrings, each featuring a pear-shaped diamond centre surrounded by a vintage-style scalloped halo of brilliant-cut diamonds. Two close-up angles highlight the intricate setting.",
        price: "₹88,000",
        priceValue: 88000,
        metal: "Rose Gold",
        gemstone: "Diamond",
        images: [
            BASE + "jauhari-073.jpg",
            BASE + "jauhari-074.jpg",
        ],
        material: ["Rose Gold", "Diamond"],
        style: ["Classic", "Bridal"],
    },

    {
        id: "JH-E006",
        name: "Rose Gold Diamond Grid Studs",
        category: "Earrings",
        description:
            "Minimalist 18K rose gold stud earrings shaped as a diamond-studded grid square — four round brilliants arranged in a 2×2 pattern with bar-set separators. Two angles reveal the structured elegance. Perfect for everyday sophistication.",
        price: "₹55,000",
        priceValue: 55000,
        metal: "Rose Gold",
        gemstone: "Diamond",
        images: [
            BASE + "jauhari-075.jpg",
            BASE + "jauhari-076.jpg",
        ],
        material: ["Rose Gold", "Diamond"],
        style: ["Minimalist", "Everyday"],
    },

    {
        id: "JH-E007",
        name: "Gold Polki Emerald Jhumka Earrings",
        category: "Earrings",
        description:
            "Traditional 22K gold jhumka earrings with an oval emerald cabochon atop a polki-studded dome, ringed by gold bead fringe and green emerald drops. Two angles showcase the size and detail of these classic Hyderabadi festive earrings.",
        price: "₹1,75,000",
        priceValue: 175000,
        metal: "Gold",
        gemstone: "Emerald, Polki Diamond",
        images: [
            BASE + "jauhari-083.jpg",
            BASE + "jauhari-084.jpg",
        ],
        isExclusive: true,
        material: ["Gold", "Emerald", "Polki Diamond"],
        style: ["Traditional", "Festive"],
    },

    {
        id: "JH-E008",
        name: "Gold Pearl Bezel Stud Set",
        category: "Earrings",
        description:
            "Classic 22K yellow gold bezel-set pearl stud earrings (JSL114), paired with a matching pearl pendant for a complete set. Three angles show the lustrous white freshwater pearl against hammered gold bezels. Timeless for any occasion.",
        price: "₹48,000",
        priceValue: 48000,
        metal: "Gold",
        gemstone: "Pearl",
        weight: "1.08g",
        images: [
            BASE + "jauhari-085.jpg",
            BASE + "jauhari-086.jpg",
            BASE + "jauhari-087.jpg",
        ],
        material: ["Gold", "Pearl"],
        style: ["Classic", "Minimal"],
    },

    // ════════════════════════════════════════════════════════════
    //  BANGLES & BRACELETS  (6 products)
    // ════════════════════════════════════════════════════════════

    {
        id: "JH-B001",
        name: "Two-Tone Tiger Eye Bangle",
        category: "Bracelets",
        description:
            "A bold 22K two-tone gold bangle set with a large oval tiger eye cabochon, flanked by rope-twist gold detailing in yellow and white gold. Consolidated design featuring sleek architectural lines inspired by modern silhouettes.",
        price: "₹85,000",
        priceValue: 85000,
        metal: "Gold",
        gemstone: "Tiger Eye",
        images: [
            BASE + "jauhari-010.jpg",
            BASE + "jauhari-011.jpg",
        ],
        material: ["Gold", "Tiger Eye"],
        style: ["Statement", "Everyday", "Modern"],
    },

    {
        id: "JH-B003",
        name: "Rose Gold Floral Panel Bangle",
        category: "Bracelets",
        description:
            "An intricate 18K rose gold bangle featuring repeating floral panels with diamond pavé centres and milgrain-edged petals. Three angles reveal the full circumference of this wearable miniature garden.",
        price: "₹1,35,000",
        priceValue: 135000,
        metal: "Rose Gold",
        gemstone: "Diamond",
        images: [
            BASE + "jauhari-012.jpg",
            BASE + "jauhari-013.jpg",
            BASE + "jauhari-014.jpg",
        ],
        material: ["Rose Gold", "Diamond"],
        style: ["Floral", "Romantic"],
    },

    {
        id: "JH-B004",
        name: "Rose Gold Cuban Love Bangle",
        category: "Bracelets",
        description:
            "A chic 18K rose gold Cuban-link bangle engraved with the word 'LOVE' in bold script. Four angles capture its sturdy chain-link construction and the polished engraving. Perfect as a heartfelt gift.",
        price: "₹78,000",
        priceValue: 78000,
        metal: "Rose Gold",
        images: [
            BASE + "jauhari-015.jpg",
            BASE + "jauhari-016.jpg",
            BASE + "jauhari-017.jpg",
            BASE + "jauhari-018.jpg",
        ],
        material: ["Rose Gold"],
        style: ["Modern", "Sentimental"],
    },

    {
        id: "JH-B005",
        name: "Tri-Gold Station Bracelet",
        category: "Bracelets",
        description:
            "A versatile 22K tri-gold bracelet alternating yellow, rose and white gold stations on a fine chain — each station shaped as a textured disc. Three angles show the beautiful tonal variation.",
        price: "₹62,000",
        priceValue: 62000,
        metal: "Gold",
        images: [
            BASE + "jauhari-022.jpg",
            BASE + "jauhari-023.jpg",
            BASE + "jauhari-024.jpg",
        ],
        material: ["Yellow Gold", "Rose Gold", "White Gold"],
        style: ["Everyday", "Layering"],
    },

    {
        id: "JH-B006",
        name: "Rose Gold Polki Slice Diamond Tennis Bracelet",
        category: "Bracelets",
        description:
            "A museum-worthy 18K rose gold tennis bracelet set with large, flat-cut polki (slice diamond) stones in varying shapes — cushion, pear, and kite. Tiny brilliant accent diamonds frame each polki. Three angles capture it on a cushion display.",
        price: "₹3,85,000",
        priceValue: 385000,
        metal: "Rose Gold",
        gemstone: "Polki Diamond",
        images: [
            BASE + "jauhari-090.jpg",
            BASE + "jauhari-091.jpg",
            BASE + "jauhari-092.jpg",
        ],
        isExclusive: true,
        material: ["Rose Gold", "Polki Diamond", "Diamond"],
        style: ["Statement", "Heritage", "Bridal"],
    },

    // ════════════════════════════════════════════════════════════
    //  PENDANTS & SETS  (4 products)
    // ════════════════════════════════════════════════════════════

    {
        id: "JH-S001",
        name: "Rose Gold Diamond Marquise Flower Set",
        category: "Sets",
        description:
            "A delightful 18K rose gold matching set — mini flower stud earrings and a floral pendant, each composed of marquise-cut diamond petals arranged in a four-petal butterfly / flower silhouette. Three images show studs and pendant together.",
        price: "₹1,05,000",
        priceValue: 105000,
        metal: "Rose Gold",
        gemstone: "Diamond",
        weight: "1.08g",
        images: [
            BASE + "jauhari-077.jpg",
            BASE + "jauhari-078.jpg",
            BASE + "jauhari-079.jpg",
        ],
        material: ["Rose Gold", "Diamond"],
        style: ["Floral", "Romantic", "Everyday"],
    },

    {
        id: "JH-S002",
        name: "Rose Gold Diamond Open Clover Pendant Set",
        category: "Sets",
        description:
            "A charming 18K rose gold set featuring open-frame clover stud earrings and a matching clover pendant (JDL34), each with a diamond-studded border and petal-cluster centre. Two images show the pendant; the third reveals the full earring + pendant pairing.",
        price: "₹1,28,000",
        priceValue: 128000,
        metal: "Rose Gold",
        gemstone: "Diamond",
        images: [
            BASE + "jauhari-080.jpg",
            BASE + "jauhari-081.jpg",
            BASE + "jauhari-082.jpg",
        ],
        material: ["Rose Gold", "Diamond"],
        style: ["Floral", "Romantic"],
    },

    {
        id: "JH-S003",
        name: "Emerald & Diamond Bridal Set",
        category: "Sets",
        description:
            "A breathtaking 18K rose gold bridal set combining the Emerald Fan-Drop Necklace (065–066) and the Emerald & Diamond Chandelier Earrings (062–064) — both featuring matching square emerald centres in diamond-pavé pear halos with cascading diamond fan-drop fringe. Perfect heirloom bridal jewellery.",
        price: "₹8,40,000",
        priceValue: 840000,
        metal: "Rose Gold",
        gemstone: "Emerald, Diamond",
        images: [
            BASE + "jauhari-065.jpg",
            BASE + "jauhari-062.jpg",
            BASE + "jauhari-066.jpg",
            BASE + "jauhari-063.jpg",
        ],
        isExclusive: true,
        material: ["Rose Gold", "Emerald", "Diamond"],
        style: ["Bridal", "Heritage", "Statement"],
    },

    {
        id: "JH-S004",
        name: "Rose Gold Diamond Bolo Bracelet",
        category: "Sets",
        description:
            "A refined 18K rose gold adjustable bolo bracelet (JDB3) with seven round diamond flower clusters on a fine box chain with a ball slider. Two images show it laid flat and angled. The perfect gift with a timeless, adjustable fit. Also shown with the Polki Tennis Bracelet as a stack.",
        price: "₹88,000",
        priceValue: 88000,
        metal: "Rose Gold",
        gemstone: "Diamond",
        images: [
            BASE + "jauhari-093.jpg",
            BASE + "jauhari-094.jpg",
            BASE + "jauhari-095.jpg",
        ],
        material: ["Rose Gold", "Diamond"],
        style: ["Modern", "Everyday", "Gift"],
    },
];

export default jauhariProducts;
