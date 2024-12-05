<?php
$title = "LEFMOGIV | Security Personnel";
$title_short = "SP";
include 'session/admin_session_check.php'; 

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title> <?php echo $title; ?> </title>
  <meta content="" name="description">
  <meta content="" name="keywords">
  <link href="../assets/img/Layer 1.png" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">
  <link href="https://unpkg.com/feather-icons"rel="preconnect">
  <link href="https://fonts.gstatic.com" rel="preconnect">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">
  <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
  <link href="assets/vendor/quill/quill.snow.css" rel="stylesheet">
  <link href="assets/vendor/quill/quill.bubble.css" rel="stylesheet">
  <link href="assets/vendor/remixicon/remixicon.css" rel="stylesheet">
  <link href="assets/vendor/simple-datatables/style.css" rel="stylesheet">
  <link href="assets/css/personnels.css" rel="stylesheet">
  <link href="assets/css/personnelsmodal/details.css" rel="stylesheet">

  <!-- jspdf -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.26/jspdf.plugin.autotable.min.js"></script>

<script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-firestore.js"></script>

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
    <button id="downloadReportBtn" class="btn btn-primary">Download List Personnels</button>
    <li class="nav-item dropdown">
    </li> 

    <nav class="header-nav ms-auto">
      <ul class="d-flex align-items-center">
        <li class="nav-item d-block d-lg-none">
          <a class="nav-link nav-icon search-bar-toggle " href="#">
            <i class="bi bi-search"></i>
          </a>
        </li><!-- End Search Icon-->
        <li class="nav-item dropdown">

        </li><!-- End Messages Nav -->
        <li class="nav-item dropdown pe-3">
           <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
         <span id="dropdown-username" class="d-none d-md-block dropdown-toggle ps-2">
      <?php echo htmlspecialchars($_SESSION['username']); // Display the username from the session ?>
    </span>
  </a><!-- End Profile Image Icon -->
              
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

  <?php include("includes/nav_list.php");?>

  <main id="main">
  <div class="main-inner">
    <div class="container">
        <div class="section-header">
        <h1 style="font-size: 24px; font-weight: 700;">Security Personnel</h1>
        <p style="font-size: 17px; font-weight: 400;">Home / Applicant / Security Personnel</p>
        </div><!-- End Section Header -->
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
                                      <span>Name</span>
                                        <div style="display: flex; flex-direction: column; align-items: center;">
                                            <i class="bi bi-caret-up-fill" onclick="sortTable('name', 'asc')" style="cursor: pointer; font-size: 0.7rem; opacity: 0.7;"></i>
                                            <i class="bi bi-caret-down-fill" onclick="sortTable('name', 'desc')" style="cursor: pointer; font-size: 0.7rem; margin-top: -7px; opacity: 0.7;"></i>
                                        </div>
                                    </div>
                                </th>
                                <th> Email</th>
                                <th class="text-center"> Status</th>
                                <th class="text-center"> Action</th>
                                <th class="text-center"> Details</th>
                            </tr>
                        </thead>
                        <tbody id="table-1-body" class="table-body">
                        <tr id="noDataRow" style="display: none;">
                                              <td colspan="6" class="text-center">No user found</td>
                                          </tr>
                        </tbody>
                    </table>
                </div><!-- End Table Responsive -->
                <div id="pagination" class="pagination-container">
                        <div class="pagination-content">
                            <span>Page </span>
                            <span id="currentPage" class="pagination-number">1</span>
                        </div>
                        <div class="pagination-info">
                            <span id="itemRange">Showing 1-1 of 1 items</span>
                        </div>
                        <button id="prevPage" class="pagination-button" aria-label="Previous" onclick="previousPage()">
                            <i class="bi bi-caret-left-fill"></i>
                        </button>
                        <button id="nextPage" class="pagination-button" aria-label="Next" onclick="nextPage()">
                            <i class="bi bi-caret-right-fill"></i>
                        </button>
                    </div>
                <!-- End Pagination Container -->
            </div><!-- End Card Body -->
        </div><!-- End Card -->
    </div><!-- End Col-lg-12 -->
    </div><!-- End Row -->
    </div><!-- End Container -->
</div><!-- End Main Inner -->
</main><!-- End Main -->

<div id="viewDetailsModal" class="applicant-modal">
    <div class="modal-content-userdetails">
        <div class="modal-header">
            <span class="close-icon" onclick="closeDropdownDetailsModal()">&times;</span>
            <h3 class="user-details-heading">Personnel Details</h3>
        </div>
        <div id="detailsContent">
            <div class="details-row">
                <div class="details-column">
                    <div class="icon-box">
                        <i class="bi bi-person-circle clickable-icon" onclick="handleUserClick()"></i>
                    </div>
                    <p class="icon-text">Details</p> 
                </div>
                <div class="details-column">
                    <div class="icon-box">
                        <i class="bi bi-file-earmark-text clickable-icon" onclick="handleFormClick()"></i>
                    </div>
                    <p class="icon-text">Form</p> 
                </div>
                <div class="details-column">
                    <div class="icon-box">
                        <i class="bi bi-file-earmark clickable-icon" onclick="handleDocumentClick()"></i>
                    </div>
                    <p class="icon-text">Documents</p> 
                </div>
                <div class="details-column">
                    <div class="icon-box">
                        <i class="bi bi-clock-history clickable-icon" onclick="handleHistoryClick()"></i>
                    </div>
                    <p class="icon-text">History</p> 
                </div>
            </div>
        </div>
        <div class="modal-actions">
            <button class="btn btn-ok-details" onclick="closeDropdownDetailsModal()">Close</button>
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



<div id="confirmInterviewModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-confirmuser">
        <h3 class="modal-title title-approve">Complete hiring process?</h3>
        <div class="modal-title-sure">Are you sure you want to mark as complete?</div>
        <div class="modal-actions">
            <button class="btn btn-cancel" onclick="closeConfirmInterviewModal()">Cancel</button>
          <button class="btn btn-confirm" id="confirmButton" onclick="confirmInterviewStatus()">
              <span id="confirmText">Confirm</span>
          </button>
        </div>
    </div>
</div>

<div id="successModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-confirmuser">
        <h3 class="modal-title title-approve">Success</h3>
        <div class="modal-title-sure">Interview successfully completed!</div>
        <div class="modal-actions">
            <button class="btn btn-confirm" onclick="closeSuccessModal()">Close</button>
        </div>
    </div>
</div>
<div id="interviewDetailsModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-confirmuser">
        <h3 class="modal-title">Interview Details</h3>
        <div class="modal-body">
            <p class="data-row"><strong>Username:</strong> <span class="data-value" id="modal-username"></span></p>
            <p class="data-row"><strong>Email:</strong> <span class="data-value" id="modal-email"></span></p>
            <p class="data-row"><strong>Interview Date:</strong> <span class="data-value" id="modal-interviewDate"></span></p>
            <p class="data-row"><strong>Interview Location:</strong> <span class="data-value" id="modal-interviewLocation"></span></p>
        </div>
        <div class="modal-actions">
            <button class="btn btn-confirm" onclick="closeInterviewDetails()">Close</button>
        </div>
    </div>
</div>
<div id="deployModal" class="deploy-modal">
    <div class="deploy-content">
        <span class="close-btn" onclick="closeDeployModal()">&times;</span>
        <h3 class="deploy-header">Deploy Personnel</h3>
        <div class="deploy-body">
            <form id="deployForm" class="deploy-form">
                <div class="form-step deploy-step" id="step1">
                    <div class="deploy-grid">
                        <div class="form-group deploy-form-group">
                            <label for="deploymentGuardName" class="deploy-label">Guard Name:</label>
                            <input type="text" id="deploymentGuardName" class="deploy-input" readonly placeholder="Guard name will populate automatically" />
                        </div>
                        <div class="form-group deploy-form-group">
                            <label for="deploymentEmail" class="deploy-label">Email:</label>
                            <input type="email" id="deploymentEmail" class="deploy-input" readonly placeholder="Email will populate automatically" />
                        </div>
                        <div class="form-group deploy-form-group">
                            <label for="deploymentStatus" class="deploy-label">Status:</label>
                            <input type="text" id="deploymentStatus" class="deploy-input" readonly placeholder="Status will populate automatically" />
                        </div>
                    </div>
                    <button type="button" class="btn btn-next-deploy" onclick="nextStep(2)">Next</button>
                </div>
                <div class="form-step deploy-step" id="step2" style="display: none;">
                    <div class="deploy-grid">
                        <div class="form-group deploy-form-group">
                            <label for="clientInformation" class="deploy-label">Client Information:</label>
                            <div class="custom-select" id="clientInformationContainer" onclick="toggleDropdown()">
                                <div class="custom-select-trigger" id="clientInformationTrigger">
                                    <span>Select a client</span>
                                </div>
                                <div class="custom-options" id="clientInformationOptions" style="display: none;">
                                </div>
                            </div>
                            <div class="invalid-feedback" style="display:none;">Please select a client.</div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-prev-deploy" onclick="nextStep(1)">Previous</button>
                    <button type="button" class="btn btn-next-deploy" onclick="nextStep(3)">Next</button>
                </div>
                <div class="form-step deploy-step" id="step3" style="display: none;">
                    <div class="deploy-grid">
                        <div class="form-group deploy-form-group">
                            <h4 class="deploy-section-title">On-site Date</h4>
                            <label for="onsiteDate" class="deploy-label">Date:</label>
                            <input type="date" id="onsiteDate" class="deploy-input" required />
                        </div>
                        <div class="form-group deploy-form-group">
                            <h4 class="deploy-section-title">Deployment Details</h4>
                            <div class="deploy-row">
                                <div class="deploy-col">
                                    <label for="deploymentStartDate" class="deploy-label">Start Date:</label>
                                    <input type="date" id="deploymentStartDate" class="deploy-input" required />
                                </div>
                                <div class="deploy-col">
                                    <label for="deploymentEndDate" class="deploy-label">End Date:</label>
                                    <input type="date" id="deploymentEndDate" class="deploy-input" required />
                                </div>
                            </div>
                            <div class="deploy-row">
                                <div class="deploy-col">
                                    <label for="shiftStartTime" class="deploy-label">Shift Start Time:</label>
                                    <input type="time" id="shiftStartTime" class="deploy-input" required />
                                </div>
                                <div class="deploy-col">
                                    <label for="shiftEndTime" class="deploy-label">Shift End Time:</label>
                                    <input type="time" id="shiftEndTime" class="deploy-input" required readonly />
                                </div>
                            </div>
                        </div>

                        <div class="form-group deploy-form-group">
                            <h4 class="deploy-section-title">Equipment Details</h4>
                            <div class="deploy-row">
                                <div class="deploy-col">
                                    <label for="equipmentCategory" class="deploy-label">Equipment Category:</label>
                                    <input list="equipmentCategories" id="equipmentCategory" class="deploy-input" placeholder="Select Equipment Category" required />
                                    <datalist id="equipmentCategories">
                                        <option value="Revolvers"></option>
                                        <option value="Pistols"></option>
                                        <option value="Shotguns"></option>
                                    </datalist>
                                </div>

                                <div class="deploy-col">
                                    <label for="equipmentID" class="deploy-label">Serial No.</label>
                                    <input type="text" id="equipmentID" class="deploy-input" required />
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="equipmentDetails" class="deploy-label">Details:</label>
                                <textarea id="equipmentDetails" class="deploy-textarea" required></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="deploy-modal-actions">
                        <button type="button" class="btn btn-prev-deploy" onclick="nextStep(2)">Previous</button>
                        <button id="deployButton" type="button" class="btn btn-submit-deploy" onclick="submitDeployment()">Submit</button>
                        <span id="deployText" class="deploy-text" style="display:none; margin-left: 10px;"></span>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>




<div id="deploySuccessModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-confirmuser">
        <h3 class="modal-title title-approve">Deployment Success</h3>
        <div class="modal-title-sure">The deployment process has been completed successfully!</div>
        <div class="modal-actions">
            <button class="btn btn-confirm" onclick="closeDeploySuccessModal()">Close</button>
        </div>
    </div>
</div>


<!-- Deployment Details Modal -->
<div id="deploymentDetailsModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-confirmuser">
        <h3 class="modal-title title-approve">Deployment Details</h3>

        <!-- Error Message -->
        <div id="detailsContent"></div>

        <!-- Personnel Information Section -->
        <h4 class="detail-header">Personnel Information</h4>
        <p class="data-row"><strong>Username:</strong> <span class="data-value" id="username">Loading...</span></p>
        <p class="data-row"><strong>Email:</strong> <span class="data-value" id="email">Loading...</span></p>
        <p class="data-row"><strong>Status:</strong> <span class="data-value" id="status">Loading...</span></p>

        <!-- Duty Details Order Section -->
        <h4 class="detail-header">Duty Details Order</h4>
        <p class="data-row"><strong>Company Name:</strong> <span class="data-value" id="companyName">Loading...</span></p>
        <p class="data-row"><strong>Equipment Released:</strong> <span class="data-value" id="equipmentReleased">Loading...</span></p>
        <p class="data-row"><strong>Start Date:</strong> <span class="data-value" id="startDate">Loading...</span></p>
        <p class="data-row"><strong>End Date:</strong> <span class="data-value" id="endDate">Loading...</span></p>
        <p class="data-row"><strong>Updated At:</strong> <span class="data-value" id="updatedAt">Loading...</span></p>

        <div class="modal-actions">
            <button class="btn btn-confirm" onclick="closeDeploymentDetailsModal()">Close</button>
        </div>
    </div>
</div>

<!-- End  -->
<div id="pdfPreviewModal" class="modal">
    <div class="modal-content">
        <iframe id="pdfPreviewFrame" width="100%" height="500px"></iframe>
        <button onclick="downloadPDF()">Download PDF</button>
    </div>
</div>

<div id="relieveModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-confirmuser">
        <h3 class="modal-title title-approve">Relieve User</h3>
        <div class="modal-title-sure">
            <textarea id="relieveReason" placeholder="Enter reason for relieving the user"></textarea>
        </div>
        <div class="modal-actions">
            <button class="btn btn-cancel" onclick="closeRelieveModal()">Cancel</button>
            <button class="btn btn-confirm" onclick="confirmRelieve()">Confirm</button>
        </div>
    </div>
</div>

<div id="reassignModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-confirmuser">
        <h3 class="modal-title title-approve">Reassign User</h3>
        <div class="modal-actions">
            <button class="btn btn-cancel" onclick="closeReassignModal()">Cancel</button>
            <button class="btn btn-confirm" onclick="confirmReassign()">Confirm</button>
        </div>
    </div>
</div>

<div id="relieveSuccessModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-confirmuser">
        <h3 class="modal-title title-approve">Relieve Success</h3>
        <div class="modal-title-sure">
            The user has been relieved successfully.
        </div>
        <div class="modal-actions">
            <button class="btn btn-confirm" onclick="closeRelieveSuccessModal()">Close</button>
        </div>
    </div>
</div>

<div id="reassignSuccessModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-confirmuser">
        <h3 class="modal-title title-approve">Reassign Success</h3>
        <div class="modal-title-sure">
            The user has been reassigned successfully.
        </div>
        <div class="modal-actions">
            <button class="btn btn-confirm" onclick="closeReassignSuccessModal()">Close</button>
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
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="assets/js/main.js"></script>

  <!-- Our JS -->
  <script src="assets/js/personnels.js"></script>
  <script src="assets/js/expirationupdate.js"></script>

</body>
</html>
<style>
.active-nav{
  color: #4154f1;
  font-size: 16px;
}
</style>