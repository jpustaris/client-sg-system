<?php
include 'session/admin_session_check.php';
$title = "LEFMOGIV | User Management";
$title_short = "UM";
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


  <script>
        const firebaseConfig = {
            apiKey: "AIzaSyAwZg1CODurIz0uJRiMxus28eKSd2CTHi4",
            authDomain: "lefmogiv-f49b3.firebaseapp.com",
            projectId: "lefmogiv-f49b3",
            storageBucket: "lefmogiv-f49b3.appspot.com",
            messagingSenderId: "687909819475",
            appId: "1:687909819475:web:60699d8e2a96376939e2a6",
            measurementId: "G-C7YD21Q71Y"
        };

        const app = firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore(app);
        const auth = firebase.auth(); // Initialize Firebase Authentication


        // Fetch all admins from Firestore and display them in the table
        // async function fetchAdminData() {
        //     const adminCollection = db.collection("isAdmin");
        //     const snapshot = await adminCollection.get();

        //     const adminData = [];
        //     snapshot.forEach(doc => {
        //         const admin = doc.data();
        //         console.log(admin)
        //         // Check if the email is verified before adding the admin
        //         // if (admin.emailVerified) {
        //             adminData.push({
        //                 id: doc.id,
        //                 username: admin.username,
        //                 name: admin.name,
        //                 email: admin.email
        //             });
        //         // }
        //     });
        //     console.log("Devig: " + adminData)
        //     displayAdminData(adminData);
        // }

        function displayAdminData(adminData) {
            const tableBody = document.getElementById("table-1-body");
            tableBody.innerHTML = "";

            adminData.forEach(admin => {
                const row = document.createElement("tr");

                // Create table cells for each field
                Object.values(admin).forEach((value, index) => {
                    const cell = document.createElement("td");
                    cell.textContent = value;
                    row.appendChild(cell);
                });

                // Add email verification status
                // const emailVerifiedCell = document.createElement("td");
                // emailVerifiedCell.textContent = admin.emailVerified ? "Verified" : "Not Verified";
                // row.appendChild(emailVerifiedCell);

                // Add buttons for update, delete and send verification actions
                const updateBtn = document.createElement("button");
                updateBtn.textContent = "Update";
                updateBtn.classList.add("btn", "btn-ok", "btn-sm", "mx-3");
                updateBtn.onclick = () => openUpdateModal(admin);

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.classList.add("btn", "btn-danger", "btn-sm");
                deleteBtn.onclick = () => deleteAdmin(admin.id, admin.email);

                // const verifyBtn = document.createElement("button");
                // verifyBtn.textContent = "Send Verification Email";
                // verifyBtn.classList.add("btn", "btn-info", "btn-sm",);
                // verifyBtn.onclick = () => sendVerificationEmail(admin.email);

                const actionsCell = document.createElement("td");
                actionsCell.appendChild(updateBtn);
                actionsCell.appendChild(deleteBtn);
                // actionsCell.appendChild(verifyBtn); // Append verification button
                row.appendChild(actionsCell);

                tableBody.appendChild(row);
            });
        }


        // Create Admin Function
        async function createAdmin() {
            const username = document.getElementById("username").value;
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            // Validate that passwords match
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            const isAdmin = true;

            // Create a user in Firebase Authentication
            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                // Send email verification (optional)
                // await user.sendEmailVerification();

                // Prepare admin data
                const newAdmin = {
                    username,
                    name,
                    email,
                    isAdmin,
                };

                // Use the Firebase Authentication user's UID as the document ID
                await db.collection("isAdmin").doc(user.uid).set(newAdmin);
                
                // Optionally, refresh admin list after creating
                fetchAdminData();  // Refresh the list of admins
                
                // Optionally, display a success message or close the modal
                alert("Admin created successfully. Verification email sent.");

            } catch (error) {
                console.error("Error creating admin:", error);
                alert("Error creating admin: " + error.message);
            }
        }



        // Update Admin Function
        async function updateAdmin(adminId) {
            const name = document.getElementById("updateName").value;
            const email = document.getElementById("updateEmail").value;
            const status = document.getElementById("updateStatus").value;

            // Check if the email is verified before updating the admin
            const adminRef = db.collection("isAdmin").doc(adminId);
            const adminDoc = await adminRef.get();
            const adminData = adminDoc.data();

            if (adminData.emailVerified) {
                const updatedAdmin = { name, email, status };
                await adminRef.update(updatedAdmin);
                fetchAdminData();
            } else {
                alert("Email not verified. Cannot update admin.");
            }
        }

        async function deleteAdmin(adminId, adminEmail) {
            // Show a confirmation dialog
            const userConfirmed = confirm("Are you sure you want to delete this admin?");

            // If the user clicks "OK" (userConfirmed is true), proceed with deletion
            if (userConfirmed) {
                try {
                    // const user = await firebase.auth().getUserByEmail(adminEmail);
                    // await firebase.auth().deleteUser(user);  // Delete the user from Firebase Authentication

                    // 1. Delete the admin from Firestore
                    await db.collection("isAdmin").doc(adminId).delete();

                    // 2. Delete the user from Firebase Authentication using the email
                    // const user = await firebase.auth().getUserByEmail(adminEmail);
                    
                    // Success messages
                    alert("Admin user deleted successfully.");
                    fetchAdminData(); // Refresh the admin data list

                } catch (error) {
                    console.error("Error deleting admin and user:", error);
                    alert("Error deleting admin and user: " + error.message);
                }
            } else {
                // If the user clicks "Cancel", do nothing
                alert("Deletion canceled.");
            }
        }


        // Open update modal with current admin data for editing
        function openUpdateModal(admin) {
          document.getElementById("updateName").value = admin.name;
          document.getElementById("updateEmail").value = admin.email;
          document.getElementById("updateStatus").value = admin.status;
          document.getElementById("updateAdminId").value = admin.id;
          document.getElementById("updateModal").style.display = "block";
        }

        // Close modal
        function closeModal() {
          document.getElementById("updateModal").style.display = "none";
        }


        // Send verification email to admin
        async function sendVerificationEmail(adminEmail) {
            try {
                // Check if the email exists in Firebase Authentication
                const methods = await firebase.auth().fetchSignInMethodsForEmail(adminEmail);

                if (methods.length === 0) {
                    alert("No user found with this email.");
                    return;
                }

                // Fetch the user from Firebase Auth using their email
                const user = await firebase.auth().getUserByEmail(adminEmail);

                // Check if the email is verified
                if (!user.emailVerified) {
                    await user.sendEmailVerification(); // Send verification email
                    alert("Verification email sent to: " + adminEmail);
                } else {
                    alert("This email is already verified.");
                }
            } catch (error) {
                console.error("Error sending email verification:", error);
                alert("Error sending verification email: " + error.message);
            }
        }

        async function fetchAdminData() {
            const adminCollection = db.collection("isAdmin");
            const snapshot = await adminCollection.get();

            const adminData = [];
          
            snapshot.forEach(doc => {
                const admin = doc.data();
                console.log(admin)
                // Check if the email is verified before adding the admin
                // if (admin.emailVerified) {
                    adminData.push({
                        // id: doc.id,
                        username: admin.username,
                        name: admin.name,
                        email: admin.email
                    });
                // }
            });
            console.log(adminData)

            // Using a for...of loop to wait for each Firebase Authentication request to complete
            // for (const doc of snapshot.docs) {
            //     const admin = doc.data();

            //     try {
            //         // Check if the email exists in Firebase Authentication
            //         const methods = await firebase.auth().fetchSignInMethodsForEmail(admin.email);

            //         // If methods are returned, the user exists
            //         if (methods.length > 0) {
            //             const user = await firebase.auth().getUserByEmail(admin.email);

            //             // Fetch the email verification status
            //             admin.emailVerified = user.emailVerified;

            //             adminData.push({
            //                 id: doc.id,
            //                 username: admin.username,
            //                 name: admin.name,
            //                 email: admin.email,
            //                 emailVerified: admin.emailVerified
            //             });
            //         }
            //     } catch (error) {
            //         console.error("Error processing admin data for email:", admin.email, error);
            //     }
            // }

            // Once all admin data is processed, display it
            displayAdminData(adminData);
        }

        // async function fetchAdminData() {
        //     const adminCollection = db.collection("isAdmin");
        //     const snapshot = await adminCollection.get();

        //     const adminData = [];
        //     snapshot.forEach(doc => {
        //         const admin = doc.data();

        //         // Check if the email exists in Firebase Authentication
        //         firebase.auth().fetchSignInMethodsForEmail(admin.email)
        //             .then(methods => {
        //                 // If methods are returned, the user exists
        //                 if (methods.length > 0) {
        //                     firebase.auth().getUserByEmail(admin.email)
        //                         .then(user => {
        //                             admin.emailVerified = user.emailVerified; // Fetch the email verification status
                                    
        //                             adminData.push({
        //                                 id: doc.id,
        //                                 username: admin.username,
        //                                 name: admin.name,
        //                                 email: admin.email,
        //                                 emailVerified: admin.emailVerified
        //                             });

        //                             // Once all the admin data is processed, display it
        //                             displayAdminData(adminData);
        //                         })
        //                         .catch(error => {
        //                             console.error("Error fetching user data:", error);
        //                         });
        //                 }
        //             })
        //             .catch(error => {
        //                 console.error("Error checking sign-in methods:", error);
        //             });
        //     });
        // }

        // Fetch data when page loads
        window.onload = function() {
          fetchAdminData();
        };

    </script>

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
        <h1 style="font-size: 24px; font-weight: 700;">User Management</h1>
        <p style="font-size: 17px; font-weight: 400;">Home / User Management</p>
    </div>
</div>


<!-- Create Admin Form -->
<div class="m-4 p-4 card">
    <card>
        <card-header>
            <h5>Create New Admin Record</h5>
        </card-header>
        <card-body>
            <form onsubmit="event.preventDefault(); createAdmin();">
                <div class="m-4 p-4">
                    <!-- Username Input -->
                    <input class="form-control my-2" type="text" id="username" placeholder="Username" required />

                    <!-- Email Input -->
                    <input class="form-control my-2" type="email" id="email" placeholder="Email" required />

                    <!-- Name Input -->
                    <input class="form-control my-2" type="text" id="name" placeholder="Name" required />

                    <!-- Password Input -->
                    <input class="form-control my-2" type="password" id="password" placeholder="Password" required />

                    <!-- Confirm Password Input -->
                    <input class="form-control my-2" type="password" id="confirmPassword" placeholder="Confirm Password" required />

                    <!-- Submit Button -->
                    <button class="form-control btn btn-ok btn-sm" type="submit">Create Admin</button>
                </div>
            </form>
        </card-body>
    </card>
     <!-- Update Modal -->
 <!-- <div id="updateModal" style="display: none;">
        <h2>Update Admin</h2>
        <form onsubmit="event.preventDefault(); updateAdmin(document.getElementById('updateAdminId').value);">
          <input type="text" id="updateName" required />
          <input type="email" id="updateEmail" required />
          <input type="text" id="updateStatus" required />
          <input type="hidden" id="updateAdminId" />
          <button type="submit">Update Admin</button>
          <button type="button" onclick="closeModal()">Close</button>
        </form>
    </div>
</div> -->

    

                         <div class="row">
                            <div class="col-lg-12">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="table-responsive table-container">
                                            <table class="table custom-table" id="table-1">
                                            <thead>
                                                <tr>
                                                    <!-- <th>
                                                        <div style="display: flex; justify-content: space-between; align-items: center;">
                                                            <span>ID</span>
                                                            <div style="display: flex; flex-direction: column; align-items: center;">
                                                                <i class="bi bi-caret-up-fill" onclick="sortTable('name', 'asc')" style="cursor: pointer; font-size: 0.7rem; opacity: 0.7;"></i>
                                                                <i class="bi bi-caret-down-fill" onclick="sortTable('name', 'desc')" style="cursor: pointer; font-size: 0.7rem; margin-top: -7px; opacity: 0.7;"></i>
                                                            </div>
                                                        </div>
                                                    </th> -->
                                                    <th>Username</th>
                                                    <!-- <th class="text-center">View Upload</th> -->
                                                    <th class="text-center">Display Name</th>
                                                    <th class="text-center">Email</th>
                                                    <th class="text-center">Actions</th>
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


 

    <style>

        /* Modal Background */
.modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    background-color: rgba(0, 0, 0, 0.4); /* Black background with opacity */
    overflow: auto; /* Enable scroll if needed */
}

/* Modal Content Box */
.modal-content {
    background-color: #fefefe;
    margin: 15% auto; /* Centered */
    padding: 20px;
    border: 1px solid #888;
    width: 50%; /* Set width to 50% of the viewport */
    max-width: 500px; /* Optional, limit the max width */
}

/* Form and input field styling */
form input {
    margin-bottom: 10px;
    width: 100%; /* Full width */
    padding: 8px;
    box-sizing: border-box;
}

form button {
    margin-top: 10px;
    padding: 10px;
    width: 100%;
    cursor: pointer;
}

/* Optional: style for the close button */
button[type="button"] {
    background-color: #f44336; /* Red */
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 5px;
}
    </style>



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

  <!-- <script src="assets/js/user_management.js"></script> -->
  <script src="assets/modal/user_management.js"></script>
</body>
</html>
<style>
.active-nav{
  color: #4154f1;
  font-size: 16px;
}

</style>

<script>
    // Function to show the modal
function openUpdateModal(adminId, name, email, status) {
    // Set the values in the modal fields
    document.getElementById('updateAdminId').value = adminId;
    document.getElementById('updateName').value = name;
    document.getElementById('updateEmail').value = email;
    document.getElementById('updateStatus').value = status;

    // Show the modal
    document.getElementById('updateModal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
    // Hide the modal
    document.getElementById('updateModal').style.display = 'none';
}
    </script>