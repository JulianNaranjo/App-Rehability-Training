export class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  private async initAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  async playTileSelect(): Promise<void> {
    await this.initAudioContext();
    this.playTone(600, 0.1, 'sine');
  }

  async playTileDeselect(): Promise<void> {
    await this.initAudioContext();
    this.playTone(400, 0.1, 'sine');
  }

  async playCorrect(): Promise<void> {
    await this.initAudioContext();
    this.playTone(800, 0.2, 'sine');
    setTimeout(() => this.playTone(1000, 0.2, 'sine'), 100);
  }

  async playWrong(): Promise<void> {
    await this.initAudioContext();
    this.playTone(200, 0.3, 'sawtooth');
  }

  async playWin(): Promise<void> {
    await this.initAudioContext();
    const notes = [523, 659, 784, 1047]; // C, E, G, High C
    notes.forEach((note, index) => {
      setTimeout(() => this.playTone(note, 0.3, 'sine'), index * 150);
    });
  }

  async playLose(): Promise<void> {
    await this.initAudioContext();
    this.playTone(150, 0.5, 'sawtooth');
  }

  async playNewGame(): Promise<void> {
    await this.initAudioContext();
    const notes = [400, 500, 600];
    notes.forEach((note, index) => {
      setTimeout(() => this.playTone(note, 0.15, 'sine'), index * 100);
    });
  }
}

export const soundManager = new SoundManager();