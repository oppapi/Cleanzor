// toast.js (basic self-contained version with inline CSS injection)
// Simplified for basic use: showToast(message, title = '') – one required argument (message), optional title
let currentToast = null; // Track single toast (no stacking for simplicity)
let stylesInjected = false; // Prevent multiple style injections

// Inject CSS styles into <head> once
function injectStyles() {
  if (stylesInjected) return;
  
  const style = document.createElement('style');
  style.textContent = `
    /* Injected Basic Toast Styles */
    .toast {
      position: fixed !important;
      padding: 12px 16px !important;
      max-width: 350px !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      opacity: 0 !important;
      transition: opacity 0.3s ease !important;
      background: #ffffff !important;
      border-left: 4px solid #007bff !important; /* Default info */
      color: #333333 !important;
      font-family: sans-serif !important;
      font-size: 14px !important;
      z-index: 10000 !important;
      cursor: pointer !important;
      display: flex !important;
      flex-direction: column !important;
      line-height: 1.4 !important;
      box-sizing: border-box !important;
    }
    
    .toast.show {
      opacity: 1 !important;
    }
    
    .toast-title {
      font-weight: bold !important;
      margin-bottom: 4px !important;
      font-size: 15px !important;
      color: inherit !important;
    }
    
    .toast-message {
      font-weight: normal !important;
    }
    
    .toast.success {
      border-left-color: #28a745 !important;
      background: #f8fff9 !important;
      color: #155724 !important;
    }
    
    .toast.error {
      border-left-color: #dc3545 !important;
      background: #fff5f5 !important;
      color: #721c24 !important;
    }
    
    .toast.info {
      border-left-color: #007bff !important;
      background: #f0f8ff !important;
      color: #004085 !important;
    }
    
    /* Mobile Responsiveness */
    @media (max-width: 480px) {
      .toast {
        max-width: none !important;
        padding: 10px 14px !important;
        font-size: 13px !important;
        left: 10px !important;
        right: 10px !important;
        bottom: 10px !important;
      }
    }
  `;
  
  document.head.appendChild(style);
  stylesInjected = true;
}

function showToast(message, title = '') {
  // Inject styles if not done
  injectStyles();
  
  // Validate args
  if (!message || typeof message !== 'string') {
    console.error('showToast: Message is required and must be a string.');
    return;
  }

  // Remove existing toast if any
  if (currentToast) {
    currentToast.classList.remove('show');
    setTimeout(() => currentToast && currentToast.remove(), 300);
  }

  // Create new toast
  currentToast = document.createElement('div');
  currentToast.className = 'toast info'; // Default to info type for basic version
  
  // Build content with optional title
  let content = `<div class="toast-message">${message}</div>`;
  if (title && typeof title === 'string') {
    content = `<div class="toast-title">${title}</div>${content}`;
  }
  
  currentToast.innerHTML = content;
  
  // Apply inline styles for default position (bottom-right)
  Object.assign(currentToast.style, {
    position: 'fixed',
    zIndex: '10000',
    maxWidth: '350px',
    bottom: '20px',
    right: '20px',
    left: 'auto',
    top: 'auto'
  });
  
  // Append to body
  document.body.appendChild(currentToast);
  
  // Show with fade-in
  setTimeout(() => currentToast.classList.add('show'), 100);
  
  // Auto-hide after 3000ms (default duration for basic version)
  setTimeout(() => {
    if (currentToast) {
      currentToast.classList.remove('show');
      setTimeout(() => {
        if (currentToast) {
          currentToast.remove();
          currentToast = null;
        }
      }, 300);
    }
  }, 3000);
  
  // Dismiss on click (whole toast)
  const dismissHandler = () => {
    if (currentToast) {
      currentToast.classList.remove('show');
      setTimeout(() => {
        if (currentToast) {
          currentToast.remove();
          currentToast = null;
        }
      }, 300);
    }
    currentToast.removeEventListener('click', dismissHandler);
  };
  currentToast.addEventListener('click', dismissHandler);
}

// Expose globally
window.showToast = showToast;

// Optional: Manual hide function
window.hideCurrentToast = function() {
  if (currentToast) {
    currentToast.classList.remove('show');
    setTimeout(() => currentToast && currentToast.remove(), 300);
    currentToast = null;
  }
};
