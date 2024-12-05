<?php
include 'session/admin_session_check.php'; 
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">

  <title>Document Page Details</title>
  <meta content="" name="description">
  <meta content="" name="keywords">

  <!-- Favicons -->
  <link href="../assets/img/Layer 1.png" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">

  <!-- Google Fonts -->
  <link href="https://fonts.gstatic.com" rel="preconnect">
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
  <link href="assets/css/add.css" rel="stylesheet">
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
    <div class="search-bar">
      <form class="search-form d-flex align-items-center" method="POST" action="#">
        <input type="text" name="query" placeholder="Search" title="Enter search keyword">
        <button type="submit" title="Search"><i class="bi bi-search"></i></button>
      </form>
    </div>
    <nav class="header-nav ms-auto">
      <ul class="d-flex align-items-center">
        <li class="nav-item d-block d-lg-none">
          <a class="nav-link nav-icon search-bar-toggle " href="#">
            <i class="bi bi-search"></i>
          </a>
        </li>
        <li class="nav-item dropdown pe-3">
      </li> 
        <li class="nav-item dropdown">
          <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <i class="bi bi-bell"></i>
            <span class="badge bg-primary badge-number">0</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
            <li class="dropdown-header">
              You have 0 notifications
              <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li class="notification-item">
              <div>
                <h4></h4>
                <p></p>
                <p></p>
              </div>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li class="dropdown-footer">
              <a href="#">Show all notifications</a>
            </li>
          </ul>
        </li>
        
        <li class="nav-item dropdown pe-3">
          <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
            <span id="dropdown-username" class="d-none d-md-block dropdown-toggle ps-2" style="display: none;"></span>
          </a>
        
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
            <li class="dropdown-header">
              <h6 id="user-log-in-name" style="display: none; font-size: 13px;"></h6>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li>
              <a class="dropdown-item d-flex align-items-center" href="users-profile.php">
                <i class="bi bi-gear"></i>
                <span>Account Settings</span>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li>
              <a class="dropdown-item d-flex align-items-center" href="pages-faq.php">
                <i class="bi bi-question-circle"></i>
                <span>Need Help?</span>
              </a>
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
          </ul>
        </li>
      </ul>
    </nav>
  </header>

  <aside id="sidebar" class="sidebar">
    <ul class="sidebar-nav" id="sidebar-nav">
    <li class="nav-heading">Navigation</li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="index.php">
          <i class="bi bi-grid"></i>
          <span>Dashboard</span>
        </a>
      </li>
           <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
          <i class="bi bi-building"></i><span>LEFMOGIV Client</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="components-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
          <li>
            <a href="client.php">
              <i class="bi bi-building"></i><span>List Clients</span>
            </a>
          </li>
        </ul>
      </li><!-- End Components Nav -->
      <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#forms-nav" data-bs-toggle="collapse" href="#">
          <i class="bi bi-person"></i><span>Applicants</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="forms-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
          <li>
            <a href="pending_list.php">
              <i class="bi bi-person-dash"></i><span>Pending</span>
            </a>
          </li>
          <li>
            <a href="rejected_list.php">
              <i class="bi bi-person-check"></i><span>Approve Security Staff</span>
            </a>
          </li>
          <li>
            <a href="rejected_list.php">
              <i class="bi bi-person-check"></i><span>Rejected Security Staff</span>
            </a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed"  href="Personnels.php">
          <i class="bi bi-person-lines-fill"></i><span>Security Personnel</span></i>
        </a>
      </li>
      <li class="nav-heading">Editing Page Tools</li>
      <li class="nav-item" >
        <a class="nav-link collapsed"  href="homepage.php">
          <i class="bi bi-archive"></i>
          <span>Edit Home Page</span>
        </a>
      </li>
      <li class="nav-item" >
        <a class="nav-link collapsed"  href="#">
          <i class="bi bi-archive"></i>
          <span style="color: #4154f1">Document Home Page</span>
        </a>
      </li>
    </ul>
  </aside>
  
  <main id="main" class="main-content">
  <div class="title-box" style="margin-bottom: 20px;">
    <div class="year-client-title">
      <div class="client-list-title">Document Page Details</div>
      <div class="breadcrumb">Dashboard / Document Page</div>
    </div>    
  </div>

  <div class="box-container">
    <div class="layout-container">
      <!-- Documentation Requirements Section -->
      <div class="section documentation-requirements">
        <div class="section-title">Provide the Proper Documentation</div>
        <div class="instruction-text">List of necessary criteria and qualifications</div>

        <ul class="requirement-list">
          <li>Transcript of Records / Diploma</li>
          <li>Resume</li>
          <li>Valid Security License</li>
          <li>Photocopies of valid IDs</li>
          <li>Valid Local Clearances</li>
          <li>Neuro and Drug Test</li>
        </ul>

        <div class="section-title">Why Do We Need It?</div>
        <div class="document-importance">
          <p>
            LEFMOGIV is diligently gathering essential documents to be uploaded upon user registration, ensuring a seamless submission process for all required documentation.
            These documents are crucial for:
          </p>
          <ul>
            <li>
              <strong>Transcript of Records / Diploma:</strong> Verifies the educational background and qualifications of applicants.
            </li>
            <li>
              <strong>Resume:</strong> To assess qualifications and professional background.
            </li>
            <li>
              <strong>Photocopies of Valid IDs:</strong> Valid identification copies are required to verify the identity of applicants and ensure compliance with legal regulations.
            </li>
            <li>
              <strong>NBI Clearance (National Bureau of Investigation Clearance):</strong> Confirms the absence of criminal records.
            </li>
            <li>
              <strong>Valid Local Clearances:</strong> Local clearances confirm that applicants have no criminal record or legal issues that may affect their suitability for the position.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</main>



  <footer id="footer" class="footer">
    <div class="copyright">
      2024 Copyright <strong>LEFMOGIV Security Agency Corp.</strong>. All Rights Reserved
    </div>
  </footer>
  <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/chart.js/chart.umd.js"></script>
  <script src="assets/vendor/quill/quill.js"></script>
  <script src="assets/vendor/simple-datatables/simple-datatables.js"></script>
  <script src="assets/vendor/tinymce/tinymce.min.js"></script>
    <!-- Our js -->

  <script src="assets/js/homepageedit.js"></script>
</body>
</html>