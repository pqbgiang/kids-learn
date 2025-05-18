import { Howl } from 'howler';

class SoundManager {
  private sounds: Map<string, Howl> = new Map();

  constructor() {
    // Preload common sound effects
    this.preloadSounds();
  }

  private preloadSounds() {
    const commonSounds = {
      click: '/sounds/click.mp3',
      complete: '/sounds/complete.mp3',
      correct: '/sounds/correct.mp3',
      wrong: '/sounds/wrong.mp3',
      choice: '/sounds/choice.mp3',
      navigate: '/sounds/navigate.mp3'
    };

    Object.entries(commonSounds).forEach(([id, src]) => {
      this.loadSound(id, src);
    });
  }

  loadSound(id: string, src: string): void {
    const sound = new Howl({
      src: [src],
      html5: true,
      preload: true,
    });
    this.sounds.set(id, sound);
  }

  play(id: string): void {
    const sound = this.sounds.get(id);
    if (sound) {
      sound.play();
    }
  }

  stop(id: string): void {
    const sound = this.sounds.get(id);
    if (sound) {
      sound.stop();
    }
  }

  setVolume(id: string, volume: number): void {
    const sound = this.sounds.get(id);
    if (sound) {
      sound.volume(volume);
    }
  }

  fadeOut(id: string, duration: number = 1000): void {
    const sound = this.sounds.get(id);
    if (sound) {
      sound.fade(sound.volume(), 0, duration);
    }
  }

  isPlaying(id: string): boolean {
    const sound = this.sounds.get(id);
    return sound ? sound.playing() : false;
  }
}

export const soundManager = new SoundManager();