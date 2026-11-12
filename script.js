// --- AUDIO SYNTHESIZER (Web Audio API) ---
class JutsuAudio {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.currentMode = null;
    this.osc1 = null;
    this.osc2 = null;
    this.gain = null;
  }
  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx();
    this.enabled = true;
  }
  toggle() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.enabled = !this.enabled;
    if (!this.enabled) this.stop();
    return this.enabled;
  }
  playRasengan() {
    if (!this.enabled || !this.ctx || this.currentMode === 'rasengan') return;
    this.stop();
    this.currentMode = 'rasengan';
    const t = this.ctx.currentTime;
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'sine';
    this.osc1.frequency.setValueAtTime(140, t);
    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'triangle';
    this.osc2.frequency.setValueAtTime(320, t);
    this.gain = this.ctx.createGain();
    this.gain.gain.setValueAtTime(0.01, t);
    this.gain.gain.linearRampToValueAtTime(0.25, t + 0.2);
    this.osc1.connect(this.gain);
    this.osc2.connect(this.gain);
    this.gain.connect(this.ctx.destination);
    this.osc1.start();
    this.osc2.start();
  }
  playChidori() {
    if (!this.enabled || !this.ctx || this.currentMode === 'chidori') return;
    this.stop();
    this.currentMode = 'chidori';
    const t = this.ctx.currentTime;
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'sawtooth';
    this.osc1.frequency.setValueAtTime(900, t);
    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'square';
    this.osc2.frequency.setValueAtTime(1800, t);
    this.gain = this.ctx.createGain();
    this.gain.gain.setValueAtTime(0.01, t);
    this.gain.gain.linearRampToValueAtTime(0.2, t + 0.1);
    this.osc1.connect(this.gain);
    this.osc2.connect(this.gain);
    this.gain.connect(this.ctx.destination);
    this.osc1.start();
    this.osc2.start();
  }
  stop() {
    if (this.gain && this.ctx) {
      try {
        this.gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        setTimeout(() => {
          if (this.osc1) this.osc1.stop();
          if (this.osc2) this.osc2.stop();
        }, 120);
      } catch (e) {}
    }
    this.currentMode = null;
  }
}
// --- VISUAL EFFECTS RENDERER ---
class JutsuRenderer {
  constructor(ctx) {
    this.ctx = ctx;
    this.time = 0;
    this.sparks = [];
  }
  update() {
    this.time += 0.05;
  }
  // 1. RASENGAN (Spiraling 3D Chakra Sphere)
  renderRasengan(x, y, radius) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // Outer Aura Glow
    const outer = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 2.2);
    outer.addColorStop(0, 'rgba(0, 210, 255, 0.4)');
    outer.addColorStop(0.5, 'rgba(0, 120, 255, 0.2)');
    outer.addColorStop(1, 'rgba(0, 50, 200, 0)');
    ctx.fillStyle = outer;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
    ctx.fill();
    // 3D Orbiting Chakra Bands
    const bands = 12;
    for (let i = 0; i < bands; i++) {
      const rot = (i / bands) * Math.PI + this.time * 2.5;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(1, Math.cos(this.time * 3 + i) * 0.7 + 0.3);
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.9, 0, Math.PI * 2);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(77, 240, 255, 0.8)' : 'rgba(255, 255, 255, 0.9)';
      ctx.stroke();
      ctx.restore();
    }
    // Dense White-Hot Energy Core
    const core = ctx.createRadialGradient(x, y, 0, x, y, radius * 0.6);
    core.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    core.addColorStop(0.3, 'rgba(160, 240, 255, 0.8)');
    core.addColorStop(1, 'rgba(0, 150, 255, 0)');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // 2. CHIDORI (Recursive Procedural Lightning)
  renderChidori(palmX, palmY, fingertips, radius) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // Lightning Arcs to each fingertip
    if (fingertips && fingertips.length) {
      for (const tip of fingertips) {
        this.drawLightning(palmX, palmY, tip.x, tip.y, 4, 25);
      }
    }
    // Wild lightning bolts jumping into space
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = radius * (1 + Math.random() * 1.5);
      this.drawLightning(palmX, palmY, palmX + Math.cos(angle) * dist, palmY + Math.sin(angle) * dist, 3, 20);
    }
    // Core Plasma Ball
    const plasma = ctx.createRadialGradient(palmX, palmY, 0, palmX, palmY, radius * 0.6);
    plasma.addColorStop(0, '#ffffff');
    plasma.addColorStop(0.3, '#bae6fd');
    plasma.addColorStop(0.7, '#0284c7');
    plasma.addColorStop(1, 'rgba(147, 51, 234, 0)');
    ctx.fillStyle = plasma;
    ctx.beginPath();
    ctx.arc(palmX, palmY, radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // Midpoint displacement lightning algorithm
  drawLightning(x1, y1, x2, y2, generations, displacement) {
    let segs = [{ p1: { x: x1, y: y1 }, p2: { x: x2, y: y2 } }];
    let disp = displacement;
    for (let g = 0; g < generations; g++) {
      let next = [];
      for (let s of segs) {
        const mx = (s.p1.x + s.p2.x) / 2;
        const my = (s.p1.y + s.p2.y) / 2;
        const dx = s.p2.x - s.p1.x;
        const dy = s.p2.y - s.p1.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const offset = (Math.random() - 0.5) * disp * 2;
        const mid = { x: mx + nx * offset, y: my + ny * offset };
        next.push({ p1: s.p1, p2: mid }, { p1: mid, p2: s.p2 });
      }
      segs = next;
      disp *= 0.5;
    }
    const ctx = this.ctx;
    ctx.beginPath();
    for (let i = 0; i < segs.length; i++) {
      if (i === 0) ctx.moveTo(segs[i].p1.x, segs[i].p1.y);
      ctx.lineTo(segs[i].p2.x, segs[i].p2.y);
    }
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
}
// --- MAIN APPLICATION LOGIC ---
const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('output-canvas');
const canvasCtx = canvasElement.getContext('2d');
const statusBadge = document.getElementById('status-badge');
const jutsuBanner = document.getElementById('jutsu-banner');
const bannerTitle = document.getElementById('banner-title');
const bannerDesc = document.getElementById('banner-desc');
const btnRasengan = document.getElementById('btn-rasengan');
const btnChidori = document.getElementById('btn-chidori');
const btnAuto = document.getElementById('btn-auto');
const btnAudio = document.getElementById('btn-audio');
let currentMode = 'rasengan'; // 'rasengan' | 'chidori' | 'auto'
const audio = new JutsuAudio();
const renderer = new JutsuRenderer(canvasCtx);
function resizeCanvas() {
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
function setMode(mode) {
  currentMode = mode;
  [btnRasengan, btnChidori, btnAuto].forEach(b => b.classList.remove('active'));
  if (mode === 'rasengan') {
    btnRasengan.classList.add('active');
    jutsuBanner.className = 'jutsu-banner rasengan-mode';
    bannerTitle.textContent = 'RASENGAN 螺旋丸';
    bannerDesc.textContent = 'Open your palm to compress rotating chakra!';
  } else if (mode === 'chidori') {
    btnChidori.classList.add('active');
    jutsuBanner.className = 'jutsu-banner chidori-mode';
    bannerTitle.textContent = 'CHIDORI 千鳥';
    bannerDesc.textContent = 'Channel lightning chakra into a deadly point!';
  } else {
    btnAuto.classList.add('active');
    jutsuBanner.className = 'jutsu-banner';
    bannerTitle.textContent = 'AUTO JUTSU MODE';
    bannerDesc.textContent = 'Open Palm = Rasengan 🌀 | Fist / Claw = Chidori ⚡';
  }
}
btnRasengan.addEventListener('click', () => setMode('rasengan'));
btnChidori.addEventListener('click', () => setMode('chidori'));
btnAuto.addEventListener('click', () => setMode('auto'));
btnAudio.addEventListener('click', () => {
  const on = audio.toggle();
  btnAudio.textContent = on ? '🔊 Sound (M)' : '🔇 Sound (M)';
  btnAudio.classList.toggle('active', on);
});
window.addEventListener('keydown', (e) => {
  if (e.key === '1') setMode('rasengan');
  if (e.key === '2') setMode('chidori');
  if (e.key === '3') setMode('auto');
  if (e.key.toLowerCase() === 'm') btnAudio.click();
});
// Detect clenched hand / claw
function isClenched(landmarks) {
  const wrist = landmarks[0];
  const tips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
  const mcps = [landmarks[5], landmarks[9], landmarks[13], landmarks[17]];
  let curled = 0;
  for (let i = 0; i < 4; i++) {
    if (Math.hypot(tips[i].x - wrist.x, tips[i].y - wrist.y) < Math.hypot(mcps[i].x - wrist.x, mcps[i].y - wrist.y) * 1.25) {
      curled++;
    }
  }
  return curled >= 3;
}
// MediaPipe Results Callback
function onResults(results) {
  statusBadge.style.display = 'none';
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  // Mirror effect so right is right
  canvasCtx.translate(canvasElement.width, 0);
  canvasCtx.scale(-1, 1);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  renderer.update();
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    for (const lm of results.multiHandLandmarks) {
      // Calculate palm center (wrist + knuckles average)
      const palmX = (lm[0].x * 0.4 + lm[9].x * 0.6) * canvasElement.width;
      const palmY = (lm[0].y * 0.4 + lm[9].y * 0.6) * canvasElement.height;
      // Calculate hand scale
      const handDist = Math.hypot((lm[9].x - lm[0].x) * canvasElement.width, (lm[9].y - lm[0].y) * canvasElement.height);
      const radius = Math.max(40, Math.min(handDist * 0.75, 160));
      const fingertips = [4, 8, 12, 16, 20].map(i => ({
        x: lm[i].x * canvasElement.width,
        y: lm[i].y * canvasElement.height
      }));
      let jutsu = currentMode;
      if (currentMode === 'auto') {
        jutsu = isClenched(lm) ? 'chidori' : 'rasengan';
      }
      if (jutsu === 'rasengan') {
        renderer.renderRasengan(palmX, palmY, radius);
        audio.playRasengan();
      } else {
        renderer.renderChidori(palmX, palmY, fingertips, radius);
        audio.playChidori();
      }
    }
  } else {
    audio.stop();
  }
  canvasCtx.restore();
}
// Setup MediaPipe
const hands = new Hands({
  locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${f}`
});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1280,
  height: 720
});
camera.start();