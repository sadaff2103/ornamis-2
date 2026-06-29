import re

# Read the file
with open(r'c:\Users\sadaf\OneDrive\Desktop\ornamis-2\src\components\pages\GivaStorePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add BackButton import after ImageWithFallback import
if 'BackButton' not in content:
    content = content.replace(
        'import { ImageWithFallback } from "../figma/ImageWithFallback";',
        'import { ImageWithFallback } from "../figma/ImageWithFallback";\nimport { BackButton } from "../BackButton";'
    )
    print("✓ Added BackButton import")

# 2. Add BackButton component after the main div
# Find the export function and return statement
if '<BackButton' not in content:
    # Look for the pattern: return ( <div className="min-h-screen
    pattern = r'(export function GivaStorePage.*?return \(\s*<div className="min-h-screen[^"]*">)'
    replacement = r'\1\n        <div className="max-w-7xl mx-auto px-4 pt-8">\n            <BackButton onNavigate={onNavigate} targetPage="stores" label="Back to Stores" />\n        </div>'
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    print("✓ Added BackButton component")

# 3. Make product images clickable
# Find: <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#f8f9fa] to-[#e8ebed]">
# Replace with clickable version
pattern = r'<div className="relative aspect-square overflow-hidden bg-gradient-to-br from-\[#f8f9fa\] to-\[#e8ebed\]">'
replacement = '''<div 
                  className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#f8f9fa] to-[#e8ebed] cursor-pointer"
                  onClick={() => {
                    console.log("Giva product clicked:", product.id);
                    onNavigate("product", { productId: product.id });
                  }}
                >'''
content = content.replace(pattern, replacement)
print("✓ Made product images clickable")

# Write the file back
with open(r'c:\Users\sadaf\OneDrive\Desktop\ornamis-2\src\components\pages\GivaStorePage.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print("\n✅ GivaStorePage.tsx updated successfully!")
