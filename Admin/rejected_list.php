<?php
  $title = "LEFMOGIV | Reject List";
  $title_short = "RL";
  include 'session/admin_session_check.php'; 
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title>LEFMOGIV | Reject List</title>
  <meta content="" name="description">
  <meta content="" name="keywords">
  
  <link href="assets/img/Layer 1.png" rel="icon">
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
 
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-firestore.js"></script>

  <link href="assets/css/reject.css" rel="stylesheet">
  <link href="assets/css/modalcss/applicantview.css" rel="stylesheet">
</head>
<body>
  <header id="header" class="header fixed-top d-flex align-items-center">
    <div class="d-flex align-items-center justify-content-between">
      <a href="../index.php" class="logo d-flex align-items-center">
        <img src="assets/img/Layer 1.png" alt="">
        <span class="d-none d-lg-block">LEFMOGIV</span>
      </a>
      <i class="bi bi-list toggle-sidebar-btn"></i>
    </div>
    <nav class="header-nav ms-auto">
      <ul class="d-flex align-items-center">
        <li class="nav-item d-block d-lg-none">
          <a class="nav-link nav-icon search-bar-toggle " href="#">
            <i class="bi bi-search"></i>
          </a>
        </li>
        <li class="nav-item dropdown pe-3">
        <button id="actionButton" class=" btn-confirm-reject" style="display: none;" onclick="confirmArchiveUser('${user.id}', '${user.username}')">Delete</button>
        </li> 
        <li class="nav-item dropdown">
        </li>
        <li class="nav-item dropdown pe-3">

          <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
            <span id="dropdown-username" class="d-none d-md-block dropdown-toggle ps-2">
              <?php echo htmlspecialchars($_SESSION['username']);?>
            </span>
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

  <?php
  include("includes/nav_list.php");
  ?>

  <main id="main">
  <div class="main-inner">
    <div class="container">
      <div class="section-header">
        <h1 style="font-size: 24px; font-weight: 700;">Rejected Applicant List</h1>
        <p style="font-size: 17px; font-weight: 400;">Home / Applicant / Rejected Applicant</p>
        </div>
          <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <div class="table-responsive table-container">
                        <table class="table custom-table" id="table-1">
                        <thead>
                              <tr>
                                  <th class="text-center">
                                      <div class="form-check form-check-inline">
                                          <input class="form-check-input" type="checkbox" id="selectAll" onclick="toggleCheckbox(this)">
                                          <label class="form-check-label" for="selectAll"></label>
                                      </div>
                                  </th>
                                  <th>
                                      <div style="display: flex; justify-content: space-between; align-items: center;">
                                          <span>Applicant Name</span>
                                          <div style="display: flex; flex-direction: column; align-items: center;">
                                              <i class="bi bi-caret-up-fill" onclick="sortTable('name', 'asc')" style="cursor: pointer; font-size: 0.7rem; opacity: 0.7;"></i>
                                              <i class="bi bi-caret-down-fill" onclick="sortTable('name', 'desc')" style="cursor: pointer; font-size: 0.7rem; margin-top: -7px; opacity: 0.7;"></i>
                                          </div>
                                      </div>
                                  </th>
                                  <th class="text-center">
                                      <div style="display: flex; justify-content: space-between; align-items: center;">
                                          <span>Rejection Date</span>
                                          <div style="display: flex; flex-direction: column; align-items: center;">
                                              <i class="bi bi-caret-up-fill" onclick="sortTable('rejectionDate', 'asc')" style="cursor: pointer; font-size: 0.7rem; opacity: 0.7;"></i>
                                              <i class="bi bi-caret-down-fill" onclick="sortTable('rejectionDate', 'desc')" style="cursor: pointer; font-size: 0.7rem; margin-top: -7px; opacity: 0.7;"></i>
                                          </div>
                                      </div>
                                  </th>
                                  <th class="text-center">
                                      <div style="display: flex; justify-content: space-between; align-items: center;">
                                          <span>Days Since Rejection</span> <!-- New column header -->
                                      </div>
                                  </th>
                                  <th class="text-center">Status</th>
                                  <th class="text-center">Action</th>
                              </tr>
                          </thead>
                                <tbody id="table-1-body">
                                    <tr id="noDataRow" style="display: none;">
                                        <td colspan="6" class="text-center">No user found</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div id="pagination-reject" class="pagination-container">
                            <div class="pagination-content">
                                <span>Page </span>
                                <span id="currentPageReject" class="pagination-number">1</span>
                            </div>
                            <div class="pagination-info">
                                <span id="itemRangeReject">Showing 1-1 of 1 items</span>
                            </div>
                            <button id="prevPageReject" class="pagination-button" aria-label="Previous">
                                <i class="bi bi-caret-left-fill"></i>
                            </button>
                            <button id="nextPageReject" class="pagination-button" aria-label="Next">
                                <i class="bi bi-caret-right-fill"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
<!-- Confirmation Modal -->
<div id="confirmModal" class="applicant-modal" style="display: none;">
    <div class="modal-content-rejectuser">
        <h3 class="modal-title title-reject">Remove User</h3>
        <div class="modal-title-sure">Are you sure you want to remove this user?</div>
        <div class="modal-actions">
            <button class="btn btn-cancel" id="cancelButton">Cancel</button>
            <button class="btn btn-ok" id="confirmButton">Confirm</button>
        </div>
    </div>
</div>

<!-- Success Modal -->
<div id="successModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-rejectuser">
        <h3 class="modal-title title-reject">Remove Success</h3>
        <div class="modal-title-sure">User is no longer on rejected page</div>
        <div class="modal-actions">
            <button id="closeSuccessModal" class="btn btn-ok">Close</button>
        </div>
    </div>
</div>

<!-- fetching form or details -->
<div id="loadingModal" class="applicant-modal-fetch" style="display: none;">
    <div class="modal-content-rejectuser-fetch">
        <i class="bi bi-file-earmark-person-fill" style="font-size: 3em; color: #4154f1; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;"></i>
        <h3 class="modal-title title-reject-fetch">Fetching User Data</h3>
    </div>
</div>

<!-- Details -->
<div id="detailsModal" class="applicant-modal">
    <div class="modal-content-rejectuser">
        <div class="modal-header">
            <span class="close-icon" onclick="closeModal()">&times;</span>
            <h3 class="user-details-heading">User Details</h3>
        </div>
        <div id="detailsContent"></div>
        <div class="modal-actions">
            <button class="btn btn-ok-details" onclick="closeModal()">Close</button>
        </div>
    </div>
</div>

<!-- Profile -->
<div id="profileModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-confirmuser">
        <h3 class="modal-title title-approve">Profile Image</h3>
        <div class="modal-body">
            <img id="modalProfileImage" src="" alt="Profile Picture" style="max-width: 100%; height: auto;"/>
        </div>
        <div class="modal-actions">
            <button class="btn btn-confirm" onclick="closeProfileModal()">Close</button>
        </div>
    </div>
</div>

<div id="viewModal" class="unique-view-applicant-modal">
    <div class="unique-view-modal-content">
    <div class="unique-view-modal-header">
        <img src="assets/img/Layer 1.png" alt="Logo" class="logo-image unique-logo">
        <div class="header-text">
            <h1 class="unique-view-modal-title">Applicant Information Form</h1>
            <div class="unique-view-modal-details">Details of the information provided during registration.
            </div>
        </div>
    </div>
        <div class="step-indicator-title-container">
            <h3 class="step-indicator-title">View / Application Form Details</h3>
            <span class="icon-container">
                <i class="bi bi-info-circle icon" data-tooltip="Application form data has been retrieved from user's registration process, including the correct steps."></i>
            </span>
        </div>
        <div class="two-column-layout-all">
            <div class="step-indicators">
                <h4 class="step-indicator-title-1">Form Steps</h4> 
                <div id="stepIndicator1" class="step-indicator">STEP 1</div>
                <div id="stepIndicator2" class="step-indicator">STEP 2</div>
                <div id="stepIndicator3" class="step-indicator">STEP 3</div>
                <div id="stepIndicator4" class="step-indicator">STEP 4</div>
                <div id="stepIndicator5" class="step-indicator">STEP 5</div>
                <div class="unique-view-modal-actions">
                    <button id="prevBtn" class="prev-button" onclick="prevStep()">Previous</button>
                    <button id="nextBtn" class="next-button" onclick="nextStep()">Next</button>
                </div>
            </div>
            <div class="unique-view-modal-body">
                <div id="step1" class="unique-view-modal-step modal-step">Step 1 Content</div>
                <div id="step2" class="unique-view-modal-step modal-step">Step 2 Content</div>
                <div id="step3" class="unique-view-modal-step modal-step">Step 3 Content</div>
                <div id="step4" class="unique-view-modal-step modal-step">Step 4 Content</div>
                <div id="step5" class="unique-view-modal-step modal-step">Step 5 Content</div>
            </div>
        </div>
        <div class="unique-view-modal-close">
            <button class="cancel-button" onclick="closeViewModal()">Close</button>
        </div>
    </div>
</div>
</main>
  <!-- <script src="assets/vendor/apexcharts/apexcharts.min.js"></script>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/chart.js/chart.umd.js"></script>
  <script src="assets/vendor/echarts/echarts.min.js"></script>
  <script src="assets/vendor/quill/quill.js"></script>
  <script src="assets/vendor/simple-datatables/simple-datatables.js"></script>
  <script src="assets/vendor/tinymce/tinymce.min.js"></script>
  <script src="assets/js/main.js"></script> -->

  <?php include("includes/footer.php");?>
  <!-- Our js -->
  <script type="module" src="assets/js/rejectapplicant.js"></script>
  <script src="assets/js/rejectfunct.js"></script>
  <script src="assets/modal/rejectview.js"></script>
</body>
</html>

<style>
.active-nav{
  color: #4154f1;
  font-size: 16px;
}
</style>