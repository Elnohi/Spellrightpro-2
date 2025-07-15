import { loginUser, signUpUser, logoutUser, setupAuthStateListener } from './auth.js';
import { 
  startPractice, 
  startTest,
  addCustomWords,
  saveWordList,
  loadWordList,
  clearWordList,
  handleFileUpload,
  initWordManager
} from './word-manager.js';
import { trackEvent, trackError } from './analytics.js';
import { speak, setAccent, getVoices } from './speech.js';
import { showNotification } from './notification.js';

// Initialize OET words if available
if (typeof OET_WORD_LIST !== 'undefined') {
  initWordManager(OET_WORD_LIST);
}

// Initialize the application
function initializeApp() {
  // Set up auth state listener
  setupAuthStateListener();
  
  // Initialize event listeners
  setupEventListeners();
  
  // Check for dark mode preference
  checkDarkMode();
  
  // Load speech synthesis voices
  loadVoices();
  
  console.log('App initialized successfully');
}

// Set up event listeners
function setupEventListeners() {
  // Auth buttons
  document.getElementById('loginBtn').addEventListener('click', handleLogin);
  document.getElementById('signupBtn').addEventListener('click', handleSignup);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  
  // Practice buttons
  document.getElementById('startPracticeBtn').addEventListener('click', handleStartPractice);
  document.getElementById('startTestBtn').addEventListener('click', handleStartTest);
  
  // Word management buttons
  document.getElementById('addCustomWordsBtn').addEventListener('click', handleAddCustomWords);
  document.getElementById('saveWordListBtn').addEventListener('click', handleSaveWordList);
  document.getElementById('loadWordListBtn').addEventListener('click', handleLoadWordList);
  document.getElementById('clearWordListBtn').addEventListener('click', handleClearWordList);
  
  // File upload
  document.getElementById('fileInput').addEventListener('change', handleFileUpload);
  
  // Exam select change
  document.getElementById("examSelect").addEventListener("change", function() {
    trackEvent('exam_selected', { exam_type: this.value });
  });
  
  // Accent select change
  document.getElementById("accentSelect").addEventListener("change", function() {
    setAccent(this.value);
    trackEvent('accent_changed', { accent: this.value });
  });
  
  // Dark mode toggle
  document.getElementById("modeToggle").addEventListener("click", toggleDarkMode);
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
  
  // Feedback form submission
  const feedbackForm = document.querySelector('form[data-netlify="true"]');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', handleFeedbackSubmit);
  }
}

// Button handler functions
async function handleLogin() {
  try {
    await loginUser();
  } catch (error) {
    trackError(error);
    showNotification(error.message, "error");
  }
}

async function handleSignup() {
  try {
    await signUpUser();
  } catch (error) {
    trackError(error);
    showNotification(error.message, "error");
  }
}

async function handleLogout() {
  try {
    await logoutUser();
  } catch (error) {
    trackError(error);
    showNotification(error.message, "error");
  }
}

function handleStartPractice() {
  try {
    startPractice();
  } catch (error) {
    trackError(error);
    showNotification(error.message, "error");
  }
}

function handleStartTest() {
  try {
    startTest();
  } catch (error) {
    trackError(error);
    showNotification(error.message, "error");
  }
}

function handleAddCustomWords() {
  try {
    addCustomWords();
  } catch (error) {
    trackError(error);
    showNotification(error.message, "error");
  }
}

async function handleSaveWordList() {
  try {
    await saveWordList();
  } catch (error) {
    trackError(error);
    showNotification(error.message, "error");
  }
}

async function handleLoadWordList() {
  try {
    await loadWordList();
  } catch (error) {
    trackError(error);
    showNotification(error.message, "error");
  }
}

function handleClearWordList() {
  try {
    clearWordList();
  } catch (error) {
    trackError(error);
    showNotification(error.message, "error");
  }
}

// ... rest of the existing app.js code (dark mode, keyboard nav, etc.) ...

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
