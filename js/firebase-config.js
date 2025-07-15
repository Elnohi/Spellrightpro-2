// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
