// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCZ-rAPnRgVjSRFOFvbiQlowE6A3RVvwWo",
  authDomain: "spellrightpro-firebase.firebaseapp.com",
  projectId: "spellrightpro-firebase",
  storageBucket: "spellrightpro-firebase.appspot.com",
  messagingSenderId: "798456641137",
  appId: "1:798456641137:web:5c6d79db5bf49d04928dd0",
  measurementId: "G-H09MF13297"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

// Rate limiter
const authLimiter = {
  attempts: 0,
  lastAttempt: 0,
  check: function() {
    const now = Date.now();
    if (now - this.lastAttempt < 5000) {
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

// Export with debug info
console.log("Firebase initialized successfully");
window.firebase = firebase; // For debugging in console

export { auth, db, analytics, authLimiter };
