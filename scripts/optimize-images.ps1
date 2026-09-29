# ==============================================================================
# Learnify AI - Image Optimizer for Avatars & Certificates
# ==============================================================================

Add-Type -AssemblyName System.Drawing

function Optimize-Image {
    param(
        [string]$Path,
        [int]$MaxWidth,
        [int]$MaxHeight,
        [long]$Quality = 85
    )

    if (-not (Test-Path -LiteralPath $Path)) { return }

    $file = Get-Item -LiteralPath $Path
    $oldSize = $file.Length
    Write-Host "Processing: $($file.Name) ($([math]::Round($oldSize / 1KB, 1)) KB)" -ForegroundColor Cyan

    $img = [System.Drawing.Image]::FromFile($Path)
    $origWidth = $img.Width
    $origHeight = $img.Height

    # Calculate proportional scale
    $ratioX = $MaxWidth / $origWidth
    $ratioY = $MaxHeight / $origHeight
    $ratio = [Math]::Min($ratioX, $ratioY)
    if ($ratio -gt 1.0) { $ratio = 1.0 }

    $newWidth = [int]($origWidth * $ratio)
    $newHeight = [int]($origHeight * $ratio)

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $newWidth, $newHeight)
    $destImage = New-Object System.Drawing.Bitmap($newWidth, $newHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    $graphics = [System.Drawing.Graphics]::FromImage($destImage)
    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $graphics.DrawImage($img, $destRect, 0, 0, $origWidth, $origHeight, [System.Drawing.GraphicsUnit]::Pixel)

    $graphics.Dispose()
    $img.Dispose()

    # Save to temp file
    $tempFile = [System.IO.Path]::GetTempFileName() + ".png"

    # Use PNG encoder
    $destImage.Save($tempFile, [System.Drawing.Imaging.ImageFormat]::Png)
    $destImage.Dispose()

    # Replace original if smaller
    $newFileSize = (Get-Item -LiteralPath $tempFile).Length
    if ($newFileSize -lt $oldSize) {
        Move-Item -LiteralPath $tempFile -Destination $Path -Force
        $savings = [math]::Round(($oldSize - $newFileSize) / $oldSize * 100, 1)
        Write-Host "  -> Reduced to: $([math]::Round($newFileSize / 1KB, 1)) KB ($savings% saved)" -ForegroundColor Green
    } else {
        Remove-Item -LiteralPath $tempFile -Force
        Write-Host "  -> Kept original (no size reduction)" -ForegroundColor DarkGray
    }
}

Write-Host "Optimizing Avatars in public\avatars..." -ForegroundColor Yellow
$publicAvatars = @(
    "d:\Learnify AI\public\avatars\Anjali-Verma.png",
    "d:\Learnify AI\public\avatars\Priya-Kapoor.png",
    "d:\Learnify AI\public\avatars\Rishabh-Sharma.png",
    "d:\Learnify AI\public\avatars\Vikram-Singh.png"
)
foreach ($p in $publicAvatars) {
    Optimize-Image -Path $p -MaxWidth 360 -MaxHeight 360
}

Write-Host "`nOptimizing Avatars in src\assets\avatars..." -ForegroundColor Yellow
$srcAvatars = @(
    "d:\Learnify AI\src\assets\avatars\Anjali-Verma.png",
    "d:\Learnify AI\src\assets\avatars\Priya-Kapoor.png",
    "d:\Learnify AI\src\assets\avatars\Rishabh-Sharma.png",
    "d:\Learnify AI\src\assets\avatars\Vikram-Singh.png",
    "d:\Learnify AI\src\assets\avatars\Vishwajeet.png"
)
foreach ($p in $srcAvatars) {
    Optimize-Image -Path $p -MaxWidth 360 -MaxHeight 360
}

Write-Host "`nOptimizing Certificates in public..." -ForegroundColor Yellow
$certs = @(
    "d:\Learnify AI\public\certificate 0.png",
    "d:\Learnify AI\public\certificate 01.png",
    "d:\Learnify AI\public\certificate 02.png",
    "d:\Learnify AI\public\certificate 1.png",
    "d:\Learnify AI\public\certificate.png"
)
foreach ($p in $certs) {
    Optimize-Image -Path $p -MaxWidth 900 -MaxHeight 640
}

Write-Host "`nDone!" -ForegroundColor Green
