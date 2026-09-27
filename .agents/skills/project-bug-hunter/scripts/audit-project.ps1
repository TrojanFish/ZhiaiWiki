param(
  [string]$ProjectRoot = (Get-Location).Path,
  [switch]$Strict,
  [string]$JsonPath
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path $ProjectRoot).Path
$required = @("package.json")
$optional = @("Dockerfile", "docker-compose.yml", "docker-compose.yaml", "prisma/schema.prisma", ".github/workflows")
$cancers = @("lung", "breast", "colon", "rectal", "gastric", "liver", "esophageal", "colorectal", "thyroid", "endometrial", "cervical", "pancreatic")
$findings = @()
$checks = @()

foreach ($file in $required) {
  $present = Test-Path (Join-Path $root $file)
  $checks += [pscustomobject]@{ id = "required:$file"; status = if ($present) { "PASS" } else { "FAIL" } }
  if (-not $present) { $findings += "MISSING_REQUIRED:$file" }
}
$sourceRoot = if (Test-Path (Join-Path $root "app/src")) { Join-Path $root "app/src" } else { $root }
$sourceFiles = Get-ChildItem -Path $sourceRoot -Recurse -File -Depth 8 -Include *.ts,*.tsx,*.js,*.jsx -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch '\\(node_modules|\.next|dist|build|coverage|\.git)\\' }
$sourceText = (($sourceFiles | ForEach-Object { Get-Content -Raw $_.FullName -ErrorAction SilentlyContinue }) -join "`n")
foreach ($cancer in $cancers) {
  $present = $sourceText -match [regex]::Escape($cancer)
  $checks += [pscustomobject]@{ id = "cancer:$cancer"; status = if ($present) { "PASS" } else { "FAIL" } }
  if (-not $present) { $findings += "CANCER_NOT_FOUND:$cancer" }
}
$lungDefault = $sourceText -match 'default.*lung|fallback.*lung|\|\|\s*["'']lung["'']'
$checks += [pscustomobject]@{ id = "routing:no-silent-lung-default"; status = if ($lungDefault) { "FAIL" } else { "PASS" } }
if ($lungDefault) { $findings += "REVIEW_POSSIBLE_LUNG_DEFAULT" }
foreach ($file in $optional) {
  $exists = Test-Path (Join-Path $root $file)
  Write-Output "$(if ($exists) { 'PRESENT' } else { 'ABSENT' }):$file"
}
Write-Output "CANCER_COUNT:$($cancers.Count)"
if ($findings.Count -gt 0) {
  $findings | ForEach-Object { Write-Output "FINDING:$_" }
  if ($Strict) { exit 1 }
}
Write-Output "STATUS:DISCOVERY_COMPLETE"
if ($JsonPath) {
  [pscustomobject]@{ generatedAt = (Get-Date).ToUniversalTime().ToString("o"); projectRoot = $root; cancerTypes = $cancers; checks = $checks; findings = $findings; status = if ($findings.Count -eq 0) { "PASS" } else { "FAIL" } } |
    ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 $JsonPath
}
