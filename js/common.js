// common.js
// Unified flag logic, dark mode, and loader overlay

export function initDarkModeToggle() {
  const toggleBtn = document.getElementById('dark-mode-toggle');
  const icon = document.getElementById('dark-mode-icon');

  function updateIcon() {
    if (icon) {
      icon.className = document.body.classList.contains('dark-mode')
        ? 'fas fa-sun'
        : 'fas fa-moon';
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'true' : 'false');
      updateIcon();
    });

    // Initial state
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
    }
    updateIcon();
  }
}

export function showLoader() {
  const loader = document.getElementById('loader-overlay');
  if (loader) loader.style.display = 'flex';
}
export function hideLoader() {
  const loader = document.getElementById('loader-overlay');
  if (loader) loader.style.display = 'none';
}

// Flagging logic - uses only flag icon (not star)
export let flaggedWords = JSON.parse(localStorage.getItem('flaggedWords')) || [];

export function toggleFlagWord(currentWord) {
  if (!currentWord) return;
  const idx = flaggedWords.indexOf(currentWord);
  if (idx === -1) {
    flaggedWords.push(currentWord);
  } else {
    flaggedWords.splice(idx, 1);
  }
  localStorage.setItem('flaggedWords', JSON.stringify(flaggedWords));
}

export function isWordFlagged(word) {
  return flaggedWords.includes(word);
}

// Practice flagged words (should be used by each app version)
export function getFlaggedWords() {
  return JSON.parse(localStorage.getItem('flaggedWords')) || [];
}

// --- Optional: utility for summary page button ---
export function handlePracticeFlaggedWords(startPracticeCallback) {
  const flagged = getFlaggedWords();
  if (!flagged.length) {
    showAlert("No flagged words yet! Flag some during practice/test sessions.");
    return;
  }
  startPracticeCallback(flagged);
}

export function showAlert(message, type = 'error') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  document.body.appendChild(alert);
  setTimeout(() => {
    alert.classList.add('fade-out');
    setTimeout(() => alert.remove(), 500);
  }, 3000);
}

// Init on page load
document.addEventListener('DOMContentLoaded', initDarkModeToggle);
