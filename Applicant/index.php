<?php
include 'session/applicant_session_check.php'; // Adjust the path if necessary
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title>Dashboard</title>
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


  <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-firestore.js"></script>
  <link href="assets/css/style.css" rel="stylesheet">
</head>
<body>
<header id="header" class="header fixed-top d-flex align-items-center">
    <div class="d-flex align-items-center justify-content-between">
      <a href="../index.php" class="logo d-flex align-items-center">
        <img src="../assets/img/Layer 1.png" alt="">
        <span class="d-none d-lg-block">LEFMOGIV</span>
      </a>
      <i class="bi bi-list toggle-sidebar-btn"></i>
    </div>
    <nav class="header-nav ms-auto">
      <ul class="d-flex align-items-center">
          </ul>
        </li>
        <li class="nav-item dropdown pe-3">
          <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
              <span id="dropdown-username" class="d-none d-md-block dropdown-toggle ps-2">
              <?php echo htmlspecialchars($_SESSION['username']);  ?>
          </a>
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
            
              <li>
                  <hr class="dropdown-divider">
              </li>
            
              <li>
                  <hr class="dropdown-divider">
              </li>
              <li>
              <a class="dropdown-item d-flex align-items-center" href="signout.php">
                      <i class="bi bi-box-arrow-right"></i>
                      <span>Sign Out</span>
                  </a>
              </li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>
 
  <aside id="sidebar" class="sidebar">
    <ul class="sidebar-nav" id="sidebar-nav">
    <li class="nav-heading">Navigation</li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="#">
          <i class="bi bi-grid"></i>
          <span style="color: #4154f1">Dashboard</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="upload.php">
          <i class="bi bi-box-arrow-in-down"></i>
          <span>Upload Document</span>
        </a>
      </li>
      <li class="nav-item">
      <a class="nav-link collapsed" href="activeclientreport.php">
          <i class="bi bi-building"></i>
          <span>Active Company </span>
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
        <h1>Applicant Dashboard</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item">Home</li>
                <li class="breadcrumb-item">Dashboard</li>
            </ol>
        </nav>
    </div>

    <!-- Application Status Section -->
    <div class="col-lg-12">
    <div class="card mb-4 application-status">
        <div class="card-body">
            <h2 class="card-title">Application Status</h2>
            <div class="info-box">
                <span>Status:</span> <span id="applicationStatus">To be announced</span>
            </div>
        </div>
    </div>
</div>


        <!-- Interview/Contract Schedule Section -->
        <div class="card mb-4">
            <div class="card-body">
                <h2 class="card-title">Interview / Contract Schedule</h2>
                <p>An interview has been scheduled for the following date and time:</p>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>

    <td>Date</td>
    <td><span id="interviewDate"></span></td>
</tr>
<tr>
    <td>Time</td>
    <td><span id="interviewTime"></span></td>
</tr>
<tr id="locationRow">
    <td>Location</td>
    <td><span id="interviewLocation"></span></td>
</tr>


                    </tbody>
                </table>
            </div>
        </div>

        <!-- Deployment Report Section -->
        <div class="card mb-4">
    <div class="card-body">
        <h2 class="card-title">Deployment Report</h2>
        <p>Details about your deployment:</p>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Field</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Company Name</td> <!-- Changed from Deployment Date -->
                    <td><span id="deploymentDate">To be announced</span></td>
                </tr>
                <tr>
                    <td>Equipment Issued</td> <!-- Changed from Position -->
                    <td><span id="position">To be announced</span></td>
                </tr>
                <tr>
                    <td>Start Date</td> <!-- Department replaced with Start Date -->
                    <td><span id="department">To be announced</span></td>
                </tr>
                <tr>
                    <td>End Date</td> <!-- Location replaced with End Date -->
                    <td><span id="location">To be announced</span></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>


        </div>
    </div>
</main>


  <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>
  <script src="assets/vendor/apexcharts/apexcharts.min.js"></script>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/chart.js/chart.umd.js"></script>
  <script src="assets/vendor/echarts/echarts.min.js"></script>
  <script src="assets/vendor/quill/quill.js"></script>
  <script src="assets/vendor/simple-datatables/simple-datatables.js"></script>
  <script src="assets/vendor/tinymce/tinymce.min.js"></script>
  <script src="assets/vendor/php-email-form/validate.js"></script>
    <!-- Our JS -->

  <script src="assets/js/main.js"></script>
  <script src="assets/js/contract.js"></script>
  </body>
</html>
