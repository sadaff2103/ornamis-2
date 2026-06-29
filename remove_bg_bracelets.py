"""
Bracelet Background Removal Script
Removes white backgrounds from bracelet images for AR virtual try-on.
Uses rembg (U2-Net AI model) for precise foreground extraction.
Output: High-resolution transparent PNGs with clean edges.
"""

import os
import sys
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from PIL import Image
from rembg import remove

# ── Input images ──────────────────────────────────────────────────────
INPUT_FILES = [
    r"C:\Users\sadaf\Downloads\WhatsApp Image 2026-04-30 at 10.56.52 AM.jpeg",
    r"C:\Users\sadaf\Downloads\WhatsApp Image 2026-04-30 at 10.58.14 AM.jpeg",
    r"C:\Users\sadaf\Downloads\WhatsApp Image 2026-04-30 at 10.56.53 AM.jpeg",
    r"C:\Users\sadaf\Downloads\WhatsApp Image 2026-04-30 at 10.56.51 AM.jpeg",
    r"C:\Users\sadaf\Downloads\WhatsApp Image 2026-04-30 at 10.56.52 AM (1).jpeg",
]

# ── Output directory ──────────────────────────────────────────────────
OUTPUT_DIR = Path(r"c:\Users\sadaf\OneDrive\Desktop\ornamis-2\public\jewelry\bracelets-tryon")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ── Descriptive names for the 5 bracelets ─────────────────────────────
BRACELET_NAMES = [
    "bracelet_marquise_chevron",
    "bracelet_floral_cluster",
    "bracelet_leaf_vine",
    "bracelet_heart_halo",
    "bracelet_botanical_cuff",
]


def process_bracelet(input_path: str, output_name: str, index: int):
    """Remove background from a single bracelet image."""
    print(f"\n[{index+1}/5] Processing: {os.path.basename(input_path)}")
    print(f"       -> {output_name}.png")

    # Load the image
    img = Image.open(input_path).convert("RGBA")
    original_size = img.size
    print(f"       Original size: {original_size[0]}x{original_size[1]}")

    # Remove background using rembg (U2-Net model)
    # alpha_matting gives smoother edges on translucent/reflective jewelry
    result = remove(
        img,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=10,
        alpha_matting_erode_size=10,
    )

    # Auto-crop to the bracelet bounding box (trim transparent edges)
    bbox = result.getbbox()
    if bbox:
        # Add a small padding (2% of the larger dimension)
        pad = int(max(original_size) * 0.02)
        x1 = max(0, bbox[0] - pad)
        y1 = max(0, bbox[1] - pad)
        x2 = min(original_size[0], bbox[2] + pad)
        y2 = min(original_size[1], bbox[3] + pad)
        result = result.crop((x1, y1, x2, y2))
        print(f"       Cropped size:  {result.size[0]}x{result.size[1]}")
    else:
        print("       WARNING: Could not detect bounding box, keeping original size")

    # Save as transparent PNG
    output_path = OUTPUT_DIR / f"{output_name}.png"
    result.save(str(output_path), "PNG", optimize=True)
    file_size_kb = os.path.getsize(output_path) / 1024
    print(f"       DONE - Saved: {output_path}  ({file_size_kb:.0f} KB)")

    return output_path


def main():
    print("=" * 60)
    print("  ORNAMIS Bracelet Background Removal")
    print("  Creating transparent PNGs for AR Try-On")
    print("=" * 60)

    results = []
    for i, (input_file, name) in enumerate(zip(INPUT_FILES, BRACELET_NAMES)):
        if not os.path.exists(input_file):
            print(f"\n  ERROR: File not found: {input_file}")
            continue
        output = process_bracelet(input_file, name, i)
        results.append(output)

    print("\n" + "=" * 60)
    print(f"  COMPLETE! {len(results)}/5 bracelets processed.")
    print(f"  Output directory: {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()
