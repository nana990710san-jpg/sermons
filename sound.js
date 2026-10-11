// 재질별 소리를 Web Audio API로 실시간 합성한다 (오디오 파일 없음).
const rand = (a, b) => a + Math.random() * (b - a);

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  get ready() {
    return !!this.ctx && this.ctx.state === 'running' && !this.muted;
  }

  async unlock() {
    if (!this.ctx) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.ctx = ctx;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 6;
      this.master = ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(comp).connect(ctx.destination);

      const len = ctx.sampleRate * 2;
      this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state !== 'running') await this.ctx.resume();
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.9, this.ctx.currentTime, 0.05);
  }

  // intensity 0..1, pan -1..1
  play(type, intensity, pan = 0) {
    if (!this.ready) return;
    const fn = this[type];
    if (fn) fn.call(this, Math.max(0.05, Math.min(1, intensity)), Math.max(-1, Math.min(1, pan)));
  }

  out(pan) {
    const p = this.ctx.createStereoPanner();
    p.pan.value = pan;
    p.connect(this.master);
    return p;
  }

  noiseSrc() {
    const s = this.ctx.createBufferSource();
    s.buffer = this.noise;
    return s;
  }

  // 짧은 노이즈 알갱이 (바스락의 '사각' 한 알)
  burst(at, dur, freq, q, amp, dest, type = 'bandpass') {
    const s = this.noiseSrc();
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(amp, at + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    s.connect(f).connect(g).connect(dest);
    s.start(at, rand(0, 1.8), dur + 0.02);
  }

  // 필터가 쓸려가는 노이즈 (천이 '스윽' 스치는 몸통)
  sweep(at, dur, f0, f1, q, amp, dest, type = 'bandpass') {
    const s = this.noiseSrc();
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(f0, at);
    f.frequency.exponentialRampToValueAtTime(f1, at + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(amp, at + dur * 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    s.connect(f).connect(g).connect(dest);
    s.start(at, rand(0, 1.5), dur + 0.05);
  }

  // 짧게 울리는 음 (비즈/진주/스팽글의 '찰랑' 한 알)
  ping(at, freq, decay, amp, dest, wave = 'sine') {
    const o = this.ctx.createOscillator();
    o.type = wave;
    o.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(amp, at + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
    o.connect(g).connect(dest);
    o.start(at);
    o.stop(at + decay + 0.02);
  }

  // 코튼 캔버스·데님: 사각사각
  rustle(i, pan) {
    const t = this.ctx.currentTime, dest = this.out(pan);
    const dur = 0.25 + i * 0.45;
    this.sweep(t, dur, rand(1400, 2200), rand(3000, 4500), 0.7, 0.18 * i, dest);
    const grains = Math.round(5 + i * 14);
    for (let k = 0; k < grains; k++) {
      this.burst(t + Math.random() * dur, rand(0.01, 0.035), rand(2500, 7000), rand(1.5, 4), rand(0.05, 0.22) * i, dest);
    }
  }

  // 실크·나일론: 부드러운 슉
  swish(i, pan) {
    const t = this.ctx.currentTime, dest = this.out(pan);
    const dur = 0.35 + i * 0.5;
    this.sweep(t, dur, rand(500, 800), rand(2500, 4200), 0.5, 0.3 * i, dest);
    this.sweep(t + 0.05, dur * 0.8, rand(4000, 6000), rand(7000, 9000), 1.2, 0.06 * i, dest, 'highpass');
  }

  // 진주·유리 비즈: 찰랑찰랑
  beads(i, pan) {
    const t = this.ctx.currentTime, dest = this.out(pan);
    const spread = 0.15 + i * 0.35;
    const n = Math.round(5 + i * 16);
    for (let k = 0; k < n; k++) {
      const at = t + Math.pow(Math.random(), 1.6) * spread;
      const f = rand(1900, 4800);
      this.ping(at, f, rand(0.04, 0.12), rand(0.04, 0.12) * i, dest, 'triangle');
      this.ping(at, f * 2.71, rand(0.02, 0.05), 0.03 * i, dest);
      this.burst(at, 0.008, rand(5000, 9000), 2, 0.08 * i, dest);
    }
    this.sweep(t, spread + 0.1, 2000, 4000, 0.8, 0.05 * i, dest);
  }

  // 스팽글·크리스털: 반짝이는 시머
  sequins(i, pan) {
    const t = this.ctx.currentTime, dest = this.out(pan);
    const spread = 0.25 + i * 0.4;
    const n = Math.round(10 + i * 26);
    for (let k = 0; k < n; k++) {
      const at = t + Math.random() * spread;
      this.ping(at, rand(5200, 10500), rand(0.02, 0.06), rand(0.02, 0.07) * i, dest);
    }
    this.sweep(t, spread + 0.1, 6000, 11000, 1, 0.08 * i, dest, 'highpass');
  }

  // 가죽: 삐걱이는 크릭 + 낮은 스침
  leather(i, pan) {
    const ctx = this.ctx, t = ctx.currentTime, dest = this.out(pan);
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    const base = rand(70, 120);
    o.frequency.setValueAtTime(base, t);
    o.frequency.linearRampToValueAtTime(base * rand(1.2, 1.6), t + 0.3 + i * 0.3);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = rand(700, 1300);
    bp.Q.value = 4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    // stick-slip: 불규칙한 마찰 펄스
    const pulses = Math.round(4 + i * 10);
    let at = t;
    for (let k = 0; k < pulses; k++) {
      at += rand(0.018, 0.045);
      g.gain.setValueAtTime(0.25 * i * rand(0.5, 1), at);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.016);
    }
    o.connect(bp).connect(g).connect(dest);
    o.start(t);
    o.stop(at + 0.05);
    this.sweep(t, 0.3 + i * 0.3, 300, 900, 0.8, 0.12 * i, dest);
    if (i > 0.45) this.clink(t + rand(0.05, 0.2), rand(1400, 2000), 0.5 * i, dest);
  }

  // 금속 하드웨어: 맑은 딸랑 (비조화 배음)
  clink(at, f, amp, dest) {
    [[1, 1], [2.76, 0.6], [5.4, 0.35], [8.93, 0.2]].forEach(([r, a]) => {
      this.ping(at, f * r, rand(0.25, 0.7) / Math.sqrt(r), amp * a * 0.12, dest);
    });
    this.burst(at, 0.006, 8000, 1, amp * 0.15, dest, 'highpass');
  }

  metal(i, pan) {
    const t = this.ctx.currentTime, dest = this.out(pan);
    const n = Math.round(2 + i * 4);
    for (let k = 0; k < n; k++) this.clink(t + k * rand(0.04, 0.11), rand(1100, 2600), i, dest);
  }
}
