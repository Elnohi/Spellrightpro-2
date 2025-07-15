async function loginUser(email, password) {
  try {
    authLimiter.check();
    await auth.signInWithEmailAndPassword(email, password);
    trackEvent('login_success');
  } catch (error) {
    trackError(error);
    throw new Error(getAuthErrorMessage(error));
  }
}

function getAuthErrorMessage(error) {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/too-many-requests':
      return 'Account temporarily locked. Try again later';
    default:
      return 'Login failed. Please try again';
  }
}

// ... other auth functions ...

function setupAuthStateListener() {
  auth.onAuthStateChanged(user => {
    const loginStatus = document.getElementById('loginStatus');
    if (user) {
      loginStatus.textContent = `Logged in as ${user.email}`;
      loginStatus.style.color = 'green';
    } else {
      loginStatus.textContent = 'Not logged in';
      loginStatus.style.color = 'red';
    }
  });
}
