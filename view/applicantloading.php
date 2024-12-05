<?php
session_start(); 
error_log("Session username: " . print_r($_SESSION['username'], true));
error_log("Session isApplicant: " . print_r($_SESSION['isApplicant'], true));
if (!isset($_SESSION['username'])) {
    header('Location: ../login.php'); 
    exit();
}
if (!isset($_SESSION['isApplicant']) || $_SESSION['isApplicant'] !== true) {
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
  <title>Applicant Dashboard</title>
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
    @media (max-width: 600px) {
      .loader {
        width: 20px;
        height: 20px;
      }

      .loading-text {
        font-size: 15px;
        margin-top: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="loader"></div>
  <div class="loading-text">Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?> Logging In</div>
  <script>
    setTimeout(function() {
      window.location.href = '../Applicant/';
    }, 3000); 
  </script>
</body>
</html>
