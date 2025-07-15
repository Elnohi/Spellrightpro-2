import { db } from './firebase-config.js';
import { trackEvent, trackError } from './analytics.js';
import { showNotification } from './app.js';
import { speak } from './speech.js';

let oetWords = [];
let customWords = [];
let currentWords = [];
let currentWordIndex = 0;
let correctCount = 0;
let flaggedWords = [];
let incorrectWords = [];
let previousWords = [];
let mode = "";
let currentListType = "";
const storageKey = "spellrightpro-progress";

export function initWordManager(words) {
  oetWords = words || [];
}

export function startPractice() {
  if (currentListType === "oet") {
    currentWords = [...oetWords];
  }
  
  if (!currentWords.length) {
    trackEvent('practice_attempt', {
      status: 'failed',
      reason: 'no_words_loaded'
    });
    return showNotification("Please load words first", "error");
  }
  
  mode = "practice";
  trackEvent('practice_start', {
    word_count: currentWords.length,
    list_type: currentListType
  });
  
  const progress = JSON.parse(localStorage.getItem(storageKey));
  if (progress && progress.words.join() === currentWords.join() && progress.listType === currentListType) {
    if (confirm("Found previous progress. Do you want to resume where you left off?")) {
      currentWordIndex = progress.currentWordIndex;
      correctCount = progress.correctCount;
      flaggedWords = progress.flaggedWords;
      incorrectWords = progress.incorrectWords;
      previousWords = progress.previousWords;
      presentWord();
      trackEvent('practice_resumed', {
        progress_index: currentWordIndex,
        correct_count: correctCount
      });
      return;
    }
  }
  resetSession();
  presentWord();
}

// ... (other word management functions)

function resetSession() {
  currentWordIndex = 0;
  correctCount = 0;
  flaggedWords = [];
  incorrectWords = [];
  previousWords = [];
  document.getElementById("scoreDisplay").innerHTML = "";
}

function saveProgress() {
  if (mode === "practice") {
    localStorage.setItem(storageKey, JSON.stringify({ 
      words: currentWords,
      listType: currentListType,
      currentWordIndex, 
      correctCount, 
      flaggedWords, 
      incorrectWords, 
      previousWords 
    }));
  }
}

// ... (remaining word management functions)
window.addCustomWords = addCustomWords;
window.saveWordList = saveWordList;
window.loadWordList = loadWordList;
window.clearWordList = clearWordList;

