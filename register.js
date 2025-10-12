import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCiBFlPxGa3tlLwPQJSssl3Bai2psbqwJY",
  authDomain: "cleanzorv6.firebaseapp.com",
  projectId: "cleanzorv6",
  storageBucket: "cleanzorv6.firebasestorage.app",
  messagingSenderId: "466216817805",
  appId: "1:466216817805:web:a04b203b55e9b609c97ec4",
  measurementId: "G-T83KMEBWE2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.main-form');

  form.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const fullName = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const cleanzorID = document.getElementById('cleanzorID').value.trim();
    const password = document.getElementById('password').value;

    if (!fullName || !email || !password) {
      alert('Please fill in all required fields (Full Name, Email, and Password).');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User signed up:', user.uid);
        
        alert('Account created successfully! Redirecting to login...');
        window.location.href = 'index.html';
      })
      .catch((error) => {
        console.error('Signup error:', error);
        let errorMessage = 'An error occurred during signup.';
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered. Please log in instead.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. Please choose a stronger one.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
          default:
            errorMessage = error.message;
        }
        alert(errorMessage);
      });
  });   
});
