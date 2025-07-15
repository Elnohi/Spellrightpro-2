class WordManager {
  constructor() {
    this.words = [];
    this.currentWordIndex = 0;
    this.correctCount = 0;
    this.incorrectWords = [];
    this.loadDefaultWords();
  }

  loadDefaultWords() {
    // Load from oet_word_list.js or default_words.json
    this.words = typeof OET_WORD_LIST !== 'undefined' ? 
      [...OET_WORD_LIST] : 
      this.loadLocalWords();
  }

  loadLocalWords() {
    try {
      const savedWords = localStorage.getItem('spellright_words');
      return savedWords ? JSON.parse(savedWords) : [];
    } catch (e) {
      console.error('Error loading words:', e);
      return [];
    }
  }

  addWords(newWords) {
    const wordsArray = Array.isArray(newWords) ? newWords : newWords.split('\n');
    this.words = [...new Set([...this.words, ...wordsArray.filter(w => w.trim())])];
    this.saveWords();
  }

  saveWords() {
    localStorage.setItem('spellright_words', JSON.stringify(this.words));
  }

  getNextWord() {
    if (this.currentWordIndex >= this.words.length) {
      this.currentWordIndex = 0;
      // Shuffle array for variety
      this.words = [...this.words].sort(() => Math.random() - 0.5);
    }
    return this.words[this.currentWordIndex++];
  }

  // ... other word management methods ...
}

window.wordManager = new WordManager();
