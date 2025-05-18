class TextToSpeechService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private initialized: boolean = false;

  constructor() {
    this.synth = window.speechSynthesis;
    this.initVoices();
  }

  private async initVoices() {
    // Wait for voices to be loaded
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
        this.initialized = true;
      };
    }
    // For browsers that load voices synchronously
    this.voices = this.synth.getVoices();
    this.initialized = true;
  }

  private getPreferredVoice(): SpeechSynthesisVoice | null {
    if (!this.initialized) {
      this.voices = this.synth.getVoices();
    }
    
    // Try to find an English voice, preferring US English
    return (
      this.voices.find(voice => voice.lang === 'en-US') ||
      this.voices.find(voice => voice.lang.startsWith('en')) ||
      this.voices[0]
    );
  }
  async speak(text: string, language: string = 'en-US') {
    return new Promise<void>((resolve, reject) => {
      try {
        if (!this.synth || !window.speechSynthesis) {
          console.warn('Speech synthesis not supported');
          resolve(); // Resolve silently instead of rejecting
          return;
        }

        // Cancel any ongoing speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const preferredVoice = this.getPreferredVoice();
        
        // Only set voice if we found one to avoid potential errors
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.rate = 0.9; // Slightly slower for children
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.lang = language; // Ensure language is set even if no specific voice

        utterance.onend = () => {
          resolve();
        };

        utterance.onerror = (event) => {
          console.warn('Speech synthesis error:', event);
          resolve(); // Resolve instead of reject to prevent app disruption
        };

        // Add safety timeout in case speech synthesis hangs
        const timeoutId = setTimeout(() => {
          this.synth.cancel();
          resolve();
        }, 5000);

        utterance.onend = () => {
          clearTimeout(timeoutId);
          resolve();
        };

        this.synth.speak(utterance);
      } catch (error) {
        console.warn('Speech synthesis error:', error);
        resolve(); // Resolve instead of reject to prevent app disruption
      }
    });
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const textToSpeechService = new TextToSpeechService();