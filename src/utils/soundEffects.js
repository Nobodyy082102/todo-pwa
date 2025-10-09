// Sound Effects using Web Audio API
// Leggero, nessun file esterno necessario!

class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.enabled = true;

    // Initialize on first user interaction to comply with browser policies
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Task completato - nota ascendente soddisfacente
  playTaskComplete() {
    if (!this.enabled) return;
    this.init();

    const now = this.audioContext?.currentTime || 0;

    // Prima nota
    this.playTone(523.25, 0.1, 'sine', 0.2); // C5

    // Seconda nota (dopo un po')
    setTimeout(() => {
      this.playTone(659.25, 0.15, 'sine', 0.25); // E5
    }, 80);

    // Terza nota finale
    setTimeout(() => {
      this.playTone(783.99, 0.2, 'sine', 0.3); // G5
    }, 160);
  }

  // Level Up - fanfara epica!
  playLevelUp() {
    if (!this.enabled) return;
    this.init();

    const notes = [
      { freq: 523.25, delay: 0 },    // C5
      { freq: 659.25, delay: 100 },  // E5
      { freq: 783.99, delay: 200 },  // G5
      { freq: 1046.50, delay: 300 }, // C6
    ];

    notes.forEach(note => {
      setTimeout(() => {
        this.playTone(note.freq, 0.3, 'triangle', 0.35);
      }, note.delay);
    });
  }

  // Achievement unlocked - campanellino magico
  playAchievement() {
    if (!this.enabled) return;
    this.init();

    // Sequenza di note brillanti
    const notes = [
      { freq: 1318.51, delay: 0 },   // E6
      { freq: 1567.98, delay: 50 },  // G6
      { freq: 2093.00, delay: 100 }, // C7
    ];

    notes.forEach(note => {
      setTimeout(() => {
        this.playTone(note.freq, 0.15, 'sine', 0.2);
      }, note.delay);
    });
  }

  // Click leggero
  playClick() {
    if (!this.enabled) return;
    this.init();

    this.playTone(800, 0.05, 'sine', 0.1);
  }

  // Snooze - nota discendente
  playSnooze() {
    if (!this.enabled) return;
    this.init();

    this.playTone(440, 0.1, 'sine', 0.15); // A4
    setTimeout(() => {
      this.playTone(349.23, 0.15, 'sine', 0.15); // F4
    }, 80);
  }

  // Delete - suono basso
  playDelete() {
    if (!this.enabled) return;
    this.init();

    this.playTone(200, 0.15, 'sawtooth', 0.15);
  }

  // Hover - tick sottile
  playHover() {
    if (!this.enabled) return;
    this.init();

    this.playTone(1200, 0.03, 'sine', 0.08);
  }
}

// Singleton instance
export const soundEffects = new SoundEffects();
