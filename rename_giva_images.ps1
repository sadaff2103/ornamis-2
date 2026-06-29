# Rename Giva images to URL-safe names
$jewelryPath = "C:\Users\sadaf\OneDrive\Desktop\ornamis-2\public\jewelry"

$renames = @{
    "1 Pair Of Ladies' Rhinestone Earrings; Lovely Heart-Shaped Design.jpg" = "giva_heart_rhinestone_earrings.jpg"
    "18K Gold Beaded Bow Bracelet Pack.jpg" = "giva_gold_bow_bracelet_pack.jpg"
    "1Pair 2Pcs Golden_Silver Fashionable Simple Bowknot Cat's Eye Stone Tassel Earrings, Linear Design, Suitable For Women's Daily Wear.jpg" = "giva_bowknot_cats_eye_earrings.jpg"
    "1pc Luxe 925 sterling zilver champagne verguld voortreffelijk paardenoog vierkant rode CZ steen open ring, damesmode fijne sieraden voor dagelijks gebruik.jpg" = "giva_luxe_silver_red_cz_ring.jpg"
    "25 Anillos de compromiso en forma de corona que tu princesa interior desea recibir.jpg" = "giva_crown_engagement_ring.jpg"
    "2pcs Stylish And Simple Gold-Colored Tear Drop Cubic Zirconia Earrings, Women's Delicate Crisscross Ear Jewelry.jpg" = "giva_tear_drop_cz_earrings.jpg"
    "AD Sea Green Pendant Set Images.jpg" = "giva_sea_green_pendant_set.jpg"
    "Aestetic koream purple.jpg" = "giva_aesthetic_purple_jewelry.jpg"
    "Alloy Brass White, Gold Jewellery Set.jpg" = "giva_alloy_brass_jewelry_set.jpg"
    "Andkiss Rhinestone Heart Stud Earrings Valentines.jpg" = "giva_rhinestone_heart_studs.jpg"
    "Beauty and the Beast Bracelet Birthday Gift Rose Charm Bracelets Costume Jewelry Mother's Day Gifts for Women Personalized Initial Bracelet - Etsy Ireland.jpg" = "giva_beauty_beast_rose_bracelet.jpg"
    "Cubic Zirconia Flower Drop Earrings.jpg" = "giva_cz_flower_drop_earrings.jpg"
    "Delicate Bloom Rhinestone Leaf Bracelet.jpg" = "giva_bloom_leaf_bracelet.jpg"
    "Elegant Pink Floral Butterfly Choker Necklace, Angelic Fairycore Necklace, Gold Regency Princess Choker, Evening_ Party_ Prom Necklaces - Etsy.jpg" = "giva_pink_butterfly_choker.jpg"
    "Ethereal  Necklace Set.jpg" = "giva_ethereal_necklace_set.jpg"
    "Evergreen Halo Set _ Everyday Set _ Rose Gold Jewelry _ GIVA Set _ Minimal _ Green.jpg" = "giva_evergreen_halo_set.jpg"
    "Floral Elegance_ Lab Grown Diamond Necklace with Round Cut Sparkle.jpg" = "giva_floral_diamond_necklace.jpg"
    "Flower Petal Necklace Earring Set Pink Gold-tone Rhinestone Pink Flower Gift.jpg" = "giva_flower_petal_set.jpg"
    "Four Heart Magnetic Gold Plated Chain With Pendant __ Link in Bio #jewellery #necklace #fashion #gold #women.jpg" = "giva_four_heart_pendant.jpg"
    "GIVA 925 Silver Bhumi Silver One in a Trillium Necklace.jpg" = "giva_bhumi_trillium_necklace.jpg"
    "GIVA 925 Silver Flowery Snowflake Studs_ studs to Gift Women_ With Certificate of Authenticity.jpg" = "giva_flowery_snowflake_studs.jpg"
    "GIVA 925 Silver Heart Lock Bracelet Anklet Pendant.jpg" = "giva_heart_lock_bracelet.jpg"
    "GIVA 925 Sterling Silver Blue Daisy Set.jpg" = "giva_blue_daisy_set.jpg"
    "GIVA Bestsellers _ Most-Loved Jewellery Collection.jpg" = "giva_bestsellers_collection.jpg"
    "GIVA GPay Signature Collection _ Exclusive Jewellery Designs.jpg" = "giva_gpay_signature_collection.jpg"
    "INDIAN JEWELLERY.jpg" = "giva_indian_jewellery.jpg"
    "Jewelry (1).jpg" = "giva_jewelry_1.jpg"
    "Lulu Dainty Twist Adjustable Ring in Rose Gold.jpg" = "giva_lulu_twist_ring.jpg"
    "Marquise Rhinestone Open Rings (011310269).jpg" = "giva_marquise_open_rings.jpg"
    "Mother of Pearl Four Leaf Clover Bracelet_ Etsy.jpg" = "giva_pearl_clover_bracelet.jpg"
    "New Elegant Crystal Drop Earrings _ Color_ Gold _ Size_ Os.jpg" = "giva_elegant_crystal_drops.jpg"
    "Newpretty!! Heart Necklace With Tiny Cz's In Gold _ Color_ Gold _ Size_ Os.jpg" = "giva_heart_cz_necklace.jpg"
    "Oak leaves wedding band for woman, diamond wedding ring, 14K 18K gold.jpg" = "giva_oak_leaves_wedding_band.jpg"
    "Original Silk Sterling Silver Zircon Butterfly Tassel Charm Bracelet.jpg" = "giva_butterfly_tassel_bracelet.jpg"
    "Pear shape diamond Halo Teardrop earrings.jpg" = "giva_pear_halo_earrings.jpg"
    "Pretty jewellery.jpg" = "giva_pretty_jewellery.jpg"
    "Pretty ring.jpg" = "giva_pretty_ring.jpg"
    "Real Rose Necklace, Real Flower Necklace, Tiny Minimalistic Necklace, Valentine's Day Gift Simple Gold Necklace, Resin Jewelry, Gift for Her - Etsy.jpg" = "giva_real_rose_necklace.jpg"
    "Rhinestone Drop Earrings.jpg" = "giva_rhinestone_drop_earrings.jpg"
    "Rose Gold Infinity Necklace • Butterfly Solitaire Diamond Necklace.jpg" = "giva_rose_gold_infinity_necklace.jpg"
    "Rose gold marquise cubic zirconia Bridal bracelet - LAUREN - rhodium (silver) _ Box clasp.jpg" = "giva_rose_gold_bridal_bracelet.jpg"
    "Silver Golden Glinting Joy Zircon Earrings _ Gifts for Girlfriend, Gifts for Women and Girls.jpg" = "giva_glinting_joy_earrings.jpg"
    "Silver Rose Gold Forever Elegant Jhumki _ Gifts for Girlfriend, Gifts for Women and Girls.jpg" = "giva_rose_gold_jhumki.jpg"
    "Silver Rose Gold Glowy Radiance Bracelet, Adjustable _ Gifts for Women and Girls.jpg" = "giva_glowy_radiance_bracelet.jpg"
    "Simple Elegant Acrylic Twist Wave Geometric Bangle.jpg" = "giva_acrylic_twist_bangle.jpg"
    "Some of our favourite diamond earrings available in store 😍.jpg" = "giva_favourite_diamond_earrings.jpg"
    "The prettiest Silver Jewellery_Gifts for Women & Girls_Wedding and Christmas Gifts_.jpg" = "giva_prettiest_silver_jewellery.jpg"
    "Unique Engagement Rings We're Loving.jpg" = "giva_unique_engagement_rings.jpg"
    "Unique floral fantasy inspired gold engagement ring, features a stunning sparkling Marquise cut lab diamond, surrounded by delicate carved gold floral motives, embedded with small accented lab diamonds_ This unique.jpg" = "giva_floral_fantasy_ring.jpg"
    "Women accessories _ Bracelet.jpg" = "giva_women_bracelet.jpg"
    "Zircon Pendant Necklace.jpg" = "giva_zircon_pendant_necklace.jpg"
}

foreach ($old in $renames.Keys) {
    $oldPath = Join-Path $jewelryPath $old
    $newPath = Join-Path $jewelryPath $renames[$old]
    if (Test-Path $oldPath) {
        Rename-Item -Path $oldPath -NewName $renames[$old] -Force -ErrorAction SilentlyContinue
        Write-Host "Renamed: $old"
    }
}

Write-Host "`nAll Giva files renamed successfully!"
