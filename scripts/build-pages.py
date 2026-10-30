"""Build static invitation with a browser-only RSVP demonstration."""
from pathlib import Path
import shutil
root = Path(__file__).resolve().parent.parent
public = root / 'public'
out = root / 'docs'
out.mkdir(exist_ok=True)
for folder in ['fonts', 'images', 'audio']:
 shutil.copytree(public/folder,out/folder,dirs_exist_ok=True)
html = (public/'index.html').read_text().replace('href="/', 'href="./').replace('src="/', 'src="./')
(out/'index.html').write_text(html)
(out/'style.css').write_text((public/'style.css').read_text().replace("url('/", "url('./"))
js = (public/'app.js').read_text()
start = js.index("    const response = await fetch('/api/rsvp'")
end = js.index("    form.reset();", start)
js = js[:start] + """    const stored = JSON.parse(localStorage.getItem('tatia-demo-rsvp') || '[]');
    stored.push({...values, receivedAt: new Date().toISOString()});
    localStorage.setItem('tatia-demo-rsvp', JSON.stringify(stored));
    status.textContent = 'შენახულია ამ ბრაუზერში · მასპინძელს არ გაგზავნია. ♡';
""" + js[end:]
js = js.replace('პასუხი ვერ გაიგზავნა. გთხოვ, სცადე ხელახლა.', 'საცდელი პასუხი ვერ შეინახა ბრაუზერმა. გთხოვ, სცადე ხელახლა.')
js = js.replace("status.textContent = 'იგზავნება…'", "status.textContent = 'ინახება…'")
(out/'app.js').write_text(js)
(out/'.nojekyll').touch()
print('Built docs/ with an editable browser-only demo RSVP form.')
