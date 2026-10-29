$portfolioPython = 'C:\Users\rudra\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
$portfolioDist = Join-Path $PSScriptRoot 'dist'
Write-Host 'Local portfolio: http://127.0.0.1:4173/ (Ctrl+C stops this server)'
& $portfolioPython -m http.server 4173 --bind 127.0.0.1 --directory $portfolioDist
