// main-premium.js
import { showLoader, hideLoader, toggleFlagWord, isWordFlagged, getFlaggedWords, handlePracticeFlaggedWords, showAlert } from './common.js';

// ... all your imports and variables as before

// Inside renderAuth() (add "Forgot password?" link)
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

// ---- For all word/practice/trainer areas, flagging: ----
function renderFlagBtn(word) {
  const flagged = isWordFlagged(word);
  return `
    <button id="flag-btn" class="btn btn-flag ${flagged ? "active" : ""}">
      <i class="${flagged ? "fas" : "far"} fa-flag"></i> ${flagged ? "Flagged" : "Flag Word"}
    </button>
  `;
}
// In all your practice/test/trainer UI, replace flag/star button rendering with renderFlagBtn(word)
// And in logic: when toggling, call toggleFlagWord(word) and re-render the word UI

// ---- Loader usage example ----
// Whenever a long async starts (TTS, recognition, file upload, login, etc), call showLoader(); then hideLoader() at end

// ---- Practice Flagged Words ----
document.getElementById('practice-flagged-btn').onclick = () => {
  handlePracticeFlaggedWords((flaggedList) => {
    words = flaggedList.slice();
    currentIndex = 0;
    // For OET: startOET(); for Bee: startBee(); or for Custom: startCustomPractice();
    startOET(); // or whichever is appropriate
  });
};

// ---- In all summary areas, add a similar button (HTML & logic as above) ----

// Remove ALL duplicate dark mode toggle code from this file. Only use common.js.
