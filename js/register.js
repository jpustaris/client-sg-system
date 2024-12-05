import { auth } from './firebase_init.js';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

const db = getFirestore();

let resendAttempts = parseInt(sessionStorage.getItem('resendAttempts')) || 5;  // Initialize from sessionStorage, fallback to 5
let retryTimeout = null;
let resendTimeout = null;

function clearModalMessages() {
  const messageList = document.getElementById('messageList');
  messageList.innerHTML = '';
}

function displayAlert(title, message, instructionType) {
  const messageList = document.getElementById('messageList');
  messageList.innerHTML = `<li>${message}</li>`;

  const instructionMessage = document.getElementById('instructionMessage');
  const resendTextContainer = document.getElementById('resendTextContainer');
  
  // Save the instruction message to sessionStorage
  sessionStorage.setItem('instructionMessage', message);
  
  switch (instructionType) {
    case 'error':
      instructionMessage.style.color = 'red';
      instructionMessage.textContent = message;
      break;
    case 'success':
      instructionMessage.style.color = 'green';
      instructionMessage.textContent = 'Verification email sent! Please check your inbox.';
      
      // Update the attempt counter
      updateResendAttempts();

      // Immediately show the resend text as soon as email is sent
      resendTextContainer.style.display = 'block';
      
      // Save the state of the resend button to sessionStorage
      sessionStorage.setItem('resendTextVisible', 'true');
      break;
    default:
      instructionMessage.style.color = 'black';
      instructionMessage.textContent = 'Your instructions go here.';
  }

  showModal();
}

function showModal() {
  const messageModal = document.getElementById('messageModal');
  messageModal.style.display = 'block';

  // Save the modal state in sessionStorage
  sessionStorage.setItem('modalShown', 'true');
}

function hideModal() {
  const messageModal = document.getElementById('messageModal');
  messageModal.style.display = 'none';

  // Remove modal state from sessionStorage when it's closed
  sessionStorage.removeItem('modalShown');
}

document.addEventListener('DOMContentLoaded', function() {
  // Check if the modal was shown before and show it if necessary
  const modalState = sessionStorage.getItem('modalShown');
  const savedInstructionMessage = sessionStorage.getItem('instructionMessage');

  if (modalState === 'true') {
    showModal();
    
    // Restore the instruction message if available
    const instructionMessage = document.getElementById('instructionMessage');
    if (savedInstructionMessage) {
      instructionMessage.textContent = savedInstructionMessage;
    }
  }

  const closeModalButton = document.getElementById('closeModal');
  if (closeModalButton) {
    closeModalButton.addEventListener('click', function() {
      hideModal();
    });
  }

  // Setup resend attempts UI
  const resendText = document.getElementById('resendText');
  if (resendText) {
    resendText.addEventListener('click', resendVerificationEmail);
  }

  // Restore the visibility of the resend button if saved in sessionStorage
  const resendTextContainer = document.getElementById('resendTextContainer');
  const resendTextVisible = sessionStorage.getItem('resendTextVisible');
  if (resendTextVisible === 'true') {
    resendTextContainer.style.display = 'block';
  }

  // Restore form input values from sessionStorage
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    const savedValue = sessionStorage.getItem(input.id);
    if (savedValue !== null) {
      input.value = savedValue;
    }

    input.addEventListener('input', function() {
      saveInput(input);
    });
  });
});

function saveInput(input) {
  if (input.type !== 'file') {
    sessionStorage.setItem(input.id, input.value);
  }
}

function toggleLoadingState(button, isLoading) {
  if (isLoading) {
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...';
    button.disabled = true;
  } else {
    button.innerHTML = 'Register';
    button.disabled = false;
  }
}

function updateResendAttempts() {
  const attemptsLeftMessage = document.getElementById('attemptsLeftMessage');
  
  if (attemptsLeftMessage) {
    attemptsLeftMessage.textContent = `${resendAttempts} attempts left`;
  }
  
  // Save the updated attempts count to sessionStorage
  sessionStorage.setItem('resendAttempts', resendAttempts);
}

function resendVerificationEmail() {
  if (resendAttempts > 0 && !retryTimeout) {
    const user = auth.currentUser;

    if (user && !user.emailVerified) {
      sendEmailVerification(user)
        .then(() => {
          resendAttempts--;  // Decrease the remaining attempts count
          displayAlert('Success', 'Verification email resent! Please check your inbox.', 'success');
        })
        .catch((error) => {
          if (error.code === 'auth/too-many-requests') {
            retryTimeout = setTimeout(() => {
              retryTimeout = null;
              displayAlert('Success', 'You can now resend the verification email.', 'success');
            }, 5000);

            displayAlert('Error', 'You have sent too many requests. Please try again in 5 seconds.', 'error');
          } else {
            console.error('Error sending verification email:', error);
            displayAlert('Error', 'There was an error resending the verification email. Please try again.', 'error');
          }
        });
    }
  } else {
    displayAlert('Error', 'No attempts left', 'error');
  }
}


document.getElementById('register-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const registerButton = document.querySelector('button[type="submit"]');
  clearModalMessages();
  if (password.length < 6) {
    displayAlert('Error', 'Password should be at least 6 characters.', 'error');
    return;
  }
  if (password !== confirmPassword) {
    displayAlert('Error', 'Passwords do not match!', 'error');
    return;
  }
  toggleLoadingState(registerButton, true);

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
  
      return sendEmailVerification(user)
        .then(() => {
          displayAlert('Success', 'Verification email sent. Please check your inbox.', 'success');
  
          const moveToTempUsersTimeout = setTimeout(() => {
            setDoc(doc(db, "users", user.uid), {
              email: email,
              application_approved: false,
              is_activated: false,
              role_name: "User",
              email: email,
              username: username,
              time: new Date()
            }).catch((error) => {
              console.error('Error moving user to tempUsers:', error);
            });
          }, 120000);

          const checkVerificationInterval = setInterval(async () => {
            await user.reload();
            if (user.emailVerified) {
              clearInterval(checkVerificationInterval);
              clearTimeout(moveToTempUsersTimeout);
  
              showEmailVerifiedModal();
  
              sessionStorage.setItem('userEmail', user.email);
              sessionStorage.setItem('userName', username);
  
              setTimeout(() => {
                window.location.href = 'applicationform.php';
              }, 3000);
  
              return updateProfile(user, { displayName: username })
                .then(() => {
                  return setDoc(doc(db, "users", user.uid), {
                    email: email,
                    application_approved: false,
                    is_activated: false,
                    role_name: "User",
                    email: email,
                    username: username,
                    time: new Date()
                  });
                })
                .then(() => {
                  displayAlert('Success', 'Registration successful!', 'success');
                })
                .catch((error) => {
                  console.error('Error adding user to Firestore:', error);
                  displayAlert('Error', 'An error occurred. Please try again.', 'error');
                });
            }
          }, 5000);
        });
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        displayAlert('Error', 'Account is already registered.', 'error');
      } else {
        displayAlert('Error', 'An unexpected error occurred.', 'error');
      }
    })
    .finally(() => {
      toggleLoadingState(registerButton, false);
    });
});


// document.getElementById('register-form').addEventListener('submit', function(event) {
//   event.preventDefault();

//   const username = document.getElementById('username').value;
//   const email = document.getElementById('email').value;
//   const password = document.getElementById('password').value;
//   const confirmPassword = document.getElementById('confirm-password').value;
//   const registerButton = document.querySelector('button[type="submit"]');
//   clearModalMessages();
//   if (password.length < 6) {
//     displayAlert('Error', 'Password should be at least 6 characters.', 'error');
//     return;
//   }
//   if (password !== confirmPassword) {
//     displayAlert('Error', 'Passwords do not match!', 'error');
//     return;
//   }
//   toggleLoadingState(registerButton, true);

//   createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
  
//       return sendEmailVerification(user)
//         .then(() => {
//           displayAlert('Success', 'Verification email sent. Please check your inbox.', 'success');
  
//           const moveToTempUsersTimeout = setTimeout(() => {
//             setDoc(doc(db, "tempUsers", user.uid), {
//               email: email,
//               username: username,
//               time: new Date()
//             }).catch((error) => {
//               console.error('Error moving user to tempUsers:', error);
//             });
//           }, 120000);

//           const checkVerificationInterval = setInterval(async () => {
//             await user.reload();
//             if (user.emailVerified) {
//               clearInterval(checkVerificationInterval);
//               clearTimeout(moveToTempUsersTimeout);
  
//               showEmailVerifiedModal();
  
//               sessionStorage.setItem('userEmail', user.email);
//               sessionStorage.setItem('userName', username);
  
//               setTimeout(() => {
//                 window.location.href = 'applicationform.php';
//               }, 3000);
  
//               return updateProfile(user, { displayName: username })
//                 .then(() => {
//                   return setDoc(doc(db, "unapproveUsers", user.uid), {
//                     email: email,
//                     username: username,
//                     Approved: false,
//                     time: new Date()
//                   });
//                 })
//                 .then(() => {
//                   displayAlert('Success', 'Registration successful!', 'success');
//                 })
//                 .catch((error) => {
//                   console.error('Error adding user to Firestore:', error);
//                   displayAlert('Error', 'An error occurred. Please try again.', 'error');
//                 });
//             }
//           }, 5000);
//         });
//     })
//     .catch((error) => {
//       if (error.code === 'auth/email-already-in-use') {
//         displayAlert('Error', 'Account is already registered.', 'error');
//       } else {
//         displayAlert('Error', 'An unexpected error occurred.', 'error');
//       }
//     })
//     .finally(() => {
//       toggleLoadingState(registerButton, false);
//     });
// });



function showEmailVerifiedModal() {
  const modal = document.getElementById('emailVerifiedModal');
  modal.style.display = 'block';

  setTimeout(() => {
    window.location.href = 'applicationform.php';
  }, 40000);
}


document.addEventListener('DOMContentLoaded', function() {
  // Restore checkbox state from sessionStorage when the page reloads
  const termsCheckbox = document.getElementById('terms');
  const savedTermsState = sessionStorage.getItem('termsChecked');

  // If the checkbox state exists in sessionStorage, set it to the saved value
  if (savedTermsState === 'true') {
    termsCheckbox.checked = true;
  } else {
    termsCheckbox.checked = false;
  }

  // Add event listener to save the checkbox state whenever it's checked/unchecked
  termsCheckbox.addEventListener('change', function() {
    const isChecked = termsCheckbox.checked;
    sessionStorage.setItem('termsChecked', isChecked.toString());
  });
});




document.addEventListener('DOMContentLoaded', function() {
  const loginContainer = document.getElementById('login-container');
  if (loginContainer) {
    loginContainer.classList.add('fade-in');
  }

  // Password field for main password
  const passwordField = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');

  // Restore password field value from sessionStorage
  const savedPassword = sessionStorage.getItem('password');
  if (savedPassword) {
    passwordField.value = savedPassword;
  }

  // Check if password visibility is toggled and restore its state
  const savedPasswordVisible = sessionStorage.getItem('passwordVisible') === 'true';
  if (savedPasswordVisible) {
    passwordField.setAttribute('type', 'text');
    togglePassword.classList.add('fa-eye-slash');
  } else {
    passwordField.setAttribute('type', 'password');
    togglePassword.classList.remove('fa-eye-slash');
  }

  // Check if password field has any value and show the eye icon accordingly
  if (passwordField.value.length > 0) {
    togglePassword.style.display = 'block'; // Show the icon if there's value
  } else {
    togglePassword.style.display = 'none'; // Hide the icon if there's no value
  }

  // Show the toggle icon if password field has value
  passwordField.addEventListener('input', function() {
    if (passwordField.value.length > 0) {
      togglePassword.style.display = 'block'; // Show the icon
    } else {
      togglePassword.style.display = 'none'; // Hide the icon
    }

    // Save the password value to sessionStorage
    sessionStorage.setItem('password', passwordField.value);
  });

  // Toggle password visibility and save state in sessionStorage
  togglePassword.addEventListener('click', function() {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
    
    // Save visibility state to sessionStorage
    sessionStorage.setItem('passwordVisible', type === 'text' ? 'true' : 'false');
  });

  // Password field for confirm password
  const confirmPasswordField = document.getElementById('confirm-password');
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

  // Restore confirm password field value from sessionStorage
  const savedConfirmPassword = sessionStorage.getItem('confirmPassword');
  if (savedConfirmPassword) {
    confirmPasswordField.value = savedConfirmPassword;
  }

  // Check if confirm password visibility is toggled and restore its state
  const savedConfirmPasswordVisible = sessionStorage.getItem('confirmPasswordVisible') === 'true';
  if (savedConfirmPasswordVisible) {
    confirmPasswordField.setAttribute('type', 'text');
    toggleConfirmPassword.classList.add('fa-eye-slash');
  } else {
    confirmPasswordField.setAttribute('type', 'password');
    toggleConfirmPassword.classList.remove('fa-eye-slash');
  }

  // Check if confirm password field has any value and show the eye icon accordingly
  if (confirmPasswordField.value.length > 0) {
    toggleConfirmPassword.style.display = 'block'; // Show the icon if there's value
  } else {
    toggleConfirmPassword.style.display = 'none'; // Hide the icon if there's no value
  }

  // Show the toggle icon if confirm password field has value
  confirmPasswordField.addEventListener('input', function() {
    if (confirmPasswordField.value.length > 0) {
      toggleConfirmPassword.style.display = 'block'; // Show the icon
    } else {
      toggleConfirmPassword.style.display = 'none'; // Hide the icon
    }

    // Save the confirm password value to sessionStorage
    sessionStorage.setItem('confirmPassword', confirmPasswordField.value);
  });

  // Toggle confirm password visibility and save state in sessionStorage
  toggleConfirmPassword.addEventListener('click', function() {
    const type = confirmPasswordField.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordField.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');

    // Save visibility state to sessionStorage
    sessionStorage.setItem('confirmPasswordVisible', type === 'text' ? 'true' : 'false');
  });
});
