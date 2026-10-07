# Uso: powershell -File tools/tarjetas/render.ps1 -Dir posts/AAAA-MM-DD-tema
# Requiere <Dir>/cards.js con: window.CARDS=[{q:"frase",a:"Autor o null",bg:"file:///D:/.../fondo.jpg"}, ...]
# Genera <Dir>/tarjeta_1.jpg .. tarjeta_N.jpg (1080x1920).
param([Parameter(Mandatory)][string]$Dir)
$Dir=(Resolve-Path $Dir).Path
$tpl=Join-Path $PSScriptRoot 'card.html'
$tmp=Join-Path $Dir '_card.html'
Copy-Item $tpl $tmp -Force
$n=([regex]::Matches((Get-Content (Join-Path $Dir 'cards.js') -Raw -Encoding UTF8),'\bq\s*:')).Count
Add-Type -AssemblyName System.Drawing
$enc=[System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()|Where-Object{$_.MimeType -eq 'image/jpeg'}
$p=New-Object System.Drawing.Imaging.EncoderParameters(1)
$p.Param[0]=New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality,92L)
$chrome='C:\Program Files\Google\Chrome\Application\chrome.exe'
for($i=0;$i -lt $n;$i++){
  $png=Join-Path $Dir "_t$i.png"
  & $chrome --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files --window-size=1080,1920 --virtual-time-budget=4000 --screenshot="$png" ("file:///"+$tmp.Replace('\','/')+"#$i") 2>$null | Out-Null
  $img=[System.Drawing.Image]::FromFile($png)
  $img.Save((Join-Path $Dir "tarjeta_$($i+1).jpg"),$enc,$p)
  $img.Dispose(); Remove-Item $png
}
Remove-Item $tmp
"Generadas $n tarjetas en $Dir"
