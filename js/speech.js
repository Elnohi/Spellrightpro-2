const synth = window.speechSynthesis;
let currentAccent = "en-GB";

export function setAccent(accent) {
  currentAccent = accent;
}

export function speak(text, rate = 0.9) {
  synth.cancel();
  
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentAccent;
    utterance.rate = rate;
    utterance.volume = 1;
    
    utterance.onend = resolve;
    
    const voices = synth.getVoices();
    const accentVoice = voices.find(voice => voice.lang === currentAccent) || voices[0];
    if (accentVoice) {
      utterance.voice = accentVoice;
    }
    
    synth.speak(utterance);
  });
}

export function getVoices() {
  return new Promise((resolve) => {
    const voices = synth.getVoices();
    if (voices.length) {
      resolve(voices);
    } else {
      synth.onvoiceschanged = () => {
        resolve(synth.getVoices());
      };
    }
  });
}
