import { auth } from './firebase_init.js';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

import firebase from 'firebase/app';
import 'firebase/storage'; 

        // data/secrets
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


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
                id: doc.id,
                username: admin.username,
                name: admin.name,
                email: admin.email
            });
        // }
    });
    console.log(adminData)


    // Once all admin data is processed, display it
    displayAdminData(adminData);
}

async function createAdmin() {
    const username = document.getElementById("username").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = "temporarypassword";  // Set a temporary password (or generate one)
    const isAdmin = true;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const newAdmin = {
            username,
            name,
            email,
            isAdmin,
        };

        await db.collection("isAdmin").doc(user.uid).set(newAdmin);
        fetchAdminData();  // Refresh admin list

        // Close the modal after creating the admin
        closeModal();

    } catch (error) {
        console.error("Error creating admin:", error);
        alert("Error creating admin: " + error.message);
    }
}


// Function to delete admin user
async function deleteAdmin(admin) {
    console.log("Deleting: " + admin.email);

    const userConfirmed = confirm("Are you sure you want to delete this admin?");
    if (userConfirmed) {
        try {

            const user = await firebase.auth().getUserByEmail(admin.email);
            if (user) {
                await deleteUser(user);
            }

            // const adminDocRef = doc(db, "isAdmin", admin);
            await db.collection("isAdmin").doc(admin.id).delete()
            // await deleteDoc(admin.id);

            // Show success popup
            showSuccessPopup();
            fetchAdminData();
        } catch (error) {
            console.error("Error deleting admin and user:", error);
            alert("Error deleting admin and user: " + error.message);
        }
    } else {
        alert("Deletion canceled.");
    }
}



// Function to show the success popup
function showSuccessPopup() {
    alert("Admin and user successfully deleted!");
}

function openAddModal() {
    document.getElementById("addAdminModal").style.display = "flex";
}

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
        
        deleteBtn.onclick = () => deleteAdmin(admin);

        const verifyBtn = document.createElement("button");
        verifyBtn.textContent = "Send Verification Email";
        verifyBtn.classList.add("btn", "btn-info", "btn-sm");
        verifyBtn.onclick = () => sendVerificationEmail(admin.email);

        const actionsCell = document.createElement("td");
        actionsCell.appendChild(updateBtn);
        actionsCell.appendChild(deleteBtn);
        actionsCell.appendChild(verifyBtn); // Append verification button
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

// Close Modal function
function closeAddModal() {
    document.getElementById("addAdminModal").style.display = "none";
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