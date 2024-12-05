<?php
include 'session/applicant_session_check.php'; // Adjust the path if necessary
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title>Company Details</title>
  <meta content="" name="description">
  <meta content="" name="keywords">
  <meta content="" name="description">
  <meta content="" name="keywords">
  
  <link href="../assets/img/Layer 1.png" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">

  <link href="https://fonts.gstatic.com" rel="preconnect">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">
  
  <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
  <link href="assets/vendor/quill/quill.snow.css" rel="stylesheet">
  <link href="assets/vendor/quill/quill.bubble.css" rel="stylesheet">
  <link href="assets/vendor/remixicon/remixicon.css" rel="stylesheet">
  <link href="assets/vendor/simple-datatables/style.css" rel="stylesheet">

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

  <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-firestore.js"></script>

  <link href="assets/css/report.css" rel="stylesheet">
  <link href="assets/css/company.css" rel="stylesheet">

</head>

<body>
  <header id="header" class="header fixed-top d-flex align-items-center">
    <div class="d-flex align-items-center justify-content-between">
      <a href="../index.php" class="logo d-flex align-items-center">
        <img src="../assets/img/Layer 1.png" alt="">
        <span class="d-none d-lg-block">LEFMOGIV</span>
      </a>
      <i class="bi bi-list toggle-sidebar-btn"></i>
    </div><!-- End Logo -->


    <nav class="header-nav ms-auto">
      <ul class="d-flex align-items-center">

        

          </ul><!-- End Notification Dropdown Items -->

        </li>
        <li class="nav-item dropdown pe-3">
          <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
          <span id="dropdown-username" class="d-none d-md-block dropdown-toggle ps-2">
              <?php echo htmlspecialchars($_SESSION['username']);  ?>          </a><!-- End Profile Image Icon -->
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
            
              <li>
                  <hr class="dropdown-divider">
              </li>
            
              <li>
                  <hr class="dropdown-divider">
              </li>
              <li>
                  <a class="dropdown-item d-flex align-items-center" href="signout.php" >
                      <i class="bi bi-box-arrow-right"></i>
                      <span>Sign Out</span>
                  </a>
              </li>
          </ul><!-- End Profile Dropdown Items -->
      </li><!-- End Profile Nav -->
      </ul>
    </nav><!-- End Icons Navigation -->
  </header><!-- End Header -->
  <aside id="sidebar" class="sidebar">
    <ul class="sidebar-nav" id="sidebar-nav">
    <li class="nav-heading">Navigation</li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="index.php">
          <i class="bi bi-grid"></i>
          <span >Dashboard</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="upload.php">
          <i class="bi bi-box-arrow-in-down"></i>
          <span>Upload Document</span>
        </a>
      </li>
      <li class="nav-item">
      <a class="nav-link collapsed" href="#">
          <i class="bi bi-building"></i>
          <span style="color: #4154f1">Active Company </span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="deploy.php">
          <i class="bi bi-grid"></i>
          <span >Deployment History</span>
        </a>
      </li>
      <li class="nav-heading">Profile</li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="applicantprofile.php">
          <i class="bi bi-person-circle"></i>
          <span >Profile</span>
        </a>
      </li>
  </aside>


  <main id="main" class="main">
  <div class="pagetitle">
  <h2 class="card-title status-title">Active company</h2>
  <div class="status-wrapper">
    </div>
  </div>

  <div class="col-lg-12">
  <!-- Active Company Card -->
  <div class="card mb-4 active-company-status">
  <div class="card-body">
    <h2 class="card-title status-title">Company Status</h2>
    <p>Current status of your company:</p>
    <div class="info-box">
      <table id="historyTable" class="table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Shift Time</th>
            <th>Equipment Issued</th>
            <th>Equipment Details</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Last Updated</th>

          </tr>
        </thead>
        <tbody>
          <!-- Data rows will be populated here -->
        </tbody>
      </table>
    </div>
  </div>
</div>



      </div>
    </div>
  </div>
</main>

  
  



  <script src="assets/vendor/apexcharts/apexcharts.min.js"></script>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/chart.js/chart.umd.js"></script>
  <script src="assets/vendor/echarts/echarts.min.js"></script>
  <script src="assets/vendor/quill/quill.js"></script>
  <script src="assets/vendor/simple-datatables/simple-datatables.js"></script>
  <script src="assets/vendor/tinymce/tinymce.min.js"></script>
  <script src="assets/vendor/php-email-form/validate.js"></script>
  <script src="assets/js/main.js"></script>
    <!-- Our JS -->

  <script src="assets/js/report.js"></script>

</body>
</html>
