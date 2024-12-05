<?php
$title = "LEFMOGIV | Client"; 
$title_short = "CL"; 
include 'session/admin_session_check.php'; 
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title> <?php echo $title; ?>  </title>
  <meta content="" name="description">
  <meta content="" name="keywords">
  <link href="../assets/img/Layer 1.png" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">
  <link href="https://fonts.gstatic.com" rel="preconnect">

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>
 
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
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
  <script src="https://www.gstatic.com/firebasejs/8.6.0/firebase-storage.js"></script>

  <link href="assets/css/client.css" rel="stylesheet">
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
                <li class="nav-item d-block d-lg-none">
                  <a class="nav-link nav-icon search-bar-toggle " href="#">
                    <i class="bi bi-search"></i>
                  </a>
                </li>
                <li class="nav-item dropdown pe-3">
                <button id="addClientButton" onclick="openModal()">Add Client</button>
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




<main id="main" class="main">
<div class="pagetitle d-flex align-items-center justify-content-between">
    <div class="title-box">
        <div class="year-client-title">
            <div class="client-list-title">List of Year <span id="currentYear">2024</span> Status</div>
            <div class="breadcrumb">Home / Client Page</div>
        </div>
    </div>
</div>
<div class="client-list-header">
    <span class="dropdown-toggle" onclick="toggleDropdown(event, 'nameDropdown')">
        Name
    </span>
    &nbsp; &nbsp; 
    <span class="dropdown-toggle" onclick="toggleDropdown(event, 'yearDropdown')">
        Year
    </span>
    &nbsp; &nbsp; 
    <span class="dropdown-toggle" onclick="toggleDropdown(event, 'activeDropdown')">
        Active
    </span>
    &nbsp; &nbsp; 
    <span id="refreshButton" style="display: none;" onclick="refreshClients()">
        Clear
    </span>
</div>

<div id="nameDropdown" class="dropdown-content" style="display: none;">
    <div onclick="handleOptionSelect('name', 'Alphabetical')">Alphabetical</div>
    <div onclick="handleOptionSelect('name', 'Reverse Alphabetical')">Reverse Alphabetical</div>
</div>
<div id="yearDropdown" class="dropdown-content" style="display: none;">
    <div onclick="handleOptionSelect('year', 'Ascending')">This Year</div>
    <div onclick="handleOptionSelect('year', 'Descending')">Last Year</div>
</div>
<div id="activeDropdown" class="dropdown-content" style="display: none;">
    <div onclick="handleOptionSelect('active', 'Active')">Active</div>
    <div onclick="handleOptionSelect('active', 'Inactive')">Inactive</div>
</div>
<button id="refreshButton" style="display: none;" onclick="refreshClients()">Clear</button>
<section class="section">
    <div class="iconslist">
    </div>
</section>

<div id="myModal" class="addmodal" style="display:none;">
  <div class="modal-content-add-client">
    <span class="close">&times;</span>
    <div class="client-profile-header header-text">Add New Client</div>
    <div class="additional-info additional-info-text">Please choose the type of client you want to add.</div>
    <div class="client-type-buttons">
      <button id="newClientButton" class="client-type-button" onclick="showNewClientForm()">
        <i class="fas fa-user-plus"></i> <!-- New Client Icon -->
        <span class="button-text">New Client</span> <!-- Text for New Client -->
      </button>
      <button id="oldClientButton" class="client-type-button" onclick="showOldClientForm()">
        <i class="fas fa-user-check"></i> <!-- Old Client Icon -->
        <span class="button-text">Old Client</span> <!-- Text for Old Client -->
      </button>
    </div>
    <!-- Add Client Form -->
    <form id="addClientForm" style="display:none;">
      <div class="modal-body">
        <div class="image-section">
          <div class="client-profile-text profile-text">Company Profile Image</div>
          <div id="imagePlaceholder" class="image-placeholder">
            <img id="uploadedImage" src="" alt="Image Preview" style="display: none;">
          </div>
          <label for="companyImage" class="upload-label upload-text">Choose an Image</label>
          <input type="file" id="companyImage" name="companyImage" accept="image/*" class="upload-input" onchange="previewImage(event)">
          <button id="removeImageButton" type="button" class="remove-image-button" onclick="removeImage()" style="display: none;">Remove Image</button>
        </div>
        
        <!-- Details Section -->
        <div class="details-section">
          <!-- Row 1: 3 fields per row -->
          <div class="form-row">
            <div class="form-column-add-client">
              <label for="companyName">Company Name:</label>
              <input type="text" id="companyName" name="companyName" placeholder="Enter Company Name" required>
            </div>
            <div class="form-column-add-client">
              <label for="location">Location:</label>
              <input type="text" id="location" name="location" placeholder="Enter Location" required>
            </div>
            <div class="form-column-add-client">
              <label for="clientDetails">Details:</label>
              <textarea id="clientDetails" name="clientDetails" placeholder="Enter Client Details" required></textarea>
            </div>
          </div>
          
          <!-- Row 2: 3 fields per row -->
          <div class="form-row">
            <div class="form-column-add-client">
              <label for="industry">Industry/Category:</label>
              <input type="text" id="industry" name="industry" placeholder="Enter Industry" required>
            </div>
            <div class="form-column-add-client">
              <label for="startDate">Start Date:</label>
              <input type="date" id="startDate" name="startDate" required>
            </div>
            <div class="form-column-add-client">
              <label for="contractExpiry">Contract Expiry:</label>
              <input type="date" id="contractExpiry" name="contractExpiry">
            </div>
          </div>

          <!-- Row 3: 3 fields per row -->
          <div class="form-row">
            <div class="form-column-add-client">
              <label for="contractDurationSelect">Contract Duration:</label>
              <select id="contractDurationSelect" name="contractDurationSelect">
                <option value="">Select Duration</option>
                <option value="1">1 Month</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="4">4 Months</option>
                <option value="5">5 Months</option>
                <option value="6">6 Months</option>
              </select>
            </div>
            <div class="form-column-add-client">
              <label for="contractDuration">Calculated Duration:</label>
              <input type="text" id="contractDuration" name="contractDuration" readonly>
            </div>
            <div class="form-column-add-client">
              <label for="contactPerson">Contact Person:</label>
              <input type="text" id="contactPerson" name="contactPerson" placeholder="Enter Contact Person" required>
            </div>
          </div>

          <!-- Row 4: 3 fields per row -->
          <div class="form-row">
            <div class="form-column-add-client">
              <label for="contactPosition">Contact Position:</label>
              <input type="text" id="contactPosition" name="contactPosition" placeholder="Enter Contact Position" required>
            </div>
            <div class="form-column-add-client">
              <label for="contactNumber">Contact Number:</label>
              <input type="tel" id="contactNumber" name="contactNumber" placeholder="Enter Contact Number" required>
            </div>
            <div class="form-column-add-client">
              <label for="emailAddress">Email Address:</label>
              <input type="email" id="emailAddress" name="emailAddress" placeholder="Enter Email Address" required>
            </div>
          </div>

          <!-- Row 5: 1 field per row for social media links -->
          <div class="form-row">
            <div class="form-column-add-client">
              <label for="socialMediaLinks">Social Media Links:</label>
              <input type="url" id="socialMediaLinks" name="socialMediaLinks" placeholder="Enter (https://)">
            </div>
          </div>
        </div>
      </div>

      <div class="button-section">
        <button type="button" id="cancelButton" class="cancel-button" onclick="closeModal()">Cancel</button>
        <button type="button" id="submitButton" class="submit-button">
          <span id="spinner" class="spinner"></span>
          Submit
        </button>
      </div>
    </form>
  </div>
</div>










  <div id="loadingOverlay" class="loading-overlay">
    <div class="loading-spinner"></div>
  </div>
</div>
<div id="confirmDeleteModal" class="modal">
  <div class="modal-content">
    <span class="close" onclick="closeConfirmDeleteModal()">&times;</span>
    <h2>Client Deleted</h2>
    <p>The client has been successfully deleted.</p>
    <button id="confirmDeleteButton" onclick="closeConfirmDeleteModal()">OK</button>
  </div>
</div>
<!-- Confirmation Modal -->
<div id="confirmationModal" class="successmodal">
  <div class="successadd">
    <span class="close">&times;</span>
    <h4>Client Added Successfully</h4>
    <div id="confirmationMessage">
      <!-- Client data will be populated here -->
    </div>
    <div class="button-section">
      <button id="confirmButton">OK</button>
    </div>
  </div>
</div>



<div id="viewClientModal" class="modal-view">
  <div class="modal-content-view">
    <span class="close-view">&times;</span>
    <h2 id="modalTitle">Client Details</h2>
    <button id="downloadClientReportBtn">Download Client Report</button> <!-- Client Report Button -->
    <div class="modal-body flex-container">
      <div class="client-details flex-item">
        
        <h3 id="clientInfoTitle">Client Information</h3>
        <div id="clientDetailsContainer"></div>
      </div>
      <div class="security-guard-list flex-item">
        <h3 id="securityGuardTitle">Security Guard List</h3>
        <table>
        <thead>
            <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody id="securityGuardListContainer">
        </tbody>
    </table>
      </div>
    </div>
    <div class="button-section">
      <button id="editClientButton" class="edit-button">Edit Client</button>
      <button id="deleteClientButton" class="delete-button">Delete Client</button>
      <button id="closeClientButton" class="close-button">Close</button>
    </div>
  </div>
</div>
</main>






  <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/chart.js/chart.umd.js"></script>
  <script src="assets/vendor/quill/quill.js"></script>
  <script src="assets/vendor/simple-datatables/simple-datatables.js"></script>
  <script src="assets/vendor/tinymce/tinymce.min.js"></script>
  <script src="assets/js/main.js"></script>

    <!-- Our js -->
  <script src="assets/js/client.js"></script>
  <script src="assets/js/clientreport.js"></script>

</body>
</html>
<style>
.active-nav{
  color: #4154f1;
  font-size: 16px;
}
</style>