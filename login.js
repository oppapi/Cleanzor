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
  const loginButton = document.getElementById('btnLogin');
  const loginForm = document.getElementById('loginForm'); 

  if (!emailInput || !passwordInput || !loginForm) {
    console.error('Required form elements not found. Check your HTML.');
    return;
  }

  if (showPasswordCheckbox) {
    showPasswordCheckbox.addEventListener('change', () => {
      passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
    });
  }

  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    handleLogin();
  });

  if (loginButton) {
    loginButton.addEventListener('click', function(event) {
      event.preventDefault();
      handleLogin();
    });
  }

  function handleLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    emailInput.classList.remove('error');
    passwordInput.classList.remove('error');

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address.');
      emailInput.classList.add('error');
      emailInput.focus();
      return;
    }

    // Password validation
    if (password === '') {
      alert('Please enter your password.');
      passwordInput.classList.add('error');
      passwordInput.focus();
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      passwordInput.classList.add('error');
      passwordInput.focus();
      return;
    }

    if (loginButton) {
      loginButton.disabled = true;
      loginButton.textContent = 'Logging in...';
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User logged in:', user.uid);

        
        showLoadingAndRedirect('home.html');
      })
      .catch((error) => {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. Please check your credentials.';
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email. Please sign up.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection and try again.';
            break;
          default:
            errorMessage = error.message || 'An unexpected error occurred.';
        }
        alert(errorMessage);
        passwordInput.value = '';
        passwordInput.classList.add('error');
        passwordInput.focus();

        if (loginButton) {
          loginButton.disabled = false;
          loginButton.textContent = 'Login';
        }
      });
  }

function showLoadingAndRedirect(url) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'flex';
    setTimeout(() => window.location.href = url, 500);
}
});
