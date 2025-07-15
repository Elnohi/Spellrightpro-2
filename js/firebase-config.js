// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCZ-rAPnRgVjSRFOFvbiQlowE6A3RVvwWo",
  authDomain: "spellrightpro-firebase.firebaseapp.com",
  projectId: "spellrightpro-firebase",
  storageBucket: "spellrightpro-firebase.firebasestorage.app",
  messagingSenderId: "798456641137",
  appId: "1:798456641137:web:5c6d79db5bf49d04928dd0",
  measurementId: "G-H09MF13297"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

// Rate limiting for auth functions
const authLimiter = {
  attempts: 0,
  lastAttempt: 0,
  check: function() {
    const now = Date.now();
    if (now - this.lastAttempt < 5000) { // 5 second cooldown
      this.attempts++;
      if (this.attempts > 3) {
        throw new Error("Too many attempts. Please wait before trying again.");
      }
    } else {
      this.attempts = 0;
    }
    this.lastAttempt = now;
  }
};

export { auth, db, analytics, authLimiter };
