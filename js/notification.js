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
