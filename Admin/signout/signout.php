<!DOCTYPE html>
<html lang="en">
<head>
  <link href="../assets/img/Layer 1.png" rel="icon">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Signing out</title>
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
  </style>
</head>

<body>
  <div class="loader"></div>
  <div class="loading-text">Signing out</div>
  <script>
    setTimeout(function() {
      window.location.href = '../index.php'; 
    }, 3000); 
  </script>
</body>
</html>
