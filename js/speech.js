class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.currentVoice = null;
    this.loadVoices();
  }

  loadVoices() {
    this.voices = this.synth.getVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
    }
  }

  speak(text, lang = 'en-GB') {
    return new Promise((resolve) => {
      this.synth.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      
      // Find appropriate voice
      const voice = this.voices.find(v => v.lang === lang) || this.voices[0];
      if (voice) utterance.voice = voice;
      
      utterance.onend = resolve;
      this.synth.speak(utterance);
    });
  }
}

window.speechService = new SpeechService();
