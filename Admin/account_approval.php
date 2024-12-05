<?php
  $title = "LEFMOGIV | Account Creation Approval List";
  $title_short = "ACAL";
  include 'session/admin_session_check.php';
  include 'includes/header.php';
?>
  <link href="assets/css/Applicant.css" rel="stylesheet">
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

<?php include 'includes/nav_list.php';?>

  <main id="main">
    <div class="main-inner">
      <div class="container">
        <div class="section-header">
            <h1 style="font-size: 24px; font-weight: 700;">Account Creation Approval List</h1>
            <p style="font-size: 17px; font-weight: 300;">Home / Applicant / Account Creation Approval List</p>
        </div>
          <div class="row">
            <div class="col-lg-12">
              <div class="card">
                <div class="card-body">
                  <div class="table-responsive table-container">
                      <table class="table custom-table" id="table-1">
                              <trhe>
                                 
                               <th>
                                  <div style="display: flex; justify-content: space-between; align-items: center;">
                                      <span>Applicant Name</span>
                                      <div style="display: flex; flex-direction: column; align-items: center;">
                                          <i class="bi bi-caret-up-fill" onclick="sortTable('name', 'asc')" style="cursor: pointer; font-size: 0.7rem; opacity: 0.7;"></i>
                                          <i class="bi bi-caret-down-fill" onclick="sortTable('name', 'desc')" style="cursor: pointer; font-size: 0.7rem; margin-top: -7px; opacity: 0.7;"></i>
                                      </div>
                                  </div>
                              </th>
                              <th>
                                  <div style="display: flex; justify-content: space-between; align-items: center;">
                                      <span>Date Registered</span>
                                      <div style="display: flex; flex-direction: column; align-items: center;">
                                          <i class="bi bi-caret-up-fill" onclick="sortTable('date', 'asc')" style="cursor: pointer; font-size: 0.7rem; opacity: 0.7;"></i>
                                          <i class="bi bi-caret-down-fill" onclick="sortTable('date', 'desc')" style="cursor: pointer; font-size: 0.7rem; margin-top: -7px; opacity: 0.7;"></i>
                                      </div>
                                  </div>
                              </th>
                              <th class="text-center"> Status</th>
                              <th class="text-center"> View Form</th>
                              <th class="text-center"> Action</th>
                              <th class="text-center"> Details</th>
                              </thead>
                                      <tbody id="table-1-body" class="table-body">
                                          <tr id="noDataRow" style="display: none;">
                                              <td colspan="6" class="text-center">No user found</td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </div>
                              <div id="pagination" class="pagination-container">
                                <div class="pagination-content">
                                    <span>Page </span>
                                    <span id="currentPage" class="pagination-number"> 1</span> 
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



    <div id="applicantModal" class="applicant-modal">
    <div class="modal-content-approveuser">
        <div class="approve-indicator-title-container">
            <h3 class="modal-title title-approve">Approve User</h3>
            <span class="icon-container">
                <i class="bi bi-info-circle icon" data-tooltip="Approve user that do registration process"></i>
            </span>
        </div>
          <div class="modal-body">
              <div class="profile-section">
                  <div class="profile-container-approveuser">
                      <img id="profileImage" src="" alt="Profile Image" class="profile-circle-approve">
                      <div class="applicant-info-approve">
                          <span class="label">Name:</span>
                          <span class="data" id="fullName">N/A</span>
                          <span class="label">Email:</span>
                          <span class="data" id="email">N/A</span>
                          <span class="label">Date Registered:</span>
                          <span class="data" id="dateRegistered">N/A</span>
                      </div>
                  </div>
              </div>
            <div class="remarkstextarea">
                <label for="remarks">Announcement or Instruction</label>
                <textarea class="textarea" id="remarks" placeholder="Enter your announcement"></textarea>
            </div>
        </div>
        <p class="instruction-text-approve">
            <i class="bi bi-exclamation-circle icon-space"></i> By clicking <span style="color: red; font-weight: 600;"> "OK" </span> the applicant will be approved and moved to the next phase of the process.
        </p>
        <div class="modal-actions">
        <button class="btn btn-cancel" onclick="closeApplicantModal()">Cancel</button>
        <button class="btn btn-ok" onclick="openConfirmModal()">Approve</button>
        </div>
    </div>
</div>
<div id="confirmModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-confirmuser">
    <h3 class="modal-title title-approve">Confirm user</h3>
    <div class="modal-title-sure">Are you sure you want to approve this user?</div>
        <div class="modal-actions">
            <button class="btn btn-cancel" onclick="closeConfirmModal()">Cancel</button>
            <button class="btn btn-confirm" onclick="confirmApproval()">Confirm</button>
        </div>
    </div>
</div>
<div id="successModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-successful-approve">
    <h3 class="modal-title title-approve">Success</h3>
    <div class="modal-title-sure">User has been Cuccessfully Approved!</div>
        <div class="modal-actions">
            <button class="btn btn-ok"  onclick="closeSuccessModal()">Close</button>
        </div>
    
      </div>
</div>
<div id="rejectModal" class="applicant-modal">
    <div class="modal-content-rejecteduser">
        <h1 class="modal-title title-reject">Reject Applicant</h1>
        <p class="instruction-text">
            By clicking "OK," the applicant will be rejected and their status will be updated.
        </p>
        <div class="profile-container-rejectuser">
            <img id="rejectProfileImage" src="" alt="Profile Image" class="profile-circle-reject">
            <div class="applicant-info-reject">
                        <span class="label">Name:</span>
                        <span class="data" id="rejectFullName">N/A</span>
                        <span class="label">Email:</span>
                        <span class="data" id="rejectEmail">N/A</span>
                        <span class="label">Date Registered:</span>
                        <span class="data" id="rejectDateRegistered">N/A</span>
             </div>
        </div>
        <input type="hidden" id="rejectUserId">
        <div class="modal-actions">
            <button class="btn btn-cancel" onclick="closeRejectModal()">Cancel</button>
            <button class="btn btn-confirm-reject" onclick="showRejectConfirmModal()">Reject</button>
        </div>
    </div>
</div>
<div id="rejectConfirmModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-rejectuser">
        <h3 class="modal-title title-reject">Reject Applicant</h3>
        <div class="modal-title-sure">Are you sure you want to reject this applicant?</div>
        <div class="modal-actions">
            <button class="btn btn-cancel" onclick="closeRejectConfirmModal()">Cancel</button>
            <button id="submitRejectRemarksButton" class="btn btn-confirm-reject" onclick="submitRejectConfirmation()">Confirm</button> <!-- Updated onclick -->
        </div>
    </div>
</div>
<div id="rejectSuccessModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-successful-reject">
        <h3 class="modal-title title-reject">Success</h3>
        <div class="modal-title-sure">Applicant has been successfully rejected.</div>
        <div class="modal-actions">
            <button class="btn btn-ok" onclick="closeRejectionSuccessModal()">Close</button>
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
  </footer>

  <?php include 'includes/footer.php';?>

  <script src="assets/js/pending.js"></script>
  <script src="assets/js/applicantmodal.js"></script>
  <script src="assets/modal/applicantview.js"></script>
</body>
</html>
<style>
.active-nav{
  color: #4154f1;
  font-size: 16px;
}
</style>