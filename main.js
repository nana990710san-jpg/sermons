import { ITEMS } from './items.js';
import { SoundEngine } from './sound.js';
import { placeholderSVG } from './placeholder.js';

// 재질별 움직임 성격: 스프링 강도/감쇠, 스크롤 속도 반영 정도, 최대 기울기, 떨림, 소리 쿨다운(ms)
const MOTION = {
  rustle:  { stiff: 60,  damp: 7,   gain: 0.010, max: 14, skew: 0.35, jitter: 0,   cool: 260 },
  swish:   { stiff: 25,  damp: 3.5, gain: 0.014, max: 22, skew: 0.6,  jitter: 0,   cool: 380 },
  beads:   { stiff: 90,  damp: 6,   gain: 0.008, max: 10, skew: 0.1,  jitter: 2.2, cool: 200 },
  sequins: { stiff: 80,  damp: 6,   gain: 0.008, max: 10, skew: 0.15, jitter: 1.4, cool: 220 },
  leather: { stiff: 18,  damp: 2.2, gain: 0.006, max: 16, skew: 0,    jitter: 0,   cool: 520 },
  metal:   { stiff: 30,  damp: 1.6, gain: 0.012, max: 28, skew: 0,    jitter: 0.6, cool: 300 },
};

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const audio = new SoundEngine();
const stage = document.getElementById('stage');
const spacer = document.getElementById('spacer');
const backdrop = document.getElementById('backdrop');
const toggle = document.getElementById('sound-toggle');
const intro = document.getElementById('intro');
const cap = {
  kicker: document.getElementById('cap-kicker'),
  name: document.getElementById('cap-name'),
  concept: document.getElementById('cap-concept'),
};
const LABEL = {
  rustle: 'Cotton · Canvas · Denim', swish: 'Silk · Nylon', beads: 'Pearls · Glass beads',
  sequins: 'Sequins', leather: 'Leather', metal: 'Metal hardware',
};

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const narrow = () => innerWidth < 640;

const nodes = ITEMS.map((item) => {
  const el = document.createElement('figure');
  el.className = 'item';
  el.style.zIndex = String(Math.round(item.depth * 100));
  const inner = document.createElement('div');
  inner.className = 'inner';
  const img = new Image();
  img.alt = item.name;
  img.draggable = false;
  img.decoding = 'async';
  img.onerror = () => { inner.innerHTML = placeholderSVG(item); };
  img.src = `assets/items/${item.id}.png`;
  inner.appendChild(img);
  el.appendChild(inner);
  stage.appendChild(el);

  const n = { item, el, inner, m: MOTION[item.sound], angle: 0, av: 0, phase: Math.random() * Math.PI * 2, last: 0, h: 0, cx: 0 };
  el.addEventListener('pointerenter', () => { kick(n, 0.55); showCaption(item); });
  el.addEventListener('click', () => { kick(n, 1); showCaption(item); });
  return n;
});

function layout() {
  const scale = narrow() ? 1.75 : 1;
  for (const n of nodes) {
    const w = n.item.w * scale;
    const x = clamp(narrow() ? n.item.x * 0.75 : n.item.x, 0, 100 - w);
    n.el.style.left = x + 'vw';
    n.el.style.width = w + 'vw';
    n.cx = (x + w / 2) / 100;
  }
  const maxY = Math.max(...ITEMS.map((i) => i.y));
  spacer.style.height = maxY + 80 + 'vh';
}

function kick(n, strength) {
  n.av += (Math.random() < 0.5 ? -1 : 1) * n.m.max * 6 * strength;
  playFor(n, strength);
}

function playFor(n, intensity) {
  audio.play(n.item.sound, intensity, n.cx * 1.6 - 0.8);
  n.last = performance.now();
}

let captionId = null;
function showCaption(item) {
  if (captionId === item.id) return;
  captionId = item.id;
  cap.kicker.textContent = LABEL[item.sound];
  cap.name.textContent = item.name;
  cap.concept.textContent = item.concept;
}

let lastY = scrollY, vel = 0, lastT = performance.now();

function frame(t) {
  const dt = Math.min(0.05, (t - lastT) / 1000) || 0.016;
  lastT = t;
  const y = scrollY;
  const H = innerHeight, vh = H / 100;
  vel += ((y - lastY) / dt - vel) * 0.3; // px/s, 부드럽게
  lastY = y;
  const speed = Math.abs(vel);

  backdrop.style.transform = `translate3d(0, ${-y * 0.08}px, 0)`;

  const candidates = [];
  let nearest = null, nearestD = Infinity;

  for (const n of nodes) {
    const { item, m } = n;
    n.h = n.el.offsetHeight; // transform만 바뀌므로 레이아웃 비용이 거의 없다
    // 각 아이템은 깊이와 상관없이 자기 y 지점에서 화면 중앙을 지나간다
    const centerY = H / 2 + (item.y * vh - H / 2 - y) * item.depth;
    const top = centerY - n.h / 2;

    // 스프링: 스크롤 속도에 따라 기울어지고 재질별로 되돌아옴
    const target = reduceMotion ? 0 : clamp(-vel * m.gain, -m.max, m.max);
    n.av += (m.stiff * (target - n.angle) - m.damp * n.av) * dt;
    n.angle += n.av * dt;
    n.angle = clamp(n.angle, -m.max * 2.5, m.max * 2.5);

    n.phase += dt * (0.6 + item.depth * 0.3);
    const bob = reduceMotion ? 0 : Math.sin(n.phase) * 10;
    const drift = reduceMotion ? 0 : Math.cos(n.phase * 0.7) * 6;
    const j = m.jitter * Math.min(1, speed / 1500);
    const jx = j ? (Math.random() - 0.5) * j * 2 : 0;
    const jy = j ? (Math.random() - 0.5) * j * 2 : 0;

    n.el.style.transform = `translate3d(${drift + jx}px, ${top + bob + jy}px, 0) scale(${0.85 + item.depth * 0.15})`;
    n.inner.style.transform = `rotate(${n.angle}deg) skewX(${n.angle * m.skew}deg)`;

    const visible = top < H && top + n.h > 0;
    if (!visible) continue;
    const dist = Math.abs(centerY - H / 2) / (H / 2);
    if (dist < nearestD) { nearestD = dist; nearest = item; }

    if (speed > 140 && t - n.last > m.cool * (0.8 + Math.random() * 0.4)) {
      const intensity = clamp(speed / 2600, 0.1, 1) * clamp(1.1 - dist * 0.6, 0.25, 1) * (0.7 + item.depth * 0.25);
      candidates.push({ n, intensity });
    }
  }

  // 한 프레임에 너무 많은 소리가 겹치지 않도록 상위 3개만
  candidates.sort((a, b) => b.intensity - a.intensity).slice(0, 3).forEach(({ n, intensity }) => playFor(n, intensity));
  if (nearest && speed > 30) showCaption(nearest);

  requestAnimationFrame(frame);
}

function setSound(on) {
  audio.setMuted(!on);
  toggle.setAttribute('aria-pressed', String(on));
  toggle.textContent = on ? 'Sound on' : 'Sound off';
}

async function enter(withSound) {
  if (withSound) {
    try { await audio.unlock(); } catch (e) { console.warn(e); }
  }
  setSound(withSound && audio.ctx?.state === 'running');
  intro.classList.add('hidden');
  document.body.classList.remove('locked');
  if (withSound) nodes.slice(0, 2).forEach((n, i) => setTimeout(() => kick(n, 0.7), 250 + i * 300));
}

document.getElementById('enter').addEventListener('click', () => enter(true));
document.getElementById('enter-mute').addEventListener('click', () => enter(false));
toggle.addEventListener('click', async () => {
  const on = toggle.getAttribute('aria-pressed') !== 'true';
  if (on) await audio.unlock();
  setSound(on);
});

addEventListener('resize', layout);

document.body.classList.add('locked');
layout();
requestAnimationFrame(frame);
