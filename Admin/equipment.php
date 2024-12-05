<?php
include 'session/admin_session_check.php'; // Adjust the path if necessary

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">

  <title>LEFMOGIV | Inventory</title>
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
  <link href="assets/css/inventory.css" rel="stylesheet">
 
  <script src="https://www.gstatic.com/firebasejs/9.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.8.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.8.0/firebase-firestore-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.8.0/firebase-storage-compat.js"></script>

</head>
<body>

  <!-- ======= Header ======= -->
  <header id="header" class="header fixed-top d-flex align-items-center">

    <div class="d-flex align-items-center justify-content-between">
      <a href="../index.php" class="logo d-flex align-items-center">
        <img src="../assets/img/Layer 1.png" alt="">
        <span class="d-none d-lg-block">LEFMOGIV</span>
      </a>
      <i class="bi bi-list toggle-sidebar-btn"></i>
    </div><!-- End Logo -->

    <div class="search-bar">
      <form class="search-form d-flex align-items-center" method="POST" action="#">
        <input type="text" name="query" placeholder="Search" title="Enter search keyword">
        <button type="submit" title="Search"><i class="bi bi-search"></i></button>
      </form>
    </div><!-- End Search Bar -->


    <nav class="header-nav ms-auto">
      <ul class="d-flex align-items-center">
        <li class="nav-item d-block d-lg-none">
          <a class="nav-link nav-icon search-bar-toggle " href="#">
            <i class="bi bi-search"></i>
          </a>
        </li>
        <li class="nav-item dropdown pe-3">
        <div class="dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button" id="createDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              New
          </button>
          <div class="dropdown-menu" aria-labelledby="createDropdown">
              <a class="dropdown-item" href="#" onclick="viewFolder()">Folder</a>
          </div>
      </div>
        
        </li> 
        <li class="nav-item dropdown pe-3">
                    <div class="dropdown">
                        <button class="btn btn-primary dropdown-toggle" type="button" id="createDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Issued
                        </button>
                        <div class="dropdown-menu" aria-labelledby="createDropdown">
                            <a class="dropdown-item" href="#" onclick="selectFolder()">Firearm</a>
                            <a class="dropdown-item" href="#" onclick="selectDocument()">Uniform</a>                      
                        </div>
                    </div>     
       </li> 
        <li class="nav-item dropdown">
          <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <i class="bi bi-bell"></i>
            <span class="badge bg-primary badge-number">0</span>
          </a>

          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
            <li class="dropdown-header">
              You have 4 new notifications
              <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>

            <li class="notification-item">
              <i class="bi bi-exclamation-circle text-warning"></i>
              <div>
                <h4>Lorem Ipsum</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>30 min. ago</p>
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

          </ul><!-- End Notification Dropdown Items -->

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
    <li class="nav-heading">Navigations</li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="index.php">
          <i class="bi bi-grid"></i>
          <span>Dashboard</span>
        </a>
      </li><!-- End Dashboard Nav -->

      <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
          <i class="bi bi-building" ></i><span >LEFMOGIV Client</span><i class="bi bi-chevron-down ms-auto"></i>
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
              <i class="bi bi-person-dash"></i><span>Pending Applicants</span>
            </a>
          </li>
          <li>
            <a href="rejected_list.php">
              <i class="bi bi-person-check"></i><span>Approve Applicants</span>
            </a>
          </li>
          <li>
            <a href="rejected_list.php">
              <i class="bi bi-person-check"></i><span>Rejected Applicants</span>
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
      <a class="nav-link collapsed"  href="documentpage.php">
          <i class="bi bi-archive"></i>
          <span>Document Home Page</span>
        </a>
      </li>
    </ul>

  </aside><!-- End Sidebar-->
   
  <main id="main">
  <div class="title-box" style="margin-bottom: 20px;">
        <div class="year-client-title">
            <div class="client-list-title">Issued Equipment</div>
            <div class="breadcrumb">Dashboard / Equipment</div>
        </div>
    </div>
    <div class="main-inner">
        <div class="container">
            <div class="inventory-section"> 
                <div class="table-responsive table-container">
                <table class="table">
                  <thead>
                      <tr>
                          <th><input type="checkbox" id="selectAll" onclick="toggleCheckboxes(this)"></th> <!-- Checkbox for selecting all -->
                          <th><i class="bi bi-archive" style="margin-right: 5px;"></i> Folder Name</th>
                          <th><i class="bi bi-envelope" style="margin-right: 5px;"></i> Email</th>
                          <th><i class="bi bi-calendar" style="margin-right: 5px;"></i> Created</th>
                          <th><i class="bi bi-info-circle" style="margin-right: 5px;"></i> Status</th>
                          <th><i class="bi bi-file-earmark-text" style="margin-right: 5px;"></i> Total File</th>
                          <th><i class="bi bi-gear" style="margin-right: 5px;"></i> Actions</th>


                      </tr>
                  </thead>
                  <tbody id="issuedEquipmentTableBody">
                      <!-- Rows will be dynamically generated here -->
                  </tbody>
              </table>

                </div>
            </div>
            <div id="itemInfo" class="item-info"></div>
        </div>
    </div>
</main>

<div class="modal fade" id="folderModal" tabindex="-1" aria-labelledby="folderModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="folderModalLabel">Create Folder</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="fileName">Folder Name</label>
                            <input type="text" id="fileName" class="form-control" placeholder="Enter folder name">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="securityStaffSelect">Security Guard List</label>
                            <select id="securityStaffSelect" class="form-control">
                                <!-- Options will be dynamically loaded -->
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="createFolderButton">Create Folder</button>
            </div>
        </div>
    </div>
</div>



<div class="modal fade" id="viewModal" tabindex="-1" role="dialog" aria-labelledby="viewModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="viewModalLabel">Item Details</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="modal-body">
              <p><strong>Name:</strong> <span id="modalItemName"></span></p>
              <p><strong>Category:</strong> <span id="modalItemCategory"></span></p>
              <p><strong>Expiration:</strong> <span id="modalItemExpiration"></span></p>
              <p><strong>Upload Date:</strong> <span id="modalUploadDate"></span></p>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
      </div>
  </div>
</div>



    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
 <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
  <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>
  <script src="assets/vendor/apexcharts/apexcharts.min.js"></script>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/chart.js/chart.umd.js"></script>
  <script src="assets/vendor/echarts/echarts.min.js"></script>
  <script src="assets/vendor/quill/quill.js"></script>
  <script src="assets/vendor/tinymce/tinymce.min.js"></script>
  <script src="assets/js/main.js"></script>
    <!-- Our js -->
  <script src="assets/js/invent.js"></script>
</body>
</html>