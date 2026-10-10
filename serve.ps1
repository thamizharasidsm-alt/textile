# Tiny static web server for the SthreeCreatives demo — no installs needed (Windows PowerShell 5+)
param([int]$Port = 8090)
$root = $PSScriptRoot
$mime = @{
  '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='application/javascript; charset=utf-8';
  '.json'='application/json'; '.svg'='image/svg+xml'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.webp'='image/webp';
  '.ico'='image/x-icon'; '.woff2'='font/woff2'; '.woff'='font/woff'; '.csv'='text/csv'; '.xlsx'='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; '.txt'='text/plain'
}
$url = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
try { $listener.Start() }
catch {
  Write-Host "Port $Port is already in use - opening the existing demo instead." -ForegroundColor Yellow
  Start-Process $url; exit
}
Write-Host ""
Write-Host "  SthreeCreatives - Basic edition demo" -ForegroundColor Cyan
Write-Host "  Running at $url" -ForegroundColor Green
Write-Host "  Keep this window open during the demo. Press Ctrl+C to stop." -ForegroundColor Gray
Write-Host ""
Start-Process $url
try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request; $res = $ctx.Response
    try {
      $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
      if ([string]::IsNullOrWhiteSpace($path)) { $path = 'index.html' }
      $file = [System.IO.Path]::GetFullPath((Join-Path $root $path))
      if (-not $file.StartsWith($root) -or -not (Test-Path $file -PathType Leaf)) {
        $res.StatusCode = 404; $bytes = [Text.Encoding]::UTF8.GetBytes('Not found')
      } else {
        $ext = [System.IO.Path]::GetExtension($file).ToLower()
        $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
        $res.Headers.Add('Cache-Control', 'no-store')
        $bytes = [System.IO.File]::ReadAllBytes($file)
      }
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } catch { $res.StatusCode = 500 }
    finally { $res.OutputStream.Close() }
  }
} finally { $listener.Stop() }
