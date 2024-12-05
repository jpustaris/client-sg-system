<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LEFMOGIV | Login</title>
  <link href="assets/img/Layer 1.png" rel="icon">
  <link href="assets/css/login.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
  <script type="module" src="https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js"></script>
  <script type="module" src="https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js"></script>
  <script type="module" src="https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js"></script>
</head>
<body>
  <div class="container">
    <div class="image-container">
      <img src="assets/img/Sample.jpg" alt="Background Image">
    </div>
    <div class="login-container" id="login-container">
      <div class="login-wrapper">
        <div class="welcome-container">
          <a href="index.php"><img src="assets/img/Layer 1.png" alt="LEFMOGIV Logo" class="logo"></a>
          <h1>LEFMOGIV Corp.</h1>
        </div>
        <div class="login-form">
          <h2>Log in your account</h2>
          <form id="login-form">
            <div id="login-alert" style="display: none; color: red; margin-bottom: 10px;"></div>
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" name="email" placeholder="Enter your email address" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <div class="password-container">
                <input type="password" id="password" name="password" placeholder="Enter your password" required>
                <i class="fas fa-eye" id="togglePassword" style="display: none; cursor: pointer;"></i>
              </div>
              <div class="forgot-password-container">
                <a href="#" class="forgot-password">Forgot Password</a>
              </div>
            </div>
            <button type="submit">Login</button>
          </form>
          <div class="google-signup">
            <h5>Create an account <a href="register.php">Sign up here</a></h5>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal Structure -->
  <div id="forgotPasswordModal" class="modal">
    <div class="modal-content">
    <div class="header">
    <div class="header-content">
        <h2>Forgot Password</h2>
    </div>
    <span class="close">&times;</span>
</div>
  <!-- Modal Structure -->
      <p class="forgot-password-note">Please enter the correct email address and recieved notification via email</p>
      <div id="loading-spinner" style="display: none; text-align: center;">
        <img src="" alt="Loading..." />
      </div>
      <form id="forgot-password-form">
        <div id="forgot-password-message" style="display: none; color: green; margin-bottom: 10px;"></div>
        <div id="forgot-password-error" style="display: none; color: red; margin-bottom: 10px;"></div>
        <div class="form-group">
          <label for="forgot-email">Email Address</label>
          <input type="email" id="forgot-email" name="forgot-email" placeholder="Enter your email address" required>
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  </div>
  <script type="module" src="js/login.js"></script>
</body>
</html>
