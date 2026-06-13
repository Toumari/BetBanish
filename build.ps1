# Builds a distributable ZIP of the extension (no dev files)
$out = "../gambling-blocker-dist.zip"
$include = @(
    "manifest.json",
    "sites.js",
    "content.js",
    "overlay.css",
    "options.html",
    "options.js",
    "icons/icon16.png",
    "icons/icon48.png",
    "icons/icon128.png"
)

if (Test-Path $out) { Remove-Item $out }

Compress-Archive -Path $include -DestinationPath $out
Write-Host "Built: $out"
