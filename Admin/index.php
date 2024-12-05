<?php
$title = "Admin | Dashboard";
$title_short = "DB";
include 'session/admin_session_check.php'; 
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title><?php echo $title;?></title>
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
  <div id="loading-overlay" style="display: none;">
    <div class="loading-spinner"></div>
    <div class="loading-text">Fetching data...</div>
  </div>

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

  <main id="main" class="main">
    <div class="pagetitle">
      <h1>Dashboard</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="index.php" style="color: white;">Home</a></li>
        </ol>
      </nav>
    </div>
    <section class="section dashboard">
      <div class="row">
       
            
            <div class="col-12">
                <div class="card recent-sales overflow-auto">
                    <div class="filter">
                        <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                          <li class="dropdown-header text-start">
                              <h6>Filter</h6>
                          </li>
                          <li><a class="dropdown-item" href="#" onclick="fetchUnapprovedUsers('today')">Today</a></li>
                          <li><a class="dropdown-item" href="#" onclick="fetchUnapprovedUsers('thisMonth')">This Month</a></li>
                          <li><a class="dropdown-item" href="#" onclick="fetchUnapprovedUsers('lastYear')">Last Year</a></li>
                          <li><a class="dropdown-item" href="#" onclick="fetchUnapprovedUsers('all')">All</a></li>
                        </ul>
                    </div>
                    <div class="card-body" style="height: 350px;">
                        <h5 class="card-title">New Applicant <span> List</span></h5>
                        <div class="instext">
                            <i class="bi bi-exclamation-circle" style="margin-right: 5px;"></i>
                            New registered users are listed below.
                        </div>

                        <table class="table table-borderless">
                            <thead>
                                <tr>
                                    <th scope="col">Applicant</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">View</th>
                                </tr>
                            </thead>
                            <tbody id="applicantList">
                                <!-- Table rows will be added dynamically -->
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>

            
            <div class="col-12">
              <div class="card top-selling overflow-auto" style="height: 358px;">
                <div class="filter">
                  <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                  <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                    <li class="dropdown-header text-start">
                      <h6>Filter</h6>
                    </li>
                    <li><a class="dropdown-item"  onclick="loadExpiredClients('today')">Today</a></li>
                    <li><a class="dropdown-item"  onclick="loadExpiredClients('thisMonth')">This Month</a></li>
                    <li><a class="dropdown-item"  onclick="loadExpiredClients('lastYear')">Last Year</a></li>
                    <li><a class="dropdown-item"  onclick="loadExpiredClients('all')">All</a></li>
                  </ul>
                </div>
                <div class="card-body pb-0">
                  <h5 class="card-title">End of Contract <span>| Client</span></h5>
                  <div class="instext">
                      <i class="bi bi-exclamation-circle" style="margin-right: 5px;"></i>
                      Expired Client List 
                  </div>
                  <table class="table table-borderless">
                    <thead>
                      <tr>
                        <th scope="col">Profile</th>
                        <th scope="col">Company</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">View</th>
                      </tr>
                    </thead>
                    <tbody id="contract-table-body">
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="row">
            <div class="col-xxl-4 col-md-6">
              <div class="card info-card sales-card">
                <div class="filter">
                  <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                  <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                    <li><a class="dropdown-item" href="#" onclick="applyFilter('today', 'TotalIssued')">Today</a></li>
                    <li><a class="dropdown-item" href="#" onclick="applyFilter('thisMonth', 'TotalIssued')">This Month</a></li>
                    <li><a class="dropdown-item" href="#" onclick="applyFilter('lastMonth', 'TotalIssued')">Last Month</a></li>
                    <li><a class="dropdown-item" href="#" onclick="applyFilter('lastYear', 'TotalIssued')">Last Year</a></li>
                  </ul>
                </div>
                <div class="card-body">
                  <h5 class="card-title">Total<span> Issued</span></h5>
                  <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i class="bi bi-archive"></i>
                    </div>
                    <div class="ps-3">
                      <h6 id="inventoryCount">0</h6>
                      <span class="text-success small pt-1 fw-bold">2024</span> <span class="text-muted small pt-2 ps-1">Total</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xxl-4 col-md-6">
              <div class="card info-card revenue-card">
                <div class="filter">
                  <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                 <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                 <li class="dropdown-header text-start">
                    <h6>Filter</h6>
                </li>
                    <li><a class="dropdown-item" href="#" onclick="applyFilter('all', 'TotalClients')">All</a></li> <!-- Add this line for "All" option -->
                    <li><a class="dropdown-item" href="#" onclick="applyFilter('thisMonth', 'TotalClients')">This Month</a></li>
                    <li><a class="dropdown-item" href="#" onclick="applyFilter('lastMonth', 'TotalClients')">Last Month</a></li>
                    <li><a class="dropdown-item" href="#" onclick="applyFilter('lastYear', 'TotalClients')">Last Year</a></li>
                  </ul>
                </div>
                <div class="card-body">
                  <h5 class="card-title">Total of <span>Clients</span></h5>
                  <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i class="bi bi-building"></i>
                    </div>
                    <div class="ps-3">
                      <h6 id="clientCount">0</h6>
                      <span class="text-success small pt-1 fw-bold">2024</span> <span class="text-muted small pt-2 ps-1">Total</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xxl-4 col-xl-12">
              <div class="card info-card customers-card">
                <div class="filter">
                  <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                  <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                      <li class="dropdown-header text-start">
                          <h6>Filter</h6>
                      </li>
                      <li><a class="dropdown-item" href="#" onclick="applyPendingListFilter('today')">Today</a></li>
                      <li><a class="dropdown-item" href="#" onclick="applyPendingListFilter('thisMonth')">This Month</a></li>
                      <li><a class="dropdown-item" href="#" onclick="applyPendingListFilter('lastYear')">Last Year</a></li>
                      <li><a class="dropdown-item" href="#" onclick="applyPendingListFilter('all')">All</a></li>
                    </ul>
                </div>
                <div class="card-body">
                  <h5 class="card-title">Pending <span> List</span></h5>
                  <div class="d-flex align-items-center">
                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i class="bi bi-people"></i>
                    </div>
                    <div class="ps-3">
                      <h6 id="applicantCount">0</h6>
                      <span class="text-danger small pt-1 fw-bold">Pending</span>
                      <span class="text-muted small pt-2 ps-1"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>


      </div>
        </div>
      </div>
    </section>
  </main>
  <footer id="footer" class="footer">
    <div class="copyright">
      2024 Copyright <strong>LEFMOGIV Security Agency Corp.</strong>. All Rights Reserved
    </div>
  </footer>
  <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>
  <script src="assets/vendor/apexcharts/apexcharts.min.js"></script>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/chart.js/chart.umd.js"></script>
  <script src="assets/vendor/echarts/echarts.min.js"></script>
  <script src="assets/vendor/quill/quill.js"></script>
  <script src="assets/vendor/simple-datatables/simple-datatables.js"></script>
  <script src="assets/vendor/tinymce/tinymce.min.js"></script>
  <script src="assets/vendor/php-email-form/validate.js"></script>
  <script src="assets/js/main.js"></script>
  <!-- Our Js -->
  <script src="assets/js/index.js"></script>
  <script src="assets/verifying/admincheck.js"></script>

</body>
</html>
<style>
.active-nav{
  color: #4154f1;
  font-size: 16px;
}
</style>