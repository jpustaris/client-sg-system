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
  
  // Function to open the modal
  function openModal() {
    document.getElementById('forgotPasswordModal').style.display = 'block';
  }
  
  // Function to close the modal
  function closeModal() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
  }
  
  // Event listener for clicking on "Forgot Password?" link
  document.querySelector('.forgot-password').addEventListener('click', function(event) {
    event.preventDefault();
    openModal();
  });
  
  // Event listener for closing the modal
  document.querySelector('#forgotPasswordModal .close').addEventListener('click', function(event) {
    closeModal();
  });
  
  // Event listener for submitting the "Forgot Password?" form
  document.getElementById('forgot-password-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('forgot-email').value;
  
    try {
      // Query the 'approveusers' collection for the email
      const q = query(collection(db, 'approveusers'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      // Check if any documents match the query
      if (!querySnapshot.empty) {
        // Assuming there's only one document per email, use the first one
        const approveUserDoc = querySnapshot.docs[0];
        
        // Send password reset email
        await sendPasswordResetEmail(auth, email);
        console.log('Password reset email sent to:', email);
        alert('Password reset email sent. Check your inbox.');
        closeModal();
      } else {
        // Email not found in approveusers collection
        console.log('User not found in approveusers collection:', email);
        alert('User not found. Please check your email address.');
      }
    } catch (error) {
      console.error('Error sending password reset email:', error.message);
      alert('Error sending password reset email. Please try again later.');
    }
  });
  