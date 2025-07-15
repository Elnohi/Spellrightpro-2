class SpellRightApp {
  constructor() {
    this.initElements();
    this.initEventListeners();
    this.checkDarkMode();
    this.updateLoginStatus();
  }

  initElements() {
    // Auth elements
    this.emailInput = document.getElementById('userEmail');
    this.passwordInput = document.getElementById('userPassword');
    this.loginBtn = document.getElementById('loginBtn');
    this.signupBtn = document.getElementById('signupBtn');
    this.logoutBtn = document.getElementById('logoutBtn');
    this.loginStatus = document.getElementById('loginStatus');

    // Practice elements
    this.wordDisplay = document.getElementById('wordDisplay');
    this.repeatBtn = document.getElementById('repeatBtn');
    this.correctBtn = document.getElementById('correctBtn');
    this.incorrectBtn = document.getElementById('incorrectBtn');
    this.progressBar = document.getElementById('progressBar');

    // Other UI elements
    this.modeToggle = document.getElementById('modeToggle');
    this.notificationArea = document.getElementById('notificationArea');
  }

  initEventListeners() {
    // Auth events
    this.loginBtn.addEventListener('click', () => this.handleLogin());
    this.signupBtn.addEventListener('click', () => this.handleSignup());
    this.logoutBtn.addEventListener('click', () => this.handleLogout());

    // Practice events
    this.repeatBtn.addEventListener('click', () => this.repeatWord());
    this.correctBtn.addEventListener('click', () => this.answer(true));
    this.incorrectBtn.addEventListener('click', () => this.answer(false));

    // Dark mode toggle
    this.modeToggle.addEventListener('click', () => this.toggleDarkMode());
  }

  async handleLogin() {
    try {
      const email = this.emailInput.value;
      const password = this.passwordInput.value;
      await loginUser(email, password);
      this.showNotification('Logged in successfully', 'success');
      this.updateLoginStatus();
    } catch (error) {
      this.showNotification(error.message, 'error');
    }
  }

  // ... other methods ...

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 
                       type === 'success' ? 'check-circle' : 'info-circle'}"></i>
      ${message}
    `;
    this.notificationArea.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  }

  // ... remaining methods ...
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  window.app = new SpellRightApp();
});
