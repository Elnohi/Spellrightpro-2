// js/main-freemium-bee.js
import { showLoader, hideLoader, toggleFlagWord, isWordFlagged, getFlaggedWords, handlePracticeFlaggedWords, showAlert } from './common.js';

// ...rest of your code...
document.getElementById('practice-flagged-btn').onclick = () => {
  handlePracticeFlaggedWords((flaggedList) => {
    words = flaggedList.slice();
    currentIndex = 0;
    startSession();
  });
};

function renderFlagBtn(word) {
  const flagged = isWordFlagged(word);
  return `
    <button id="flag-btn" class="btn btn-flag ${flagged ? "active" : ""}">
      <i class="${flagged ? "fas" : "far"} fa-flag"></i> ${flagged ? "Flagged" : "Flag Word"}
    </button>
  `;
}

// Use showLoader/hideLoader for async, and showAlert for all messages
// Remove all dark mode code here—handled in common.js now.
