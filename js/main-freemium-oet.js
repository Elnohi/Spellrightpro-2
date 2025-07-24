import { showLoader, hideLoader, toggleFlagWord, isWordFlagged, getFlaggedWords, handlePracticeFlaggedWords, showAlert } from './common.js';

// Add "Practice Flagged Words" button event
document.getElementById('practice-flagged-btn').onclick = () => {
  handlePracticeFlaggedWords((flaggedList) => {
    words = flaggedList.slice();
    currentIndex = 0;
    startSession();
  });
};

// Replace flag button rendering and logic:
function renderFlagBtn(word) {
  const flagged = isWordFlagged(word);
  return `
    <button id="flag-btn" class="btn btn-flag ${flagged ? "active" : ""}">
      <i class="${flagged ? "fas" : "far"} fa-flag"></i> ${flagged ? "Flagged" : "Flag Word"}
    </button>
  `;
}

// When toggling flag in your logic, call:
toggleFlagWord(word);
// Then call renderFlagBtn(word) to re-render the button

// Add showLoader()/hideLoader() for async ops (file upload, speech init, etc)

// Remove all dark mode logic from here; handled in common.js

// Use showAlert as provided in common.js for messages

// ...rest of your app logic...
