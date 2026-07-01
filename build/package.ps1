# Packages the skin payload into an installable MediaMonkey .mmip.
# The .mmip is a ZIP with the skin files at the archive root (no wrapping folder)
# and FORWARD-SLASH separators, matching the original "Flat Monkey.zip".
#
# NOTE: On Windows PowerShell 5.1 (.NET Framework) both Compress-Archive and
# ZipFile.CreateFromDirectory emit BACKSLASH separators for nested entries, which
# MediaMonkey does not read correctly. We therefore build the archive entry by
# entry with explicit '/'-separated names.
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$root    = Split-Path -Parent $PSScriptRoot
$payload = Join-Path $root "Flat Monkey Dark"
$distDir = Join-Path $root "dist"
$mmip    = Join-Path $distDir "Flat Monkey Dark.mmip"

New-Item -ItemType Directory -Force -Path $distDir | Out-Null
if (Test-Path $mmip) { Remove-Item $mmip -Force }

$fs  = [System.IO.File]::Open($mmip, [System.IO.FileMode]::Create)
$zip = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    Get-ChildItem -Path $payload -Recurse -File | ForEach-Object {
        $rel = $_.FullName.Substring($payload.Length + 1).Replace('\', '/')
        $entry  = $zip.CreateEntry($rel, [System.IO.Compression.CompressionLevel]::Optimal)
        $stream = $entry.Open()
        $bytes  = [System.IO.File]::ReadAllBytes($_.FullName)
        $stream.Write($bytes, 0, $bytes.Length)
        $stream.Dispose()
    }
}
finally {
    $zip.Dispose()
    $fs.Dispose()
}
Write-Host "Built $mmip"
