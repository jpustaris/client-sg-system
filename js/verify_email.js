import { auth } from './firebase_init.js';

window.addEventListener('load', async () => {
  const email = new URLSearchParams(window.location.search).get('email');
  if (!email) {
    alert('No email specified.');
    return;
  }

  // Check if the user's email is verified
  auth.currentUser.reload().then(() => {
    if (auth.currentUser.emailVerified) {
      // Complete the registration process
      completeRegistration(email);
    } else {
      alert('Email not verified yet.');
    }
  });
});