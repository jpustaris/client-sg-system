  function togglePasswordVisibility(fieldId) {
    var passwordInput = document.getElementById(fieldId);
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  }

  document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Call a function to handle registration
    registerUser();
  });

  function registerUser() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Call Firebase Authentication method to create a new user
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        // Registration successful
        var user = userCredential.user;
        alert('Registration successful!');
        // Redirect the user or perform additional actions as needed
      })
      .catch(function(error) {
        // Handle errors
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/weak-password') {
          alert('Password should be at least 6 characters.');
        } else {
          alert(errorMessage);
        }
      });
  }

