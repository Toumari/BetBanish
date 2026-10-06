# Builds a distributable ZIP of the extension (no dev files)
$out = Join-Path $PSScriptRoot 'betbanish-v1.1.zip'
$include = @(
    "manifest.json",
    "sites.js",
    "background.js",
    "content.js",
    "overlay.css",
    "options.html",
    "options.js",
    "popup.html",
    "popup.css",
    "popup.js",
    "privacy.html",
    "icons/icon16.png",
    "icons/icon48.png",
    "icons/icon128.png"
)

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$stream = [IO.File]::Open($out, [IO.FileMode]::Create)
$archive = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($relativePath in $include) {
        $source = Join-Path $PSScriptRoot $relativePath
        [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $source, $relativePath) | Out-Null
    }
} finally {
    $archive.Dispose()
    $stream.Dispose()
}
Write-Host "Built: $out"
