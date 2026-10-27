param(
  [Parameter(Mandatory=$true)][string]$TargetPublicDirectory,
  [string]$LogoSource
)
$ErrorActionPreference = 'Stop'
$source = Join-Path (Split-Path $PSScriptRoot -Parent) 'src'
if (!(Test-Path $TargetPublicDirectory)) { throw "Target directory does not exist: $TargetPublicDirectory" }
Copy-Item (Join-Path $source 'brand.css') (Join-Path $TargetPublicDirectory 'brand.css') -Force
Copy-Item (Join-Path $source 'zrain-ui.js') (Join-Path $TargetPublicDirectory 'zrain-ui.js') -Force
if ($LogoSource) {
  if (!(Test-Path $LogoSource)) { throw "Logo file not found: $LogoSource" }
  Copy-Item $LogoSource (Join-Path $TargetPublicDirectory 'zrain-logo.webp') -Force
}
Write-Host 'Zrain UI files synced. Check your product-specific config and run tests before deploying.'
