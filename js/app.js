// Initialize debug mode
const DEBUG_MODE = true;

// Debug logging function
function debugLog(message) {
  if (DEBUG_MODE) {
    console.log(message);
    const debugConsole = document.getElementById('debug-console');
    if (debugConsole) {
      debugConsole.innerHTML += `<div>${new Date().toLocaleTimeString()}: ${message}</div>`;
      debugConsole.scrollTop = debugConsole.scrollHeight;
    }
  }
}

// Notification system
function showNotification(message, type = "info") {
  debugLog(`Notification: ${type} - ${message}`);
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${
      type === 'error' ? 'exclamation-circle' : 
      type === 'success' ? 'check-circle' : 
      'info-circle'
    }"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Button handler with error protection
function setupButton(buttonId, handler) {
  const button = document.getElementById(buttonId);
  if (!button) {
    debugLog(`Button ${buttonId} not found`);
    return;
  }
  
  button.addEventListener('click', () => {
    try {
      debugLog(`${buttonId} clicked`);
      handler();
    } catch (error) {
      debugLog(`Error in ${buttonId}: ${error.message}`);
      showNotification(`Error: ${error.message}`, "error");
    }
  });
}

// Practice functions
function startPracticeSession() {
  debugLog("Starting practice session");
  const trainer = document.getElementById('trainer');
  trainer.innerHTML = `
    <h2>Practice Session</h2>
    <div class="word-display">
      <p class="current-word">Sample word will appear here</p>
      <div class="controls">
        <button class="btn btn-success">Correct</button>
        <button class="btn btn-warning">Incorrect</button>
      </div>
    </div>
  `;
  showNotification("Practice session started", "success");
}

function startTestSession() {
  debugLog("Starting test session");
  document.getElementById('trainer').innerHTML = `
    <h2>Test Mode</h2>
    <div class="test-interface">
      <p>Test words will appear here</p>
    </div>
  `;
  showNotification("Test session started", "success");
}

// Initialize all functionality
function initializeApp() {
  debugLog("Initializing application");
  
  // Setup buttons
  setupButton('startPracticeBtn', startPracticeSession);
  setupButton('startTestBtn', startTestSession);
  
  setupButton('addCustomWordsBtn', () => {
    const words = document.getElementById('wordInput').value;
    debugLog(`Adding custom words: ${words}`);
    showNotification("Custom words added", "success");
  });
  
  // Setup other buttons similarly...
  
  // Dark mode toggle
  setupButton('modeToggle', () => {
    document.body.classList.toggle('dark-mode');
    const icon = document.getElementById('modeIcon');
    if (icon) {
      icon.className = document.body.classList.contains('dark-mode') ? 
        'fas fa-sun' : 'fas fa-moon';
    }
    showNotification("Dark mode toggled", "info");
  });
  
  // Show debug console if in debug mode
  if (DEBUG_MODE) {
    document.getElementById('debug-console').style.display = 'block';
  }
  
  debugLog("Application initialized");
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
