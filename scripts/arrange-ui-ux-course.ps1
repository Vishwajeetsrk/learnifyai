# ==============================================================================
# Learnify AI - UI & UX Course Video Organizer
# Target Folder: C:\Users\Vishwajeet\Music\Learnify AI Courses\Designing User Interfaces and Experiences (UI & UX)\UX\Designing User Interfaces and User Experiences (UI-UX)
# ==============================================================================

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

$basePath = "C:\Users\Vishwajeet\Music\Learnify AI Courses\Designing User Interfaces and Experiences (UI & UX)\UX\Designing User Interfaces and User Experiences (UI-UX)"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Learnify AI: Arranging UI & UX Course Videos by Syllabus" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Target Directory: $basePath" -ForegroundColor Gray

if (-not (Test-Path -LiteralPath $basePath)) {
    Write-Error "Source directory does not exist: $basePath"
    exit 1
}

# 1. Target Module Folders inside UX
$mod1Path = Join-Path $basePath "Module 1 - Designing Intuitive Front Ends and Mockup Design Principles"
$mod2Path = Join-Path $basePath "Module 2 - Web Design Methodologies"
$mod3Path = Join-Path $basePath "Module 3 - UI Design with Figma"
$mod4Path = Join-Path $basePath "Module 4 - Final Project and Assessment"

$modulePaths = @($mod1Path, $mod2Path, $mod3Path, $mod4Path)

foreach ($dir in $modulePaths) {
    if (-not (Test-Path -LiteralPath $dir)) {
        [System.IO.Directory]::CreateDirectory($dir) | Out-Null
        $folderName = Split-Path $dir -Leaf
        Write-Host "[+] Created Module Directory: $folderName" -ForegroundColor Green
    }
}

# 2. Complete Mapping Dictionary
$videoMappings = @(
    # -- Module 1 (12 Videos) ---------------------------------------------------
    @{
        Source = "1. Course Introduction.mp4"
        TargetModule = $mod1Path
        TargetName = "1. Course Introduction.mp4"
    },
    @{
        Source = "4. What is Design and UI_UX_.mp4"
        TargetModule = $mod1Path
        TargetName = "4. What is Design and UI & UX.mp4"
    },
    @{
        Source = "5. Importance of UI_UX_.mp4"
        TargetModule = $mod1Path
        TargetName = "5. Importance of UI & UX.mp4"
    },
    @{
        Source = "6. Design Thinking.mp4"
        TargetModule = $mod1Path
        TargetName = "6. Design Thinking.mp4"
    },
    @{
        Source = "UX Design and Strategies.mp4"
        TargetModule = $mod1Path
        TargetName = "7. UX Design and Strategies.mp4"
    },
    @{
        Source = "Wireframing and Prototyping.mp4"
        TargetModule = $mod1Path
        TargetName = "8. Wireframing and Prototyping.mp4"
    },
    @{
        Source = "Design Methodologies and Approaches.mp4"
        TargetModule = $mod1Path
        TargetName = "9. Design Methodologies and Approaches.mp4"
    },
    @{
        Source = "Visual Design Principles in UI Design.mp4"
        TargetModule = $mod1Path
        TargetName = "10. Visual Design Principles in UI Design.mp4"
    },
    @{
        Source = "UI Design in Figma.mp4"
        TargetModule = $mod1Path
        TargetName = "11. UI Design in Figma.mp4"
    },
    @{
        Source = "Designing a User Interface.mp4"
        TargetModule = $mod1Path
        TargetName = "15. Designing a User Interface.mp4"
    },
    @{
        Source = "Typography, Readability, and Color Theory in UI Design.mp4"
        TargetModule = $mod1Path
        TargetName = "16. Typography, Readability, and Color Theory in UI Design.mp4"
    },
    @{
        Source = "Best Practices in UI Design for Web and Mobile.mp4"
        TargetModule = $mod1Path
        TargetName = "17. Best Practices in UI Design for Web and Mobile.mp4"
    },

    # -- Module 2 (13 Videos) ---------------------------------------------------
    @{
        Source = "Introduction to Responsive Web Design (RWD) .mp4"
        TargetModule = $mod2Path
        TargetName = "1. Introduction to Responsive Web Design (RWD).mp4"
    },
    @{
        Source = "Mobile First Design.mp4"
        TargetModule = $mod2Path
        TargetName = "2. Mobile First Design.mp4"
    },
    @{
        Source = "Adaptive Layouts and Fluid Layouts.mp4"
        TargetModule = $mod2Path
        TargetName = "3. Adaptive Layouts and Fluid Layouts.mp4"
    },
    @{
        Source = "Working with Media Queries.mp4"
        TargetModule = $mod2Path
        TargetName = "4. Working with Media Queries.mp4"
    },
    @{
        Source = "Responsive Web Design Best Practices.mp4"
        TargetModule = $mod2Path
        TargetName = "5. Responsive Web Design Best Practices.mp4"
    },
    @{
        Source = "Cross Device Validation and Testing.mp4"
        TargetModule = $mod2Path
        TargetName = "6. Cross Device Validation and Testing.mp4"
    },
    @{
        Source = "Introduction to Progressive Web Development .mp4"
        TargetModule = $mod2Path
        TargetName = "10. Introduction to Progressive Web Development.mp4"
    },
    @{
        Source = "Progressive Web Development Technologies.mp4"
        TargetModule = $mod2Path
        TargetName = "11. Progressive Web Development Technologies.mp4"
    },
    @{
        Source = "Single Page Applications (SPA).mp4"
        TargetModule = $mod2Path
        TargetName = "12. Single Page Applications (SPA).mp4"
    },
    @{
        Source = "Service Worker, Push Notifications and Caching .mp4"
        TargetModule = $mod2Path
        TargetName = "13. Service Worker, Push Notifications and Caching.mp4"
    },
    @{
        Source = "Converting Existing App to PWA.mp4"
        TargetModule = $mod2Path
        TargetName = "14. Converting Existing App to PWA.mp4"
    },
    @{
        Source = "Progressive Web Applications in Action.mp4"
        TargetModule = $mod2Path
        TargetName = "15. Progressive Web Applications in Action.mp4"
    },
    @{
        Source = "No Code & Low Code Tools.mp4"
        TargetModule = $mod2Path
        TargetName = "16. No Code & Low Code Tools.mp4"
    },

    # -- Module 3 (8 Videos) ----------------------------------------------------
    @{
        Source = "What is Figma_.mp4"
        TargetModule = $mod3Path
        TargetName = "1. What is Figma.mp4"
    },
    @{
        Source = "Essential Concepts of Figma.mp4"
        TargetModule = $mod3Path
        TargetName = "2. Essential Concepts of Figma.mp4"
    },
    @{
        Source = "Setup and Configure Figma.mp4"
        TargetModule = $mod3Path
        TargetName = "3. Setup and Configure Figma.mp4"
    },
    @{
        Source = "Images, Shapes, and Tools.mp4"
        TargetModule = $mod3Path
        TargetName = "4. Images, Shapes, and Tools.mp4"
    },
    @{
        Source = "Working with Figma.mp4"
        TargetModule = $mod3Path
        TargetName = "9. Working with Figma.mp4"
    },
    @{
        Source = "Getting Started with Components.mp4"
        TargetModule = $mod3Path
        TargetName = "10. Getting Started with Components.mp4"
    },
    @{
        Source = "Styles and Libraries in Figma.mp4"
        TargetModule = $mod3Path
        TargetName = "11. Styles and Libraries in Figma.mp4"
    },
    @{
        Source = "Cards and Layout Grids in Figma .mp4"
        TargetModule = $mod3Path
        TargetName = "12. Cards and Layout Grids in Figma.mp4"
    }
)

$totalVideos = $videoMappings.Count
Write-Host "`nArranging $totalVideos videos..." -ForegroundColor Yellow

$movedCount = 0
$alreadyMovedCount = 0
$missingCount = 0

foreach ($item in $videoMappings) {
    $src = Join-Path $basePath $item.Source
    $dst = Join-Path $item.TargetModule $item.TargetName

    # Resilient path resolution
    $actualSrc = $null
    if (Test-Path -LiteralPath $src) {
        $actualSrc = $src
    } else {
        $matched = Get-ChildItem -LiteralPath $basePath -File | Where-Object { $_.Name.Trim() -eq $item.Source.Trim() } | Select-Object -First 1
        if ($matched) {
            $actualSrc = $matched.FullName
        }
    }

    $modLeaf = Split-Path $item.TargetModule -Leaf
    $tgtName = $item.TargetName

    if ($actualSrc) {
        Move-Item -LiteralPath $actualSrc -Destination $dst -Force
        $movedCount++
        $srcLeaf = Split-Path $actualSrc -Leaf
        Write-Host " [OK] Moved: $srcLeaf -> $modLeaf / $tgtName" -ForegroundColor Green
    } elseif (Test-Path -LiteralPath $dst) {
        $alreadyMovedCount++
        Write-Host " [=] Already in place: $modLeaf / $tgtName" -ForegroundColor Cyan
    } else {
        $missingCount++
        $itemSource = $item.Source
        Write-Host " [!] File not found: $itemSource" -ForegroundColor Red
    }
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "  Summary: $movedCount moved | $alreadyMovedCount already arranged | $missingCount missing" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
