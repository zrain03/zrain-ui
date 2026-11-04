# Pembangun / Developer: Zrain
# Dicipta / Created (rekod Git terawal): 2026-10-27
# Dikemas kini / Last updated: 2026-11-04
# Fail / File: scripts/sync.ps1
# BM: Salin aset bersama secara manual ke folder publik produk.
# EN: Manually copy shared UI assets to a consumer public directory.

# BM: Terima parameter lokasi folder publik produk serta sumber logo pilihan.
# EN: Accept the product public-folder path and optional logo source.
param(
# BM: Wajibkan direktori destinasi supaya fail tidak disalin ke tempat salah.
# EN: Require the destination directory to avoid accidental copies.
  [Parameter(Mandatory=$true)][string]$TargetPublicDirectory,
# BM: Benarkan penyalinan logo hanya apabila path dibekalkan.
# EN: Permit logo copying only when a source path is supplied.
  [string]$LogoSource
)
# BM: Hentikan script sebaik sahaja berlaku error.
# EN: Stop the script immediately on any error.
$ErrorActionPreference = 'Stop'
# BM: Cari folder src relatif kepada lokasi script, bukan current directory terminal.
# EN: Find src relative to the script path rather than the terminal working directory.
$source = Join-Path (Split-Path $PSScriptRoot -Parent) 'src'
# BM: Tolak destinasi yang belum wujud; jangan cipta folder tanpa kelulusan.
# EN: Reject missing destinations; do not create folders implicitly.
if (!(Test-Path $TargetPublicDirectory)) { throw "Target directory does not exist: $TargetPublicDirectory" }
# BM: Salin CSS rasmi sambil mengekalkan nama fail yang diketahui oleh consumer.
# EN: Copy official CSS while retaining the filename expected by consumers.
Copy-Item (Join-Path $source 'brand.css') (Join-Path $TargetPublicDirectory 'brand.css') -Force
# BM: Salin JavaScript rasmi sambil mengekalkan API dan nama fail.
# EN: Copy official JavaScript while preserving its filename and public API.
Copy-Item (Join-Path $source 'zrain-ui.js') (Join-Path $TargetPublicDirectory 'zrain-ui.js') -Force
# BM: Salin logo hanya apabila parameter LogoSource telah ditetapkan.
# EN: Copy the logo only when LogoSource was supplied.
if ($LogoSource) {
# BM: Sahkan fail logo asal wujud sebelum overwrite destinasi.
# EN: Confirm the source logo exists before overwriting the destination.
  if (!(Test-Path $LogoSource)) { throw "Logo file not found: $LogoSource" }
# BM: Salin imej rasmi tanpa menukar atau menjana semula kandungan aset.
# EN: Copy the official image without transforming or regenerating the asset.
  Copy-Item $LogoSource (Join-Path $TargetPublicDirectory 'zrain-logo.webp') -Force
}
# BM: Paparkan arahan semakan selepas proses sync; script ini tidak melakukan deployment.
# EN: Print a reminder to verify after sync; this script does not deploy anything.
Write-Host 'Zrain UI files synced. Check your product-specific config and run tests before deploying.'
