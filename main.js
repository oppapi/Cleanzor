// Import the functions you need from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
// Optional: For fetching additional user data from Firestore post-login
// import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Your web app's Firebase configuration (same as signup)
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
// Optional: const db = getFirestore(app); // For Firestore

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const showPasswordCheckbox = document.getElementById('showPassword');
  const loginButton = document.getElementById('btnLogin');
  const loginForm = document.getElementById('loginForm'); // Assumes form ID

  // Show/hide password toggle
  if (showPasswordCheckbox) {
    showPasswordCheckbox.addEventListener('click', () => {
      passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
    });
  }

  // Handle form submission (preferred for login)
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      handleLogin();
    });
  }

  // Fallback: Button click listener (as in your original code)
  if (loginButton) {
    loginButton.addEventListener('click', function(event) {
      event.preventDefault();
      handleLogin();
    });
  }

  // Login handler function (shared for form/button)
  function handleLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Email validation (your regex)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address.');
      emailInput.focus();
      return;
    }

    // Password validation
    if (password === '') {
      alert('Please enter your password.');
      passwordInput.focus();
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      passwordInput.focus();
      return;
    }

    // Firebase login
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in successfully
        const user = userCredential.user;
        console.log('User logged in:', user.uid);

        // Optional: Fetch additional user data from Firestore
        // const userRef = doc(db, 'users', user.uid);
        // getDoc(userRef).then((docSnap) => {
        //   if (docSnap.exists()) {
        //     console.log('User data:', docSnap.data());
        //     // e.g., Update UI with fullName or cleanzorID
        //   }
        // }).catch((error) => {
        //   console.error('Error fetching user data:', error);
        // });

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
          default:
            errorMessage = error.message;
        }
        alert(errorMessage);
        passwordInput.value = ''; // Clear password on error for security
        passwordInput.focus();
      });
  }

  // Your loading and redirect function (unchanged)
  function showLoadingAndRedirect(url) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
    }
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  }

  // Cleaning button toggle (if this is on the login page; otherwise, move to home.js)
  const btn = document.querySelector('.btn-start-cleaning');
  if (btn) {
    btn.addEventListener('click', () => {
      btn.classList.toggle('charging');
      btn.classList.toggle('cleaning');
      btn.textContent = btn.classList.contains('cleaning')
        ? 'CLEANING'
        : 'CHARGING';
    });
  }
});
