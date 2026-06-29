// CAREFULLY RECATEGORIZED product collections based on image filenames ONLY
// Only categorizing items where the filename clearly shows what type of jewelry it is
import type { UnifiedProduct } from './allProducts';
export type { UnifiedProduct };
import { palmonasProducts as palmonasProductsData } from './palmonasProducts';
import { jauhariProducts as jauhariProductsData } from './jauhariProducts';

const p = (
    id: string, name: string, category: string, desc: string,
    price: string, priceValue: number, metal: string, imageUrl: string,
    store: 'Giva' | 'Palmonas' | 'Khan Jewellers' | 'Jauhari',
    storeUrl: string, extra?: Partial<UnifiedProduct>
): UnifiedProduct => ({
    id, name, category, description: desc, price, priceValue, metal, imageUrl, store, storeUrl, ...extra
});

const givaUrl = "https://www.giva.co/";
const khanUrl = "#";
const palmonasUrl = "https://www.palmonas.com/";

// ========== RINGS - Only images with "ring" in filename ==========
const givaRings: UnifiedProduct[] = [
    p("GV-033", "Lulu Twist Ring", "Rings", "Lulu Dainty Twist Adjustable Ring in Rose Gold", "₹2,299", 2299, "Rose Gold", "/jewelry/Lulu_Dainty_Twist_Adjustable_Ring_in_Rose_Gold.jpg", "Giva", givaUrl),
    p("GV-052", "Pretty Ring", "Rings", "Pretty ring design", "₹2,199", 2199, "Silver", "/jewelry/Pretty_ring.jpg", "Giva", givaUrl),
];

const khanRings: UnifiedProduct[] = [
    p("KJ-R001", "Diamond Solitaire Ring", "Rings", "18K white gold with brilliant cut diamond", "₹1,45,000", 145000, "White Gold", "/jewelry/ring_diamond_solitaire_1768489347746.png", "Khan Jewellers", khanUrl, { weight: "5.8g" }),
    p("KJ-R006", "Sapphire Halo Ring", "Rings", "18K gold with sapphire and diamond halo", "₹1,85,000", 185000, "Gold", "/jewelry/ring_sapphire_halo_1768489370442.png", "Khan Jewellers", khanUrl, { weight: "6.0g" }),
    p("KJ-R007", "Pearl Gold Ring", "Rings", "22K gold with natural pearl", "₹65,000", 65000, "Gold", "/jewelry/ring_pearl_gold_1768489385702.png", "Khan Jewellers", khanUrl, { weight: "5.5g" }),
    p("KJ-R008", "Antique Design Ring", "Rings", "22K gold with antique finish", "₹75,000", 75000, "Gold", "/jewelry/ring_antique_design_1768489405531.png", "Khan Jewellers", khanUrl, { weight: "6.8g" }),
    // New Khan rings from folder
    p("KJ-R009", "Elegant Khan Ring 1", "Rings", "Exquisite gold ring design", "₹85,000", 85000, "Gold", "/jewelry/ring_1.jpg", "Khan Jewellers", khanUrl),
    p("KJ-R010", "Elegant Khan Ring 2", "Rings", "Beautiful gold ring", "₹95,000", 95000, "Gold", "/jewelry/ring_2.jpg", "Khan Jewellers", khanUrl),
    p("KJ-R011", "Elegant Khan Ring 3", "Rings", "Stunning ring design", "₹1,15,000", 115000, "Gold", "/jewelry/ring_3.jpg", "Khan Jewellers", khanUrl),
    p("KJ-R012", "Elegant Khan Ring 4", "Rings", "Premium gold ring", "₹1,25,000", 125000, "Gold", "/jewelry/ring_4.jpg", "Khan Jewellers", khanUrl),
    p("KJ-R013", "Elegant Khan Ring 5", "Rings", "Designer gold ring", "₹98,000", 98000, "Gold", "/jewelry/ring_5.jpg", "Khan Jewellers", khanUrl),
    p("KJ-R014", "Elegant Khan Ring 6", "Rings", "Luxury ring design", "₹1,45,000", 145000, "Gold", "/jewelry/ring_6.jpg", "Khan Jewellers", khanUrl),
    p("KJ-R015", "Elegant Khan Ring 7", "Rings", "Classic gold ring", "₹1,05,000", 105000, "Gold", "/jewelry/ring_7.jpg", "Khan Jewellers", khanUrl),
    p("KJ-R016", "Elegant Khan Ring 8", "Rings", "Traditional ring style", "₹88,000", 88000, "Gold", "/jewelry/ring_8.jpg", "Khan Jewellers", khanUrl),
    p("KJ-R017", "Elegant Khan Ring 9", "Rings", "Sophisticated ring", "₹1,35,000", 135000, "Gold", "/jewelry/ring_9.jpg", "Khan Jewellers", khanUrl),
    p("KJ-R018", "Elegant Khan Ring 10", "Rings", "Premium ring collection", "₹1,55,000", 155000, "Gold", "/jewelry/ring_10.jpg", "Khan Jewellers", khanUrl),
];

// Palmonas rings imported from palmonasProducts.ts

// ========== NECKLACES - Only images with "necklace", "choker", "pendant" in filename ==========
const givaNecklaces: UnifiedProduct[] = [
    p("GV-014", "Trillium Necklace", "Necklaces", "925 Silver Trillium Necklace", "₹4,799", 4799, "Silver", "/jewelry/GIVA_925_Silver_Bhumi_Silver_One_in_a_Trillium_Necklace.jpg", "Giva", givaUrl),
    p("GV-038", "Butterfly Choker", "Necklaces", "Elegant Pink Floral Butterfly Choker", "₹4,299", 4299, "Gold", "/jewelry/Elegant_Pink_Floral_Butterfly_Choker.jpg", "Giva", givaUrl),
    p("GV-039", "Infinity Necklace", "Necklaces", "Rose Gold Infinity Necklace", "₹5,799", 5799, "Rose Gold", "/jewelry/Rose_Gold_Infinity_Necklace.jpg", "Giva", givaUrl),
    p("GV-040", "Rose Necklace", "Necklaces", "Real Rose Necklace", "₹3,499", 3499, "Gold", "/jewelry/Real_Rose_Necklace,_Real_Flower_Necklace,_Tiny_Minimalistic_Necklace,_Valentine's_Day_Gift_Simple_Gold_Necklace,_Resin_Jewelry,_Gift_for_Her_-_Etsy.jpg", "Giva", givaUrl),
    p("GV-042", "Floral Necklace", "Necklaces", "Floral Lab Grown Diamond Necklace", "₹6,499", 6499, "Silver", "/jewelry/Floral_Elegance__Lab_Grown_Diamond_Necklace_with_Round_Cut_Sparkle.jpg", "Giva", givaUrl),
    p("GV-043", "Heart Pendant", "Necklaces", "Four Heart Pendant with Chain", "₹3,799", 3799, "Gold", "/jewelry/Four_Heart_Magnetic_Gold_Plated_Chain_With_P.jpg", "Giva", givaUrl),
    p("GV-044", "Zircon Pendant", "Necklaces", "Zircon Pendant Necklace", "₹2,799", 2799, "Silver", "/jewelry/Zircon_Pendant_Necklace.jpg", "Giva", givaUrl),
    p("GV-059", "Queen Necklace", "Necklaces", "Queen necklace design", "₹4,799", 4799, "Silver", "/jewelry/Queen_necklace_🍂🍂.jpg", "Giva", givaUrl),
    p("GV-061", "Diamond Necklace", "Necklaces", "Diamond necklace", "₹3,999", 3999, "Silver", "/jewelry/Necklace.jpg", "Giva", givaUrl),
];

const khanNecklaces: UnifiedProduct[] = [
    p("KJ-N001", "Traditional Necklace", "Necklaces", "22K gold traditional necklace", "₹1,95,000", 195000, "Gold", "/jewelry/necklace_traditional_gold_1768489235856.png", "Khan Jewellers", khanUrl, { weight: "28.5g" }),
    p("KJ-N002", "Kundan Necklace", "Necklaces", "22K gold kundan necklace with pearls", "₹2,45,000", 245000, "Gold", "/jewelry/necklace_kundan_pearl_1768489256743.png", "Khan Jewellers", khanUrl, { weight: "35.2g" }),
    p("KJ-N003", "Emerald Choker", "Necklaces", "22K gold choker with emerald", "₹3,15,000", 315000, "Gold", "/jewelry/necklace_emerald_choker_1768489274745.png", "Khan Jewellers", khanUrl, { weight: "42.0g" }),
    p("KJ-N004", "Temple Necklace", "Necklaces", "Traditional temple design necklace", "₹2,85,000", 285000, "Gold", "/jewelry/necklace_temple_design_1768489291420.png", "Khan Jewellers", khanUrl, { weight: "38.5g" }),
    p("KJ-N005", "Ruby Necklace", "Necklaces", "18K white gold with ruby necklace", "₹3,95,000", 395000, "White Gold", "/jewelry/necklace_ruby_diamond_1768489313570.png", "Khan Jewellers", khanUrl, { weight: "32.0g" }),
    // New Khan necklaces from folder
    p("KJ-N006", "Khan Necklace 1", "Necklaces", "Exquisite gold necklace", "₹2,25,000", 225000, "Gold", "/jewelry/necklace_1.jpg", "Khan Jewellers", khanUrl),
    p("KJ-N007", "Khan Necklace 2", "Necklaces", "Beautiful traditional necklace", "₹2,75,000", 275000, "Gold", "/jewelry/necklace_2.jpg", "Khan Jewellers", khanUrl),
    p("KJ-N008", "Khan Necklace 3", "Necklaces", "Ornate gold necklace", "₹3,25,000", 325000, "Gold", "/jewelry/necklace_3.jpg", "Khan Jewellers", khanUrl),
    p("KJ-N009", "Khan Necklace 4", "Necklaces", "Premium necklace design", "₹2,95,000", 295000, "Gold", "/jewelry/necklace_4.jpg", "Khan Jewellers", khanUrl),
    p("KJ-N010", "Khan Necklace 5", "Necklaces", "Designer necklace", "₹2,45,000", 245000, "Gold", "/jewelry/necklace_5.jpg", "Khan Jewellers", khanUrl),
    p("KJ-N011", "Khan Necklace 6", "Necklaces", "Elegant necklace", "₹2,65,000", 265000, "Gold", "/jewelry/necklace_6.jpg", "Khan Jewellers", khanUrl),
    p("KJ-N012", "Khan Necklace 7", "Necklaces", "Luxury necklace design", "₹3,45,000", 345000, "Gold", "/jewelry/necklace_7.jpg", "Khan Jewellers", khanUrl),
    p("KJ-N013", "Khan Necklace 8", "Necklaces", "Traditional gold necklace", "₹3,15,000", 315000, "Gold", "/jewelry/necklace_8.jpg", "Khan Jewellers", khanUrl),
    p("KJ-N014", "Khan Necklace 9", "Necklaces", "Stunning necklace style", "₹2,85,000", 285000, "Gold", "/jewelry/necklace_9.jpg", "Khan Jewellers", khanUrl),
    p("KJ-N015", "Khan Necklace 10", "Necklaces", "Premium gold necklace", "₹3,05,000", 305000, "Gold", "/jewelry/necklace_10.jpg", "Khan Jewellers", khanUrl),
];

// Palmonas necklaces imported from palmonasProducts.ts

// ========== EARRINGS - Only images with "earring", "stud", "hoop" in filename ==========
const givaEarrings: UnifiedProduct[] = [
    p("GV-016", "Heart Stud Earrings", "Earrings", "Rhinestone Heart Stud Earrings", "₹1,999", 1999, "Silver", "/jewelry/Andkiss_Rhinestone_Heart_Stud_Earrings_Valentines.jpg", "Giva", givaUrl),
    p("GV-017", "Drop Earrings", "Earrings", "Water Drop CZ Earrings", "₹2,799", 2799, "Gold", "/jewelry/1_Pair_Elegant_Water_Drop_CZ_Women_Long_Wedding_Earrings_With_AAA_Cubic_Zirconia_Dangle_Ea.jpg", "Giva", givaUrl, { isNew: true }),
    p("GV-018", "Flower Drop Earrings", "Earrings", "Cubic Zirconia Flower Drop Earrings", "₹2,499", 2499, "Silver", "/jewelry/Cubic_Zirconia_Flower_Drop_Earrings.jpg", "Giva", givaUrl),
    p("GV-019", "Teardrop Earrings", "Earrings", "Pear Halo Teardrop earrings", "₹4,999", 4999, "Silver", "/jewelry/Pear_shape_diamond_Halo_Teardrop_earrings.jpg", "Giva", givaUrl),
    p("GV-020", "Pearl Stud Earrings", "Earrings", "Bow Pearl Rhinestone Stud Earrings", "₹1,799", 1799, "Silver", "/jewelry/1_Pair_Elegant_Bow_Faux_Pearl_Rhinestone_Stud_Earrings_ValentinesI_discovered_amazing_products_on_SHEIN_com,_come_check_them_out!.jpg", "Giva", givaUrl),
    p("GV-023", "Zircon Earrings", "Earrings", "Silver Golden Glinting Joy Zircon Earrings", "₹2,699", 2699, "Silver", "/jewelry/Silver_Golden_Glinting_Joy_Zircon_Earrings___Gifts_for_Girlfriend,_Gifts_for_Women_and_Girls.jpg", "Giva", givaUrl),
    p("GV-024", "Drop Earrings", "Earrings", "Rhinestone Drop Earrings", "₹2,199", 2199, "Silver", "/jewelry/Rhinestone_Drop_Earrings.jpg", "Giva", givaUrl),
    p("GV-022", "Jhumki Earrings", "Earrings", "Silver Rose Gold Jhumki", "₹3,299", 3299, "Rose Gold", "/jewelry/Silver_Rose_Gold_Forever_Elegant_Jhumki___Gifts_for_Girlfriend,_Gifts_for_Women_and_Girls.jpg", "Giva", givaUrl),
    p("GV-050", "Diamond Earrings", "Earrings", "Favourite diamond earrings", "₹5,499", 5499, "Silver", "/jewelry/Some_of_our_favourite_diamond_earrin.jpg", "Giva", givaUrl),
    p("GV-051", "Hoop Earrings", "Earrings", "BHLDN Irene Hoop Earrings", "₹3,999", 3999, "Gold", "/jewelry/BHLDN_Irene_Hoop_Earrings.jpg", "Giva", givaUrl),
    p("GV-062", "Flower Earrings", "Earrings", "Luxury CZ Flower Dangle Earrings", "₹2,299", 2299, "Silver", "/jewelry/1pair_Luxury_Cubic_Zirconia_Flower_Water_Drop_Dangle_Earrings_For_Women_Wedding_Dresses_Ladies_Daily_Graduation_Gift.jpg", "Giva", givaUrl),
    p("GV-063", "Geometric Earrings", "Earrings", "Rhinestone Geometric Drop Earrings", "₹2,499", 2499, "Silver", "/jewelry/Rhinestone_Decor_Geometric_Drop_Earrings.jpg", "Giva", givaUrl),
    p("GV-064", "Elegant Earrings", "Earrings", "Beautiful earrings collection", "₹2,999", 2999, "Silver", "/jewelry/Earrings_🤩.jpg", "Giva", givaUrl),
];

// Palmonas earrings imported from palmonasProducts.ts

const khanEarrings: UnifiedProduct[] = [
    p("KJ-E001", "Khan Earrings 1", "Earrings", "Elegant gold earrings", "₹45,000", 45000, "Gold", "/jewelry/earrings_1.jpg", "Khan Jewellers", khanUrl),
    p("KJ-E002", "Khan Earrings 2", "Earrings", "Beautiful earring design", "₹52,000", 52000, "Gold", "/jewelry/earrings_2.jpg", "Khan Jewellers", khanUrl),
    p("KJ-E003", "Khan Earrings 3", "Earrings", "Traditional earrings", "₹48,000", 48000, "Gold", "/jewelry/earrings__3.jpg", "Khan Jewellers", khanUrl),
    p("KJ-E004", "Khan Earrings 4", "Earrings", "Designer earrings", "₹55,000", 55000, "Gold", "/jewelry/earrings_4.jpg", "Khan Jewellers", khanUrl),
    p("KJ-E005", "Khan Earrings 5", "Earrings", "Premium gold earrings", "₹62,000", 62000, "Gold", "/jewelry/earrings_5.jpg", "Khan Jewellers", khanUrl),
    p("KJ-E006", "Khan Earrings 6", "Earrings", "Luxury earring style", "₹58,000", 58000, "Gold", "/jewelry/earrings_6.jpg", "Khan Jewellers", khanUrl),
    p("KJ-E007", "Khan Earrings 7", "Earrings", "Ornate earrings", "₹65,000", 65000, "Gold", "/jewelry/earrings_7.jpg", "Khan Jewellers", khanUrl),
    p("KJ-E008", "Khan Earrings 8", "Earrings", "Exquisite design earrings", "₹68,000", 68000, "Gold", "/jewelry/earrings_8.jpg", "Khan Jewellers", khanUrl),
    p("KJ-E009", "Khan Earrings 9", "Earrings", "Classic earrings", "₹72,000", 72000, "Gold", "/jewelry/earrings_9.jpg", "Khan Jewellers", khanUrl),
    p("KJ-E010", "Khan Earrings 10", "Earrings", "Sophisticated earring pair", "₹75,000", 75000, "Gold", "/jewelry/earrings_10.jpg", "Khan Jewellers", khanUrl),
];



// ========== BRACELETS - Only images with "bracelet", "bangle" in filename ==========
const givaBracelets: UnifiedProduct[] = [
    p("GV-013", "Heart Lock Bracelet", "Bracelets", "925 Silver Heart Lock Bracelet", "₹3,499", 3499, "Silver", "/jewelry/GIVA_925_Silver_Heart_Lock_Bracelet_Anklet_Pendant.jpg", "Giva", givaUrl),
    p("GV-025", "Bow Bracelet", "Bracelets", "18K Gold Beaded Bow Bracelet Pack", "₹4,499", 4499, "Gold", "/jewelry/18K_Gold_Beaded_Bow_Bracelet_Pack.jpg", "Giva", givaUrl),
    p("GV-026", "Leaf Bracelet", "Bracelets", "Delicate Bloom Rhinestone Leaf Bracelet", "₹2,899", 2899, "Silver", "/jewelry/Delicate_Bloom_Rhinestone_Leaf_Bracelet.jpg", "Giva", givaUrl),
    p("GV-028", "Butterfly Bracelet", "Bracelets", "Sterling Silver Butterfly Tassel Charm Bracelet", "₹3,599", 3599, "Silver", "/jewelry/Original_Silk_Sterling_Silver_Zircon_Butterfly_Tassel_Charm_Bracelet.jpg", "Giva", givaUrl),
    p("GV-029", "Rose Charm Bracelet", "Bracelets", "Beauty and the Beast Rose Charm Bracelet", "₹2,999", 2999, "Silver", "/jewelry/Beauty_and_the_Beast_Bracelet_Birthday_Gift_Rose_Charm_Bracelets.jpg", "Giva", givaUrl),
    p("GV-031", "Heart Bracelet", "Bracelets", "Rhinestone Detail Heart Bracelet", "₹2,499", 2499, "Rose Gold", "/jewelry/Rhinestone_Detail_Heart_Decor_Bracelet.jpg", "Giva", givaUrl),
    p("GV-032", "Twist Bangle", "Bracelets", "Elegant Acrylic Twist Wave Bangle", "₹1,999", 1999, "Gold", "/jewelry/Simple_Elegant_Acrylic_Twist_Wave_Geometric_Bangle.jpg", "Giva", givaUrl),
    p("GV-066", "Leaf Bracelet", "Bracelets", "Leaf Design Link Bracelet", "₹2,899", 2899, "Silver", "/jewelry/Leaf_Design_Link_Bracelet_1pc.jpg", "Giva", givaUrl),
    p("GV-067", "Star Moon Bracelet", "Bracelets", "Double-Layered Star Moon Bracelet", "₹1,999", 1999, "Silver", "/jewelry/1pc_Forest_Style_Small_Fresh_And_Sweet_Double-Layered_Star_And_Moon_Bracelet_For_Women_Dating_Daily_Gift.jpg", "Giva", givaUrl),
    p("GV-068", "Tennis Bracelet", "Bracelets", "925 Silver Moissanite Diamond Tennis Bracelet", "₹5,999", 5999, "Silver", "/jewelry/925_Sterling_Silver_Moissanite_Diamond_3_5ct_Heart_Tennis_Bracelet_Adjustable.jpg", "Giva", givaUrl),
];

// Palmonas bracelets imported from palmonasProducts.ts

const khanBracelets: UnifiedProduct[] = [
    p("KJ-B001", "Khan Bracelet 1", "Bracelets", "Elegant gold bracelet", "₹1,25,000", 125000, "Gold", "/jewelry/Bracelet_1.jpg", "Khan Jewellers", khanUrl),
    p("KJ-B002", "Khan Bracelet 2", "Bracelets", "Beautiful bracelet design", "₹1,45,000", 145000, "Gold", "/jewelry/Bracelet_2.jpg", "Khan Jewellers", khanUrl),
    p("KJ-B003", "Khan Bracelet 3", "Bracelets", "Traditional bracelet", "₹1,35,000", 135000, "Gold", "/jewelry/Bracelet_3.jpg", "Khan Jewellers", khanUrl),
    p("KJ-B004", "Khan Bracelet 4", "Bracelets", "Designer gold bracelet", "₹1,55,000", 155000, "Gold", "/jewelry/Bracelet_4.jpg", "Khan Jewellers", khanUrl),
    p("KJ-B005", "Khan Bracelet 5", "Bracelets", "Premium bracelet", "₹1,65,000", 165000, "Gold", "/jewelry/Bracelet_5.jpg", "Khan Jewellers", khanUrl),
    p("KJ-B006", "Khan Bracelet 6", "Bracelets", "Luxury bracelet style", "₹1,75,000", 175000, "Gold", "/jewelry/Bracelet_6.jpg", "Khan Jewellers", khanUrl),
    p("KJ-B007", "Khan Bracelet 7", "Bracelets", "Ornate bracelet", "₹1,85,000", 185000, "Gold", "/jewelry/Bracelet_7.jpg", "Khan Jewellers", khanUrl),
    p("KJ-B008", "Khan Bracelet 8", "Bracelets", "Exquisite bracelet", "₹1,95,000", 195000, "Gold", "/jewelry/Bracelet_8.jpg", "Khan Jewellers", khanUrl),
    p("KJ-B009", "Khan Bracelet 9", "Bracelets", "Classic bracelet", "₹2,05,000", 205000, "Gold", "/jewelry/Bracelet_9.jpg", "Khan Jewellers", khanUrl),
    p("KJ-B010", "Khan Bracelet 10", "Bracelets", "Premium gold bracelet", "₹2,15,000", 215000, "Gold", "/jewelry/Bracelet_10.jpg", "Khan Jewellers", khanUrl),
];

// ========== SETS - Jewelry sets ==========
const givaSets: UnifiedProduct[] = [
    p("GV-011", "Blue Daisy Set", "Sets", "925 Sterling Silver Blue Daisy Set", "₹6,999", 6999, "Silver", "/jewelry/GIVA_925_Sterling_Silver_Blue_Daisy_Set.jpg", "Giva", givaUrl, { isNew: true }),
    p("GV-015", "Evergreen Halo Set", "Sets", "Rose Gold Jewelry Set", "₹5,499", 5499, "Rose Gold", "/jewelry/Evergreen_Halo_Set.jpg", "Giva", givaUrl),
    p("GV-045", "Sea Green Set", "Sets", "AD Sea Green Pendant Set", "₹4,999", 4999, "Silver", "/jewelry/AD_Sea_Green_Pendant_Set_Images.jpg", "Giva", givaUrl),
    p("GV-046", "Ethereal Set", "Sets", "Ethereal Necklace Set", "₹5,999", 5999, "Silver", "/jewelry/Ethereal__Necklace_Set.jpg", "Giva", givaUrl),
    p("GV-047", "Flower Petal Set", "Sets", "Flower Petal Necklace Earring Set", "₹4,499", 4499, "Gold", "/jewelry/Flower_Petal_Necklace_Earring.jpg", "Giva", givaUrl),
    p("GV-048", "Brass Set", "Sets", "Alloy Brass Jewellery Set", "₹3,999", 3999, "Gold", "/jewelry/Alloy_Brass_White,_Gold_Jewellery_Set.jpg", "Giva", givaUrl),
    p("GV-054", "Indian Set", "Sets", "Traditional Indian Jewellery", "₹7,999", 7999, "Gold", "/jewelry/INDIAN_JEWELLERY.jpg", "Giva", givaUrl),
    p("GV-056", "Silver Set", "Sets", "The prettiest Silver Jewellery", "₹6,499", 6499, "Silver", "/jewelry/The_prettiest_Silver_Jeweller.jpg", "Giva", givaUrl),
    p("GV-057", "Bestsellers Set", "Sets", "GIVA Bestsellers Collection", "₹8,999", 8999, "Silver", "/jewelry/GIVA_Bestsellers.jpg", "Giva", givaUrl, { isNew: true }),
    p("GV-058", "GPay Set", "Sets", "GIVA GPay Signature Collection", "₹7,499", 7499, "Silver", "/jewelry/GIVA_GPay_Signature_Collection.jpg", "Giva", givaUrl, { isNew: true }),
    p("GV-069", "Jewelry Set", "Sets", "Beautiful jewelry collection", "₹5,999", 5999, "Silver", "/jewelry/Jewelry_(1).jpg", "Giva", givaUrl),
    p("GV-070", "Pretty Set", "Sets", "Pretty jewellery collection", "₹4,999", 4999, "Silver", "/jewelry/Pretty_jewellery.jpg", "Giva", givaUrl),
    p("GV-071", "Rose Gold Set", "Sets", "Silver Rose Gold jewelry set", "₹5,499", 5499, "Rose Gold", "/jewelry/Silver_Rose_Gold.jpg", "Giva", givaUrl),
];

// Palmonas sets - none in palmonasProducts.ts yet

// ========== COMBINE ALL PRODUCTS ==========
export const givaProducts = [...givaRings, ...givaNecklaces, ...givaEarrings, ...givaBracelets, ...givaSets];
export const khanProducts = [...khanRings, ...khanNecklaces, ...khanEarrings, ...khanBracelets];

// Convert Palmonas products to UnifiedProduct format
const palmonasConverted: UnifiedProduct[] = palmonasProductsData.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    price: p.price,
    priceValue: p.priceValue,
    metal: p.metal,
    imageUrl: p.imageUrl,
    store: 'Palmonas' as const,
    storeUrl: palmonasUrl,
    weight: p.weight,
    isBridal: p.isBridal,
}));

export const palmonasProducts = palmonasConverted;

// Convert Jauhari products to UnifiedProduct format
const jauhariConverted: UnifiedProduct[] = jauhariProductsData.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    price: p.price,
    priceValue: p.priceValue,
    metal: p.metal,
    imageUrl: p.images[0], // Use first image as main
    images: p.images, // Pass all images for PDP gallery
    store: 'Jauhari' as const,
    storeUrl: '#',
    weight: p.weight,
    gemstone: p.gemstone,
    isExclusive: p.isExclusive,
    isLimited: p.isLimited,
}));

export const jauhariProducts = jauhariConverted;

export const allProducts: UnifiedProduct[] = [
    ...givaProducts,
    ...khanProducts,
    ...palmonasProducts,
    ...jauhariProducts,
];

// Export by category
export const rings = allProducts.filter(p => p.category === 'Rings');
export const necklaces = allProducts.filter(p => p.category === 'Necklaces');
export const earrings = allProducts.filter(p => p.category === 'Earrings');
export const bracelets = allProducts.filter(p => p.category === 'Bracelets');
export const sets = allProducts.filter(p => p.category === 'Sets');

export const getProductsByCategory = (category: string): UnifiedProduct[] => {
    if (category === 'All') return allProducts;
    return allProducts.filter(p => p.category === category);
};
