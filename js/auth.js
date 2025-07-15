import { auth, authLimiter } from './firebase-config.js';
import { trackEvent, trackError } from './analytics.js';
import { showNotification } from './app.js';

export async function loginUser() {
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value;
  
  if (!email || !password) {
    trackEvent('login_attempt', {
      status: 'failed',
      reason: 'missing_credentials'
    });
    return showNotification("Email and password required", "error");
  }

  showNotification("Logging in...", "info");
  trackEvent('login_attempt', { status: 'started' });
  
  try {
    authLimiter.check();
    await auth.signInWithEmailAndPassword(email, password);
    showNotification("Login successful!", "success");
    trackEvent('login_success');
  } catch (error) {
    showNotification(error.message, "error");
    trackError(error, { action: 'login' });
  }
}

export async function signUpUser() {
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value;
  
  if (!email || !password) {
    trackEvent('signup_attempt', {
      status: 'failed',
      reason: 'missing_credentials'
    });
    return showNotification("Email and password required", "error");
  }

  showNotification("Creating account...", "info");
  trackEvent('signup_attempt', { status: 'started' });
  
  try {
    authLimiter.check();
    await auth.createUserWithEmailAndPassword(email, password);
    showNotification("Account created and signed in!", "success");
    trackEvent('signup_success');
  } catch (error) {
    showNotification(error.message, "error");
    trackError(error, { action: 'signup' });
  }
}

export async function logoutUser() {
  showNotification("Logging out...", "info");
  trackEvent('logout_attempt');
  
  try {
    await auth.signOut();
    showNotification("You have logged out", "info");
    document.getElementById("trainer").innerHTML = "";
    document.getElementById("scoreDisplay").innerHTML = "";
    trackEvent('logout_success');
  } catch (error) {
    trackError(error, { action: 'logout' });
  }
}

export function setupAuthStateListener() {
auth.onAuthStateChanged(user => {
  const loginStatus = document.getElementById("loginStatus");

  if (user) {
    trackEvent('screen_view', {
      screen_name: 'Main',
      screen_class: 'Home'
    });
    trackEvent('login_success');

    document.getElementById("formHiddenEmail").value = user.email;
    loginStatus.textContent = `Logged in as ${user.email}`;
    loginStatus.style.color = "green";
  } else {
    loginStatus.textContent = "Not logged in";
    loginStatus.style.color = "red";
  }
});
}
