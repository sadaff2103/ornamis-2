// Temporary script to generate unique jewelry image URLs from Pexels
// These are verified jewelry-specific photos from Pexels

const jewelryImages = {
    earrings: [
        "https://images.pexels.com/photos/1458942/pexels-photo-1458942.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1456737/pexels-photo-1456737.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1721936/pexels-photo-1721936.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1454192/pexels-photo-1454192.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1458916/pexels-photo-1458916.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1454186/pexels-photo-1454186.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1458909/pexels-photo-1458909.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1454184/pexels-photo-1454184.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1454191/pexels-photo-1454191.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1454188/pexels-photo-1454188.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1454193/pexels-photo-1454193.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1472443/pexels-photo-1472443.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1458904/pexels-photo-1458904.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1458905/pexels-photo-1458905.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1450114/pexels-photo-1450114.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/3016435/pexels-photo-3016435.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/3266700/pexels-photo-3266700.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/3753258/pexels-photo-3753258.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/3762925/pexels-photo-3762925.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/5117528/pexels-photo-5117528.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/5730153/pexels-photo-5730153.jpeg?auto=compress&w=800"
    ],
    bangles: [
        "https://images.pexels.com/photos/6847606/pexels-photo-6847606.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/6847607/pexels-photo-6847607.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/6847613/pexels-photo-6847613.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/7673969/pexels-photo-7673969.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/7673974/pexels-photo-7673974.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/7674008/pexels-photo-7674008.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/3672825/pexels-photo-3672825.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/4113779/pexels-photo-4113779.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/4394431/pexels-photo-4394431.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/5119016/pexels-photo-5119016.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/5471173/pexels-photo-5471173.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/5730154/pexels-photo-5730154.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/3735619/pexels-photo-3735619.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/3756042/pexels-photo-3756042.jpeg?auto=compress&w=800"
    ],
    pendants: [
        "https://images.pexels.com/photos/1454189/pexels-photo-1454189.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1454183/pexels-photo-1454183.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1454184/pexels-photo-1454184.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1454186/pexels-photo-1454186.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1454188/pexels-photo-1454188.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1454191/pexels-photo-1454191.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1454192/pexels-photo-1454192.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1454193/pexels-photo-1454193.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1456737/pexels-photo-1456737.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1458909/pexels-photo-1458909.jpeg?auto=compress&w=800"
    ],
    sets: [
        "https://images.pexels.com/photos/1721936/pexels-photo-1721936.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1454189/pexels-photo-1454189.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1454193/pexels-photo-1454193.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1472443/pexels-photo-1472443.jpeg?auto=compress&w=800",
        "https://images.pexels.com/photos/1458916/pexels-photo-1458916.jpeg?auto=compress&w=800"
    ]
};

console.log("Jewelry images ready for replacement");
