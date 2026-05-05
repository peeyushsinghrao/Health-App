import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Repeat, Volume2, VolumeX } from 'lucide-react';
import VideoTemplate, { SCENE_DURATIONS } from './VideoTemplate';
import { useSceneControls } from './useSceneControls';

const PROGRESS_TICK_MS = 60;

// ─────────────────────────────────────────────
//  AUDIO ENGINE
// ─────────────────────────────────────────────

/** Create a short impulse-response reverb from white noise */
function makeReverb(ctx: AudioContext, seconds = 2.4, decay = 3.2): ConvolverNode {
  const rate = ctx.sampleRate;
  const length = rate * seconds;
  const buf = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = buf;
  return conv;
}

/** Sine oscillator helper */
function osc(
  ctx: AudioContext,
  freq: number,
  type: OscillatorType,
  gainVal: number,
  dest: AudioNode,
  detune = 0,
): OscillatorNode {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.detune.value = detune;
  g.gain.value = gainVal;
  o.connect(g);
  g.connect(dest);
  o.start();
  return o;
}

/** Pentatonic major scale starting at root Hz — 2 octaves */
function pentatonic(root: number): number[] {
  const ratios = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2, 9 / 4, 5 / 2, 3, 10 / 3];
  return ratios.map(r => root * r);
}

/** Short percussive click using band-passed noise */
function playPercussionHit(ctx: AudioContext, dest: AudioNode, freq: number, gain: number, time: number) {
  const dur = 0.07;
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 6);
  }
  const src = ctx.createBufferSource();
  const filt = ctx.createBiquadFilter();
  const g = ctx.createGain();
  filt.type = 'bandpass';
  filt.frequency.value = freq;
  filt.Q.value = 3;
  g.gain.value = gain;
  src.buffer = buf;
  src.connect(filt);
  filt.connect(g);
  g.connect(dest);
  src.start(time);
}

/** Soft tonal pluck (karnataka-ish) using triangle + filter */
function playPluck(ctx: AudioContext, dest: AudioNode, freq: number, gain: number, time: number) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  const filt = ctx.createBiquadFilter();
  o.type = 'triangle';
  o.frequency.value = freq;
  filt.type = 'lowpass';
  filt.frequency.value = freq * 6;
  filt.Q.value = 1;
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(gain, time + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, time + 1.4);
  o.connect(filt);
  filt.connect(g);
  g.connect(dest);
  o.start(time);
  o.stop(time + 1.5);
}

/** Soft pad note with slow attack */
function playPad(ctx: AudioContext, dest: AudioNode, freq: number, gain: number, time: number, dur: number) {
  const o = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o2.type = 'triangle';
  o.frequency.value = freq;
  o2.frequency.value = freq * 2.003; // slight octave with tiny detune
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(gain, time + 1.0);
  g.gain.setValueAtTime(gain, time + dur - 1.0);
  g.gain.linearRampToValueAtTime(0, time + dur);
  const g2 = ctx.createGain();
  g2.gain.value = 0.35;
  o.connect(g); o2.connect(g2); g2.connect(g);
  g.connect(dest);
  o.start(time); o2.start(time);
  o.stop(time + dur + 0.1); o2.stop(time + dur + 0.1);
}

/** Whoosh transition sound (filtered noise sweep) */
function playWhoosh(ctx: AudioContext, dest: AudioNode) {
  const dur = 0.6;
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(Math.sin(Math.PI * i / data.length), 2) * 0.4;
  }
  const src = ctx.createBufferSource();
  const filt = ctx.createBiquadFilter();
  const g = ctx.createGain();
  filt.type = 'bandpass';
  filt.frequency.setValueAtTime(300, ctx.currentTime);
  filt.frequency.linearRampToValueAtTime(3200, ctx.currentTime + dur);
  filt.Q.value = 2;
  g.gain.value = 0.18;
  src.buffer = buf;
  src.connect(filt); filt.connect(g); g.connect(dest);
  src.start();
}

class AudioEngine {
  ctx: AudioContext;
  master: GainNode;
  reverbWet: GainNode;
  dryBus: GainNode;
  reverb: ConvolverNode;
  compressor: DynamicsCompressorNode;

  private drones: OscillatorNode[] = [];
  private rhythmTimers: ReturnType<typeof setTimeout>[] = [];
  private melodyTimers: ReturnType<typeof setTimeout>[] = [];
  private stopped = false;
  private pentas: number[];

  constructor() {
    this.ctx = new AudioContext();
    const ctx = this.ctx;

    // Master chain: dryBus → compressor → master → destination
    //               reverbWet → compressor
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -18;
    this.compressor.knee.value = 10;
    this.compressor.ratio.value = 4;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.2;
    this.dryBus = ctx.createGain();
    this.dryBus.gain.value = 0.85;
    this.reverb = makeReverb(ctx, 2.6, 2.8);
    this.reverbWet = ctx.createGain();
    this.reverbWet.gain.value = 0.38;

    this.dryBus.connect(this.compressor);
    this.dryBus.connect(this.reverb);
    this.reverb.connect(this.reverbWet);
    this.reverbWet.connect(this.compressor);
    this.compressor.connect(this.master);
    this.master.connect(ctx.destination);

    // Root: D3 (146.83 Hz) — warm, government-dignified register
    const root = 146.83;
    this.pentas = pentatonic(root);

    this._startDrone(root);
    this._scheduleRhythm();
    this._scheduleMelody();
    this._schedulePads(root);

    // Fade in over 1.5s
    this.master.gain.setValueAtTime(0, ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(0.82, ctx.currentTime + 1.5);
  }

  /** Tanpura-like drone — root + fifth + octave with subtle beating */
  private _startDrone(root: number) {
    const ctx = this.ctx;
    const dest = this.dryBus;
    const fifth = root * 1.5;
    const oct = root * 2;

    const pairs: [number, OscillatorType, number, number][] = [
      [root,       'sine',     0.09, 0],
      [root,       'sine',     0.06, +4],   // beating
      [root * 0.5, 'sine',     0.05, 0],    // sub-octave warmth
      [fifth,      'sine',     0.07, 0],
      [fifth,      'triangle', 0.03, -3],   // chorus
      [oct,        'sine',     0.04, 0],
      [oct * 2,    'sine',     0.018, 0],   // air
    ];

    this.drones = pairs.map(([f, t, g, d]) => osc(ctx, f, t, g, dest, d));
  }

  /** Tabla-like rhythmic pattern — 16-beat taal at ~82 bpm */
  private _scheduleRhythm() {
    if (this.stopped) return;
    const ctx = this.ctx;
    const dest = this.dryBus;
    const bpm = 82;
    const beat = 60 / bpm;
    const cycle = beat * 16; // 16-beat taal

    // Pattern: 1 = dha (bass), 2 = thi (mid), 3 = na (high), 0 = rest
    const pattern = [1, 0, 2, 3, 1, 0, 2, 0, 1, 3, 2, 0, 1, 0, 3, 2];
    const freqs = { 1: 90, 2: 220, 3: 560 };
    const gains = { 1: 0.55, 2: 0.28, 3: 0.18 };

    const now = ctx.currentTime;
    pattern.forEach((hit, i) => {
      if (hit === 0) return;
      const t = now + i * beat;
      const f = freqs[hit as 1 | 2 | 3];
      const g = gains[hit as 1 | 2 | 3];
      playPercussionHit(ctx, dest, f, g, t);
      // Soft dha gets a sub hit too
      if (hit === 1) playPercussionHit(ctx, dest, 55, 0.22, t);
    });

    const id = setTimeout(() => this._scheduleRhythm(), cycle * 1000 - 80);
    this.rhythmTimers.push(id);
  }

  /** Pentatonic melody motif — arpeggiated, sitar-like plucks */
  private _scheduleMelody() {
    if (this.stopped) return;
    const ctx = this.ctx;
    const dest = this.dryBus;
    const bpm = 82;
    const beat = 60 / bpm;

    // A 8-note motif cycling through the pentatonic scale
    const motif = [4, 6, 5, 7, 4, 3, 5, 4]; // indices into this.pentas
    const timing = [0, 1, 2, 3, 4.5, 5.5, 6.5, 8]; // in beats from now

    const now = ctx.currentTime;
    timing.forEach((b, i) => {
      const idx = motif[i] ?? 4;
      const freq = this.pentas[Math.min(idx, this.pentas.length - 1)];
      playPluck(ctx, dest, freq, 0.22, now + b * beat);
    });

    // Cycle every 10 beats, offset so rhythm & melody create polyrhythm interest
    const cycleMs = beat * 10 * 1000;
    const id = setTimeout(() => this._scheduleMelody(), cycleMs - 60);
    this.melodyTimers.push(id);
  }

  /** Slow chord pads that wash in and out */
  private _schedulePads(root: number) {
    if (this.stopped) return;
    const ctx = this.ctx;
    const dest = this.reverbWet;

    // Two alternating chord voicings (Sa-Ma-Pa and Sa-Ga-Ni)
    const chords = [
      [root, root * 1.25, root * 1.5],       // major triad
      [root, root * 1.125, root * 1.6875],   // sus2-ish
    ];

    let t = ctx.currentTime;
    for (let pass = 0; pass < 4; pass++) {
      const chord = chords[pass % 2];
      const dur = 7.0;
      chord.forEach((f, ci) => {
        playPad(ctx, dest, f, 0.055 - ci * 0.01, t, dur);
        playPad(ctx, dest, f * 2, 0.022 - ci * 0.004, t + 0.3, dur);
      });
      t += 6.5;
    }

    // Re-schedule next batch
    const id = setTimeout(() => this._schedulePads(root), 4 * 6.5 * 1000 - 200);
    this.melodyTimers.push(id);
  }

  sceneTransition() {
    if (this.stopped || this.ctx.state !== 'running') return;
    playWhoosh(this.ctx, this.dryBus);
  }

  setMuted(muted: boolean) {
    const ctx = this.ctx;
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(
      muted ? 0 : 0.82,
      ctx.currentTime + 0.4
    );
  }

  resume() {
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  destroy() {
    this.stopped = true;
    [...this.rhythmTimers, ...this.melodyTimers].forEach(t => clearTimeout(t));
    this.drones.forEach(d => { try { d.stop(); } catch {} });
    try { this.ctx.close(); } catch {}
  }
}

// ─────────────────────────────────────────────
//  COMPONENTS
// ─────────────────────────────────────────────

interface ControlBarProps {
  visible: boolean;
  collapsed: boolean;
  locked: boolean;
  muted: boolean;
  sceneKeys: string[];
  activeIndex: number;
  activeDuration: number;
  tick: number;
  onToggleLock: () => void;
  onJumpTo: (index: number) => void;
  onToggleCollapsed: () => void;
  onToggleMute: () => void;
}

function ProgressSegments({
  sceneKeys, activeIndex, activeDuration, tick, onJumpTo,
}: {
  sceneKeys: string[];
  activeIndex: number;
  activeDuration: number;
  tick: number;
  onJumpTo: (index: number) => void;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const start = performance.now();
    const id = window.setInterval(() => setElapsed(performance.now() - start), PROGRESS_TICK_MS);
    return () => window.clearInterval(id);
  }, [tick]);

  const progress = activeDuration > 0 ? Math.min(1, elapsed / activeDuration) : 0;

  return (
    <div className="flex-1 flex items-center gap-1.5">
      {sceneKeys.map((key, i) => {
        const isActive = i === activeIndex;
        const fill = isActive ? progress * 100 : 0;
        return (
          <button
            key={key}
            onClick={() => onJumpTo(i)}
            className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:h-4 hover:bg-white/25 transition-all relative min-h-[12px]"
            aria-label={`Jump to scene ${i + 1}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <div
              className="absolute inset-y-0 left-0 bg-white/90 rounded-full transition-[width] duration-100"
              style={{ width: `${fill}%` }}
            />
          </button>
        );
      })}
    </div>
  );
}

function ControlBar({
  visible, collapsed, locked, muted, sceneKeys, activeIndex, activeDuration,
  tick, onToggleLock, onJumpTo, onToggleCollapsed, onToggleMute,
}: ControlBarProps) {
  return (
    <div
      className={`flex items-center gap-3 bg-black/50 backdrop-blur-sm px-5 py-4 transition-all duration-200 ease-out ${
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-full opacity-0 pointer-events-none'
      }`}
      aria-hidden={!visible}
    >
      <button
        onClick={onToggleLock}
        className={`w-14 h-14 flex items-center justify-center transition-colors rounded-lg shrink-0 ${
          locked
            ? 'text-white bg-white/15 hover:bg-white/25'
            : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
        title={locked ? 'Loop: on' : 'Loop: off'}
        aria-label={locked ? 'Loop: on' : 'Loop: off'}
        aria-pressed={locked}
      >
        <Repeat className="w-8 h-8" />
      </button>

      <div className="w-px self-stretch bg-white/15" aria-hidden="true" />

      <ProgressSegments
        sceneKeys={sceneKeys}
        activeIndex={activeIndex}
        activeDuration={activeDuration}
        tick={tick}
        onJumpTo={onJumpTo}
      />

      <div className="text-xl text-white/60 font-mono tabular-nums shrink-0">
        {activeIndex + 1}/{sceneKeys.length}
      </div>

      <button
        onClick={onToggleMute}
        className={`w-14 h-14 flex items-center justify-center transition-colors rounded-lg shrink-0 ${
          muted
            ? 'text-white/40 hover:text-white hover:bg-white/10'
            : 'text-white bg-white/15 hover:bg-white/25'
        }`}
        title={muted ? 'Unmute' : 'Mute'}
        aria-label={muted ? 'Unmute' : 'Mute'}
        aria-pressed={!muted}
      >
        {muted ? <VolumeX className="w-7 h-7" /> : <Volume2 className="w-7 h-7" />}
      </button>

      <button
        onClick={onToggleCollapsed}
        className="w-14 h-14 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors rounded-lg shrink-0"
        title={collapsed ? 'Show controls' : 'Hide controls'}
        aria-label={collapsed ? 'Show controls' : 'Hide controls'}
        aria-expanded={!collapsed}
      >
        {collapsed ? <ChevronUp className="w-10 h-10" /> : <ChevronDown className="w-10 h-10" />}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN EXPORT
// ─────────────────────────────────────────────

export default function VideoWithControls() {
  const isIframed = typeof window !== 'undefined' && window.self !== window.top;

  const {
    sceneKeys, activeIndex, locked, mountKey, tick,
    durations, activeDuration, onSceneChange, jumpTo, toggleLock,
  } = useSceneControls(SCENE_DURATIONS);

  const sensorRef = useRef<HTMLDivElement | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tapPinned, setTapPinned] = useState(false);
  const [muted, setMuted] = useState(false);

  const engineRef = useRef<AudioEngine | null>(null);
  const startedRef = useRef(false);
  const prevSceneRef = useRef(activeIndex);

  const initAudio = useCallback(() => {
    if (startedRef.current) {
      engineRef.current?.resume();
      return;
    }
    startedRef.current = true;
    try {
      engineRef.current = new AudioEngine();
    } catch (e) {
      console.warn('AudioEngine failed to start', e);
    }
  }, []);

  // Scene-change whoosh
  useEffect(() => {
    if (prevSceneRef.current !== activeIndex) {
      prevSceneRef.current = activeIndex;
      engineRef.current?.sceneTransition();
    }
  }, [activeIndex]);

  // Sync mute
  useEffect(() => {
    engineRef.current?.setMuted(muted);
  }, [muted]);

  // Cleanup
  useEffect(() => () => { engineRef.current?.destroy(); }, []);

  const handlePointerEnter = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') setHovering(true);
  }, []);
  const handlePointerLeave = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') setHovering(false);
  }, []);
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    initAudio();
    if (e.pointerType === 'mouse') return;
    if (collapsed) setTapPinned(true);
  }, [collapsed, initAudio]);

  const handleToggleCollapsed = useCallback(() => {
    setCollapsed(c => {
      if (!c) { setHovering(false); setTapPinned(false); }
      return !c;
    });
  }, []);

  const handleToggleMute = useCallback(() => {
    initAudio();
    setMuted(m => !m);
  }, [initAudio]);

  useEffect(() => {
    if (!(collapsed && tapPinned)) return;
    const onDocPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      if (sensorRef.current && !sensorRef.current.contains(e.target as Node))
        setTapPinned(false);
    };
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, [collapsed, tapPinned]);

  const barVisible = !collapsed || hovering || tapPinned;

  if (!isIframed) return <VideoTemplate />;

  return (
    <div
      className="relative w-full h-screen cursor-pointer"
      onClick={initAudio}
    >
      <VideoTemplate
        key={mountKey}
        durations={durations}
        loop
        onSceneChange={onSceneChange}
      />
      <div
        ref={sensorRef}
        className="absolute bottom-0 left-0 right-0 z-50 flex flex-col justify-end"
        style={{ height: '25%' }}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
      >
        <div className="flex-1 w-full" aria-hidden="true" />
        <ControlBar
          visible={barVisible}
          collapsed={collapsed}
          locked={locked}
          muted={muted}
          sceneKeys={sceneKeys}
          activeIndex={activeIndex}
          activeDuration={activeDuration}
          tick={tick}
          onToggleLock={toggleLock}
          onJumpTo={jumpTo}
          onToggleCollapsed={handleToggleCollapsed}
          onToggleMute={handleToggleMute}
        />
      </div>
    </div>
  );
}
