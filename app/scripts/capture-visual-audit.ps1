$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outDir = "C:\Users\Administrator\.gemini\antigravity\brain\5f067fb4-7260-4b9e-97f0-390964082fa8\screenshots"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force }

$viewports = @(
    @{ Name = "mobile_393"; Width = 393; Height = 852 },
    @{ Name = "desktop_1440"; Width = 1440; Height = 900 }
)

$pages = @(
    @{ Slug = "home"; Url = "http://localhost:3000/?consent=1" },
    @{ Slug = "profile"; Url = "http://localhost:3000/profile?consent=1&template=ia1" },
    @{ Slug = "calibrate"; Url = "http://localhost:3000/profile?consent=1&mode=calibrate&template=ia1" },
    @{ Slug = "wiki"; Url = "http://localhost:3000/wiki?consent=1" },
    @{ Slug = "report"; Url = "http://localhost:3000/profile/report?consent=1" },
    @{ Slug = "love-relay"; Url = "http://localhost:3000/love-relay?consent=1" },
    @{ Slug = "knowledge"; Url = "http://localhost:3000/knowledge?consent=1" },
    @{ Slug = "reimbursement"; Url = "http://localhost:3000/reimbursement?consent=1" },
    @{ Slug = "studies"; Url = "http://localhost:3000/studies?consent=1" },
    @{ Slug = "timeline"; Url = "http://localhost:3000/timeline?consent=1" },
    @{ Slug = "resources"; Url = "http://localhost:3000/resources?consent=1" },
    @{ Slug = "about"; Url = "http://localhost:3000/about?consent=1" },
    @{ Slug = "privacy"; Url = "http://localhost:3000/privacy?consent=1" },
    @{ Slug = "terms"; Url = "http://localhost:3000/terms?consent=1" },
    @{ Slug = "admin"; Url = "http://localhost:3000/admin?consent=1" }
)

foreach ($vp in $viewports) {
    foreach ($pg in $pages) {
        $outFile = Join-Path $outDir "$($pg.Slug)_$($vp.Name).png"
        if (Test-Path $outFile) { Remove-Item $outFile -Force }
        Write-Host "Capturing $($pg.Slug) on $($vp.Name) ($($vp.Width)x$($vp.Height))..."
        $tempProfile = Join-Path $env:TEMP "edge_headless_$(Get-Random)"
        $args = @(
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            "--hide-scrollbars",
            "--user-data-dir=$tempProfile",
            "--window-size=$($vp.Width),$($vp.Height)",
            "--virtual-time-budget=5000",
            "--screenshot=$outFile",
            $pg.Url
        )
        Start-Process -FilePath $edgePath -ArgumentList $args -Wait
        if (Test-Path $tempProfile) { Remove-Item $tempProfile -Recurse -Force -ErrorAction SilentlyContinue }
        if (Test-Path $outFile) {
            $size = (Get-Item $outFile).Length
            Write-Host " [OK] Saved $outFile ($([math]::Round($size/1024, 1)) KB)"
        } else {
            Write-Host " [FAILED] $outFile was not created"
        }
    }
}
Write-Host "Visual capture complete."
