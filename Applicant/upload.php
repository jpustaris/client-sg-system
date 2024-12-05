<?php
include 'session/applicant_session_check.php'; // Adjust the path if necessary
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title>Upload | Document</title>
  <meta content="" name="description">
  <meta content="" name="keywords">
  <meta content="" name="description">
  <meta content="" name="keywords">
  <link href="../assets/img/Layer 1.png" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">
  <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
  <link href="assets/vendor/quill/quill.snow.css" rel="stylesheet">
  <link href="assets/vendor/quill/quill.bubble.css" rel="stylesheet">
  <link href="assets/vendor/remixicon/remixicon.css" rel="stylesheet">
  <link href="assets/vendor/simple-datatables/style.css" rel="stylesheet">
  <!-- Bootstrap JS and Popper.js -->
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-storage.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script> 
  <link href="assets/css/upload.css" rel="stylesheet">
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
              <?php echo htmlspecialchars(string: $_SESSION['username']);  ?>
          </a><!-- End Profile Image Icon -->
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

  <!-- ======= Sidebar ======= -->
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
          <span style="color: #4154f1">Upload Document</span>
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
          <span >Profile</span>
        </a>
      </li>
  </aside>

  <main id="main" class="main">
<!-- Add a section to show the status message above the upload form -->
<div id="uploadStatusMessage" class="alert alert-info" style="display: none;">
  Your documents are still Submit Success.
</div>

<div class="pagetitle">


  <h1>Upload Documents</h1>
  <nav>
    <ol class="breadcrumb">
      <li class="breadcrumb-item">Home</li>
      <li class="breadcrumb-item">Upload</li>
    </ol>
  </nav>
</div><!-- End Page Title -->
<section class="section dashboard">
  <div class="row">
    <div class="col-lg-12">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">201 File Requirements</h5>
          
          <!-- Notice Message -->
          <h6 style="background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; font-size: 1.2em; font-weight: bold; text-align: center; margin-bottom: 20px;">
            Upload correct scanned documents and please wait for approval. You will receive an email with your interview date once approved.
          </h6>

          <!-- Documents Section -->
          <div class="mb-4">
            <h6 class="section-heading" style="font-size: 1.3em; color: #007bff; font-weight: bold;">Documents</h6>
            <div class="row">
              <div class="col-md-4 mb-3" id="pagibig-section">
                <label for="pagibig" class="form-label" style="font-weight: bold;">PAG-IBIG ID</label>
                <input class="form-control" type="file" accept="application/pdf, application/vnd.ms-excel" id="pagibig" name="pagibig">
                <div id="pagibig-status" style="display:none; color: green;">Submit Success</div>
              </div>
              <div class="col-md-4 mb-3" id="tin-section">
                <label for="tin" class="form-label" style="font-weight: bold;">TIN ID</label>
                <input class="form-control" type="file" accept="application/pdf, application/vnd.ms-excel" id="tin" name="tin">
                <div id="tin-status" style="display:none; color: green;">Submit Success</div>
              </div>
              <div class="col-md-4 mb-3" id="sss-section">
                <label for="sss" class="form-label" style="font-weight: bold;">SSS ID</label>
                <input class="form-control" type="file" accept="application/pdf, application/vnd.ms-excel" id="sss" name="sss">
                <div id="sss-status" style="display:none; color: green;">Submit Success</div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 mb-3" id="philhealth-section">
                <label for="philhealth" class="form-label" style="font-weight: bold;">PhilHealth ID</label>
                <input class="form-control" type="file" accept="application/pdf, application/vnd.ms-excel" id="philhealth" name="philhealth">
                <div id="philhealth-status" style="display:none; color: green;">Submit Success</div>
              </div>
            </div>
          </div>

          <!-- Clearance Section -->
          <div class="mb-4">
            <h6 class="section-heading" style="font-size: 1.3em; color: #007bff; font-weight: bold;">Clearance</h6>
            <div class="row">
              <div class="col-md-4 mb-3" id="psa-section">
                <label for="psa" class="form-label" style="font-weight: bold;">PSA</label>
                <input class="form-control" type="file" id="psa" accept="application/pdf, application/vnd.ms-excel" name="psa">
                <div id="psa-status" style="display:none; color: green;">Submit Success</div>
              </div>
              <div class="col-md-4 mb-3" id="diploma-section">
                <label for="diploma" class="form-label" style="font-weight: bold;">Diploma</label>
                <input class="form-control" type="file" id="diploma" accept="application/pdf, application/vnd.ms-excel" name="diploma">
                <div id="diploma-status" style="display:none; color: green;">Submit Success</div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 mb-3" id="police_clearance-section">
                <label for="police_clearance" class="form-label" style="font-weight: bold;">Police Clearance</label>
                <input class="form-control" type="file" accept="application/pdf, application/vnd.ms-excel" id="police_clearance" name="police_clearance">
                <div id="police_clearance-status" style="display:none; color: green;">Submit Success</div>
              </div>
              <div class="col-md-4 mb-3" id="brgy_clearance-section">
                <label for="brgy_clearance" class="form-label" style="font-weight: bold;">Barangay Clearance</label>
                <input class="form-control" type="file" accept="application/pdf, application/vnd.ms-excel" id="brgy_clearance" name="brgy_clearance">
                <div id="brgy_clearance-status" style="display:none; color: green;">Submit Success</div>
              </div>
            </div>
          </div>

          <!-- Certificate / License Section -->
          <div class="mb-4">
            <h6 class="section-heading" style="font-size: 1.3em; color: #007bff; font-weight: bold;">Certificate / License</h6>
            <div class="row">
              <div class="col-md-4 mb-3" id="lesp-section">
                <label for="lesp" class="form-label" style="font-weight: bold;">LESP</label>
                <input class="form-control" type="file" accept="application/pdf, application/vnd.ms-excel" id="lesp" name="lesp">
                <div id="lesp-status" style="display:none; color: green;">Submit Success</div>
              </div>
              <div class="col-md-4 mb-3" id="training_certificate-section">
                <label for="training_certificate" class="form-label" style="font-weight: bold;">Training Certificate</label>
                <input class="form-control" type="file" id="training_certificate" name="training_certificate">
                <div id="training_certificate-status" style="display:none; color: green;">Submit Success</div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 mb-3" id="neuro_and_drugtest-section">
                <label for="neuro_and_drugtest" class="form-label" style="font-weight: bold;">Neuro and Drugtest</label>
                <input class="form-control" type="file" accept="application/pdf, application/vnd.ms-excel" id="neuro_and_drugtest" name="neuro_and_drugtest">
                <div id="neuro_and_drugtest-status" style="display:none; color: green;">Submit Success</div>
              </div>
            </div>
          </div>

          <!-- Upload Button -->
          <div class="text-center">
            <button type="button" class="btn btn-primary" id="uploadBtn" style="padding: 10px 20px; font-size: 1.1em; font-weight: bold; border-radius: 5px;">
              Upload All Files
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</section>





<!-- Approval message for Pag-IBIG -->
<div id="pagibig-status" style="display: none;">Submit Success</div>

<!-- Success Modal -->
<div class="modal" id="successModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="successModalTitle">Success</h5>
        <button type="button" class="btn-close" id="closeSuccessModalBtn"></button>
      </div>
      <div class="modal-body">
        <p id="successMessage">Your action was successful!</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" id="closeSuccessModalBtn">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- Confirmation Modal -->
<div class="modal" id="viewDetailsModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalTitle">Confirm Changes</h5>
        <button type="button" class="btn-close" onclick="closeConfirmationModal()"></button>
      </div>
      <div class="modal-body" id="modalBody">
        <p>Are you sure you want to save changes?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeConfirmationModal()">Cancel</button>
        <button type="button" class="btn btn-primary" id="confirmSaveBtn">OK</button>
      </div>
    </div>
  </div>
</div>


</section>




    
    

  </main>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.2/tinymce.min.js"></script>
<script src="assets/vendor/apexcharts/apexcharts.min.js"></script>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/chart.js/chart.umd.js"></script>
  <script src="assets/vendor/echarts/echarts.min.js"></script>
  <script src="assets/vendor/quill/quill.js"></script>
  <script src="assets/vendor/simple-datatables/simple-datatables.js"></script>
  <script src="assets/vendor/tinymce/tinymce.min.js"></script>
  <script src="assets/vendor/php-email-form/validate.js"></script>
  <!-- Our JS -->
  <script type="module" src="assets/js/upload.js"></script>
  <script src="assets/js/main.js"></script>

</body>
</html>
