# PowerShell script to list Palmonas images and generate product data
$sourceFolder = "C:\Users\sadaf\Downloads\palmo"
$destFolder = ".\public\jewelry"

Write-Host "=== Palmonas Product Image Inventory ===" -ForegroundColor Cyan
Write-Host ""

# Get all image files
$images = Get-ChildItem -Path $sourceFolder -Include *.jpg, *.jpeg, *.png, *.webp -File

Write-Host "Total images found: $($images.Count)" -ForegroundColor Green
Write-Host ""

# List all images with index
$index = 58  # Starting from PM-058
foreach ($img in $images) {
    $newName = "palmonas_product_$index" + $img.Extension
    Write-Host "PM-0$index : $($img.Name) -> $newName"
    
    # Copy and rename
    Copy-Item -Path $img.FullName -Destination "$destFolder\$newName" -Force
    
    $index++
}

Write-Host ""
Write-Host "All images copied to $destFolder" -ForegroundColor Green
Write-Host "Product IDs: PM-058 to PM-0$($index-1)" -ForegroundColor Yellow
