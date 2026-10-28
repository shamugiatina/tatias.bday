"""Build static GitHub Pages files. RSVP needs a backend and is disabled here."""
from pathlib import Path
import shutil
root = Path(__file__).resolve().parent.parent
public = root / 'public'
out = root / 'docs'
out.mkdir(exist_ok=True)
for folder in ['fonts', 'images']:
 shutil.copytree(public/folder,out/folder,dirs_exist_ok=True)
html = (public/'index.html').read_text().replace('href="/', 'href="./').replace('src="/', 'src="./')
html = html.replace('<form id="rsvp-form">','<p class="small-note">სტუმრების დასტური მალე დაემატება. მანამდე, გთხოვ, პირადად მომწერო ♡</p><form id="rsvp-form">')
(out/'index.html').write_text(html)
(out/'style.css').write_text((public/'style.css').read_text().replace("url('/", "url('./"))
js = (public/'app.js').read_text()
start = js.index("form.addEventListener('submit'")
end = js.index('// Touch-friendly candy bursts.', start)
js = js[:start] + "form.querySelectorAll('input, textarea, button').forEach(element => { element.disabled = true; });\nform.querySelector('button').textContent = 'დასტური მალე დაემატება ♡';\n\n" + js[end:]
(out/'app.js').write_text(js)
(out/'.nojekyll').touch()
print('Built GitHub Pages site in docs/. RSVP explicitly disabled until a backend is configured.')
