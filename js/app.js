// Debug function to log to console and screen
function debugLog(message) {
  console.log(message);
  const debugConsole = document.getElementById('debug-console');
  if (debugConsole) {
    debugConsole.innerHTML += `<div>${new Date().toLocaleTimeString()}: ${message}</div>`;
    debugConsole.scrollTop = debugConsole.scrollHeight;
  }
}

// Simple notification system
function showNotification(message, type = "info") {
  debugLog(`Notification: ${type} - ${message}`);
  const note = document.createElement("div");
  note.className = `notification ${type}`;
  note.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}`;
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 3000);
}

// Initialize the application
function initializeApp() {
  debugLog("Initializing application...");

  // Setup all button event listeners
  function setupButtonListeners() {
    debugLog("Setting up button listeners...");
    
    // Auth buttons
    document.getElementById('loginBtn')?.addEventListener('click', () => {
      debugLog("Login button clicked");
      showNotification("Login button works!", "success");
    });
    
    document.getElementById('signupBtn')?.addEventListener('click', () => {
      debugLog("Signup button clicked");
      showNotification("Signup button works!", "success");
    });
    
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      debugLog("Logout button clicked");
      showNotification("Logout button works!", "success");
    });

    // Practice buttons
    document.getElementById('startPracticeBtn')?.addEventListener('click', () => {
      debugLog("Practice button clicked");
      showNotification("Practice button works!", "success");
    });
    
    document.getElementById('startTestBtn')?.addEventListener('click', () => {
      debugLog("Test button clicked");
      showNotification("Test button works!", "success");
    });

    // Word management buttons
    document.getElementById('addCustomWordsBtn')?.addEventListener('click', () => {
      debugLog("Add Custom Words clicked");
      showNotification("Custom Words button works!", "success");
    });
    
    document.getElementById('saveWordListBtn')?.addEventListener('click', () => {
      debugLog("Save Words clicked");
      showNotification("Save Words button works!", "success");
    });
    
    document.getElementById('loadWordListBtn')?.addEventListener('click', () => {
      debugLog("Load Words clicked");
      showNotification("Load Words button works!", "success");
    });
    
    document.getElementById('clearWordListBtn')?.addEventListener('click', () => {
      debugLog("Clear Words clicked");
      showNotification("Clear Words button works!", "success");
    });

    // Dark mode toggle
    document.getElementById('modeToggle')?.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const icon = document.getElementById('modeIcon');
      if (icon) {
        icon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
      }
      showNotification("Dark mode toggled", "info");
    });
  }

  // Check if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupButtonListeners);
  } else {
    setupButtonListeners();
  }
}

// Start the app
initializeApp();
