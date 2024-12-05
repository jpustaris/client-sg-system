<?php
session_start(); // Start the session

error_log("Session username: " . print_r($_SESSION['username'], true));
error_log("Session isAdmin: " . print_r($_SESSION['isAdmin'], true));

if (!isset($_SESSION['username'])) {
    header('Location: ../login.php');
    exit();
}

// Check if user is an admin
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    // If the user is not an admin, redirect to a non-admin page (e.g., home or dashboard)
    header('Location: index.php');
    exit();
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
  <link href="../assets/img/Layer 1.png" rel="icon">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loading</title>
  <style>
   body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  font-family: Arial, sans-serif;
}

.loader {
  border: 8px solid #f3f3f3; 
  border-top: 8px solid #1C1263;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 20px;
  font-size: 1.2em;
  color: #333;
}

/* Mobile Styles */
@media only screen and (max-width: 600px) {
  .loader {
    width: 30px;  /* Smaller size for mobile */
    height: 30px; /* Smaller size for mobile */
    border-width: 5px; /* Adjust border width for mobile */
  }

  .loading-text {
    font-size: 14px; /* Smaller text size for mobile */
  }
}

  </style>
</head>
<body>
  <div class="loader"></div>
  <div class="loading-text">Loading</div>
  <script>
    setTimeout(function() {
      window.location.href = '../Admin/'; // Ensure this path is correct
    }, 2000); 
  </script>
</body>
</html>
