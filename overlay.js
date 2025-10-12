function showLoadingAndRedirect(url) {
  console.log("Loading and redirecting to:", url);
  
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
  } else {
    console.error('Loading overlay element not found. Redirecting anyway.');
  }
  
  setTimeout(() => {
    window.location.href = url;
  }, 250); 
}

document.addEventListener('DOMContentLoaded', function() {
  window.showLoadingAndRedirect = showLoadingAndRedirect;
});
