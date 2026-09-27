param(
  [string]$AuditJson,
  [string]$ChecksJson,
  [string]$ProjectRoot = (Get-Location).Path,
  [string]$OutputJson
)

$blocking = @()
if ($AuditJson -and (Test-Path $AuditJson)) {
  $audit = Get-Content -Raw $AuditJson | ConvertFrom-Json
  if ($audit.status -ne "PASS") { $blocking += "AUDIT_FINDINGS" }
} else { $blocking += "AUDIT_UNVERIFIED" }
if ($ChecksJson -and (Test-Path $ChecksJson)) {
  $checks = Get-Content -Raw $ChecksJson | ConvertFrom-Json
  if ($checks.failed -gt 0) { $blocking += "CHECK_FAILURES" }
} else { $blocking += "CHECKS_UNVERIFIED" }
$result = [pscustomobject]@{ generatedAt = (Get-Date).ToUniversalTime().ToString("o"); projectRoot = (Resolve-Path $ProjectRoot).Path; status = if ($blocking.Count -eq 0) { "STABLE" } else { "BLOCKED" }; blockingReasons = $blocking; disclaimer = "This is an engineering release gate, not clinical validation." }
$json = $result | ConvertTo-Json -Depth 6
Write-Output $json
if ($OutputJson) { $json | Set-Content -Encoding UTF8 $OutputJson }
if ($blocking.Count -gt 0) { exit 1 }
