// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, getDoc, doc, writeBatch, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, deleteUser } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js";
import { getStorage, ref, deleteObject, getBlob, uploadBytes } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-storage.js";

var firebaseConfig = {
    apiKey: "AIzaSyAwZg1CODurIz0uJRiMxus28eKSd2CTHi4",
    authDomain: "lefmogiv-f49b3.firebaseapp.com",
    projectId: "lefmogiv-f49b3",
    storageBucket: "lefmogiv-f49b3.appspot.com",
    messagingSenderId: "687909819475",
    appId: "1:687909819475:web:60699d8e2a96376939e2a6",
    measurementId: "G-C7YD21Q71Y"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
window.db = db;
window.auth = auth;
window.storage = storage;
function fetchUserData(userId) {
    const userDocRef = doc(db, 'isAdmin', userId);
    getDoc(userDocRef).then((doc) => {
        if (doc.exists()) {
            const userData = doc.data();
            const userNameElement = document.getElementById('user-log-in-name');
            const dropdownUsernameElement = document.getElementById('dropdown-username');
            dropdownUsernameElement.textContent = userData.username || "No Username";
            if (userNameElement) {
                userNameElement.style.display = 'block'; 
            }
            if (dropdownUsernameElement) {
                dropdownUsernameElement.style.display = 'block';
            }
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchUserData(user.uid); 
        fetchRejectedApplicants(); 
    } else {
        console.log("No user signed in, redirecting to login page");
        window.location.href = "../Admin/signout.php"; 
    }
});

async function fetchRejectedApplicants() {
    const user = auth.currentUser; 
    if (user) {
        const tableBody = document.getElementById('table-1-body');
        const noDataRow = document.getElementById('noDataRow');
        if (!tableBody || !noDataRow) {
            tableBody.innerHTML = `  
                <tr>
                    <td colspan="8" class="text-center" style="height: 475px;">
                        <div style="display: flex; justify-content: center; align-items: center; height: 100%;">Table body not found</div>
                    </td>
                </tr>
            `;
            return;
        }
        tableBody.innerHTML = `
            <tr id="loadingRow">
                <td colspan="8" class="text-center" style="height: 475px;">
                    <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
                        <div class="spinner"></div> <!-- This is the loading spinner -->
                    </div>
                </td>
            </tr>
            <tr id="noDataRow" style="display: none;">
                <td colspan="8" class="text-center" style="height: 475px;">
                    <div style="display: flex; justify-content: center; align-items: center; height: 100%;">No users found.</div>
                </td>
            </tr>
        `;
        noDataRow.style.display = 'none';
        const rejectedApplicantsCollection = collection(db, 'rejectedapplicant');
        const rejectedApplicantsSnapshot = await getDocs(rejectedApplicantsCollection);
        const loadingRow = document.getElementById('loadingRow');
        loadingRow.style.display = 'none';
        if (rejectedApplicantsSnapshot.empty) {
            noDataRow.style.display = 'table-row';
            return;
        }
        const usersData = [];
        const promises = rejectedApplicantsSnapshot.docs.map((doc) => {
            const userId = doc.id;
            const userData = doc.data();
            return getUserApplications(userId, userData, usersData);
        });
        try {
            await Promise.all(promises); 
            renderRejectedApplicantsTable(usersData); 
        } catch (error) {
            tableBody.innerHTML = `  
                <tr>
                    <td colspan="8" class="text-center" style="height: 475px;">
                        <div style="display: flex; justify-content: center; align-items: center; height: 100%;">Error fetching some applications.</div>
                    </td>
                </tr>
            `;
            console.error("Error fetching rejected applicants:", error);
        }
    } else {
        console.log("No user signed in");
        window.location.href = "../Admin/signout.php";
    }
}

async function getUserApplications(userId, userData, usersData) {
    const applicationQuery = query(collection(db, 'applications'), where('userId', '==', userId));
    const appSnapshot = await getDocs(applicationQuery);
    if (!appSnapshot.empty) {
        const appData = appSnapshot.docs[0].data();
        const profileImage = appData.imageURL || 'default-profile.png';
        usersData.push({
            id: userId,
            username: userData.username || "N/A",
            time: formatTime(userData.time),
            rejectionTimestamp: userData.isApproved ? "" : formatTime(userData.rejectionTimestamp),
            isApproved: userData.isApproved,
            profileImage: profileImage,
        });
    }
}

function renderRejectedApplicantsTable(users) {
    const tableBody = document.getElementById('table-1-body');
    tableBody.innerHTML = ''; 

    users.forEach(user => {
        const row = document.createElement('tr');
        row.classList.add('user-row');
        row.setAttribute('data-user-id', user.id); 
        row.innerHTML = `
        <td class="text-center">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" onchange="updateActionButtonVisibility()">
            </div>
        </td>
       <td class="text-left-detail">
            <div style="display: flex; align-items: center;">
                <img 
                    src="${user.profileImage}" 
                    alt="Profile" 
                    class="profile-circle" 
                    style="margin-right: 10px; cursor: pointer;" 
                    ondblclick="openProfileModal('${user.profileImage}')"
                />
                <span>${user.username}</span>
            </div>
        </td>
        <td class="text-left-detail">${user.rejectionTimestamp}</td>
        <td class="text-left-detail rejection-days">
            <i class="bi bi-dot rejection-dot"></i>${calculateDaysSinceRejection(user.rejectionTimestamp)} days
        </td>
        <td class="text-center">
            <span class="${user.isApproved ? 'status-approved' : 'status-pending'}">
                ${user.isApproved ? 'Approved' : 'Rejected'}
            </span>
        </td>
        <td class="text-center">
            <div class="dropdown d-inline-block">
                <button class="btn p-0" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><a class="dropdown-item" onclick="viewApplicant('${user.id}')">View Form</a></li>
                    <li><a class="dropdown-item" onclick="viewDetails('${user.id}')">View Details</a></li>
                    <li><a class="dropdown-item" onclick="confirmArchiveUser('${user.id}', '${user.username}')">Delete User</a></li>
                </ul>
            </div>
        </td>
    `;
        tableBody.appendChild(row);
    });
}



function formatTime(timestamp) {
    let date;
    if (timestamp && timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
    } else if (timestamp) {
        date = new Date(timestamp);
    } else {
        return "N/A"; 
    }
    const options = { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

window.archiveUserData = async function (userId, rejectedUsername) {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error("User is not authenticated");
            alert('User not authenticated');
            return false;
        }

        console.log("Authenticated user ID:", user.uid);
        console.log("User ID being archived:", userId);
        const rejectedApplicantRef = doc(db, 'rejectedapplicant', userId);
        const applicationRef = doc(db, 'applications', userId);
        const rejectedData = await getDoc(rejectedApplicantRef);
        const applicationData = await getDoc(applicationRef);
        const applicationFullName = applicationData.exists() ? applicationData.data().fullName : userId;
        const rejectUserStorageRefFolder = ref(storage, `rejectedusers/${applicationFullName}`);
        console.log("Reject user storage folder path:", `rejectedusers/${applicationFullName}`);
        const profileImageUrl = applicationData.exists() ? applicationData.data().imageURL : null;
        if (profileImageUrl) {
            const profileImageRef = ref(storage, profileImageUrl); 
            const profileImageBlob = await getBlob(profileImageRef);

            console.log("Uploading profile image to rejectedusers folder...");
            await uploadBytes(ref(rejectUserStorageRefFolder, 'profile.jpg'), profileImageBlob);
        } else {
            console.log("No profile image found for user:", userId);
        }
        if (rejectedData.exists()) {
            console.log("Uploading rejected applicant data...");
            const rejectedDataBlob = new Blob([JSON.stringify(rejectedData.data())], { type: 'application/json' });
            await uploadBytes(ref(rejectUserStorageRefFolder, 'rejectedapplicant.json'), rejectedDataBlob);
        }
        if (applicationData.exists()) {
            console.log("Uploading application data...");
            const applicationDataBlob = new Blob([JSON.stringify(applicationData.data())], { type: 'application/json' });
            await uploadBytes(ref(rejectUserStorageRefFolder, 'applications.json'), applicationDataBlob);
        } else {
            console.log("Application data not found for user:", userId);
        }
        console.log("Deleting original Firestore documents...");
        await deleteDoc(rejectedApplicantRef);
        await deleteDoc(applicationRef);
        console.log('User data archived successfully!');
        return true;
    } catch (error) {
        console.error("Error archiving user data:", error);
        alert('An error occurred while archiving the user data.');
        return false;
    }
};
