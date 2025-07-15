// Import all required functions from modules
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

// Initialize OET words if available
if (typeof OET_WORD_LIST !== 'undefined') {
  initWordManager(OET_WORD_LIST);
}

// Expose all needed functions to global scope
function exposeFunctionsToGlobal() {
  window.loginUser = async () => {
    try {
      await loginUser();
    } catch (error) {
      trackError(error);
      showNotification(error.message, "error");
    }
  };
  
  window.signUpUser = async () => {
    try {
      await signUpUser();
    } catch (error) {
      trackError(error);
      showNotification(error.message, "error");
    }
  };
  
  window.logoutUser = async () => {
    try {
      await logoutUser();
    } catch (error) {
      trackError(error);
      showNotification(error.message, "error");
    }
  };
  
  window.startPractice = () => {
    try {
      startPractice();
    } catch (error) {
      trackError(error);
      showNotification(error.message, "error");
    }
  };
  
  window.startTest = () => {
    try {
      startTest();
    } catch (error) {
      trackError(error);
      showNotification(error.message, "error");
    }
  };
  
  window.addCustomWords = () => {
    try {
      addCustomWords();
    } catch (error) {
      trackError(error);
      showNotification(error.message, "error");
    }
  };
  
  window.saveWordList = async () => {
    try {
      await saveWordList();
    } catch (error) {
      trackError(error);
      showNotification(error.message, "error");
    }
  };
  
  window.loadWordList = async () => {
    try {
      await loadWordList();
    } catch (error) {
      trackError(error);
      showNotification(error.message, "error");
    }
  };
  
  window.clearWordList = () => {
    try {
      clearWordList();
    } catch (error) {
      trackError(error);
      showNotification(error.message, "error");
    }
  };
  
  window.handleFileUpload = (event) => {
    try {
      handleFileUpload(event);
    } catch (error) {
      trackError(error);
      showNotification(error.message, "error");
    }
  };
}

// Initialize the application
function initializeApp() {
  // Expose functions to global scope
  exposeFunctionsToGlobal();
  
  // Set up auth state listener
  setupAuthStateListener();
  
  // Initialize event listeners
  setupEventListeners();
  
  // Check for dark mode preference
  checkDarkMode();
  
  // Load speech synthesis voices
  loadVoices();
  
  // Debugging
  console.log('App initialized successfully');
  console.log('Available functions:', [
    'loginUser', 'signUpUser', 'logoutUser',
    'startPractice', 'startTest',
    'addCustomWords', 'saveWordList',
    'loadWordList', 'clearWordList',
    'handleFileUpload'
  ]);
}

// Set up event listeners
function setupEventListeners() {
  // Exam select change
  const examSelect = document.getElementById("examSelect");
  if (examSelect) {
    examSelect.addEventListener("change", function() {
      trackEvent('exam_selected', { exam_type: this.value });
    });
  }
  
  // Accent select change
  const accentSelect = document.getElementById("accentSelect");
  if (accentSelect) {
    accentSelect.addEventListener("change", function() {
      setAccent(this.value);
      trackEvent('accent_changed', { accent: this.value });
    });
  }
  
  // Dark mode toggle
  const modeToggle = document.getElementById("modeToggle");
  if (modeToggle) {
    modeToggle.addEventListener("click", toggleDarkMode);
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
  
  // Feedback form submission
  const feedbackForm = document.querySelector('form[data-netlify="true"]');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', handleFeedbackSubmit);
  }
}

// Dark mode functions
function checkDarkMode() {
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add("dark-mode");
    const icon = document.getElementById("modeIcon");
    if (icon) icon.className = "fas fa-sun";
  }
}

function toggleDarkMode() {
  const body = document.body;
  const icon = document.getElementById("modeIcon");
  body.classList.toggle("dark-mode");
  const dark = body.classList.contains("dark-mode");
  if (icon) icon.className = dark ? "fas fa-sun" : "fas fa-moon";
  localStorage.setItem('darkMode', dark ? 'enabled' : 'disabled');
  trackEvent('theme_changed', { theme: dark ? 'dark' : 'light' });
}

// Keyboard navigation
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

// Feedback form handling
function handleFeedbackSubmit(event) {
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }, 2000);
  }
  trackEvent('feedback_submitted');
}

// Load speech voices
async function loadVoices() {
  try {
    await getVoices();
    console.log('Speech synthesis voices loaded');
  } catch (error) {
    console.warn('Error loading voices:', error);
    trackError(error);
  }
}

// Notification system
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

// Global error handling
window.onerror = function(message, source, lineno, colno, error) {
  trackError(error || new Error(message), {
    source_file: source,
    line_number: lineno,
    column_number: colno
  });
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
