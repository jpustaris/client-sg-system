<?php
include 'session/admin_session_check.php';
$title = "LEFMOGIV | Approved List";
$title_short = "AL";
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title><?php echo $title;?></title>
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

  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-storage.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script> 

  <link href="assets/css/approve.css" rel="stylesheet">
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
        <li class="nav-item dropdown">
        </li>
        <li class="nav-item dropdown pe-3">
          <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
            <span id="dropdown-username" class="d-none d-md-block dropdown-toggle ps-2">
              <?php echo htmlspecialchars($_SESSION['username']);  ?>
            </span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
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
  
  <?php include("includes/nav_list.php");?>


  <main id="main">
    <div class="main-inner">
      <div class="container">
         <!-- Section Header -->
<!-- Section Header -->
<!-- Section Header -->
<div class="section-header">
    <div class="header-top">
        <h1 style="font-size: 24px; font-weight: 700;">Approved Applicants</h1>
        <p style="font-size: 17px; font-weight: 400;">Home / Applicants / Approve</p>
    </div>
</div>




                         <div class="row">
                            <div class="col-lg-12">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="table-responsive table-container">
                                            <table class="table custom-table" id="table-1">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <div style="display: flex; justify-content: space-between; align-items: center;">
                                                            <span>Applicant Name</span>
                                                            <div style="display: flex; flex-direction: column; align-items: center;">
                                                                <i class="bi bi-caret-up-fill" onclick="sortTable('name', 'asc')" style="cursor: pointer; font-size: 0.7rem; opacity: 0.7;"></i>
                                                                <i class="bi bi-caret-down-fill" onclick="sortTable('name', 'desc')" style="cursor: pointer; font-size: 0.7rem; margin-top: -7px; opacity: 0.7;"></i>
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th>Email</th>
                                                    <!-- <th class="text-center">View Upload</th> -->
                                                    <th class="text-center">Action</th>
                                                    <th class="text-center">Details</th>
                                                </tr>
                                            </thead>


                                            <tbody id="table-1-body">
                                            <tbody id="table-1-body" class="table-body">
                                          <tr id="noDataRow" style="display: none;">
                                              <td colspan="6" class="text-center"  style="height: 492px;">No user found</td>
                                          </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div id="pagination" class="pagination-container">
                                        <div class="pagination-content">
                                            <span>Page </span>
                                            <span id="currentPage" class="pagination-number">1</span>
                                        </div>
                                        <div class="pagination-info">
                                            <span id="itemRange">Showing 1-1 of 1 items</span> 
                                        </div>
                                        <button id="prevPage" class="pagination-button" aria-label="Previous">
                                            <i class="bi bi-caret-left-fill"></i>
                                        </button>
                                        <button id="nextPage" class="pagination-button" aria-label="Next">
                                            <i class="bi bi-caret-right-fill"></i>
                                        </button>
                                    </div> 
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
              </div>
  </main>

  <div id="documentModal" class="applicant-modal" style="display: none;">
    <div class="modal-content-approveuser">
        <div class="modal-header">
            <div class="modal-title">201 File Requirements</div>
            <span class="close-icon" onclick="closeModal()">&times;</span>
        </div>

        <div class="document-section-container">
            <div class="document-section" id="documents-section">
                <div class="section-header" style="font-size: 1.3em; font-weight: bold; color: #007bff;">Documents</div>
                <!-- Dynamic document boxes will be inserted here -->
            </div>
        </div>
    </div>
</div>



<div id="confirmModal" class="applicant-modal" style="display: none;">
    <div class="modal-content-approveuser-confirm">
        <h3 class="modal-title title-approve">Set onsite Interview</h3>
        <div class="modal-title-sure">Are you sure you want to interview this user?</div>
        <div class="modal-actions">
            <button class="btn btn-cancel" id="cancelButton">Cancel</button>
            <button class="btn btn-ok" id="confirmApproveButton">Confirm</button>
        </div>
    </div>
</div>

<!-- Modal for Confirming Approve User Action -->
<div id="approveUserModal" class="applicant-modal" style="display: none;">
    <div class="modal-content-approveuser">
        <h3 class="modal-title title-approve">Approve User</h3>
        <div class="modal-title-sure">Are you sure you want to approve this user for the interview?</div>
        <div class="modal-actions">
            <button class="btn btn-cancel" id="cancelApproveButton">Cancel</button>
            <button class="btn btn-ok" id="confirmApproveButton">Confirm</button>
        </div>
    </div>
</div>

<!-- Schedule Interview Modal -->
<div id="scheduleModal" class="applicant-modal" style="display: none;">
    <div class="modal-content-approveuser-schedule">
        <h3 class="modal-title title-approve">Schedule Interview</h3>
        <form id="scheduleForm">
            <div class="form-group">
              <label for="interviewLocation">LEFMOGIV Address</label>
              <input type="text" id="interviewLocation" name="location" placeholder="Enter location here" value="657C+QVW, San Jose, Calamba City, Laguna, Calamba" required>
          </div>
            <div class="form-group">
                <label for="interviewPerson">Look For</label>
                <input type="text" id="interviewPerson" name="person" placeholder="Enter details here" value="Julius" required>
            </div>
            <div class="form-group">
                <label for="interviewDate">Date and Time</label>
                <input type="datetime-local" id="interviewDate" name="datetime" required>
            </div>
            <input type="hidden" id="userId" name="userId">
            <input type="hidden" id="username" name="username">
            <input type="hidden" id="email" name="email">
            <input type="hidden" id="remarks" name="remarks">
            <div class="modal-actions">
                <button type="button" class="btn btn-cancel" id="cancelScheduleButton">Cancel</button>
                <button id="scheduleInterviewBtn" class="btn btn-ok">Schedule Interview</button>
            </div>
        </form>
    </div>
</div>


<div id="contractModal" class="applicant-modal" style="display: none;">
    <div class="modal-content-approveuser-schedule">
        <h3 class="modal-title title-approve">Set Contract Signing</h3>
        <form id="contractForm">
            <div class="form-group">
                <label for="contractDateTime">Date and Time</label>
                <input type="datetime-local" id="contractDateTime" name="datetime" required>
            </div>

            <!-- Hidden form fields for additional user details -->
            <input type="hidden" id="contractUserId" name="userId">
            <input type="hidden" id="contractUsername" name="username">

            <div class="modal-actions">
                <button type="button" class="btn btn-cancel" id="cancelContractButton">Cancel</button>
                <button type="button" class="btn btn-ok" onclick="setContract()">Set Contract</button>
            </div>
        </form>
    </div>
</div>


<div id="proceedModal" class="applicant-modal" style="display: none;">
    <div class="modal-content-approveuser-schedule">
        <h3 class="modal-title title-approve">Proceed to Deployment</h3>
        
        <!-- Modal Body -->
        <div class="modal-body">
            <p><strong>Name:</strong> <span id="username-placeholder"></span></p>
            <p><strong>Email:</strong> <span id="email-placeholder"></span></p>
            
            <div class="form-group">
                <label for="contractStartDate">Contract Start Date:</label>
                <input type="date" id="contractStartDate" class="form-control" required>
            </div>

            <div class="form-group">
                <label for="contractEndDate">Contract End Date:</label>
                <input type="date" id="contractEndDate" class="form-control" required>
            </div>

            <!-- Duration Option -->
            <div class="form-group">
                <label for="contractDuration">Contract Duration:</label>
                <button type="button" class="btn btn-info" onclick="setContractDuration(1)">1 Month</button>
                <button type="button" class="btn btn-info" onclick="setContractDuration(3)">3 Months</button>
                <button type="button" class="btn btn-info" onclick="setContractDuration(6)">6 Months (Max)</button>
            </div>

            <p><strong>Deployment Status:</strong> Pending</p>
            <p>Do you want to proceed with the user to deployment?</p>
        </div>

        <!-- Modal Actions -->
        <div class="modal-actions">
            <button type="button" class="btn btn-cancel" onclick="closeProceedModal()">Cancel</button>
            <button type="button" class="btn btn-ok" onclick="proceedWithUser(userId)">Proceed</button>
        </div>
    </div>
</div>




<div id="successModal" class="modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" style="color: green;">Transfer Successful</h5>
                <button type="button" class="btn-close" onclick="closeSuccessModal()" style="color: green;">X</button>
            </div>
            <div class="modal-body" style="color: green;">
                User has been successfully transferred to deployment.
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" onclick="closeSuccessModal()" style="background-color: green; border-color: green; color: white;">OK</button>
            </div>
        </div>
    </div>
</div>


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
<div id="successModal" class="applicant-modal" style="display: none;">
    <div class="modal-content-approveuser-confirm">
        <h3 class="modal-title title-approve">Success</h3>
        <div class="modal-title-sure">The user has been successfully approved and added to the personnel list.</div>
        <div class="modal-actions">
            <button class="btn btn-ok" id="successButton">Done</button>
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

 

  <script src="assets/vendor/apexcharts/apexcharts.min.js"></script>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/chart.js/chart.umd.js"></script>
  <script src="assets/vendor/echarts/echarts.min.js"></script>
  <script src="assets/vendor/quill/quill.js"></script>
  <script src="assets/vendor/simple-datatables/simple-datatables.js"></script>
  <script src="assets/vendor/tinymce/tinymce.min.js"></script>
  <script src="assets/vendor/php-email-form/validate.js"></script>
  <script src="assets/js/main.js"></script>
    <!-- Our js -->
  <script src="assets/js/approve.js"></script>
  <script src="assets/modal/approve.js"></script>
</body>
</html>
<style>
.active-nav{
  color: #4154f1;
  font-size: 16px;
}
</style>