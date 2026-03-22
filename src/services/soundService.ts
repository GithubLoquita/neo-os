const SOUNDS = {
  tap: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  launch: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  notification: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3',
  unlock: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  lock: 'https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3',
  camera: 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3',
};

class SoundService {
  private audioCache: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    // Preload sounds
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.audioCache.set(key, audio);
    });
  }

  play(soundName: keyof typeof SOUNDS) {
    const audio = this.audioCache.get(soundName);
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.3; // Keep it subtle
      audio.play().catch(err => console.warn('Audio playback failed:', err));
    }
  }
}

export const soundService = new SoundService();
