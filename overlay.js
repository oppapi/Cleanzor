function showLoadingAndRedirect(url) {
  
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
  }
  
  setTimeout(() => {
    window.location.href = url;
  }, 250); 
}

document.addEventListener('DOMContentLoaded', function() {
  window.showLoadingAndRedirect = showLoadingAndRedirect;
});
