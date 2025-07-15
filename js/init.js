import { initializeApp } from './firebase-config.js';
import { setupAuth } from './auth.js';
import { initWordManager, setupWordControls } from './word-manager.js';
import { setupDarkMode } from './app.js';

// Initialize Firebase and app components
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initializeApp();
    
    if (typeof OET_WORD_LIST !== 'undefined') {
      initWordManager(OET_WORD_LIST);
    }
    
    setupAuth();
    setupWordControls();
    setupDarkMode();
    
    console.log('App initialized successfully');
  } catch (error) {
    console.error('Initialization failed:', error);
  }
});
