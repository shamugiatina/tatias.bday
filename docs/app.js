const intro = document.querySelector('#intro');
const invitation = document.querySelector('#invitation');
const cake = document.querySelector('#cake');
let opening = false;
const music = document.querySelector('#background-music');
const musicToggle = document.querySelector('#music-toggle');
const musicStatus = document.querySelector('#music-status');
let musicStarted = false;
music.volume = 0.35;
function syncMusicControl() {
  const playing = !music.paused && !music.ended;
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', playing ? 'გამორთე მუსიკა' : 'ჩართე მუსიკა');
  musicToggle.classList.toggle('playing', playing);
}
async function playMusic() {
  try {
    await music.play();
    musicStatus.textContent = '';
  } catch {
    musicStatus.textContent = 'მუსიკა ვერ ჩაირთო. ხელახლა სცადე მუსიკის ღილაკით.';
  }
  syncMusicControl();
}
music.addEventListener('play', syncMusicControl);
music.addEventListener('pause', syncMusicControl);
music.addEventListener('error', () => {
  musicStatus.textContent = 'მუსიკა ვერ ჩაიტვირთა. სცადე ხელახლა.';
  syncMusicControl();
});
musicToggle.addEventListener('click', () => {
  if (music.paused) void playMusic();
  else music.pause();
});
function confetti() {
  const container = document.querySelector('#confetti');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 55; i++) {
    const piece = document.createElement('span'); piece.className = 'confetti-piece';
    piece.style.cssText = `left:${Math.random()*100}%;background:${['#b14d70','#efb6cd','#f8e3af','#fff9ef'][i%4]};animation-delay:${Math.random()*.7}s;--drift:${Math.random()*200-100}px;border-radius:${i%3 ? '0' : '50%'}`;
    container.append(piece); setTimeout(() => piece.remove(), 4000);
  }
}
cake.addEventListener('click', () => {
  if (opening) return; opening = true; cake.classList.add('blown');
  // Start directly inside the user gesture for Safari and mobile browser policies.
  if (!musicStarted) { musicStarted = true; void playMusic(); }
  cake.querySelector('.cake-hint').textContent = 'სურვილი ჩაიფიქრე? ♡';
  setTimeout(() => {
    intro.classList.add('exit'); intro.inert = true; intro.setAttribute('aria-hidden','true');
    musicToggle.hidden = false;
    invitation.inert = false; invitation.removeAttribute('aria-hidden'); document.body.classList.remove('intro-active');
    window.scrollTo(0,0); confetti(); document.querySelector('#home').focus({preventScroll:true});
  }, 1000);
});
document.querySelector('#replay').addEventListener('click', () => {
  opening = false; cake.classList.remove('blown'); cake.querySelector('.cake-hint').textContent = 'შეეხე და ჩააქრე';
  invitation.inert = true; invitation.setAttribute('aria-hidden','true'); intro.inert = false; intro.removeAttribute('aria-hidden'); intro.classList.remove('exit'); musicToggle.hidden = true;
  document.body.classList.add('intro-active'); cake.focus();
});
intro.addEventListener('keydown', event => { if(event.key === 'Tab') { event.preventDefault(); cake.focus(); } });
const partyDate = new Date('2026-11-26T20:00:00+04:00').getTime();
function countdown() {
  let remaining = Math.max(0, Math.floor((partyDate - Date.now()) / 1000));
  const values = { days: Math.floor(remaining/86400), hours: Math.floor(remaining%86400/3600), minutes: Math.floor(remaining%3600/60), seconds: remaining%60 };
  for (const [id, value] of Object.entries(values)) document.getElementById(id).textContent = String(value).padStart(2,'0');
  if (!remaining) document.querySelector('#count-note').textContent = 'ჩვენი საღამო დადგა! ♡';
}
countdown(); setInterval(countdown,1000);
const envelope = document.querySelector('#envelope');
envelope.addEventListener('click', () => {
  const open = envelope.getAttribute('aria-expanded') !== 'true';
  envelope.setAttribute('aria-expanded', String(open)); envelope.classList.toggle('open',open);
  document.querySelector('#letter-content').hidden = !open;
  document.querySelector('#envelope-hint').textContent = open ? 'შენთან ერთად უფრო ლამაზია ♡' : 'დააჭირე კონვერტს და გახსენი შენი მოსაწვევი ↑';
});
document.querySelector('#close-letter').addEventListener('click', () => { envelope.click(); envelope.focus({preventScroll:true}); });
const form = document.querySelector('#rsvp-form');
form.querySelectorAll('input, textarea, button').forEach(element => { element.disabled = true; });
form.querySelector('button').textContent = 'დასტური მალე დაემატება ♡';

// Touch-friendly candy bursts. All moving pieces are short lived and bounded.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function candyBurst(x, y, shower = false) {
  if (reducedMotion.matches) return;
  const layer = document.querySelector('#confetti');
  const count = shower ? 36 : 22;
  for (let i = 0; i < count; i++) {
    if (layer.childElementCount > 100) break;
    const particle = document.createElement('span');
    particle.className = 'candy-particle';
    {
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox','0 0 100 100');
      const use = document.createElementNS('http://www.w3.org/2000/svg','use');
      use.setAttribute('href', i % 5 === 0 ? '#star-balloon' : '#candy'); svg.append(use); particle.append(svg);
    }
    const startX = shower ? 20 + Math.random() * (innerWidth - 40) : x;
    const startY = shower ? -40 - Math.random() * 150 : y;
    particle.style.left = `${startX - 24}px`; particle.style.top = `${startY - 15}px`;
    const dx = (Math.random() - .5) * (shower ? 180 : 370);
    const spin = (Math.random() - .5) * 1000;
    layer.append(particle);
    const animation = particle.animate([
      {transform:'translate(0,0) rotate(0deg) scale(.5)',opacity:0},
      {transform:`translate(${dx*.4}px,${shower ? 80 : -80-Math.random()*90}px) rotate(${spin*.25}deg) scale(1)`,opacity:1,offset:.25},
      {transform:`translate(${dx}px,${innerHeight-startY+100}px) rotate(${spin}deg) scale(.75)`,opacity:0}
    ],{duration:2000+Math.random()*1200,delay:shower ? Math.random()*450 : 0,easing:'cubic-bezier(.2,.45,.65,1)',fill:'both'});
    animation.onfinish = () => particle.remove();
  }
}
document.querySelectorAll('.pop-balloon').forEach(balloon => {
  balloon.addEventListener('click', () => {
    if (balloon.classList.contains('popped')) return;
    const rect = balloon.getBoundingClientRect();
    balloon.classList.remove('returning'); balloon.classList.add('popped');
    balloon.setAttribute('aria-disabled','true');
    candyBurst(rect.x+rect.width/2,rect.y+rect.height*.4);
    document.querySelector('.pop-status').textContent = 'პოპ! მთელი ვარდისფერი ბედნიერება შენთვის 🍬';
    setTimeout(() => {
      balloon.classList.remove('popped'); balloon.classList.add('returning');
      balloon.removeAttribute('aria-disabled');
      document.querySelector('.pop-status').textContent = 'კიდევ ერთი სურვილი? შეეხე ბუშტს ♡';
    },3200);
  });
});
document.querySelector('#candy-shower').addEventListener('click', () => {
  candyBurst(innerWidth/2,0,true);
  document.querySelector('.pop-status').textContent = 'დღეს ყველაფერი ცოტა უფრო ტკბილია 🍬';
});
cake.addEventListener('click', () => setTimeout(() => candyBurst(innerWidth/2,0,true),1100));
const revealObserver = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target);
  }
},{threshold:.08});
document.querySelectorAll('.palette-card, .location-card, .dress-heading, .count-wrap').forEach(element => {
  element.classList.add('reveal'); revealObserver.observe(element);
});
