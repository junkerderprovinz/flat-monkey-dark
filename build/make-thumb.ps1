# Generates the dark Carbon thumbnail (182x100) for Flat Monkey Dark via GDI+.
# Monochrome Carbon shell with a single sunflower-yellow accent (dot, selected row).
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$out  = Join-Path $root "Flat Monkey Dark\thumb.png"
$W = 182; $H = 100

function C([string]$hex) {
    $hex = $hex.TrimStart('#')
    [System.Drawing.Color]::FromArgb(
        [Convert]::ToInt32($hex.Substring(0,2),16),
        [Convert]::ToInt32($hex.Substring(2,2),16),
        [Convert]::ToInt32($hex.Substring(4,2),16))
}

$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g   = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Carbon palette
$bg     = New-Object System.Drawing.SolidBrush (C '#161616')  # window
$panel  = New-Object System.Drawing.SolidBrush (C '#262626')  # panels/rows
$selRow = New-Object System.Drawing.SolidBrush (C '#574F10')  # #FFE000 @28% over #161616
$accent = New-Object System.Drawing.SolidBrush (C '#FFE000')  # accent

$g.FillRectangle($bg, 0, 0, $W, $H)                 # background
$g.FillRectangle($panel, 0, 0, $W, 16)              # header bar
$g.FillEllipse($accent, 7, 4, 9, 9)                 # accent dot
$g.FillRectangle($panel, 8, 26, 44, 66)             # left sidebar

# list rows on the right
$g.FillRectangle($selRow, 58, 30, 116, 12)          # selected row (accent tint)
$g.FillRectangle($accent, 58, 30, 3, 12)            # accent left edge on selected row
$g.FillRectangle($panel, 58, 46, 116, 10)
$g.FillRectangle($panel, 58, 60, 116, 10)
$g.FillRectangle($panel, 58, 74, 116, 10)

# player progress accent at the very bottom
$g.FillRectangle($panel, 0, 94, $W, 6)
$g.FillRectangle($accent, 0, 94, 66, 6)

$g.Dispose()
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Wrote $out ($W x $H)"
