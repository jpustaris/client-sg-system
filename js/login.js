import { auth } from './firebase_init.js';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

const db = getFirestore();

function toggleLoadingState(button, isLoading) {
  if (isLoading) {
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
    button.disabled = true;
  } else {
    button.innerHTML = 'Login';
    button.disabled = false;
  }
}

function displayAlert(alertElement, message) {
  alertElement.textContent = message;
  alertElement.style.display = 'block';
}
document.getElementById('login-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const loginButton = document.querySelector('button[type="submit"]');
  const loginAlert = document.getElementById('login-alert');

  try {
      // Clear previous alert
      loginAlert.style.display = 'none';
      loginAlert.textContent = '';

      // Start loading state
      toggleLoadingState(loginButton, true);

      console.log('Attempting to sign in with email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Sign-in successful, UID:', user.uid);

      // Check if the user document exists in isAdmin collection
      const isAdminDoc = await getDoc(doc(db, "isAdmin", user.uid));
      console.log("isAdminDoc exists:", isAdminDoc.exists());

      if (isAdminDoc.exists() && isAdminDoc.data().isAdmin) {
          // Admin login flow
          const username = isAdminDoc.data().username;
          console.log('Admin logged in:', user.email);
          
          await fetch('../session/set_session.php', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: `username=${encodeURIComponent(username)}&isAdmin=true`
          });

          window.location.href = '../view/adminloading.php';
          return;
      }

      console.log('Checking user in approveusers collection with UID:', user.uid);

      // Check if the user document exists in approveusers collection
      const approveUserDoc = await getDoc(doc(db, "approveusers", user.uid));
      console.log("approveUserDoc exists:", approveUserDoc.exists());

      if (approveUserDoc.exists()) {
          const isApproved = approveUserDoc.data().Approved;
          const username = approveUserDoc.data().username;
          console.log('User data:', approveUserDoc.data());
          
          if (isApproved) {
              await fetch('../session/session_storage_applicant.php', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: `username=${encodeURIComponent(username)}&isAdmin=false`
              });

              console.log('User logged in:', user.email);
              window.location.href = '../view/applicantloading.php';
              return;
          } else {
              console.log('User account is not approved yet.');
              displayAlert(loginAlert, 'Your account is not approved yet. Please wait for admin approval.');
              return;
          }
      }

      console.log('Checking user in personnel collection with UID:', user.uid);

      // Check if the user document exists in personnel collection
      const personnelDoc = await getDoc(doc(db, "personnels", user.uid));
      console.log("personnelDoc exists:", personnelDoc.exists());

      if (personnelDoc.exists()) {
          const isApproved = personnelDoc.data().Approved;
          const username = personnelDoc.data().username;
          console.log('Personnel data:', personnelDoc.data());
          
          if (isApproved) {
            await fetch('../session/session_storage_applicant.php', {
              method: 'POST',
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: `username=${encodeURIComponent(username)}&isAdmin=false`
              });

              console.log('Personnel logged in:', user.email);
              window.location.href = '../view/applicantloading.php';
              return;
          } else {
              console.log('Personnel account is not approved yet.');
              displayAlert(loginAlert, 'Your account is not approved yet. Please wait for admin approval.');
              return;
          }
      }

      console.log('User document not found in any collection.');
      displayAlert(loginAlert, 'Your account is not registered or not approved yet. Please sign up or wait for admin approval.');
  } catch (error) {
      console.error('Error signing in:', error);
      displayAlert(loginAlert, 'Login failed. Please check your email and password.');
  } finally {
      // Stop loading state
      toggleLoadingState(loginButton, false);
  }
});



document.addEventListener('DOMContentLoaded', function() {
  const loginContainer = document.getElementById('login-container');
  if (loginContainer) {
    loginContainer.classList.add('fade-in'); // Add fade-in class
  }

  const passwordField = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');

  passwordField.addEventListener('input', function() {
    if (passwordField.value.length > 0) {
      togglePassword.style.display = 'block';
    } else {
      togglePassword.style.display = 'none';
    }
  });

  togglePassword.addEventListener('click', function() {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
  });
});

function openModal() {
  document.getElementById('forgotPasswordModal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
  document.getElementById('forgotPasswordModal').style.display = 'none';
}

// Function to hide any messages
function hideMessage() {
  const messageElement = document.getElementById('forgot-password-message');
  messageElement.style.display = 'none';
}

// Event listener for clicking on "Forgot Password?" link
document.querySelector('.forgot-password').addEventListener('click', function(event) {
  event.preventDefault();
  openModal();
  hideMessage(); // Clear any existing messages when opening the modal
});

// Event listener for closing the modal
document.querySelector('#forgotPasswordModal .close').addEventListener('click', function(event) {
  closeModal();
});

// Event listener for submitting the "Forgot Password?" form
document.getElementById('forgot-password-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const email = document.getElementById('forgot-email').value;
  const resetButton = event.target.querySelector('button[type="submit"]');

  // Hide any existing messages
  hideMessage();

  // Change button text to loading spinner
  resetButton.innerHTML = 'Processing <div class="spinner"></div>';
  resetButton.disabled = true; // Optionally disable the button to prevent multiple clicks

  try {
    // Query all relevant collections for the email
    const collections = ['approveusers', 'unapproveUsers', 'isAdmin'];
    let userFound = false;
    
    for (const collectionName of collections) {
      const querySnapshot = await getDocs(query(collection(db, collectionName), where('email', '==', email)));
      
      if (!querySnapshot.empty) {
        userFound = true;
        break; // Exit loop if user is found in any collection
      }
    }

    if (userFound) {
      // User found in one of the collections
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent to:', email);
      displaySuccessMessage('Password reset email sent. Check your inbox.');
      
      setTimeout(() => {
        closeModal(); // Close modal after showing success message
      }, 3000);
    } else {
      // Email not found in any of the collections
      console.log('User not found in any collection:', email);
      displayErrorMessage('No user found with that email.');
    }
  } catch (error) {
    console.error('Error sending password reset email:', error);
    displayErrorMessage('Error sending password reset email. Please try again later.');
  } finally {
    resetButton.innerHTML = 'Reset Password';
    resetButton.disabled = false;
  }
});

// Function to display success message inside the modal
function displaySuccessMessage(message) {
  const messageElement = document.getElementById('forgot-password-message');
  messageElement.textContent = message;
  messageElement.style.color = 'green'; // Optionally, you can style the success message
  messageElement.style.display = 'block';
}

// Function to display error message inside the modal
function displayErrorMessage(message) {
  const messageElement = document.getElementById('forgot-password-message');
  messageElement.textContent = message;
  messageElement.style.color = 'red'; // Optionally, you can style the error message
  messageElement.style.display = 'block';
}
