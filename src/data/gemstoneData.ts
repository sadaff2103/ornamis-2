// Comprehensive Gemstone Database for ORNAMIS Gem Encyclopedia
// Contains detailed information about each gemstone including descriptions,
// properties, origins, and related stones

import imgCutAlexandritePng from "figma:asset/4e3ac42d89cd6de519170b431ccf02c9a5f24dac.png";
import imgAmberGemstonePng from "figma:asset/1f8a18b369dd6561e3b24393ace97b2123cd3c88.png";
import imgAmethystGemstonePng from "figma:asset/0cdf9c483fb1f3d57d53e5a30e5003b54361e17d.png";
import imgAmetrineGemstonePng from "figma:asset/bb007eeb28ba04d8dd7a8d69cb4d2693fcd1d276.png";
import imgAquamarineGemstonePng from "figma:asset/b465d288b290dcdf13b003d6c1d00783ce90719e.png";
import imgCitrineGemstonePng from "figma:asset/45d19cbd7a885db5d272d3fbaa48ee38439598e1.png";
import imgGreenEmeraldPng from "figma:asset/276e246bb652ba5d6dfba899653b9a39fcf08075.png";
import imgPolishedGarnetGemstonePng from "figma:asset/0b225929c042cdb144c76b84a91a61c636f85348.png";
import imgPolishedIoliteGemstonePng from "figma:asset/17761087d7c80245e6086c166b9825f90872d0c4.png";
import imgJadeGemstonePng from "figma:asset/7bfa7c118b006b4b4bf39d908c98cd7d73f8a295.png";
import imgKunziteGemstonePng from "figma:asset/a1dec71a5f9b9cd9bb6003146fc9227e8c5d51d2.png";
import imgLapisLazuliPng from "figma:asset/6247de843424c14335675d1434f3d6ba489ed800.png";
import imgMoonstoneGemPng from "figma:asset/2c4abc143678210f96ebb13db7158ba03b398d1c.png";
import imgMorganiteGemstonePng from "figma:asset/625b8c8627a25e245b4d8c143ceb4b98e2939eeb.png";
import imgOpalGemstonePng from "figma:asset/2a869bb565f6fbc495fff70b0b35b2ca3b02b041.png";
import imgPeralPng from "figma:asset/7c3f16c7126dfb194cf43daf12a1baccba69b80b.png";
import imgPeridotGemPng from "figma:asset/bb969eba57e477ff9ebcac00a51dce6009547acc.png";
import imgRoseQuartzGemsPng from "figma:asset/3d5b4652b11a7237ab6b0fd2fd007b953bbd6ab4.png";
import imgRubyGemstonePng from "figma:asset/0d4f23c004281e37749bba810d47ef0fa562a730.png";
import imgSpinelGemstonePng from "figma:asset/129051079ad0c7c355a5b15c7a0866b3389df153.png";
import imgSuntoneGemPng from "figma:asset/b0492ab20d455dd010e5884ad4581c963d11fef8.png";
import imgTanzaniteGemstonePng from "figma:asset/92c3ca788cae84b4cf77c0a3b8e5407fbf405c5f.png";
import imgTopazGemstonePng from "figma:asset/7e3feeca48b1b7c3f4efd3d75b6ab5cc5fcb0ac7.png";
import imgTourmalineGemstonePng from "figma:asset/e896bc5265e42189cb33f84954eb24503b67f1e9.png";
import imgTurquoiseGemstonePng from "figma:asset/ecad692b3798ed097470c72d6634a3d9acc153c0.png";
import imgZirconGemstonePng from "figma:asset/4d190b8e3b17ddb9703b5893f47c0304a3a4c694.png";

export interface GemstoneData {
    name: string;
    image: string;
    shortDescription: string;
    longDescription: string;
    properties: {
        colors: string[];
        hardness: string;
        origins: string[];
        chakra?: string;
        birthstone?: string;
        zodiac?: string;
    };
    metaphysical: string;
    relatedGemstones: string[];
}

export const gemstoneDatabase: Record<string, GemstoneData> = {
    ALEXANDRITE: {
        name: "Alexandrite",
        image: imgCutAlexandritePng,
        shortDescription: "The color-changing miracle gemstone that shifts from green in daylight to red under incandescent light.",
        longDescription: "Alexandrite is one of the rarest and most coveted gemstones in the world, famous for its remarkable color-changing phenomenon called pleochroism. Discovered in Russia's Ural Mountains in the 1830s and named after Czar Alexander II, this extraordinary gem displays emerald green hues in natural daylight and transforms to raspberry red under incandescent lighting. This magical transformation occurs due to the presence of chromium in its crystal structure. Alexandrite is a variety of chrysoberyl and is considered one of the most valuable gemstones, often exceeding the price of diamonds. Its extreme rarity, combined with its mesmerizing optical properties, makes it a true collector's treasure. The finest specimens come from Russia, Brazil, Sri Lanka, and East Africa. Due to its scarcity, most alexandrite jewelry features smaller stones, making larger specimens exceptionally valuable.",
        properties: {
            colors: ["Green (daylight)", "Red (incandescent)", "Purple-red", "Bluish-green"],
            hardness: "8.5 (Mohs scale)",
            origins: ["Russia", "Brazil", "Sri Lanka", "Madagascar", "Tanzania", "India"],
            chakra: "Heart and Crown Chakra",
            birthstone: "June (alternative)",
            zodiac: "Gemini, Cancer, Scorpio"
        },
        metaphysical: "Alexandrite is believed to strengthen intuition, creativity, and imagination. It's thought to bring balance between the physical and spiritual worlds, enhance self-esteem, and promote joy and good fortune. Many consider it a stone of prosperity and longevity.",
        relatedGemstones: ["EMERALD", "RUBY", "SAPPHIRE", "SPINEL"]
    },

    AMBER: {
        name: "Amber",
        image: imgAmberGemstonePng,
        shortDescription: "Ancient fossilized tree resin that captures millions of years of Earth's history.",
        longDescription: "Amber is not a mineral but rather fossilized tree resin that has been preserved for millions of years, making it one of the oldest gemstones known to humanity. Formed from the sticky sap of ancient coniferous trees, amber often contains perfectly preserved insects, plant matter, and even small vertebrates, offering a fascinating window into prehistoric life. The most prized amber comes from the Baltic region, where it has been treasured for over 6,000 years. Its warm, golden hues range from pale yellow to deep cognac, with rare blue and green varieties found in the Dominican Republic. Amber is remarkably lightweight and warm to the touch, and when rubbed, it can generate static electricity—a property that gave rise to the word 'electricity' from the Greek word for amber, 'elektron.' Throughout history, amber has been used for jewelry, religious artifacts, and even medicinal purposes. Its organic origin and ancient nature make each piece unique and irreplaceable.",
        properties: {
            colors: ["Golden yellow", "Orange", "Cognac", "Cherry red", "Green (rare)", "Blue (rare)"],
            hardness: "2-2.5 (Mohs scale)",
            origins: ["Baltic Sea region", "Dominican Republic", "Mexico", "Myanmar", "Poland", "Russia"],
            chakra: "Solar Plexus and Sacral Chakra",
            birthstone: "Not traditional, but associated with November",
            zodiac: "Leo, Aquarius"
        },
        metaphysical: "Amber is believed to be a powerful healer and cleanser, absorbing negative energy and transforming it into positive forces. It's thought to promote patience, wisdom, and balance, while also enhancing decision-making abilities and memory. Many cultures consider it a stone of courage and protection.",
        relatedGemstones: ["CITRINE", "TOPAZ", "SUNSTONE", "TOURMALINE"]
    },

    AMETHYST: {
        name: "Amethyst",
        image: imgAmethystGemstonePng,
        shortDescription: "The royal purple quartz variety symbolizing peace, clarity, and spiritual wisdom.",
        longDescription: "Amethyst is a stunning purple variety of quartz that has been prized since ancient times for its wine-like color and spiritual properties. Its name comes from the Greek word 'amethystos,' meaning 'not intoxicated,' as ancient Greeks believed it could prevent drunkenness. The gemstone's purple hue ranges from pale lavender to deep violet, caused by iron impurities and natural irradiation within the crystal structure. Historically, amethyst was as valuable as ruby and emerald until large deposits were discovered in Brazil in the 19th century. It has adorned the crowns of royalty, religious jewelry, and ceremonial objects for millennia. The finest amethysts display a deep, rich purple with flashes of red and blue. Major sources include Brazil, Uruguay, Zambia, and Russia. Amethyst is also unique in that it can fade when exposed to prolonged sunlight, making proper care essential. Its combination of beauty, availability, and affordability makes it one of the most popular gemstones for jewelry today.",
        properties: {
            colors: ["Light lavender", "Deep purple", "Violet", "Purple with red flashes"],
            hardness: "7 (Mohs scale)",
            origins: ["Brazil", "Uruguay", "Zambia", "Russia", "South Korea", "India"],
            chakra: "Third Eye and Crown Chakra",
            birthstone: "February",
            zodiac: "Pisces, Virgo, Aquarius, Capricorn"
        },
        metaphysical: "Amethyst is known as the stone of spiritual wisdom and inner peace. It's believed to enhance intuition, promote emotional balance, and protect against negative energies. Many use it for meditation, as it's thought to calm the mind and facilitate connection with higher consciousness.",
        relatedGemstones: ["CITRINE", "AMETRINE", "ROSE QUARTZ", "TANZANITE"]
    },

    AMETRINE: {
        name: "Ametrine",
        image: imgAmetrineGemstonePng,
        shortDescription: "A rare natural combination of amethyst and citrine in a single crystal.",
        longDescription: "Ametrine is a truly unique and rare gemstone that naturally combines the purple of amethyst and the golden yellow of citrine in a single crystal. This bicolor quartz variety occurs when different oxidation states of iron are present in different zones of the crystal during formation. The result is a stunning gemstone that displays both colors simultaneously, often in distinct bands or zones. Natural ametrine is extremely rare and comes almost exclusively from the Anahi mine in Bolivia, though synthetic versions are also produced. The legend behind ametrine tells of a Spanish conquistador who received the mine as a dowry when he married a princess from the Ayoreos tribe in the 17th century. The gemstone's dual nature symbolizes balance and harmony, making it highly sought after by collectors and jewelry enthusiasts. Skilled gem cutters can orient ametrine to showcase both colors in a single faceted stone, creating a mesmerizing display of purple and gold. Its rarity and unique beauty make it a prized addition to any gemstone collection.",
        properties: {
            colors: ["Purple and yellow", "Violet and golden", "Lavender and citrine"],
            hardness: "7 (Mohs scale)",
            origins: ["Bolivia (Anahi mine)", "Brazil (rare)"],
            chakra: "Solar Plexus and Crown Chakra",
            birthstone: "Not traditional",
            zodiac: "Libra"
        },
        metaphysical: "Ametrine combines the properties of both amethyst and citrine, believed to enhance creativity, mental clarity, and spiritual awareness while also promoting optimism and confidence. It's thought to help balance emotions and facilitate decision-making by harmonizing masculine and feminine energies.",
        relatedGemstones: ["AMETHYST", "CITRINE", "TOPAZ", "TOURMALINE"]
    },

    AQUAMARINE: {
        name: "Aquamarine",
        image: imgAquamarineGemstonePng,
        shortDescription: "The serene blue gemstone of the sea, symbolizing tranquility and courage.",
        longDescription: "Aquamarine, whose name means 'water of the sea' in Latin, is a breathtaking blue to blue-green variety of the mineral beryl, the same family as emerald. Its delicate, transparent blue color evokes the clarity and calmness of tropical waters, ranging from pale sky blue to deep sea blue. Ancient mariners believed aquamarine would protect them during ocean voyages and ensure safe passage, making it a talisman of courage and protection. The gemstone's color comes from trace amounts of iron in its crystal structure, and unlike many gemstones, aquamarine is often found in large, flawless crystals, making it ideal for cutting impressive stones. The finest aquamarines display a rich, saturated blue without any green tones and come primarily from Brazil, though significant deposits also exist in Pakistan, Madagascar, and Africa. Aquamarine is remarkably durable and maintains its color well, making it an excellent choice for everyday jewelry. Its association with the ocean and its soothing blue hues have made it a symbol of youth, health, and hope throughout history.",
        properties: {
            colors: ["Light blue", "Blue-green", "Deep blue", "Greenish-blue"],
            hardness: "7.5-8 (Mohs scale)",
            origins: ["Brazil", "Pakistan", "Madagascar", "Nigeria", "Zambia", "Mozambique"],
            chakra: "Throat Chakra",
            birthstone: "March",
            zodiac: "Pisces, Aries, Gemini"
        },
        metaphysical: "Aquamarine is believed to calm the mind, reduce stress, and enhance clear communication. It's thought to promote courage, especially in difficult situations, and help release emotional baggage. Many use it to facilitate meditation and connect with their inner wisdom.",
        relatedGemstones: ["EMERALD", "MORGANITE", "TOPAZ", "BLUE SAPPHIRE"]
    },

    CITRINE: {
        name: "Citrine",
        image: imgCitrineGemstonePng,
        shortDescription: "The golden gemstone of abundance, success, and positive energy.",
        longDescription: "Citrine is a radiant yellow to golden-orange variety of quartz that has been treasured for thousands of years for its warm, sunny appearance and association with prosperity. Its name derives from the French word 'citron,' meaning lemon, though the finest citrines display rich golden to amber hues rather than pale yellow. Natural citrine is relatively rare; most citrine on the market is actually heat-treated amethyst or smoky quartz, which develops the characteristic golden color through controlled heating. Genuine natural citrine, with its pale to medium yellow color, is highly prized by collectors. Throughout history, citrine has been known as the 'merchant's stone' or 'success stone,' believed to attract wealth and prosperity. The ancient Romans used citrine for intaglio work and decorative jewelry, while in the Middle Ages, it was thought to protect against evil thoughts and snake venom. Major sources include Brazil, Madagascar, Russia, and France. Citrine's durability, affordability, and cheerful color make it an excellent choice for everyday jewelry, and it's one of the few gemstones that never needs cleansing, as it's believed to dissipate negative energy rather than absorb it.",
        properties: {
            colors: ["Pale yellow", "Golden yellow", "Orange", "Amber", "Madeira (reddish-brown)"],
            hardness: "7 (Mohs scale)",
            origins: ["Brazil", "Madagascar", "Russia", "France", "Spain", "Scotland"],
            chakra: "Solar Plexus and Sacral Chakra",
            birthstone: "November (alternative)",
            zodiac: "Aries, Gemini, Leo, Libra"
        },
        metaphysical: "Citrine is known as the stone of abundance and manifestation, believed to attract wealth, success, and prosperity. It's thought to promote optimism, confidence, and mental clarity while dispelling negative energies. Many use it to enhance creativity and motivation.",
        relatedGemstones: ["AMETHYST", "AMETRINE", "TOPAZ", "AMBER"]
    },

    EMERALD: {
        name: "Emerald",
        image: imgGreenEmeraldPng,
        shortDescription: "The legendary green gemstone of royalty, representing rebirth and eternal love.",
        longDescription: "Emerald is one of the 'Big Four' precious gemstones (along with diamond, ruby, and sapphire) and has been revered for over 5,000 years. This vivid green variety of beryl derives its mesmerizing color from trace amounts of chromium and sometimes vanadium. Cleopatra was famous for her passion for emeralds, and the gemstone has adorned the crowns and treasures of royalty throughout history. The finest emeralds display a pure, intense green color with a slight bluish tint, and they come primarily from Colombia, which produces about 70-90% of the world's emeralds. Unlike most gemstones, emeralds are almost always included with tiny fractures and mineral inclusions, which gemologists call 'jardin' (French for garden). These inclusions are so characteristic that a flawless emerald is extremely rare and valuable. In fact, a fine emerald can be more valuable than a diamond of equal size. Emeralds are relatively soft compared to other precious stones and require careful handling. Throughout history, emeralds have been associated with fertility, rebirth, and love, and they were believed to grant the wearer foresight and good fortune.",
        properties: {
            colors: ["Vivid green", "Bluish-green", "Yellowish-green", "Deep green"],
            hardness: "7.5-8 (Mohs scale)",
            origins: ["Colombia", "Zambia", "Brazil", "Afghanistan", "Pakistan", "Russia"],
            chakra: "Heart Chakra",
            birthstone: "May",
            zodiac: "Taurus, Gemini, Aries"
        },
        metaphysical: "Emerald is known as the stone of successful love, believed to bring loyalty, unity, and unconditional love. It's thought to enhance intuition, promote emotional healing, and bring harmony to relationships. Many consider it a stone of wisdom and truth.",
        relatedGemstones: ["AQUAMARINE", "MORGANITE", "JADE", "PERIDOT"]
    },

    GARNET: {
        name: "Garnet",
        image: imgPolishedGarnetGemstonePng,
        shortDescription: "The passionate red gemstone symbolizing love, devotion, and vitality.",
        longDescription: "Garnet is a diverse group of silicate minerals that have been used as gemstones and abrasives for thousands of years. While most people associate garnet with deep red color, this gemstone actually occurs in almost every color except blue, including green (tsavorite), orange (spessartine), and even color-changing varieties. The name 'garnet' comes from the Latin word 'granatum,' meaning pomegranate, due to the resemblance of red garnet crystals to pomegranate seeds. Ancient warriors believed garnets brought victory and protection in battle, and they were often set into shields and armor. The Egyptians used garnets as inlays in jewelry and carvings, while in medieval times, garnets were thought to cure depression and protect against nightmares. Red pyrope and almandine garnets are the most common and affordable, while rare varieties like demantoid (green) and tsavorite can rival emeralds in value. Garnets are found worldwide, with significant deposits in India, Sri Lanka, Africa, and the United States. Their durability and wide range of colors make them versatile gemstones for all types of jewelry.",
        properties: {
            colors: ["Red", "Orange", "Yellow", "Green", "Purple", "Pink", "Brown", "Black"],
            hardness: "6.5-7.5 (Mohs scale)",
            origins: ["India", "Sri Lanka", "Madagascar", "Tanzania", "USA", "Czech Republic"],
            chakra: "Root and Heart Chakra (varies by color)",
            birthstone: "January",
            zodiac: "Capricorn, Aquarius, Aries"
        },
        metaphysical: "Garnet is believed to revitalize, purify, and balance energy, bringing serenity or passion as needed. It's thought to inspire love and devotion, enhance self-confidence, and provide protection during travel. Many use it to overcome crisis and trauma.",
        relatedGemstones: ["RUBY", "SPINEL", "TOURMALINE", "ALEXANDRITE"]
    },

    IOLITE: {
        name: "Iolite",
        image: imgPolishedIoliteGemstonePng,
        shortDescription: "The Viking compass stone with mesmerizing blue-violet hues and strong pleochroism.",
        longDescription: "Iolite, also known as 'water sapphire' or 'Viking's compass,' is a beautiful blue to violet gemstone with a fascinating history and unique optical properties. Its name comes from the Greek word 'ios,' meaning violet. Iolite's most distinctive feature is its strong pleochroism—the ability to show different colors when viewed from different angles. A single iolite crystal can appear blue-violet from one direction, yellowish-gray from another, and nearly colorless from a third. This property made it invaluable to Viking navigators, who used thin slices of iolite as polarizing filters to locate the sun on cloudy days, allowing them to navigate accurately across the North Atlantic. The gemstone's blue-violet color comes from iron and magnesium in its crystal structure. While iolite resembles sapphire in color, it's much more affordable and has a softer, more delicate appearance. The finest iolites display a rich, saturated blue-violet color with minimal gray tones and come primarily from India, Sri Lanka, and Madagascar. Iolite is relatively durable and makes an excellent alternative to more expensive blue gemstones.",
        properties: {
            colors: ["Blue-violet", "Indigo", "Grayish-blue", "Lavender"],
            hardness: "7-7.5 (Mohs scale)",
            origins: ["India", "Sri Lanka", "Madagascar", "Tanzania", "Brazil", "Myanmar"],
            chakra: "Third Eye Chakra",
            birthstone: "Not traditional",
            zodiac: "Sagittarius, Libra, Taurus"
        },
        metaphysical: "Iolite is known as the stone of vision and inner sight, believed to enhance intuition and spiritual awareness. It's thought to help with self-discovery, release discord, and facilitate shamanic journeys. Many use it to strengthen the connection between the heart and mind.",
        relatedGemstones: ["SAPPHIRE", "TANZANITE", "AMETHYST", "LAPIS LAZULI"]
    },

    JADE: {
        name: "Jade",
        image: imgJadeGemstonePng,
        shortDescription: "The sacred stone of ancient China, symbolizing purity, wisdom, and harmony.",
        longDescription: "Jade is one of the most culturally significant gemstones in human history, particularly in Chinese, Mesoamerican, and Maori cultures. The term 'jade' actually refers to two different minerals: jadeite and nephrite. Jadeite is rarer and more valuable, displaying a wider range of colors including the highly prized 'imperial jade'—a vivid, translucent emerald green. Nephrite, while more common, is tougher and has been used for tools, weapons, and ornaments for over 7,000 years. In Chinese culture, jade is more precious than gold, symbolizing virtue, purity, and immortality. The stone was believed to have protective powers and was often buried with the deceased to ensure safe passage to the afterlife. Jade's toughness (not to be confused with hardness) makes it extremely resistant to breaking, which is why it was ideal for carving intricate sculptures and ornaments. The finest jadeite comes from Myanmar (Burma), while nephrite is found in China, Russia, New Zealand, and Canada. Jade's smooth, cool touch and beautiful translucency have made it a beloved gemstone for millennia. Its cultural significance and beauty continue to make it highly sought after, especially in Asian markets.",
        properties: {
            colors: ["Green", "White", "Lavender", "Yellow", "Orange", "Black", "Red (rare)"],
            hardness: "6-7 (Mohs scale)",
            origins: ["Myanmar", "China", "Russia", "New Zealand", "Guatemala", "Canada"],
            chakra: "Heart Chakra",
            birthstone: "Not traditional",
            zodiac: "Aries, Taurus, Gemini, Libra"
        },
        metaphysical: "Jade is believed to attract good luck and friendship, promote wisdom and balance, and protect against harm. It's thought to encourage self-sufficiency, facilitate dream recall, and release negative thoughts. Many cultures consider it a stone of eternal youth and longevity.",
        relatedGemstones: ["EMERALD", "PERIDOT", "MALACHITE", "AVENTURINE"]
    },

    KUNZITE: {
        name: "Kunzite",
        image: imgKunziteGemstonePng,
        shortDescription: "The delicate pink gemstone of divine love and emotional healing.",
        longDescription: "Kunzite is a beautiful pink to lilac variety of the mineral spodumene, discovered in 1902 in California and named after the famous gemologist George Frederick Kunz. This relatively young gemstone quickly gained popularity for its delicate, romantic colors ranging from pale pink to intense violet-pink. Kunzite's color comes from trace amounts of manganese, and the finest specimens display a rich, saturated pink with violet overtones. The gemstone is strongly pleochroic, showing different shades of pink when viewed from different angles, which skilled cutters use to maximize color intensity. Kunzite is often found in large, clean crystals, making it possible to cut impressive stones at affordable prices. However, it has some challenges: it's relatively soft, has perfect cleavage (meaning it can split along certain planes), and its color can fade when exposed to strong light or heat. Despite these sensitivities, kunzite's ethereal beauty and association with love and compassion make it a favorite for evening jewelry. Major sources include Afghanistan, Brazil, Madagascar, and the United States. The gemstone's gentle energy and affordable price point have made it increasingly popular in recent years.",
        properties: {
            colors: ["Pink", "Lilac", "Violet-pink", "Pale pink"],
            hardness: "6.5-7 (Mohs scale)",
            origins: ["Afghanistan", "Brazil", "Madagascar", "USA", "Pakistan", "Myanmar"],
            chakra: "Heart Chakra",
            birthstone: "Not traditional",
            zodiac: "Taurus, Leo, Scorpio"
        },
        metaphysical: "Kunzite is known as the stone of divine love and emotional healing, believed to open the heart to unconditional love and promote inner peace. It's thought to dispel negativity, reduce stress and anxiety, and facilitate meditation. Many use it to heal emotional wounds and encourage self-love.",
        relatedGemstones: ["MORGANITE", "ROSE QUARTZ", "PINK TOURMALINE", "PINK SAPPHIRE"]
    },

    "LAPIS LAZULI": {
        name: "Lapis Lazuli",
        image: imgLapisLazuliPng,
        shortDescription: "The celestial blue stone of ancient royalty and spiritual enlightenment.",
        longDescription: "Lapis lazuli is one of the oldest gemstones in history, treasured for over 6,000 years for its intense blue color and golden pyrite inclusions that resemble stars in a night sky. This metamorphic rock is composed primarily of lazurite, along with calcite, pyrite, and other minerals. The name comes from the Latin 'lapis' (stone) and the Persian 'lazhuward' (blue). Ancient Egyptians used lapis lazuli extensively in jewelry, amulets, and cosmetics—Cleopatra famously used ground lapis as eyeshadow. The stone was also ground into powder to create the precious ultramarine pigment used by Renaissance masters like Michelangelo and Vermeer. In ancient Mesopotamia, lapis lazuli was more valuable than gold. The finest lapis lazuli displays a rich, royal blue color with minimal white calcite and evenly distributed golden pyrite flecks. The best quality stones come from Afghanistan's Badakhshan mines, which have been producing lapis for over 6,000 years. Other sources include Chile, Russia, and Pakistan. Lapis lazuli's deep blue color and historical significance continue to make it a highly prized gemstone for jewelry and decorative objects.",
        properties: {
            colors: ["Deep blue", "Royal blue", "Azure", "Violet-blue"],
            hardness: "5-6 (Mohs scale)",
            origins: ["Afghanistan", "Chile", "Russia", "Pakistan", "Italy", "USA"],
            chakra: "Third Eye and Throat Chakra",
            birthstone: "September (alternative)",
            zodiac: "Sagittarius, Libra"
        },
        metaphysical: "Lapis lazuli is known as the stone of wisdom and truth, believed to enhance intellectual ability, memory, and desire for knowledge. It's thought to promote self-awareness, encourage self-expression, and facilitate spiritual enlightenment. Many use it to access inner vision and enhance psychic abilities.",
        relatedGemstones: ["SAPPHIRE", "AZURITE", "SODALITE", "TURQUOISE"]
    },

    MOONSTONE: {
        name: "Moonstone",
        image: imgMoonstoneGemPng,
        shortDescription: "The ethereal gemstone with a mystical glow reminiscent of moonlight.",
        longDescription: "Moonstone is a captivating gemstone known for its adularescence—a soft, billowy glow that appears to float across the stone's surface, reminiscent of moonlight on water. This optical phenomenon is caused by light scattering between microscopic layers of feldspar minerals. Moonstone has been revered in many cultures as a sacred stone connected to lunar deities and feminine energy. Ancient Romans believed it was formed from solidified moonbeams, while in India, it's considered a sacred stone that brings good fortune. The finest moonstones display a blue sheen on a nearly transparent background, though they can also show white, peach, or rainbow adularescence. Rainbow moonstone, despite its name, is actually a variety of labradorite rather than true moonstone. The gemstone comes primarily from Sri Lanka, India, Madagascar, and Myanmar. Moonstone is relatively soft and has perfect cleavage, making it somewhat fragile and requiring careful handling. Its mysterious glow and association with the moon have made it a favorite for bohemian and mystical jewelry designs. The stone's popularity surged during the Art Nouveau period and continues to be beloved for its ethereal beauty.",
        properties: {
            colors: ["White", "Cream", "Peach", "Gray", "Blue sheen", "Rainbow"],
            hardness: "6-6.5 (Mohs scale)",
            origins: ["Sri Lanka", "India", "Madagascar", "Myanmar", "Tanzania", "USA"],
            chakra: "Crown and Third Eye Chakra",
            birthstone: "June",
            zodiac: "Cancer, Libra, Scorpio"
        },
        metaphysical: "Moonstone is believed to enhance intuition, promote inspiration, and bring success in love and business. It's thought to calm emotions, relieve stress, and facilitate new beginnings. Many use it to connect with feminine energy and enhance psychic abilities.",
        relatedGemstones: ["OPAL", "PEARL", "LABRADORITE", "RAINBOW MOONSTONE"]
    },

    MORGANITE: {
        name: "Morganite",
        image: imgMorganiteGemstonePng,
        shortDescription: "The romantic pink beryl symbolizing divine love and compassion.",
        longDescription: "Morganite is a delicate pink to peachy-pink variety of beryl, the same mineral family as emerald and aquamarine. Discovered in Madagascar in 1910, it was named after the famous banker and gem enthusiast J.P. Morgan by gemologist George Frederick Kunz. Morganite's soft, romantic color comes from trace amounts of manganese, and it ranges from pale blush pink to salmon and peachy tones. The gemstone is often found in large, clean crystals, making it possible to cut substantial stones at relatively affordable prices. Unlike many pink gemstones, morganite's color is stable and won't fade with exposure to light. The finest morganites display a pure, saturated pink color without brown or orange undertones, though some people prefer the warmer peachy hues. Heat treatment is sometimes used to remove yellow tones and enhance the pink color. Major sources include Brazil, Madagascar, Afghanistan, Mozambique, and California. Morganite has gained significant popularity in recent years, particularly for engagement rings, as it offers a romantic alternative to traditional diamonds. Its durability, size availability, and gentle color make it an excellent choice for all types of jewelry.",
        properties: {
            colors: ["Pink", "Peach", "Salmon", "Rose", "Violet-pink"],
            hardness: "7.5-8 (Mohs scale)",
            origins: ["Brazil", "Madagascar", "Afghanistan", "Mozambique", "Namibia", "USA"],
            chakra: "Heart Chakra",
            birthstone: "Not traditional",
            zodiac: "Pisces, Taurus, Cancer"
        },
        metaphysical: "Morganite is known as the stone of divine love and compassion, believed to bring healing, promise, and assurance. It's thought to attract and maintain love, open the heart to unconditional love, and heal emotional trauma. Many use it to release old wounds and embrace joy.",
        relatedGemstones: ["AQUAMARINE", "EMERALD", "KUNZITE", "ROSE QUARTZ"]
    },

    OPAL: {
        name: "Opal",
        image: imgOpalGemstonePng,
        shortDescription: "The magical gemstone displaying a rainbow of colors in its mesmerizing play-of-color.",
        longDescription: "Opal is one of the most unique and captivating gemstones, famous for its spectacular play-of-color—flashes of rainbow hues that seem to dance within the stone. This optical phenomenon occurs when light diffracts through tiny silica spheres arranged in a regular pattern within the opal's structure. Unlike most gemstones, opal is a mineraloid rather than a true mineral, composed of hydrated silica gel. Ancient Romans considered opal the most precious gemstone, believing it contained the beauty of all gems. Aboriginal Australians have legends of opals being created when a rainbow touched the earth. There are many varieties of opal: precious opal (with play-of-color), common opal (without), black opal (the rarest and most valuable), white opal, boulder opal, and fire opal (orange-red without play-of-color). Australia produces about 95% of the world's precious opal, particularly from Lightning Ridge (black opal) and Coober Pedy (white opal). Opals contain 5-10% water, making them sensitive to heat and dehydration, which can cause cracking. They're also relatively soft and require careful handling. Despite these sensitivities, opal's unmatched beauty and uniqueness make it one of the most beloved gemstones.",
        properties: {
            colors: ["White", "Black", "Crystal", "Boulder", "Fire (orange-red)", "All spectral colors"],
            hardness: "5.5-6.5 (Mohs scale)",
            origins: ["Australia", "Ethiopia", "Mexico", "Brazil", "USA", "Honduras"],
            chakra: "All Chakras (varies by type)",
            birthstone: "October",
            zodiac: "Libra, Scorpio, Pisces"
        },
        metaphysical: "Opal is believed to amplify emotions and release inhibitions, encouraging freedom and independence. It's thought to enhance cosmic consciousness, induce psychic and mystical visions, and stimulate creativity. Many consider it a stone of inspiration and imagination.",
        relatedGemstones: ["MOONSTONE", "LABRADORITE", "FIRE OPAL", "PEARL"]
    },

    PEARL: {
        name: "Pearl",
        image: imgPeralPng,
        shortDescription: "The timeless organic gem from the sea, symbolizing purity and wisdom.",
        longDescription: "Pearls are unique among gemstones as they are the only ones created by living organisms. Formed inside mollusks (oysters and mussels) when an irritant becomes coated with layers of nacre (mother-of-pearl), pearls have been treasured for over 4,000 years. Unlike other gemstones that must be cut and polished, pearls emerge from the water with their characteristic luster already intact. Natural pearls are extremely rare and valuable, as they form spontaneously in the wild. Today, most pearls are cultured—grown in pearl farms where the process is initiated by human intervention, though the mollusk still creates the pearl naturally. There are several types of pearls: Akoya (classic white), South Sea (large, white to golden), Tahitian (naturally dark), and freshwater (various shapes and colors). The finest pearls display strong luster (the quality and intensity of light reflection), good surface quality, and desirable color. Pearls have been associated with purity, innocence, and wisdom throughout history. Cleopatra famously dissolved a pearl in vinegar to win a bet with Marc Antony about hosting the most expensive dinner. Pearls are organic and relatively soft, requiring gentle care to maintain their beauty.",
        properties: {
            colors: ["White", "Cream", "Golden", "Black", "Pink", "Silver", "Blue", "Green"],
            hardness: "2.5-4.5 (Mohs scale)",
            origins: ["Japan", "China", "French Polynesia", "Australia", "Indonesia", "Philippines"],
            chakra: "Crown and Third Eye Chakra",
            birthstone: "June",
            zodiac: "Gemini, Cancer"
        },
        metaphysical: "Pearls are believed to attract wealth and luck, offer protection, and strengthen relationships. They're thought to promote purity, integrity, and loyalty while calming the mind and emotions. Many use pearls to enhance personal integrity and focus the mind.",
        relatedGemstones: ["MOONSTONE", "OPAL", "MOTHER OF PEARL", "CORAL"]
    },

    PERIDOT: {
        name: "Peridot",
        image: imgPeridotGemPng,
        shortDescription: "The vibrant green gem of the sun, bringing light and positive energy.",
        longDescription: "Peridot is a vibrant lime to olive-green gemstone that has been treasured since ancient times. It's one of the few gemstones that occurs in only one color, though the intensity and tint of green can vary from yellowish-green to olive to brownish-green. Peridot is the gem-quality variety of the mineral olivine, and its color comes from iron in its crystal structure—the color is inherent to the mineral, not caused by impurities. Ancient Egyptians called peridot the 'gem of the sun' and believed it protected its wearer from nightmares. The island of Zabargad (St. John's Island) in the Red Sea was the source of peridot for over 3,500 years. Interestingly, peridot is also found in meteorites, and some peridot jewelry contains extraterrestrial stones. The finest peridots display a pure grass-green color without brown or yellow tones and come primarily from Myanmar, Pakistan, and Arizona. Peridot is relatively soft compared to other gemstones and can scratch easily, but its cheerful green color and affordability make it popular for jewelry. The gemstone's association with light and positive energy has made it a symbol of renewal and growth.",
        properties: {
            colors: ["Lime green", "Olive green", "Yellowish-green", "Brownish-green"],
            hardness: "6.5-7 (Mohs scale)",
            origins: ["Myanmar", "Pakistan", "China", "USA (Arizona)", "Vietnam", "Egypt"],
            chakra: "Heart and Solar Plexus Chakra",
            birthstone: "August",
            zodiac: "Leo, Virgo, Scorpio, Sagittarius"
        },
        metaphysical: "Peridot is believed to bring good health, restful sleep, and peace to relationships. It's thought to attract love and calm anger, reduce stress, and motivate growth and change. Many use it to release negative patterns and promote confidence.",
        relatedGemstones: ["EMERALD", "JADE", "TOURMALINE", "TSAVORITE GARNET"]
    },

    "ROSE QUARTZ": {
        name: "Rose Quartz",
        image: imgRoseQuartzGemsPng,
        shortDescription: "The gentle pink stone of unconditional love and emotional healing.",
        longDescription: "Rose quartz is a pale pink to rose-red variety of quartz that has been used in love rituals and as a symbol of unconditional love for thousands of years. Its delicate color comes from trace amounts of titanium, iron, or manganese. Unlike most quartz varieties, rose quartz rarely forms well-defined crystals; instead, it typically occurs in massive form. The gemstone has been found in ancient Roman, Egyptian, and Greek jewelry, and it was used in facial masks by Egyptian and Roman women who believed it would prevent wrinkles and maintain a youthful complexion. Rose quartz is often translucent to transparent, and the finest specimens display a soft, even pink color without white streaks. Some rare rose quartz exhibits asterism (a star effect) when cut as a cabochon. Major sources include Brazil, Madagascar, India, and South Dakota. Rose quartz is abundant and affordable, making it accessible to everyone. Its association with love, both romantic and self-love, has made it one of the most popular crystals in metaphysical practices. The stone's gentle energy and soothing pink color make it a favorite for jewelry, carvings, and decorative objects.",
        properties: {
            colors: ["Pale pink", "Rose pink", "Peachy pink"],
            hardness: "7 (Mohs scale)",
            origins: ["Brazil", "Madagascar", "India", "South Africa", "USA", "Namibia"],
            chakra: "Heart Chakra",
            birthstone: "Not traditional",
            zodiac: "Taurus, Libra"
        },
        metaphysical: "Rose quartz is known as the stone of unconditional love and infinite peace, believed to open the heart to all types of love. It's thought to restore trust and harmony in relationships, encourage self-love and self-forgiveness, and heal emotional wounds. Many use it to attract new love or strengthen existing relationships.",
        relatedGemstones: ["MORGANITE", "KUNZITE", "PINK TOURMALINE", "RHODONITE"]
    },

    RUBY: {
        name: "Ruby",
        image: imgRubyGemstonePng,
        shortDescription: "The king of gemstones, symbolizing passion, protection, and prosperity.",
        longDescription: "Ruby is one of the four precious gemstones (along with diamond, emerald, and sapphire) and has been prized for millennia for its intense red color and exceptional hardness. Ruby is the red variety of the mineral corundum, with its color caused by chromium. The name comes from the Latin 'ruber,' meaning red. Ancient cultures believed rubies held the power of life due to their blood-red color, and they were thought to bring good fortune, protection, and passion to their owners. Burmese warriors implanted rubies under their skin, believing they would make them invincible in battle. The finest rubies display a pure, vibrant red with a slight bluish tint, known as 'pigeon's blood' red, and come primarily from Myanmar (Burma). Other significant sources include Mozambique, Thailand, and Madagascar. Like emeralds, rubies are almost always included, and a flawless ruby is extremely rare and valuable. The combination of beauty, rarity, and durability makes ruby one of the most valuable gemstones—fine rubies can exceed the price of equivalent diamonds. Ruby's association with love, passion, and power has made it a favorite for engagement rings and royal jewelry throughout history.",
        properties: {
            colors: ["Red", "Pinkish-red", "Purplish-red", "Orangish-red"],
            hardness: "9 (Mohs scale)",
            origins: ["Myanmar", "Mozambique", "Thailand", "Madagascar", "Vietnam", "Tanzania"],
            chakra: "Root and Heart Chakra",
            birthstone: "July",
            zodiac: "Aries, Leo, Scorpio, Sagittarius"
        },
        metaphysical: "Ruby is believed to promote vitality, courage, and passion while protecting against negative energy. It's thought to stimulate the heart chakra, encourage leadership, and increase motivation. Many use it to overcome exhaustion and lethargy while promoting positive dreams.",
        relatedGemstones: ["SAPPHIRE", "SPINEL", "GARNET", "TOURMALINE"]
    },

    SAPPHIRE: {
        name: "Sapphire",
        image: imgSpinelGemstonePng,
        shortDescription: "The celestial blue gemstone of wisdom, royalty, and divine favor.",
        longDescription: "Sapphire is one of the most coveted gemstones, known for its rich blue color and exceptional durability. Like ruby, sapphire is a variety of corundum, but while ruby must be red, sapphire can be any color except red—though blue is the most famous and valuable. The name comes from the Greek 'sappheiros,' meaning blue stone. Throughout history, sapphires have been associated with royalty, wisdom, and divine favor. Medieval clergy wore sapphires to symbolize heaven, while ancient Persians believed the earth rested on a giant sapphire, which made the sky blue. The finest blue sapphires display a rich, velvety blue color with slight violet undertones, known as 'cornflower blue' or 'Kashmir blue.' Major sources include Myanmar, Sri Lanka, Madagascar, and Australia. Sapphires can also be pink, yellow, orange, green, purple, and even colorless. The rare orange-pink variety is called padparadscha, named after the lotus blossom. Star sapphires display asterism—a star-like pattern caused by needle-like inclusions. Sapphires are extremely durable (second only to diamond) and maintain their color and clarity well, making them excellent for everyday jewelry, including engagement rings. Their combination of beauty, durability, and symbolism has made them treasured throughout history.",
        properties: {
            colors: ["Blue", "Pink", "Yellow", "Orange", "Green", "Purple", "White", "Black"],
            hardness: "9 (Mohs scale)",
            origins: ["Myanmar", "Sri Lanka", "Madagascar", "Australia", "Thailand", "USA (Montana)"],
            chakra: "Throat and Third Eye Chakra",
            birthstone: "September",
            zodiac: "Virgo, Libra, Sagittarius"
        },
        metaphysical: "Sapphire is known as the stone of wisdom and royalty, believed to attract prosperity, happiness, and peace. It's thought to enhance mental clarity, promote spiritual enlightenment, and protect against negative energies. Many use it to facilitate meditation and access deeper levels of consciousness.",
        relatedGemstones: ["RUBY", "TANZANITE", "IOLITE", "LAPIS LAZULI"]
    },

    SPINEL: {
        name: "Spinel",
        image: imgSpinelGemstonePng,
        shortDescription: "The underrated gemstone of vibrant colors and exceptional brilliance.",
        longDescription: "Spinel is a beautiful and durable gemstone that has been mistaken for ruby and sapphire throughout history. In fact, some of the most famous 'rubies' in crown jewels around the world, including the 'Black Prince's Ruby' in the British Crown Jewels, are actually spinels. This confusion occurred because spinel and corundum (ruby/sapphire) are often found together in the same deposits, and until modern gemology, they were indistinguishable. Spinel comes in a wide range of colors—red, pink, orange, purple, blue, and even black—caused by various trace elements. The finest red spinels rival the best rubies in color and brilliance, while the rare cobalt-blue spinels are among the most valuable. Unlike many gemstones, spinel is rarely treated or enhanced, so its color is entirely natural. The gemstone is singly refractive, giving it exceptional brilliance and fire. Major sources include Myanmar, Sri Lanka, Tanzania, and Tajikistan. Spinel's durability (hardness 8) makes it excellent for all types of jewelry. Despite its beauty and rarity, spinel has historically been undervalued due to its association with ruby and sapphire. However, it's now gaining recognition as a gemstone in its own right, appreciated for its vibrant colors, brilliance, and authenticity.",
        properties: {
            colors: ["Red", "Pink", "Orange", "Purple", "Blue", "Black", "Colorless"],
            hardness: "8 (Mohs scale)",
            origins: ["Myanmar", "Sri Lanka", "Tanzania", "Tajikistan", "Vietnam", "Madagascar"],
            chakra: "Root, Sacral, and Crown Chakra (varies by color)",
            birthstone: "August (alternative)",
            zodiac: "Aries, Sagittarius, Scorpio"
        },
        metaphysical: "Spinel is believed to revitalize energy, reduce stress, and encourage passion and devotion. It's thought to help release negative energy, promote physical vitality, and inspire new ideas. Many use it to overcome obstacles and achieve goals.",
        relatedGemstones: ["RUBY", "SAPPHIRE", "GARNET", "TOURMALINE"]
    },

    SUNSTONE: {
        name: "Sunstone",
        image: imgSuntoneGemPng,
        shortDescription: "The radiant gemstone with golden sparkles, embodying joy and vitality.",
        longDescription: "Sunstone is a feldspar gemstone known for its warm colors and distinctive aventurescence—a glittering effect caused by light reflecting from tiny plate-like inclusions of copper or hematite. This optical phenomenon, also called schiller, gives sunstone its characteristic sparkle, reminiscent of the sun's rays. The gemstone ranges in color from colorless to yellow, orange, red, and brown, with the most prized specimens displaying a rich orange-red color with strong aventurescence. Ancient Greeks believed sunstone represented the sun god, bringing life and abundance to those who wore it. Norse legends tell of sunstone being used as a navigation tool, similar to iolite. Oregon sunstone, found in the United States, is particularly prized for its copper inclusions, which create spectacular red and green colors. Some Oregon sunstones are transparent enough to be faceted, displaying exceptional brilliance along with their aventurescence. Other sources include India, Canada, Norway, and Russia. Sunstone is relatively soft and requires careful handling, but its warm, cheerful appearance and association with positive energy make it popular for jewelry. The gemstone's connection to the sun and its life-giving properties has made it a symbol of joy, vitality, and good fortune.",
        properties: {
            colors: ["Orange", "Red", "Brown", "Yellow", "Green", "Colorless with golden sparkles"],
            hardness: "6-6.5 (Mohs scale)",
            origins: ["USA (Oregon)", "India", "Canada", "Norway", "Russia", "Australia"],
            chakra: "Sacral and Solar Plexus Chakra",
            birthstone: "Not traditional",
            zodiac: "Leo, Libra"
        },
        metaphysical: "Sunstone is believed to bring joy, enthusiasm, and optimism while dispelling fears and stress. It's thought to increase self-worth, confidence, and vitality, encouraging independence and originality. Many use it to lift dark moods and promote a sunny disposition.",
        relatedGemstones: ["CITRINE", "AMBER", "TOPAZ", "FIRE OPAL"]
    },

    TANZANITE: {
        name: "Tanzanite",
        image: imgTanzaniteGemstonePng,
        shortDescription: "The rare blue-violet gemstone found only in Tanzania, symbolizing transformation.",
        longDescription: "Tanzanite is one of the rarest gemstones on Earth, found in only one place—a small area near Mount Kilimanjaro in Tanzania. Discovered in 1967, it's a relatively new gemstone but has quickly become one of the most sought-after colored stones. Tanzanite is a blue-violet variety of the mineral zoisite, and its color comes from trace amounts of vanadium. The gemstone is strongly pleochroic, showing different colors (blue, violet, and burgundy) when viewed from different angles. Almost all tanzanite is heat-treated to enhance its blue-violet color by removing brownish tones—this treatment is permanent and universally accepted. The finest tanzanites display a rich, saturated blue-violet color, often called 'velvety' due to their depth and intensity. Tanzanite is about 1,000 times rarer than diamond, and geologists estimate that the supply may be depleted within the next 20-30 years, making it increasingly valuable. The gemstone was named by Tiffany & Co., who recognized its potential and became its primary promoter. Tanzanite's unique color, rarity, and single-source origin make it highly collectible. However, it's relatively soft (6-7 on the Mohs scale) and requires careful handling to prevent scratching or chipping.",
        properties: {
            colors: ["Blue-violet", "Violet", "Blue", "Purple"],
            hardness: "6-7 (Mohs scale)",
            origins: ["Tanzania (only source)"],
            chakra: "Throat and Third Eye Chakra",
            birthstone: "December (alternative)",
            zodiac: "Sagittarius, Gemini, Libra"
        },
        metaphysical: "Tanzanite is believed to facilitate spiritual awareness and psychic insight, helping to integrate the mind and heart. It's thought to promote compassion, calm the mind, and dissolve old patterns. Many use it for transformation and to explore the workings of the heart and mind.",
        relatedGemstones: ["SAPPHIRE", "IOLITE", "AMETHYST", "BLUE TOPAZ"]
    },

    TOPAZ: {
        name: "Topaz",
        image: imgTopazGemstonePng,
        shortDescription: "The brilliant gemstone of strength and wisdom, available in a rainbow of colors.",
        longDescription: "Topaz is a brilliant and versatile gemstone that occurs in a wide range of colors, from colorless to blue, pink, yellow, orange, and even rare red. The name may come from the Sanskrit word 'tapas,' meaning fire, or from the Greek island of Topazios. Historically, all yellow gemstones were called topaz, leading to confusion with citrine and other stones. Pure topaz is colorless; trace elements and defects in the crystal structure create the various colors. Imperial topaz, a rich orange to pink color, is the most valuable variety and comes primarily from Brazil. Blue topaz, one of the most popular varieties, is usually created by irradiating and heat-treating colorless topaz—a stable and permanent treatment. Topaz is one of the hardest gemstones (8 on the Mohs scale), making it durable for jewelry, but it has perfect cleavage, meaning it can split along certain planes if struck. The ancient Egyptians believed topaz was colored by the golden glow of the sun god Ra, making it a powerful amulet. Romans associated it with Jupiter, their god of the sun. Major sources include Brazil, Pakistan, Russia, and Nigeria. Topaz's brilliance, hardness, and variety of colors make it a popular and affordable gemstone.",
        properties: {
            colors: ["Colorless", "Blue", "Pink", "Yellow", "Orange", "Red (rare)", "Green (rare)"],
            hardness: "8 (Mohs scale)",
            origins: ["Brazil", "Pakistan", "Russia", "Nigeria", "Sri Lanka", "USA"],
            chakra: "Throat and Solar Plexus Chakra (varies by color)",
            birthstone: "November",
            zodiac: "Sagittarius, Leo, Scorpio"
        },
        metaphysical: "Topaz is believed to promote truth, forgiveness, and self-realization. It's thought to bring joy, generosity, and good health while releasing tension and promoting relaxation. Many use it to manifest intentions and attract success.",
        relatedGemstones: ["CITRINE", "AQUAMARINE", "SAPPHIRE", "AMETRINE"]
    },

    TOURMALINE: {
        name: "Tourmaline",
        image: imgTourmalineGemstonePng,
        shortDescription: "The rainbow gemstone with more colors than any other, symbolizing creativity and protection.",
        longDescription: "Tourmaline is one of the most colorful gemstone species, occurring in virtually every color of the rainbow—often multiple colors in a single crystal. The name comes from the Sinhalese word 'turmali,' meaning 'mixed colored stones.' Tourmaline's complex chemical composition allows for an incredible variety of colors, and it's the only gemstone that can be found in every color. Some varieties have special names: rubellite (red-pink), indicolite (blue), chrome tourmaline (green), and watermelon tourmaline (pink center with green rim). Paraíba tourmaline, discovered in Brazil in the 1980s, displays an electric blue-green color caused by copper and is one of the most valuable gemstones per carat. Tourmaline is also strongly pleochroic and can be dichroic or trichroic, showing different colors from different angles. The gemstone has unique electrical properties—when heated or rubbed, it becomes electrically charged and can attract dust particles, a property called pyroelectricity. Dutch traders in the 1700s used tourmaline to pull ash from their pipes. Major sources include Brazil, Afghanistan, Africa, and the United States. Tourmaline's incredible color range, durability, and availability make it one of the most popular gemstones for jewelry.",
        properties: {
            colors: ["All colors", "Bi-color", "Tri-color", "Watermelon", "Paraíba blue"],
            hardness: "7-7.5 (Mohs scale)",
            origins: ["Brazil", "Afghanistan", "Madagascar", "Nigeria", "Mozambique", "USA"],
            chakra: "All Chakras (varies by color)",
            birthstone: "October",
            zodiac: "Libra, Scorpio"
        },
        metaphysical: "Tourmaline is believed to protect against negative energy, promote self-confidence, and diminish fear. It's thought to attract inspiration, compassion, and prosperity while balancing the mind and emotions. Many use it to understand oneself and others better.",
        relatedGemstones: ["RUBY", "EMERALD", "SAPPHIRE", "SPINEL"]
    },

    TURQUOISE: {
        name: "Turquoise",
        image: imgTurquoiseGemstonePng,
        shortDescription: "The ancient sky-blue stone of protection, healing, and spiritual grounding.",
        longDescription: "Turquoise is one of the oldest known gemstones, treasured for over 7,000 years by ancient civilizations including the Egyptians, Persians, Aztecs, and Native Americans. The name comes from the French 'pierre turquoise,' meaning 'Turkish stone,' as it was first brought to Europe through Turkey. This opaque gemstone ranges from sky blue to green, with its color caused by copper (blue) and iron (green). The finest turquoise displays a pure, robin's egg blue color, though many people also prize the green varieties and stones with attractive matrix (veining) patterns. Turquoise is a hydrous phosphate of copper and aluminum, and it's relatively porous and soft, making it susceptible to damage from chemicals, heat, and even skin oils. Many turquoise stones are stabilized with resin to improve durability. The gemstone has been used in jewelry, amulets, and ceremonial objects throughout history. Ancient Egyptians adorned Tutankhamun's burial mask with turquoise, while Native Americans consider it a sacred stone connecting earth and sky. Major sources include Iran (producing the finest quality), the southwestern United States, China, and Egypt. Turquoise's cultural significance and beautiful color continue to make it highly valued, particularly in Southwestern and Native American jewelry.",
        properties: {
            colors: ["Sky blue", "Blue-green", "Green", "Blue with matrix"],
            hardness: "5-6 (Mohs scale)",
            origins: ["Iran", "USA (Arizona, Nevada)", "China", "Egypt", "Mexico", "Israel"],
            chakra: "Throat and Third Eye Chakra",
            birthstone: "December",
            zodiac: "Sagittarius, Scorpio, Pisces"
        },
        metaphysical: "Turquoise is believed to be a master healer, promoting spiritual attunement and enhancing communication. It's thought to protect against negative energy, bring good fortune, and strengthen the immune system. Many cultures consider it a bridge between heaven and earth.",
        relatedGemstones: ["LAPIS LAZULI", "CHRYSOCOLLA", "AMAZONITE", "AQUAMARINE"]
    },

    ZIRCON: {
        name: "Zircon",
        image: imgZirconGemstonePng,
        shortDescription: "The ancient gemstone with exceptional brilliance and fire, often mistaken for diamond.",
        longDescription: "Zircon is one of the oldest minerals on Earth, with some crystals dating back over 4.4 billion years, making them among the oldest materials on our planet. Despite its ancient origins, zircon is often confused with cubic zirconia, a synthetic diamond simulant—but they are completely different materials. Natural zircon is a beautiful gemstone in its own right, known for its exceptional brilliance and fire (dispersion) that can rival or exceed diamond. Zircon occurs in a wide range of colors, including colorless, blue, green, yellow, orange, red, and brown. Blue zircon, created by heat-treating brown zircon, is the most popular variety and displays a beautiful electric blue color. Colorless zircon has been used as a diamond substitute for centuries due to its brilliance. The gemstone's name may come from the Persian 'zargun,' meaning gold-colored, or the Arabic 'zarkun,' meaning cinnabar or vermillion. Zircon has high refractive index and strong dispersion, giving it exceptional sparkle. However, it's relatively brittle and can chip or abrade easily, particularly along facet edges. Major sources include Cambodia, Sri Lanka, Thailand, and Australia. Zircon's brilliance, variety of colors, and affordability make it an excellent choice for jewelry, though it deserves more recognition as a distinct and beautiful gemstone.",
        properties: {
            colors: ["Colorless", "Blue", "Green", "Yellow", "Orange", "Red", "Brown"],
            hardness: "6.5-7.5 (Mohs scale)",
            origins: ["Cambodia", "Sri Lanka", "Thailand", "Australia", "Tanzania", "Myanmar"],
            chakra: "All Chakras (varies by color)",
            birthstone: "December (alternative)",
            zodiac: "Sagittarius, Virgo, Leo"
        },
        metaphysical: "Zircon is believed to promote wisdom, honor, and spiritual growth. It's thought to bring prosperity, increase self-confidence, and help overcome grief and loss. Many use it to ground spiritual energy and enhance meditation.",
        relatedGemstones: ["DIAMOND", "TOPAZ", "AQUAMARINE", "SAPPHIRE"]
    }
};

// Helper function to get gemstone data by name
export function getGemstoneByName(name: string): GemstoneData | undefined {
    return gemstoneDatabase[name.toUpperCase()];
}

// Get all gemstone names
export function getAllGemstoneNames(): string[] {
    return Object.keys(gemstoneDatabase);
}
