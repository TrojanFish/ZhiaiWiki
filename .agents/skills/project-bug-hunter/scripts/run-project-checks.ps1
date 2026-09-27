param([string]$ProjectRoot = (Get-Location).Path, [string]$JsonPath)
$ErrorActionPreference = "Continue"
$root = (Resolve-Path $ProjectRoot).Path
$results = @()
function Invoke-Check([string]$Id, [string]$Command) {
  Push-Location $root
  try { $output = Invoke-Expression "$Command 2>&1" | Out-String; $code = $LASTEXITCODE; $script:results += [pscustomobject]@{ id = $Id; status = if ($code -eq 0) { "PASS" } else { "FAIL" }; exitCode = $code; output = $output.Trim() } }
  catch { $script:results += [pscustomobject]@{ id = $Id; status = "BLOCKED_BY_ENVIRONMENT"; exitCode = $null; output = $_.Exception.Message } }
  finally { Pop-Location }
}
$packagePath = Join-Path $root "package.json"
if (-not (Test-Path $packagePath)) { $results += [pscustomobject]@{ id = "package"; status = "BLOCKED_BY_ENVIRONMENT"; exitCode = $null; output = "package.json not found" } }
else {
  $pkg = Get-Content -Raw $packagePath | ConvertFrom-Json
  foreach ($name in @("type-check", "lint", "test", "build")) {
    if ($pkg.scripts.PSObject.Properties.Name -contains $name) { Invoke-Check "npm:$name" "npm run $name" }
    else { $results += [pscustomobject]@{ id = "npm:$name"; status = "UNVERIFIED"; exitCode = $null; output = "script not defined" } }
  }
  if (Test-Path (Join-Path $root "scripts/production-full-simulation.ts")) { Invoke-Check "production-full-simulation" "npx tsx scripts/production-full-simulation.ts" }
  else { $results += [pscustomobject]@{ id = "production-full-simulation"; status = "UNVERIFIED"; exitCode = $null; output = "simulation script not found" } }
}
$failed = @($results | Where-Object status -eq "FAIL").Count
$report = [pscustomobject]@{ generatedAt = (Get-Date).ToUniversalTime().ToString("o"); projectRoot = $root; checks = $results; passed = @($results | Where-Object status -eq "PASS").Count; failed = $failed; status = if ($failed -eq 0) { "PASS" } else { "FAIL" } }
$results | ForEach-Object { Write-Output "$($_.status):$($_.id)" }
Write-Output "SUMMARY:passed=$($report.passed) failed=$failed"
if ($JsonPath) { $report | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 $JsonPath }
if ($failed -gt 0) { exit 1 }
