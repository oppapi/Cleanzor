document.addEventListener('DOMContentLoaded', function() {

  const { initializeApp, getAuth, createUserWithEmailAndPassword } = window.firebaseModules;

  // Firebase configuration (from your previous messages)
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
  const auth = getAuth(app);

  // Form elements
  const signupForm = document.getElementById('signupForm');
  const fullNameInput = document.getElementById('full-name');
  const emailInput = document.getElementById('email');
  const cleanzorIDInput = document.getElementById('cleanzorID');
  const passwordInput = document.getElementById('password');
  const submitButton = document.getElementById('submit');

  // Form submission
  signupForm.addEventListener('submit', function(event) {
    event.preventDefault();
    handleSignup();
  });

  function handleSignup() {
    // Get and trim values
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const cleanzorID = cleanzorIDInput.value.trim();
    const password = passwordInput.value.trim();

    // Clear previous errors
    [fullNameInput, emailInput, cleanzorIDInput, passwordInput].forEach(input => {
      input.classList.remove('error');
    });

    // Validation
    if (fullName === '') {
      alert('Please enter your full name.');
      fullNameInput.classList.add('error');
      fullNameInput.focus();
      return;
    }
    if (fullName.length < 2) {
      alert('Full name must be at least 2 characters long.');
      fullNameInput.classList.add('error');
      fullNameInput.focus();
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address.');
      emailInput.classList.add('error');
      emailInput.focus();
      return;
    }

    if (cleanzorID !== '' && cleanzorID.length < 3) {
      alert('Cleanzor ID must be at least 3 characters long if provided.');
      cleanzorIDInput.classList.add('error');
      cleanzorIDInput.focus();
      return;
    }

    if (password === '') {
      alert('Please enter a password.');
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

    submitButton.disabled = true;
    submitButton.textContent = 'CREATING ACCOUNT...';

    // Firebase signup
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        localStorage.setItem('userFullName', fullName);
        if (cleanzorID) {
          localStorage.setItem('userCleanzorID', cleanzorID);
        }

        window.showLoadingAndRedirect('index.html'); 
      })
      .catch((error) => {
        console.error('Signup error:', error);
        let errorMessage = 'Signup failed. Please try again.';
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'An account with this email already exists. Please log in.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. Use at least 6 characters.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
          default:
            errorMessage = error.message || 'An unexpected error occurred.';
        }
        alert(errorMessage);

        emailInput.classList.add('error');
        passwordInput.value = '';
        emailInput.focus();

        submitButton.disabled = false;
        submitButton.textContent = 'Create Account';
      });
  }

  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.showLoadingAndRedirect('index.html');
    });
  }
});
