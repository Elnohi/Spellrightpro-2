// js/main-premium.js
import { showLoader, hideLoader, toggleFlagWord, isWordFlagged, getFlaggedWords, handlePracticeFlaggedWords, showAlert } from './common.js';

let currentUser = null;
let examType = "OET";
let accent = "en-US";
let words = [];
let currentIndex = 0;
let sessionMode = "practice";
let score = 0;
let flaggedWords = [];
let userAnswers = [];
let userAttempts = [];

const authArea = document.getElementById('auth-area');
const premiumApp = document.getElementById('premium-app');
const examUI = document.getElementById('exam-ui');
const trainerArea = document.getElementById('trainer-area');
const summaryArea = document.getElementById('summary-area');
const appTitle = document.getElementById('app-title');

const WORD_SEPARATORS = /[\s,;\/\-–—|]+/;

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

auth.onAuthStateChanged(user => {
  currentUser = user;
  renderAuth();
});

// ... Rest of your main-premium.js logic, update all flag buttons as:
function renderFlagBtn(word) {
  const flagged = isWordFlagged(word);
  return `
    <button id="flag-btn" class="btn btn-flag ${flagged ? "active" : ""}">
      <i class="${flagged ? "fas" : "far"} fa-flag"></i> ${flagged ? "Flagged" : "Flag Word"}
    </button>
  `;
}

// At the end, wire up the Practice Flagged Words button:
document.getElementById('practice-flagged-btn').onclick = () => {
  handlePracticeFlaggedWords((flaggedList) => {
    words = flaggedList.slice();
    currentIndex = 0;
    startOET(); // Or your actual practice mode for flagged words
  });
};
