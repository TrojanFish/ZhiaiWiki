$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outDir = "C:\Users\Administrator\.gemini\antigravity\brain\5f067fb4-7260-4b9e-97f0-390964082fa8\screenshots\inspect"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force }

$targets = @(
    @{ Name = "verify_home_1440"; Url = "http://localhost:3000/?consent=1"; W = 1440; H = 1400 },
    @{ Name = "verify_home_mobile"; Url = "http://localhost:3000/?consent=1"; W = 390; H = 844 },
    @{ Name = "verify_profile_1440"; Url = "http://localhost:3000/profile?consent=1&template=ia1"; W = 1440; H = 1400 },
    @{ Name = "verify_profile_mobile"; Url = "http://localhost:3000/profile?consent=1&template=ia1"; W = 390; H = 844 },
    @{ Name = "verify_love_relay_1440"; Url = "http://localhost:3000/love-relay?consent=1"; W = 1440; H = 900 }
)

foreach ($item in $targets) {
    $outFile = Join-Path $outDir "$($item.Name).png"
    if (Test-Path $outFile) { Remove-Item $outFile -Force }
    $tempProfile = Join-Path $env:TEMP ("edge_audit_" + (Get-Random))
    $args = @(
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars",
        "--user-data-dir=$tempProfile",
        "--window-size=$($item.W),$($item.H)",
        "--virtual-time-budget=4000",
        "--screenshot=$outFile",
        $item.Url
    )
    Start-Process -FilePath $edgePath -ArgumentList $args -Wait
    if (Test-Path $tempProfile) { Remove-Item $tempProfile -Recurse -Force -ErrorAction SilentlyContinue }
    if (Test-Path $outFile) {
        Write-Host "Captured: $outFile"
    } else {
        Write-Host "Failed to capture: $outFile"
    }
}
