from pathlib import Path
import base64
root=Path(__file__).resolve().parent.parent/'public'
html=(root/'index.html').read_text()
css=(root/'style.css').read_text()
for font in ['georgian','script','galaktioni','firago-italic']:
 encoded=base64.b64encode((root/f'fonts/{font}.ttf').read_bytes()).decode()
 css=css.replace(f'/fonts/{font}.ttf',f'data:font/ttf;base64,{encoded}')
for image in ['birthday-cake.png','dresscode-women.png','stickers-3d.png']:
 encoded=base64.b64encode((root/f'images/{image}').read_bytes()).decode()
 html=html.replace(f'/images/{image}',f'data:image/png;base64,{encoded}')
 css=css.replace(f'/images/{image}',f'data:image/png;base64,{encoded}')
audio=base64.b64encode((root/'audio/this-will-be.mp3').read_bytes()).decode()
html=html.replace('/audio/this-will-be.mp3',f'data:audio/mpeg;base64,{audio}')
js=(root/'app.js').read_text()
start=js.index("    const response = await fetch('/api/rsvp'")
end=js.index("    status.textContent = values.attending",start)
js=js[:start]+"    const stored = JSON.parse(localStorage.getItem('tatia-preview-rsvp') || '[]');\n    stored.push({...values, receivedAt: new Date().toISOString()});\n    localStorage.setItem('tatia-preview-rsvp', JSON.stringify(stored));\n"+js[end:]
js=js.replace('შენი პასუხი შენახულია! მოუთმენლად გელი! 🎀','საცდელი პასუხი შენახულია ამ ბრაუზერში! 🎀').replace('შენი პასუხი შენახულია. ძალიან დაგვაკლდები! ♡','საცდელი პასუხი შენახულია ამ ბრაუზერში. ♡')
html=html.replace('<link rel="stylesheet" href="/style.css">',f'<style>{css}</style>').replace('<script src="/app.js" defer></script>','')
html=html.replace('<form id="rsvp-form">','<p class="small-note">საცდელი ვერსია: პასუხი მხოლოდ შენს ბრაუზერში ინახება.</p><form id="rsvp-form">')
html=html.replace('</body>',f'<script>{js}</script></body>')
Path('/tmp/tatia-invitation-preview.html').write_text(html)
print('Standalone interactive preview created:',len(html),'characters')
