// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCiBFlPxGa3tlLwPQJSssl3Bai2psbqwJY",
  authDomain: "cleanzorv6.firebaseapp.com",
  projectId: "cleanzorv6",
  storageBucket: "cleanzorv6.firebasestorage.app",
  messagingSenderId: "466216817805",
  appId: "1:466216817805:web:a04b203b55e9b609c97ec4",
  measurementId: "G-T83KMEBWE2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function() {

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const showPasswordCheckbox = document.getElementById('showPassword');
  const loginButton = document.getElementById('submit'); 
  const loginForm = document.querySelector('.login-form'); 
  const signupButton = document.getElementById('signupBtn');

  if (!emailInput || !passwordInput || !loginForm || !loginButton || !signupButton) {
    console.error('Required form elements not found. Check your HTML selectors.');
    console.error('Missing elements:', {
      email: !!emailInput,
      password: !!passwordInput,
      form: !!loginForm,
      button: !!loginButton,
      signup: !!signupButton
    });
    return;
  }

  // Toast Notification Setup (moved up to ensure functions are defined before use)
  const notifications = document.querySelector(".notifications");
  if (!notifications) {
    console.warn('Notifications container (.notifications) not found in HTML. Toasts will not display.');
  }

  const toastDetails = {
      timer: 5000,
      success: {
          icon: 'fa-circle-check',
          defaultText: 'Success: This is a success toast.',
      },
      error: {
          icon: 'fa-circle-xmark',
          defaultText: 'Error: This is an error toast.',
      },
      warning: {
          icon: 'fa-triangle-exclamation',
          defaultText: 'Warning: This is a warning toast.',
      },
      info: {
          icon: 'fa-circle-info',
          defaultText: 'Info: This is an information toast.',
      }
  }

  const removeToast = (toast) => {
      if (!toast) return;
      toast.classList.add("hide");
      if (toast.timeoutId) clearTimeout(toast.timeoutId); 
      setTimeout(() => toast.remove(), 500); 
  }

  // Expose removeToast globally for inline onclick usage in toast HTML
  window.removeToast = removeToast;

  const createToast = (id, customText = null) => {
      if (!notifications) return; // Skip if no container

      // Getting the icon and default text for the toast based on the id passed
      const { icon, defaultText } = toastDetails[id];
      const text = customText || defaultText;
      const toast = document.createElement("li"); // Creating a new 'li' element for the toast
      toast.className = `toast ${id}`; // Setting the classes for the toast
      // Setting the inner HTML for the toast
      toast.innerHTML = `<div class="column">
                           <i class="fa-solid ${icon}"></i>
                           <span>${text}</span>
                        </div>
                        <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>`;
      notifications.appendChild(toast); // Append the toast to the notification ul
      // Setting a timeout to remove the toast after the specified duration
      toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
  }

  // Four methods, each taking one argument for custom text (exposed globally if needed for HTML onclick)
  const showSuccess = (text) => createToast('success', text);
  const showError = (text) => createToast('error', text);
  const showWarning = (text) => createToast('warning', text);
  const showInfo = (text) => createToast('info', text);

  // Expose to window for potential HTML onclick calls (e.g., from other pages)
  window.showSuccess = showSuccess;
  window.showError = showError;
  window.showWarning = showWarning;
  window.showInfo = showInfo;

  // Optional: Add event listeners for any .buttons .btn on this page (skip if none exist)
  const buttons = document.querySelectorAll(".buttons .btn");
  if (buttons.length > 0) {
      buttons.forEach(btn => {
          btn.addEventListener("click", () => createToast(btn.id));
      });
  }

  if (showPasswordCheckbox) {
    showPasswordCheckbox.addEventListener('change', () => {
      passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
    });
  }

  signupButton.addEventListener('click', (e) => {
    e.preventDefault();
    showLoadingAndRedirect('signup.html');
  });

  // Login form submission
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    handleLogin();
  });

  function handleLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    emailInput.classList.remove('error');
    passwordInput.classList.remove('error');

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      showError('Please enter a valid email address.');
      emailInput.classList.add('error');
      emailInput.focus();
      return;
    }

    // Password validation
    if (password === '') {
      showError('Please enter your password.');
      passwordInput.classList.add('error');
      passwordInput.focus();
      return;
    }
    if (password.length < 6) {
      showError('Password must be at least 6 characters long.');
      passwordInput.classList.add('error');
      passwordInput.focus();
      return;
    }

    loginButton.disabled = true;
    loginButton.textContent = 'LOGGING IN...'; 

    // Firebase login
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Optional: Show success toast before redirect (it may not fully animate due to quick redirect)
        showSuccess('Login successful! Redirecting...');

        showLoadingAndRedirect('home.html');
      })
      .catch((error) => {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. Please check your email and password.';
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email. Please sign up.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please try again.';
            break;
          default:
            errorMessage = error.message || 'An unexpected error occurred.';
        }
        showError(errorMessage);
        passwordInput.value = '';
        passwordInput.classList.add('error');
        passwordInput.focus();

        loginButton.disabled = false;
        loginButton.textContent = 'LOGIN'; 
      });
  }

  function showLoadingAndRedirect(url) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
    }

    setTimeout(() => {
      window.location.href = url;
    }, 250); 
  }

  // Expose showLoadingAndRedirect globally for optional inline HTML onclick usage (e.g., forgot password link)
  window.showLoadingAndRedirect = showLoadingAndRedirect;

});
