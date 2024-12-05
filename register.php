<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LEFMOGIV | Register</title>
  <link href="assets/img/Layer 1.png" rel="icon">
  <link href="assets/css/register.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
</head>
<body>
<div class="container">
  <div class="image-container">
    <img src="assets/img/register.jpg" alt="Background Image">
  </div>
  <div class="login-container">
    <div class="login-wrapper"> 
      <div class="welcome-container">
        <a href="index.php"><img src="assets/img/Layer 1.png" alt="LEFMOGIV Logo" class="logo"></a>
        <h1>LEFMOGIV Corp.</h1>
      </div>
      <div class="login-form">
        <h2>Welcome! Register to get started.</h2>
        <form id="register-form">
          <div class="form-group">
            <label for="username">Full Name</label>
            <input type="text" id="username" name="username" placeholder="Enter Full Name" required>
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="Enter your email address" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-container">
              <input type="password" id="password" name="password" placeholder="Enter Strong Password" required>
              <i class="fas fa-eye" id="togglePassword" style="display: none; cursor: pointer;"></i>
            </div>
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <div class="password-container">
              <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm Your Password" required>
              <i class="fas fa-eye" id="toggleConfirmPassword" style="display: none; cursor: pointer;"></i>
            </div>
          </div>
          <div class="form-group terms">
            <input type="checkbox" id="terms" name="terms" required>
            <label for="terms">
                I read and understand the <a href="terms.html" target="_blank">terms and conditions</a>
            </label>
        </div>
          <button type="submit">Register</button>
        </form>
        <div class="google-signup">
          <h5>Already have an account? <a href="login.php">Log in here</a></h5>
        </div>
      </div>
    </div>
  </div>

  <div id="messageModal" class="modal" style="display: none;">
  <div class="modal-content">
    <h2 id="modalTitle">
      <img src="assets/img/check.png" alt="Check Icon" /> Messages
    </h2>
    <ul id="messageList"></ul>
    <div class="instruction-box">
      <p id="instructionMessage">Your instructions go here.</p>
    </div>
    <div id="resendTextContainer" style="display: none;">
    <span id="resendText" style="cursor: pointer; color: blue;">Resend Email</span>
      <p id="attemptsLeftMessage"></p> 
    </div>



    <button id="closeModal" class="close-btn">Close</button>
  </div>
</div>

  
  <div id="emailVerifiedModal" class="modal" style="display: none;">
  <div class="modal-content">
    <h2 id="modalTitle">
      <img src="assets/img/check.png" alt="Check Icon" /> Email Verified
    </h2>
    <ul id="messageList">
      <li>Your email has been verified successfully! You will be redirected shortly.</li>
    </ul>
    <div class="instruction-box">
      <p id="instructionMessage">Please wait...</p>
    </div>
  </div>
</div>
  <script type="module" src="js/register.js"></script>

  <div id="tutorialModal" class="tutorialmodal" style="display: none;">
  <div class="tutorial-content">
    <h2>
      Tutorial
    </h2>
    <p>Do you want a tutorial on how to register and log in to LEFMOGIV?</p>
    <div class="button-group">
      <button id="yesButton" class="modal-btn">Yes</button>
      <button id="noButton" class="modal-btn">No</button>
    </div>
  </div>
</div>


</body>
</html>
