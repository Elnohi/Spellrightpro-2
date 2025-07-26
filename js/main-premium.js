// js/main-premium.js
import {
  showLoader, hideLoader,
  toggleFlagWord, isWordFlagged,
  getFlaggedWords, handlePracticeFlaggedWords,
  showAlert
} from './common.js';

let currentUser = null;
let examType = "OET";
let accent = "en-US";
let words = [];
let currentIndex = 0;
let sessionMode = "practice";
let score = 0;
let userAnswers = [];
let userAttempts = [];

const authArea = document.getElementById('auth-area');
const premiumApp = document.getElementById('premium-app');
const examUI = document.getElementById('exam-ui');
const trainerArea = document.getElementById('trainer-area');
const summaryArea = document.getElementById('summary-area');
const appTitle = document.getElementById('app-title');

// Firebase Auth integration
auth.onAuthStateChanged(user => {
  currentUser = user;
  renderAuth();
});

// AUTH UI & LOGIC
function renderAuth() {
  if (currentUser) {
    authArea.innerHTML = `
      <div style="text-align:right;">
        <span>Welcome, ${currentUser.email}</span>
        <button id="logout-btn" class="btn btn-secondary btn-sm">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    `;
    document.getElementById('logout-btn').onclick = () => {
      showLoader();
      auth.signOut().finally(hideLoader);
    };
    premiumApp.classList.remove('hidden');
    renderExamUI();
  } else {
    authArea.innerHTML = `
      <div class="auth-form">
        <input id="email" type="email" placeholder="Email" class="form-control">
        <input id="password" type="password" placeholder="Password" class="form-control">
        <button id="login-btn" class="btn btn-primary">
          <i class="fas fa-sign-in-alt"></i> Login
        </button>
        <button id="signup-btn" class="btn btn-outline">
          <i class="fas fa-user-plus"></i> Sign up
        </button>
        <div style="text-align:right; margin-top: 0.5rem;">
          <a href="#" id="forgot-password-link" style="font-size:0.96rem;">Forgot password?</a>
        </div>
      </div>
    `;
    document.getElementById('login-btn').onclick = () => {
      showLoader();
      auth.signInWithEmailAndPassword(
        document.getElementById('email').value,
        document.getElementById('password').value
      ).catch(e => { showAlert(e.message, 'error'); }).finally(hideLoader);
    };
    document.getElementById('signup-btn').onclick = () => {
      showLoader();
      auth.createUserWithEmailAndPassword(
        document.getElementById('email').value,
        document.getElementById('password').value
      ).catch(e => { showAlert(e.message, 'error'); }).finally(hideLoader);
    };
    document.getElementById('forgot-password-link').onclick = function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      if (!email) return showAlert("Enter your email first.");
      showLoader();
      auth.sendPasswordResetEmail(email)
        .then(() => showAlert("Password reset email sent! Check your inbox.", "success"))
        .catch(e => showAlert(e.message, "error"))
        .finally(hideLoader);
    };
    premiumApp.classList.add('hidden');
  }
}

// Exam UI render (mode selection, accent, exam type, start)
function renderExamUI() {
  examUI.innerHTML = `
    <div class="mode-selector">
      <button id="practice-mode-btn" class="mode-btn${sessionMode === 'practice' ? ' selected' : ''}">
        <i class="fas fa-graduation-cap"></i> Practice Mode
      </button>
      <button id="test-mode-btn" class="mode-btn${sessionMode === 'test' ? ' selected' : ''}">
        <i class="fas fa-clipboard-check"></i> Test Mode
      </button>
    </div>
    <div class="input-group">
      <select id="exam-type" class="form-control">
        <option value="OET">OET Spelling</option>
        <option value="Bee">Spelling Bee</option>
        <option value="Custom">Custom Words</option>
      </select>
      <select id="accent-select" class="form-control" style="max-width: 150px;">
        <option value="en-US">American English</option>
        <option value="en-GB">British English</option>
        <option value="en-AU">Australian English</option>
      </select>
      <span id="flag-svg" style="display: inline-flex; align-items: center;"></span>
    </div>
    <div id="custom-upload-area"></div>
    <button id="start-btn" class="btn btn-primary" style="margin-top: 15px;">
      <i class="fas fa-play"></i> Start Session
    </button>
  `;

  document.getElementById('practice-mode-btn').onclick = () => {
    sessionMode = "practice";
    renderExamUI();
  };
  document.getElementById('test-mode-btn').onclick = () => {
    sessionMode = "test";
    renderExamUI();
  };

  document.getElementById('exam-type').value = examType;
  document.getElementById('accent-select').value = accent;
  updateFlagSVG();

  document.getElementById('exam-type').onchange = e => {
    examType = e.target.value;
    renderExamUI();
  };
  document.getElementById('accent-select').onchange = e => {
    accent = e.target.value;
    updateFlagSVG();
  };
  document.getElementById('start-btn').onclick = () => {
    summaryArea.innerHTML = "";
    if (examType === "OET") {
      startOET();
    } else if (examType === "Bee") {
      startBee();
    } else if (examType === "Custom") {
      renderCustomInput();
    }
  };

  if (examType === "Custom") renderCustomInput();
}

function updateFlagSVG() {
  const flagSVGs = {
    "en-US": `<svg width="24" height="16" viewBox="0 0 60 40"><rect fill="#b22234" width="60" height="40"/><g fill="#fff"><rect y="4" width="60" height="4"/><rect y="12" width="60" height="4"/><rect y="20" width="60" height="4"/><rect y="28" width="60" height="4"/><rect y="36" width="60" height="4"/></g><rect width="24" height="16" fill="#3c3b6e"/><g fill="#fff"><g id="s18"><g id="s9"><polygon points="2.5,2.1 3.0,3.5 4.3,3.5 3.2,4.3 3.7,5.7 2.5,4.8 1.3,5.7 1.8,4.3 0.7,3.5 2.0,3.5"/></g><use href="#s9" x="6"/><use href="#s9" x="12"/><use href="#s9" x="18"/><use href="#s9" y="4"/><use href="#s9" x="6" y="4"/><use href="#s9" x="12" y="4"/><use href="#s9" x="18" y="4"/><use href="#s9" y="8"/><use href="#s9" x="6" y="8"/><use href="#s9" x="12" y="8"/><use href="#s9" x="18" y="8"/><use href="#s9" y="12"/><use href="#s9" x="6" y="12"/><use href="#s9" x="12" y="12"/><use href="#s9" x="18" y="12"/></g><use href="#s18" y="2"/></g></svg>`,
    "en-GB": `<svg width="24" height="16" viewBox="0 0 60 40"><rect fill="#00247d" width="60" height="40"/><path stroke="#fff" stroke-width="6" d="M0,0 L60,40 M60,0 L0,40"/><path stroke="#cf142b" stroke-width="4" d="M0,0 L60,40 M60,0 L0,40"/><rect x="25" width="10" height="40" fill="#fff"/><rect y="15" width="60" height="10" fill="#fff"/><rect x="27" width="6" height="40" fill="#cf142b"/><rect y="17" width="60" height="6" fill="#cf142b"/></svg>`,
    "en-AU": `<svg width="24" height="16" viewBox="0 0 60 40"><rect width="60" height="40" fill="#012169"/><path d="M7,0 L23,0 L37,16 L60,16 L60,6 L40,6 L25,0 L60,0 L60,0 L60,40 L0,40 L0,0 L7,0 Z" fill="#FFFFFF"/><path d="M0,16 L25,16 L10,0 L0,0 L0,16 Z" fill="#FFFFFF"/><path d="M60,24 L35,24 L50,40 L60,40 L60,24 Z" fill="#FFFFFF"/><path d="M0,24 L20,24 L0,40 L0,24 Z" fill="#FFFFFF"/><path d="M25,0 L35,0 L60,30 L60,40 L50,40 L25,10 L25,0 Z" fill="#C8102E"/><path d="M0,16 L10,16 L0,6 L0,16 Z" fill="#C8102E"/><path d="M60,24 L50,24 L60,34 L60,24 Z" fill="#C8102E"/><path d="M0,0 L60,0 L25,35 L25,40 L0,40 L0,0 Z" fill="#C8102E"/><circle cx="30" cy="20" r="10" fill="#012169"/><circle cx="30" cy="20" r="8" fill="#FFFFFF"/><path d="M30,12 L33,20 L30,28 L27,20 Z" fill="#012169"/><path d="M30,12 L37,16 L23,16 Z" fill="#012169"/><path d="M30,28 L37,24 L23,24 Z" fill="#012169"/><path d="M23,16 L27,20 L23,24 Z" fill="#012169"/><path d="M37,16 L33,20 L37,24 Z" fill="#012169"/></svg>`
  };
  document.getElementById('flag-svg').innerHTML = flagSVGs[accent] || "";
}

function renderCustomInput() {
  document.getElementById('custom-upload-area').innerHTML = `
    <textarea id="custom-words" class="form-control" rows="4"
      placeholder="Enter words (separated by commas, spaces, or new lines)"></textarea>
    <button id="add-custom-btn" class="btn btn-info" style="margin-top: 10px;">
      <i class="fas fa-plus-circle"></i> Use These Words
    </button>
  `;
  document.getElementById('add-custom-btn').onclick = () => {
    const input = document.getElementById('custom-words').value.trim();
    if (!input) {
      showAlert("Please enter some words first!", 'error');
      return;
    }
    words = [...new Set(input.split(/[\s,;\/\-–—|]+/))].map(w => w.trim()).filter(w => w && w.length > 1);
    if (!words.length) {
      showAlert("No valid words found.", 'error');
      return;
    }
    showAlert(`Added ${words.length} words!`, 'success');
    appTitle.textContent = "Custom Spelling Practice";
    startCustomPractice();
  };
}

// ---------------- OET SPELLING MODE ----------------
function startOET() {
  currentIndex = 0; score = 0; userAnswers = [];
  words = window.oetWords ? window.oetWords.slice() : [];
  if (sessionMode === "test") words = shuffleArray([...words]).slice(0, 24);
  appTitle.textContent = `OET Spelling ${sessionMode === "test" ? "Test" : "Practice"}`;
  showOETWord();
  speakCurrentWord();
}
function showOETWord() {
  if (currentIndex >= words.length) return showSummary();
  const word = words[currentIndex];
  trainerArea.innerHTML = `
    <div class="word-progress">Word ${currentIndex + 1} of ${words.length}</div>
    <div class="word-audio-feedback">
      <button id="repeat-btn" class="btn btn-icon" title="Repeat word">
        <i class="fas fa-redo"></i>
      </button>
      <span id="word-status"></span>
    </div>
    <input type="text" id="user-input" class="form-control" style="margin-top: 15px;"
           placeholder="Type what you heard..." autofocus>
    <div class="button-group">
      <button id="prev-btn" class="btn btn-secondary"${currentIndex === 0 ? " disabled" : ""}>
        <i class="fas fa-arrow-left"></i> Previous
      </button>
      ${renderFlagBtn(word)}
      <button id="next-btn" class="btn btn-secondary"${currentIndex === words.length-1 ? " disabled" : ""}>
        <i class="fas fa-arrow-right"></i> Next
      </button>
    </div>
    <div id="feedback" class="feedback" style="margin-top: 15px;"></div>
  `;
  const userInput = document.getElementById('user-input');
  userInput.focus();
  document.getElementById('repeat-btn').onclick = () => speakCurrentWord();
  document.getElementById('prev-btn').onclick = prevOETWord;
  document.getElementById('next-btn').onclick = nextOETWord;
  document.getElementById('flag-btn').onclick = () => {
    toggleFlagWord(word);
    showOETWord(); // re-render button state
  };
  userInput.onkeydown = (e) => { if (e.key === 'Enter') checkOETAnswer(word); };
  userInput.oninput = (e) => {
    if (e.target.value.toLowerCase() === word.toLowerCase()) checkOETAnswer(word);
  };
}
function speakCurrentWord() {
  speakWord(words[currentIndex]);
}
function checkOETAnswer(correctWord) {
  const userInput = document.getElementById('user-input');
  const userAnswer = userInput.value.trim();
  userAnswers[currentIndex] = userAnswer;
  const feedback = document.getElementById('feedback');
  if (userAnswer.toLowerCase() === correctWord.toLowerCase()) {
    feedback.textContent = "✓ Correct!";
    feedback.className = "feedback correct";
    score++;
    document.getElementById('word-status').innerHTML = '<i class="fas fa-check-circle"></i>';
    setTimeout(() => {
      if (currentIndex < words.length - 1) { currentIndex++; showOETWord(); speakCurrentWord(); }
      else showSummary();
    }, 1000);
  } else {
    feedback.textContent = `✗ Incorrect. The correct spelling is: ${correctWord}`;
    feedback.className = "feedback incorrect";
    document.getElementById('word-status').innerHTML = '<i class="fas fa-times-circle"></i>';
  }
}
function nextOETWord() {
  if (currentIndex < words.length - 1) { currentIndex++; showOETWord(); speakCurrentWord(); }
  else showSummary();
}
function prevOETWord() {
  if (currentIndex > 0) { currentIndex--; showOETWord(); speakCurrentWord(); }
}
// ----------------------------------------------------

// Example Spelling Bee and Custom session can be added below, following same structure...

function speakWord(word) {
  if (!window.speechSynthesis) {
    showAlert("Text-to-speech not supported in your browser.", 'error');
    return;
  }
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(word);
  utter.lang = accent;
  utter.rate = 0.9;
  speechSynthesis.speak(utter);
}

function showSummary() {
  const percent = Math.round((score / words.length) * 100);
  const wrongWords = words.filter((w, i) => (userAnswers[i] || "").toLowerCase() !== w.toLowerCase());
  summaryArea.innerHTML = `
    <div class="card-header">
      <h3>Session Results</h3>
      <div class="score-display">${score}/${words.length} (${percent}%)</div>
    </div>
    <div class="results-grid">
      <div class="results-card correct">
        <h3><i class="fas fa-check-circle"></i> Correct</h3>
        <div class="score-number">${score}</div>
        <div class="word-list">
          ${words.filter((w, i) => (userAnswers[i] || "").toLowerCase() === w.toLowerCase())
            .map(w => `<div class="word-item">${w}</div>`).join('')}
        </div>
      </div>
      <div class="results-card incorrect">
        <h3><i class="fas fa-times-circle"></i> Needs Practice</h3>
        <div class="score-number">${wrongWords.length}</div>
        <div class="word-list">
          ${wrongWords.map(w => `<div class="word-item">${w}</div>`).join('')}
        </div>
      </div>
    </div>
    <div class="summary-actions">
      <button id="restart-btn" class="btn btn-primary">
        <i class="fas fa-redo"></i> Restart Session
      </button>
      <button id="new-list-btn" class="btn btn-secondary">
        <i class="fas fa-sync-alt"></i> New Word List
      </button>
    </div>
    <button id="summary-flagged-btn" class="btn btn-flag" style="margin-top:12px;">
      <i class="far fa-flag"></i> Practice Flagged Words
    </button>
  `;
  document.getElementById('restart-btn').onclick = startOET;
  document.getElementById('new-list-btn').onclick = () => {
    summaryArea.innerHTML = "";
    renderExamUI();
  };
  document.getElementById('summary-flagged-btn').onclick = () => {
    handlePracticeFlaggedWords((flaggedList) => {
      words = flaggedList.slice();
      currentIndex = 0;
      startOET();
    });
  };
}

// Flagged button on main page
document.getElementById('practice-flagged-btn').onclick = () => {
  handlePracticeFlaggedWords((flaggedList) => {
    words = flaggedList.slice();
    currentIndex = 0;
    startOET();
  });
};

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
