<?php
include 'session/applicant_session_check.php'; // Adjust the path if necessary
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title>Applicant | Profile</title>
  <link href="../assets/img/Layer 1.png" rel="icon">
  <meta content="" name="description">
  <meta content="" name="keywords">
  <link href="assets/img/favicon.png" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">

  <!-- Google Fonts -->
  <link href="https://fonts.gstatic.com" rel="preconnect">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">

  <!-- Vendor CSS Files -->
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
<script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-storage.js"></script>

  <link href="assets/css/status.css" rel="stylesheet">
  <link href="assets/css/applicantprofile.css" rel="stylesheet">
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
      </li>
      <li class="nav-item dropdown pe-3">
        <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
        <span id="dropdown-username" class="d-none d-md-block dropdown-toggle ps-2">
              <?php echo htmlspecialchars($_SESSION['username']);  ?>        </a><!-- End Profile Image Icon -->
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
        <a class="nav-link collapsed" href="#">
          <i class="bi bi-person-circle"></i>
          <span style="color: #4154f1" >Profile</span>
        </a>
      </li>
  </aside>
  <main id="main" class="main">
    <div class="pagetitle">
      <h1>Profile Details</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item">Home</li>
          <li class="breadcrumb-item">Profile Settings</li>
        </ol>
      </nav>
    </div><!-- End Page Title -->
    <section class="section profile">
      <div class="row">
      <div class="col-xl-4">
          <div class="card shadow border-0">
              <div class="card-body profile-card pt-4 d-flex flex-column align-items-center">
                  <!-- Profile Image -->
                  <div class="profile-image-wrapper mb-3">
                      <img id="profileImage" src="assets/img/images.jpg" alt="Profile" class="profile-image">
                  </div>

                  <!-- Dynamic Status Div -->
                  <div id="approvalStatus" class="status-div status-retrieving">Status: Retrieving Data...</div>

                  <!-- Applicant Name -->
                  <div class="applicant-info">
                      <div class="applicant-name" id="applicantName">Applicant Username</div>
                      <div class="applicant-role">Security Personnel</div> <!-- Removed ID -->
                  </div>
                    </div>
          </div>
      </div>



        <div class="col-xl-8">
          <div class="card">
            <div class="card-body pt-3">
              <ul class="nav nav-tabs nav-tabs-bordered">
                <li class="nav-item">
                  <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Profile</button>
                </li>
                <li class="nav-item">
                  <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Edit Profile</button>
                </li>
                <li class="nav-item">
                  <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password">Change Password</button>
                </li>
              </ul>
              <div class="tab-content pt-2">
                <div class="tab-pane fade show active profile-overview" id="profile-overview">
                <h5 class="card-title">Profile Details</h5>

                  <div class="row">
                      <div class="col-lg-3 col-md-4 label">Full Name</div>
                      <div class="col-lg-9 col-md-8" id="fullName">No Data</div>
                  </div>

                  <div class="row">
                      <div class="col-lg-3 col-md-4 label">Address</div>
                      <div class="col-lg-9 col-md-8" id="address">No Data</div>
                  </div>

                  <div class="row">
                      <div class="col-lg-3 col-md-4 label">Phone</div>
                      <div class="col-lg-9 col-md-8" id="phone">No Data</div>
                  </div>

                  <div class="row">
                      <div class="col-lg-3 col-md-4 label">Email</div>
                      <div class="col-lg-9 col-md-8" id="email">No Data</div>
                  </div>

                </div>
                <div class="tab-pane fade profile-edit pt-3" id="profile-edit">
                  <form id="profileForm">
                  <div class="profile-image-section">
                    <label for="profileImageInput" class="profile-image-label">Profile Image</label>
                    <div class="profile-image-actions">
                      <input type="file" id="profileImageInput" class="profile-image-input" />
                      <a href="#" class="change-btn-upload" id="uploadImageButton" title="Upload new profile image">
                        <i class="bi bi-upload"></i> Upload
                      </a>
                      <a href="#" class="change-btn-remove" id="removeImageButton" title="Remove my profile image">
                        <i class="bi bi-trash"></i> Remove
                      </a>
                    </div>
                  </div>
                  </form><!-- End Profile Edit Form -->
                </div>


                <div class="tab-pane fade pt-3" id="profile-change-password">
                <form id="changePasswordForm">
  <div class="row mb-3">
    <label for="currentPassword" class="col-md-4 col-lg-3 col-form-label">Current Password</label>
    <div class="col-md-8 col-lg-9">
      <input name="password" type="password" class="form-control" id="currentPassword">
    </div>
  </div>
  <div class="row mb-3">
    <label for="newPassword" class="col-md-4 col-lg-3 col-form-label">New Password</label>
    <div class="col-md-8 col-lg-9">
      <input name="newpassword" type="password" class="form-control" id="newPassword">
    </div>
  </div>
  <div class="row mb-3">
    <label for="renewPassword" class="col-md-4 col-lg-3 col-form-label">Re-enter New Password</label>
    <div class="col-md-8 col-lg-9">
      <input name="renewpassword" type="password" class="form-control" id="renewPassword">
    </div>
  </div>
  <div class="text-center">
    <button type="submit" class="btn btn-primary">Change Password</button>
  </div>
</form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main><!-- End #main -->


  <!-- Modal for success/error messages -->
<div class="modal fade" id="passwordChangeModal" tabindex="-1" aria-labelledby="passwordChangeModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="passwordChangeModalLabel">Password Change Status</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="passwordChangeMessage">
        <!-- Success or error message will be inserted here -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

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

  <script src="assets/js/user.js"></script>
  <script src="assets/js/userprofile.js"></script>
</body>
</html>
