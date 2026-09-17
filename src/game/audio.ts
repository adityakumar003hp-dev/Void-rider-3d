/**
 * Procedural Web Audio API sound generator for Void-Rider 3D.
 * Clean, lightweight, reliable, zero external assets required.
 */
class SoundSystem {
  private ctx: AudioContext | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private boostOsc: OscillatorNode | null = null;
  private boostGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private musicInterval: any = null;

  public sfxEnabled: boolean = true;
  public musicEnabled: boolean = true;
  public volume: number = 0.7;
  public sfxVolume: number = 0.7;
  public musicVolume: number = 0.5;
  public isMuted: boolean = false;

  public setSFXVolume(val: number) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    this.volume = this.sfxVolume;
  }

  public setMusicVolume(val: number) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicEnabled && !this.isMuted ? 0.12 * this.musicVolume : 0, this.ctx.currentTime);
    }
  }

  public toggleMute(muted: boolean) {
    this.isMuted = muted;
    this.sfxEnabled = !muted;
    this.musicEnabled = !muted;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicEnabled && !this.isMuted ? 0.12 * this.musicVolume : 0, this.ctx.currentTime);
    }
  }

  public playCountdownTick() {
    this.playCountdown(false);
  }

  public playCountdownGo() {
    this.playCountdown(true);
  }

  // Active countdown state and cancellation handles
  private countdownTimeouts: any[] = [];
  public isCountdownActive: boolean = false;
  private activeCountdownNodes: { stop: () => void }[] = [];

  /**
   * Cancel and immediately silence the 3-2-1-GO voice-over sequence
   * if the race is cancelled, aborted, paused, or restarted.
   */
  public cancelCountdownSequence() {
    this.isCountdownActive = false;

    // Clear all scheduled timeouts
    if (this.countdownTimeouts.length > 0) {
      this.countdownTimeouts.forEach(t => clearTimeout(t));
      this.countdownTimeouts = [];
    }

    // Immediately stop any active Web Speech synthesis utterances
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {
      // Ignore speech cancel exceptions
    }

    // Immediately stop any active procedural oscillator nodes
    for (const node of this.activeCountdownNodes) {
      try {
        node.stop();
      } catch {}
    }
    this.activeCountdownNodes = [];
  }

  public stopCountdown() {
    this.cancelCountdownSequence();
  }

  /**
   * Procedural vocal formant synthesizer fallback creating a gritty,
   * high-energy cybernetic voice for "THREE", "TWO", "ONE", "GO!".
   */
  private playCyberVoiceFormant(word: 'THREE' | 'TWO' | 'ONE' | 'GO', durationMs: number = 420) {
    if (!this.ctx || !this.sfxEnabled) return;
    try {
      const now = this.ctx.currentTime;
      const dur = durationMs / 1000;

      // Vocal tract carrier (sawtooth wave with pitch micro-vibrato)
      const carrier = this.ctx.createOscillator();
      carrier.type = 'sawtooth';

      const baseFreq = word === 'THREE' ? 175 : word === 'TWO' ? 190 : word === 'ONE' ? 210 : 255;
      carrier.frequency.setValueAtTime(baseFreq, now);
      carrier.frequency.exponentialRampToValueAtTime(
        word === 'GO' ? baseFreq * 1.35 : baseFreq * 0.95,
        now + dur
      );

      // Formant filters F1 and F2 to shape vowels
      let f1Freq = 600;
      let f2Freq = 1400;
      if (word === 'THREE') {
        f1Freq = 300;
        f2Freq = 2200;
      } else if (word === 'TWO') {
        f1Freq = 380;
        f2Freq = 950;
      } else if (word === 'ONE') {
        f1Freq = 580;
        f2Freq = 1150;
      } else if (word === 'GO') {
        f1Freq = 520;
        f2Freq = 900;
      }

      const f1 = this.ctx.createBiquadFilter();
      f1.type = 'bandpass';
      f1.frequency.setValueAtTime(f1Freq, now);
      f1.Q.setValueAtTime(6.0, now);

      const f2 = this.ctx.createBiquadFilter();
      f2.type = 'bandpass';
      f2.frequency.setValueAtTime(f2Freq, now);
      f2.Q.setValueAtTime(7.5, now);

      const voiceGain = this.ctx.createGain();
      const peakVol = (word === 'GO' ? 0.32 : 0.22) * this.volume;
      voiceGain.gain.setValueAtTime(0.001, now);
      voiceGain.gain.linearRampToValueAtTime(peakVol, now + 0.04);
      voiceGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      carrier.connect(f1);
      carrier.connect(f2);
      f1.connect(voiceGain);
      f2.connect(voiceGain);
      voiceGain.connect(this.ctx.destination);

      carrier.start(now);
      carrier.stop(now + dur + 0.05);

      const stopHandle = {
        stop: () => {
          try {
            voiceGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
            carrier.stop();
            carrier.disconnect();
          } catch {}
        },
      };
      this.activeCountdownNodes.push(stopHandle);
      setTimeout(() => {
        const idx = this.activeCountdownNodes.indexOf(stopHandle);
        if (idx !== -1) this.activeCountdownNodes.splice(idx, 1);
      }, durationMs + 80);
    } catch {
      // Fallback
    }
  }

  /**
   * Plays a single high-energy countdown step (3, 2, 1, or 0 / GO)
   * with robotic cyber-announcer vocalization and punchy synth chords.
   */
  public playCountdownStep(count: number) {
    this.initContext();
    if (!this.sfxEnabled) return;

    const isGo = count <= 0;
    const word = count === 3 ? 'THREE' : count === 2 ? 'TWO' : count === 1 ? 'ONE' : 'GO';

    // 1. Web Speech API Announcer (high-energy, crisp delivery)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const text = isGo ? 'GO!' : `${count}!`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = isGo ? 1.35 : 1.25;
        utterance.pitch = count === 3 ? 1.15 : count === 2 ? 1.28 : count === 1 ? 1.38 : 1.55;
        utterance.volume = Math.min(1.0, 0.9 * this.volume);

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          v =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('Daniel') ||
              v.name.includes('Karen'))
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.debug('Speech synthesis fallback:', err);
      }
    }

    // 2. Procedural cyber voice formant backing
    this.playCyberVoiceFormant(word, isGo ? 650 : 380);

    // 3. High-energy musical countdown synth riser and bass drop
    if (this.ctx) {
      try {
        const now = this.ctx.currentTime;

        // Punchy sub-bass transient
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';

        const startSub = isGo ? 120 : 65 + (3 - count) * 15;
        const endSub = isGo ? 36 : 40;
        subOsc.frequency.setValueAtTime(startSub, now);
        subOsc.frequency.exponentialRampToValueAtTime(endSub, now + (isGo ? 0.6 : 0.28));

        const subVol = (isGo ? 0.35 : 0.22) * this.volume;
        subGain.gain.setValueAtTime(subVol, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + (isGo ? 0.65 : 0.3));

        subOsc.connect(subGain);
        subGain.connect(this.ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + (isGo ? 0.7 : 0.32));

        // Melodic tension chords (E -> G -> B -> E hyper blast)
        const rootFreq = count === 3 ? 440 : count === 2 ? 554.37 : count === 1 ? 659.25 : 880;
        const harmonies = isGo ? [880, 1320, 1760, 2640] : [rootFreq, rootFreq * 1.5];

        harmonies.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = isGo ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          if (isGo) {
            osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.35);
          }

          const vol = ((isGo ? 0.14 : 0.1) / (idx + 1)) * this.volume;
          gain.gain.setValueAtTime(vol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + (isGo ? 0.8 : 0.35));

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + (isGo ? 0.85 : 0.38));

          const stopHandle = {
            stop: () => {
              try {
                gain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
                osc.stop();
                osc.disconnect();
              } catch {}
            },
          };
          this.activeCountdownNodes.push(stopHandle);
          setTimeout(() => {
            const i = this.activeCountdownNodes.indexOf(stopHandle);
            if (i !== -1) this.activeCountdownNodes.splice(i, 1);
          }, 900);
        });
      } catch {
        // Fallback
      }
    }
  }

  /**
   * Starts a high-energy distinct 3-2-1-GO countdown sequence
   * with callbacks for each tick and completion.
   * Cancels any currently running countdown first to avoid overlapping.
   */
  public startCountdownSequence(options?: {
    onTick?: (count: number) => void;
    onGo?: () => void;
    onComplete?: () => void;
  }) {
    this.cancelCountdownSequence();
    this.isCountdownActive = true;

    const steps = [3, 2, 1, 0];
    steps.forEach((step, idx) => {
      const delay = idx * 1000;
      const t = setTimeout(() => {
        if (!this.isCountdownActive) return;

        this.playCountdownStep(step);
        options?.onTick?.(step);

        if (step === 0) {
          options?.onGo?.();
          setTimeout(() => {
            if (this.isCountdownActive) {
              this.isCountdownActive = false;
              options?.onComplete?.();
            }
          }, 1200);
        }
      }, delay);
      this.countdownTimeouts.push(t);
    });
  }

  public playUpgradePurchase() {
    this.playUpgradeUnlock();
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public startEngine() {
    this.initContext();
    if (!this.ctx || this.engineOsc) return;

    try {
      this.engineOsc = this.ctx.createOscillator();
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(65, this.ctx.currentTime);

      this.engineFilter = this.ctx.createBiquadFilter();
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(280, this.ctx.currentTime);

      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(this.sfxEnabled ? 0.08 * this.volume : 0, this.ctx.currentTime);

      this.engineOsc.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);

      this.engineOsc.start();

      // Boost noise/hum
      this.boostOsc = this.ctx.createOscillator();
      this.boostOsc.type = 'sine';
      this.boostOsc.frequency.setValueAtTime(240, this.ctx.currentTime);

      this.boostGain = this.ctx.createGain();
      this.boostGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.boostOsc.connect(this.boostGain);
      this.boostGain.connect(this.ctx.destination);

      this.boostOsc.start();
    } catch (e) {
      console.warn('Audio start engine err:', e);
    }
  }

  public updateEngine(speedNorm: number, isBoosting: boolean) {
    if (!this.ctx || !this.engineOsc || !this.engineFilter || !this.engineGain) return;
    const now = this.ctx.currentTime;
    
    // Pitch scales with normalized speed (0.0 to 1.5+)
    const targetFreq = 70 + speedNorm * 180 + (isBoosting ? 90 : 0);
    this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.05);

    const filterFreq = 300 + speedNorm * 800 + (isBoosting ? 600 : 0);
    this.engineFilter.frequency.setTargetAtTime(filterFreq, now, 0.05);

    const targetGain = this.sfxEnabled ? (0.05 + speedNorm * 0.12) * this.volume : 0;
    this.engineGain.gain.setTargetAtTime(targetGain, now, 0.05);

    if (this.boostGain && this.boostOsc) {
      const boostTarget = (this.sfxEnabled && isBoosting) ? 0.18 * this.volume : 0;
      this.boostGain.gain.setTargetAtTime(boostTarget, now, 0.05);
      if (isBoosting) {
        this.boostOsc.frequency.setTargetAtTime(360 + Math.sin(now * 25) * 40, now, 0.03);
      }
    }
  }

  public stopEngine() {
    if (this.engineOsc) {
      try { this.engineOsc.stop(); } catch (_) {}
      this.engineOsc.disconnect();
      this.engineOsc = null;
    }
    if (this.boostOsc) {
      try { this.boostOsc.stop(); } catch (_) {}
      this.boostOsc.disconnect();
      this.boostOsc = null;
    }
  }

  public playCountdown(isGo: boolean = false) {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isGo ? 'triangle' : 'sine';
    const freq = isGo ? 880 : 440; // A5 for GO, A4 for 3,2,1
    osc.frequency.setValueAtTime(freq, now);

    if (isGo) {
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.3);
    }

    gain.gain.setValueAtTime(0.25 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isGo ? 0.6 : 0.25));

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + (isGo ? 0.65 : 0.3));
  }

  public playCountdownBeep(isFinal: boolean = false) {
    this.playCountdown(isFinal);
  }

  public playMenuClick() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.04);

      gain.gain.setValueAtTime(0.08 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // fallback
    }
  }

  public playCheckpoint() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    // Harmonious dual chime (E5 + B5)
    [659.25, 987.77].forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.04);
      gain.gain.setValueAtTime(0.18 * this.volume, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.04);
      osc.stop(now + 0.4);
    });
  }

  public playBoostPad() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.3);

    gain.gain.setValueAtTime(0.2 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.42);
  }

  public playCollision() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.15);

    gain.gain.setValueAtTime(0.22 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playAsteroidHit() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    // Heavy low punch and resonant metallic ring
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

    gain.gain.setValueAtTime(0.35 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  public playAlarmAlert() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(740, now);
    osc.frequency.setValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.18 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playGravityShift(isLowG: boolean) {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    if (isLowG) {
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.4);
    } else {
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.4);
    }

    gain.gain.setValueAtTime(0.24 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.46);
  }

  public playWormholeWarp() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    // Ascending hyperspace resonance chord
    [320, 480, 640, 960, 1280].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + i * 0.05 + 0.4);

      gain.gain.setValueAtTime(0.2 * this.volume, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.48);
    });
  }

  public playUpgradeUnlock() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.2 * this.volume, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.38);
    });
  }

  public playFinish() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    const chords = [523.25, 659.25, 783.99, 1046.5]; // C major fanfare
    chords.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.22 * this.volume, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.85);
    });
  }

  public playWhoosh() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.Q.setValueAtTime(3, now);

    gain.gain.setValueAtTime(0.18 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playCreditPickup() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    // Two-tone high crystal chime
    [1046.5, 1567.98].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.22 * this.volume, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.28);
    });
  }

  public playShieldActivate() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

    gain.gain.setValueAtTime(0.05 * this.volume, now);
    gain.gain.linearRampToValueAtTime(0.28 * this.volume, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.48);
  }

  public playShieldDeflect() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.2);

    gain.gain.setValueAtTime(0.3 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playMagnetPulse() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(660, now + 0.12);
    osc.frequency.linearRampToValueAtTime(440, now + 0.24);

    gain.gain.setValueAtTime(0.18 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  public playHyperBoost() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    [150, 300, 600].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 3.5, now + 0.4);

      gain.gain.setValueAtTime(0.2 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.58);
    });
  }

  public playNitroBoost() {
    this.playHyperBoost();
  }

  public playRepairCore() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.06);
      gain.gain.setValueAtTime(0.18 * this.volume, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.38);
    });
  }

  public playEMPPulse() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.45);
    gain.gain.setValueAtTime(0.3 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  public playTimeWarp() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    [300, 200, 150].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + idx * 0.1 + 0.4);
      gain.gain.setValueAtTime(0.2 * this.volume, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.52);
    });
  }

  public playGravityBurst() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(350, now + 0.2);
    osc.frequency.linearRampToValueAtTime(120, now + 0.4);
    gain.gain.setValueAtTime(0.25 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.46);
  }

  public playDecoySpawn() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.2);
    gain.gain.setValueAtTime(0.15 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playGameOver() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.8);

    gain.gain.setValueAtTime(0.3 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.95);
  }

  public playExplosion() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    // 1. Low frequency thump
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.6);
    oscGain.gain.setValueAtTime(0.45 * this.volume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.72);

    // 2. Filtered noise burst for explosion shockwave
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.8);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.7);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5 * this.volume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
    } catch (_) {}
  }

  public playRespawn() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    // Ascending cyber warp chime
    [261.63, 392.0, 523.25, 783.99, 1046.5].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.18 * this.volume, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.3);
    });
  }

  public playWrongWayAlert() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.setValueAtTime(440, now + 0.12);

    gain.gain.setValueAtTime(0.25 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playDriftMiniTurbo() {
    this.initContext();
    if (!this.ctx || !this.sfxEnabled) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.25);

    gain.gain.setValueAtTime(0.3 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  public startCosmicMusic() {
    this.initContext();
    if (!this.ctx || this.musicInterval) return;

    try {
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicEnabled ? 0.12 * this.volume : 0, this.ctx.currentTime);
      this.musicGain.connect(this.ctx.destination);

      // Space Synth Chord sequence (Cm, Ab, Eb, Bb)
      const scale = [
        [130.81, 196.00, 311.13, 392.00], // C3, G3, Eb4, G4
        [103.83, 207.65, 261.63, 329.63], // Ab2, Ab3, C4, E4
        [155.56, 233.08, 311.13, 466.16], // Eb3, Bb3, Eb4, Bb4
        [116.54, 233.08, 293.66, 349.23], // Bb2, Bb3, D4, F4
      ];
      let step = 0;

      this.musicInterval = setInterval(() => {
        if (!this.ctx || !this.musicEnabled || this.ctx.state !== 'running') return;
        const now = this.ctx.currentTime;
        const chord = scale[Math.floor(step / 4) % scale.length];
        const note = chord[step % chord.length];

        // Bass/lead arp note
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        osc.type = step % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(note, now);
        
        noteGain.gain.setValueAtTime(0.06 * this.volume, now);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(noteGain);
        noteGain.connect(this.musicGain!);

        osc.start(now);
        osc.stop(now + 0.3);

        step++;
      }, 160);
    } catch (e) {
      console.warn('Music error:', e);
    }
  }

  public stopCosmicMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const sound = new SoundSystem();
export const soundSystem = sound;
export const audioManager = sound;
export { SoundSystem as AudioManager };
