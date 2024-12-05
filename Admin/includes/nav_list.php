<aside id="sidebar" class="sidebar">
    <ul class="sidebar-nav" id="sidebar-nav">
    <li class="nav-heading">Navigation</li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="index.php">
          <i class="bi bi-grid"></i>
          <span <?php if($title_short=="DB") {echo 'class="active-nav"';}?>>Dashboard</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
          <i class="bi bi-building"></i><span <?php if($title_short=="CL") {echo 'class="active-nav"';}?>>LEFMOGIV Client</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="components-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
          <li>
            <a href="client.php">
              <i class="bi bi-building"></i><span <?php if($title_short=="CL") {echo 'class="active-nav"';}?>>List Clients</span>
            </a>
          </li>
        </ul>
      </li>

      <!-- <li class="nav-item">
        <a class="nav-link collapsed" href="/Admin/account_approval.php">
          <i class="bi bi-person-fill-add"></i>
          <span <?php if($title_short=="ACAL") {echo 'class="active-nav"';}?>>Account Approval List</span>
        </a>
      </li> -->

      <li class="nav-item">
        <a class="nav-link collapsed" href="/Admin/pending_list.php">
          <i class="bi bi-person-fill-exclamation"></i>
          <span <?php if($title_short=="PAL") {echo 'class="active-nav"';}?> >Pending Applications</span>
        </a>
      </li>

      <li class="nav-item">
        <a class="nav-link collapsed" href="/Admin/approved_list.php">
          <i class="bi bi-person-check"></i>
          <span <?php if($title_short=="AL") {echo 'class="active-nav"';}?>>Approved Applications</span>
        </a>
      </li>

      <li class="nav-item">
        <a class="nav-link collapsed" href="/Admin/rejected_list.php">
          <i class="bi bi-person-x"></i>
          <span <?php if($title_short=="RL") {echo 'class="active-nav"';}?> >Rejected Applications</span>
        </a>
      </li>

      <li class="nav-item">
        <a class="nav-link collapsed" href="security_personnel.php">
          <i class="bi bi-person-lines-fill"></i><span <?php if($title_short=="SP") {echo 'class="active-nav"';}?> >Security Personnel</span></i>
        </a>
      </li>

      <li class="nav-item">
        <a class="nav-link collapsed" href="user_management.php">
          <i class="bi bi-person-lines-fill"></i><span <?php if($title_short=="UM") {echo 'class="active-nav"';}?> >User Management</span></i>
        </a>
      </li>
    </ul>
  </aside>