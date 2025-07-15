import { loginUser, signUpUser, logoutUser, setupAuthStateListener } from './auth.js';
import { initWordManager, startPractice, startTest } from './word-manager.js';
import { trackEvent, trackError } from './analytics.js';
import { speak, setAccent } from './speech.js';

// Initialize OET words
if (typeof OET_WORD_LIST !== 'undefined') {
  initWordManager(OET_WORD_LIST);
}

// Expose functions to global scope for HTML event handlers
window.loginUser = loginUser;
window.signUpUser = signUpUser;
window.logoutUser = logoutUser;
window.startPractice = startPractice;
window.startTest = startTest;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  setupAuthStateListener();
  setupEventListeners();
  checkDarkMode();
});

function setupEventListeners() {
  document.getElementById("examSelect").addEventListener("change", function() {
    trackEvent('exam_selected', { exam_type: this.value });
  });

  document.getElementById("accentSelect").addEventListener("change", function() {
    setAccent(this.value);
    trackEvent('accent_changed', { accent: this.value });
  });

  document.getElementById("modeToggle").addEventListener("click", toggleDarkMode);
  
  document.addEventListener('keydown', handleKeyboardNavigation);
}

function checkDarkMode() {
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add("dark-mode");
    document.getElementById("modeIcon").className = "fas fa-sun";
  }
}

function toggleDarkMode() {
  const body = document.body;
  const icon = document.getElementById("modeIcon");
  body.classList.toggle("dark-mode");
  const dark = body.classList.contains("dark-mode");
  icon.className = dark ? "fas fa-sun" : "fas fa-moon";
  localStorage.setItem('darkMode', dark ? 'enabled' : 'disabled');
  trackEvent('theme_changed', { theme: dark ? 'dark' : 'light' });
}

function handleKeyboardNavigation(e) {
  if (document.activeElement.tagName === 'INPUT') return;
  
  switch(e.key) {
    case 'ArrowLeft':
      document.querySelector('.controls .btn:first-child')?.click();
      break;
    case 'ArrowRight':
      document.querySelector('.controls .btn:last-child')?.click();
      break;
    case ' ':
      document.querySelector('.btn-info')?.click();
      break;
    case 'Enter':
      document.querySelector('.btn-success')?.click();
      break;
    case 'f':
      document.querySelector('.btn:not(.btn-success):not(.btn-info)')?.click();
      break;
  }
}

export function showNotification(message, type = "info") {
  const note = document.createElement("div");
  note.className = `notification ${type}`;
  note.setAttribute('role', 'alert');
  note.innerHTML = `
    <i class="fas fa-${
      type === 'error' ? 'exclamation-circle' : 
      type === 'success' ? 'check-circle' : 
      'info-circle'
    }"></i> 
    <span>${message}</span>
  `;
  document.body.appendChild(note);
  setTimeout(() => note.classList.add("show"), 10);
  setTimeout(() => {
    note.classList.remove("show");
    setTimeout(() => note.remove(), 300);
  }, 5000);
  
  trackEvent('notification_shown', { type, message });
}

// Error handling
window.onerror = function(message, source, lineno, colno, error) {
  trackError(error || new Error(message), {
    source_file: source,
    line_number: lineno,
    column_number: colno
  });
};
