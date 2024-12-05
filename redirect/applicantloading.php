<?php
session_start(); // Start the session

error_log("Session username: " . print_r($_SESSION['username'], true));
error_log("Session isApplicant: " . print_r($_SESSION['isApplicant'], true));

if (!isset($_SESSION['username'])) {
    header('Location: ../login.php'); // Redirect to login if not logged in
    exit();
}

// Check if user is an applicant
if (!isset($_SESSION['isApplicant']) || $_SESSION['isApplicant'] !== true) {
    // If the user is not an applicant, redirect to a non-applicant page (e.g., home or dashboard)
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
    font-size: 1em; /* Smaller text size for mobile */
  }
}

  </style>
</head>
<body>
  <div class="loader"></div>
  <div class="loading-text">Loading...</div>
  <script>
    setTimeout(function() {
      window.location.href = '../Applicant/'; 
    }, 2000); 
  </script>
</body>
</html>
