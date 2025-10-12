// overlay.js (non-module - exposes global function for HTML onclick)
function showLoadingAndRedirect(url) {
  console.log("Loading and redirecting to:", url);
  
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.style.display = 'flex'; // Show overlay (assumes CSS: display: none initially)
  } else {
    console.error('Loading overlay element not found. Redirecting anyway.');
  }
  
  setTimeout(() => {
    window.location.href = url;
  }, 500); // Your specified 500ms delay
}

// Expose globally for HTML onclick calls (e.g., from the login link)
document.addEventListener('DOMContentLoaded', function() {
  window.showLoadingAndRedirect = showLoadingAndRedirect;
});
