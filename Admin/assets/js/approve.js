import firebase from 'firebase/app';
import 'firebase/storage'; 

var firebaseConfig = {
    apiKey: "AIzaSyAwZg1CODurIz0uJRiMxus28eKSd2CTHi4",
    authDomain: "lefmogiv-f49b3.firebaseapp.com",
    projectId: "lefmogiv-f49b3",
    storageBucket: "lefmogiv-f49b3.appspot.com",
    messagingSenderId: "687909819475",
    appId: "1:687909819475:web:60699d8e2a96376939e2a6",
    measurementId: "G-C7YD21Q71Y"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


const storage = firebase.storage().ref();
//fetch approveusers
fetchApprovedUsers();


function fetchApprovedUsers() {
    const tableBody = document.getElementById('table-1-body');
    const noDataRow = document.getElementById('noDataRow');

    if (!tableBody || !noDataRow) {
        if (!tableBody) {
            console.error("Table body not found.");
        }
        if (!noDataRow) {
            console.error("No Data Row not found.");
        }
        return;
    }
    tableBody.innerHTML = ` 
        <tr id="loadingRow">
            <td colspan="8" class="text-center" style="height: 492px;">
                <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
                    <div class="spinner"></div> <!-- This is the loading spinner -->
                </div>
            </td>
        </tr>
        <tr id="noDataRow" style="display: none;">
            <td colspan="8" class="text-center" style="height: 492px;">
                <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
                    No users found.
                </div>
            </td>
        </tr>
    `;
    noDataRow.style.display = 'none';
    db.collection('approveusers').onSnapshot((querySnapshot) => {
        const usersData = [];
        const promises = [];
        if (querySnapshot.empty) {
            const loadingRow = document.getElementById('loadingRow');
            loadingRow.style.display = 'none';
            noDataRow.style.display = 'table-row'; // Should not throw error now
            return;
        }
        querySnapshot.forEach((doc) => {
            if (doc.id !== "(donotdelete)W9tC3zJ1gvSkJ4QxZOgt") {
                const userData = doc.data();
                const userApplicationsPromise = db.collection('applications')
                    .where('userId', '==', doc.id)
                    .get()
                    .then((appSnapshot) => {
                        if (!appSnapshot.empty) {
                            const appData = appSnapshot.docs[0].data();
                            const profileImage = appData.imageURL || 'https://via.placeholder.com/150';

                            usersData.push({
                                id: doc.id,
                                username: userData.username || "N/A",
                                email: userData.email || "N/A",
                                time: formatTime(userData.time),
                                profileImage: profileImage,
                                interviewStatus: userData.interviewStatus || "set interview",
                            });
                        }
                    })
                    .catch((error) => {
                        console.error(`Error fetching application data for user ${doc.id}:`, error);
                    });

                promises.push(userApplicationsPromise);
            }
        });
        Promise.all(promises).then(() => {
            const loadingRow = document.getElementById('loadingRow');
            loadingRow.style.display = 'none';
            if (usersData.length === 0) {
                noDataRow.style.display = 'table-row';
            } else {
                renderTable(usersData);
            }
        }).catch((error) => {
            console.error("Error processing real-time data:", error);
            const loadingRow = document.getElementById('loadingRow');
            loadingRow.style.display = 'none';
            noDataRow.style.display = 'table-row';
        });
    }, (error) => {
        console.error("Error setting up real-time listener:", error);
        const loadingRow = document.getElementById('loadingRow');
        loadingRow.style.display = 'none';
        noDataRow.style.display = 'table-row';
    });
}



// render table
function renderTable(users) {
    const tableBody = document.getElementById('table-1-body');
    tableBody.innerHTML = ''; 
    users.forEach(user => {
        const row = document.createElement('tr');
        row.classList.add('user-row');
        let buttonHtml = '';
        if (user.interviewStatus === 'Scheduled') {
            buttonHtml = `
                <button class="btn btn-warning btn-sm" onclick="showSetContractModal('${user.id}', '${user.username}')">
                    Set Contract Signing
                </button>`;
        } else if (user.interviewStatus === 'Complete') {
            buttonHtml = `
                <button class="btn btn-success btn-sm" onclick="showProceedModal('${user.id}', '${user.username}')">
                    Proceed
                </button>`;
        } else {
            buttonHtml = `
                <button class="btn btn-success btn-sm" onclick="showScheduleInterviewModal('${user.id}', '${user.username}', '${user.email}', '${user.remarks}')">
                    Set Interview
                </button>`;
        }
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center;">
                    <img 
                        src="${user.profileImage || 'https://via.placeholder.com/150'}" 
                        alt="Profile" 
                        class="profile-circle" 
                        style="margin-right: 10px; cursor: pointer;" 
                        ondblclick="openProfileModal('${user.profileImage || 'https://via.placeholder.com/150'}')" 
                        onerror="this.onerror=null; this.src='https://via.placeholder.com/150';">
                    <span>${user.username}</span>
                </div>
            </td>
            <td>${user.email}</td>
       
            <td class="text-center">
                ${buttonHtml} <!-- Dynamically inserted button -->
            </td>
            <td class="text-center">
                <div class="dropdown d-inline-block">
                    <button class="btn p-0" data-bs-toggle="dropdown">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" onclick="viewApplicant('${user.id}')">View Form</a></li>
                    </ul>
                      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><a class="dropdown-item" onclick="viewDetails('${user.id}')">View Details</a></li>
                </ul>
                </div>
            </td>
        `;
        tableBody.appendChild(row);

    });
}

  // Function to fetch interview dates from Firestore
  function fetchInterviewDates() {
    const db = firebase.firestore();
    const applicantsRef = db.collection('personnels');  // Assuming this is the collection where interview data is stored
    applicantsRef.where('interviewDate', '!=', null)
      .get()
      .then(snapshot => {
        const interviewDates = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          const interviewDate = data.interviewDate.toDate();  // Convert Firestore timestamp to JavaScript Date
          interviewDates.push(interviewDate);
        });
        initializeCalendar(interviewDates); // Initialize FullCalendar with the fetched dates
      })
      .catch(error => {
        console.error("Error fetching interview dates:", error);
      });
  }

//  profile image
function openProfileModal(imageURL) {
    const modalImage = document.getElementById('modalProfileImage');
    modalImage.src = imageURL;
    const modal = document.getElementById('profileModal');
    modal.style.display = 'block';
}
function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.style.display = 'none';
}


//contract
function showSetContractModal(userId, username) {
    const modal = document.getElementById('contractModal');
    modal.style.display = 'block';
    document.getElementById('contractUserId').value = userId;
    document.getElementById('contractUsername').value = username;
}
document.getElementById('cancelContractButton').addEventListener('click', () => {
    document.getElementById('contractModal').style.display = 'none';
});
document.getElementById('contractForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const userId = document.getElementById('contractUserId').value;
    const date = document.getElementById('contractDate').value;
    const time = document.getElementById('contractTime').value;
    console.log(`Contract signing set for User ID: ${userId}, Date: ${date}, Time: ${time}`);
    document.getElementById('contractModal').style.display = 'none';
});


// Helper to format timestamps
function formatTime(timestamp) {
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", {
        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
    });
}


// The formatTime function
function formatTime(timestamp) {
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
}




// 201 document files
async function getAllFiles(userId) {
    const db = firebase.firestore();
    const docRef = db.collection('issuedocument').doc(userId);

    try {
        const doc = await docRef.get();
        if (!doc.exists) {
            console.log(`No document found for user: ${userId}`);
            return [];
        }

        const data = doc.data();
        if (!data.files) {
            console.log("No files found.");
            return [];
        }

        // Transform files map into an array for easier handling
        return Object.entries(data.files).map(([fileKey, fileData]) => ({
            fileKey,      // Example: "pagibig"
            ...fileData,  // Spread the metadata for this file
        }));
    } catch (error) {
        console.error("Error fetching files:", error);
        return [];
    }
}
async function viewDocuments(userId) {
    const modal = document.getElementById('documentModal');
    const documentSection = document.getElementById('documents-section');
    const fileKeys = [
        'pagibig', 
        'tin', 'sss', 
        'philhealth', 
        'psa', 
        'diploma', 
        'police_clearance', 
        'brgy_clearance', 
        'lesp', 
        'training_certificate', 
        'neuro_and_drugtest'];
    documentSection.innerHTML = '';
    try {
        // Fetch the user's document data
        const db = firebase.firestore();
        const docRef = db.collection('issuedocument').doc(userId);
        const doc = await docRef.get();

        if (!doc.exists) {
            console.log(`No document found for user: ${userId}`);
            return;
        }
        const files = doc.data().files || {}; 
        fileKeys.forEach((fileKey) => {
            const documentBox = document.createElement('div');
            documentBox.classList.add('document-box');
            documentBox.id = `${fileKey}-id-box`;
            const documentName = fileKey.replace('_', ' ').toUpperCase(); // Capitalize the file name
            const documentDiv = document.createElement('div');
            documentDiv.textContent = documentName;
            const statusSpan = document.createElement('span');
            statusSpan.textContent = 'No file chosen'; // Default message
            const viewButton = document.createElement('button');
            viewButton.classList.add('btn', 'btn-primary');
            viewButton.textContent = 'View';
            viewButton.disabled = true; // Disable by default
            if (files[fileKey]) {
                const fileData = files[fileKey]; 
                const fileUrl = fileData.fileUrl; 
                statusSpan.textContent = 'File available'; 
                viewButton.disabled = false; 
                viewButton.onclick = () => window.open(fileUrl, '_blank'); 
                const fileExtension = fileUrl.split('.').pop().toLowerCase();
                const filePreview = document.createElement('div');
                if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                    const img = document.createElement('img');
                    img.src = fileUrl;
                    img.style.maxWidth = '100%';
                    img.style.maxHeight = '200px';
                    filePreview.appendChild(img);
                } else if (fileExtension === 'pdf') {
                    const iframe = document.createElement('iframe');
                    iframe.src = fileUrl;
                    iframe.style.width = '100%';
                    iframe.style.height = '500px';
                    filePreview.appendChild(iframe);
                } else {
                    filePreview.textContent = 'Preview not available for this file type';
                }
                documentBox.appendChild(filePreview);
            } else {
                statusSpan.textContent = 'No file available'; 
            }
            documentBox.appendChild(documentDiv);
            documentBox.appendChild(statusSpan);
            documentBox.appendChild(viewButton);
            documentSection.appendChild(documentBox);
        });
        modal.style.display = 'block';
    } catch (error) {
        console.error("Error viewing documents:", error);
    }
}
function closeModal() {
    const modal = document.getElementById('documentModal');
    modal.style.display = 'none';
}
function viewDocument(fileKey, userId) {
    getDocumentURL(fileKey, userId).then((url) => {
        if (url) {
            window.open(url, '_blank');  
            alert('Document not available');
        }
    });
}
function openDocumentModal(userId) {
    const docRef = db.collection('useruploaddocument').doc(userId);
    docRef.get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            console.log('Firestore Document Data:', data); 
            ['pagibig', 'tin', 'sss', 'philhealth'].forEach(documentKey => {
                const documentData = data[documentKey];
                if (documentData && documentData.url) {
                    console.log(`${documentKey} URL:`, documentData.url); 
                    populateDocument(documentKey, documentData);
                } else {
                    console.log(`No URL found for ${documentKey}`);
                    populateDocument(documentKey, null);
                }
            });
            document.getElementById('documentModal').style.display = 'block';
        } else {
            console.log('No such document!');
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
    });
}
function populateDocument(documentKey, documentData) {
    const documentBox = document.getElementById(`${documentKey}-id-box`);
    const fileNameElement = documentBox.querySelector('span');
    const viewButton = documentBox.querySelector('button.btn-primary');
    const downloadButton = documentBox.querySelector('button.btn-secondary');

    if (documentData && documentData.url) {
        fileNameElement.textContent = documentData.name;
        viewButton.onclick = () => viewDocument(documentKey, documentData.url);
        downloadButton.onclick = () => downloadDocument(documentKey, documentData.url);
    } else {
        fileNameElement.textContent = "No file chosen";
    }
}
function viewDocument(documentKey, fileUrl) {
    window.open(fileUrl, '_blank');
}


// Download document
function downloadDocument(documentKey, fileUrl) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = documentKey; // You can set the filename here
    link.click();
}



// approve modal
function showApproveUserModal(userId) {
    fetchUserDetails(userId);
    document.getElementById("confirmModal").style.display = "block";
    document.getElementById("confirmApproveButton").onclick = function() {
        document.getElementById("confirmModal").style.display = "none";
        if (window.currentUser) { 
            showScheduleInterviewModal(window.currentUser);
        } else {
            console.error("User data not loaded yet.");
        }
    };
    document.getElementById("cancelButton").onclick = function() {
        document.getElementById("confirmModal").style.display = "none";
    };
}

function fetchUserDetails(userId) {
    console.log("Fetching details for User ID:", userId); 
    db.collection('approveusers').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                window.currentUser = { 
                    id: userId,
                    username: userData.username,
                    email: userData.email,
                    remarks: userData.remarks || "",
                    approved: userData.approved || false,
                    time: userData.time || ""
                };
                console.log("User data fetched and stored:", window.currentUser); 
            } else {
                console.error("User document does not exist for ID:", userId);
                window.currentUser = null; 
            }
        })
        .catch((error) => {
            console.error("Error fetching user details:", error);
            window.currentUser = null; 
        });
}


//  schedule interview
function showScheduleInterviewModal(userId, username, email, remarks) {
    if (!userId) {
        console.error("No user data available to schedule interview or user ID is missing");
        return; 
    }
    console.log("User ID:", userId); 
    document.getElementById("scheduleModal").style.display = "block";
    document.getElementById("userId").value = userId;
    document.getElementById("username").value = username;
    document.getElementById("email").value = email;
    document.getElementById("remarks").value = remarks || '';
    document.getElementById("interviewLocation").value = "657C+QVW, San Jose, Calamba City, Laguna, Calamba";
    document.getElementById("interviewPerson").value = "Julius";
    const interviewDateInput = document.getElementById("interviewDate");
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');
    const defaultTime = "08:00";
    interviewDateInput.value = `${year}-${month}-${day}T${defaultTime}`;
    const minDate = currentDate.toISOString().slice(0, 16); // Get current date and time in the required format
    interviewDateInput.setAttribute("min", minDate);
}
function submitScheduleInterviewForm(event) {
    event.preventDefault(); // Prevent form submission
    const userId = document.getElementById("userId").value;
    const location = document.getElementById("interviewLocation").value;
    const person = document.getElementById("interviewPerson").value;
    const datetime = document.getElementById("interviewDate").value;
    const remarks = document.getElementById("remarks").value;
    const interviewTimestamp = firebase.firestore.Timestamp.fromDate(new Date(datetime));
    db.collection('approveusers').doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                const subject = "Your Interview has been Scheduled";
                const body = `Dear ${userData.username},<br><br>
                              We are pleased to inform you that your interview has been scheduled.<br><br>
                              Location: ${location}<br>
                              Interviewer: ${person}<br>
                              Date and Time: ${new Date(interviewTimestamp.seconds * 1000).toLocaleString()}<br><br>
                              Please be on time and prepare accordingly.<br><br>
                              If you have any questions, feel free to contact us.<br><br>
                              Best regards,<br>
                              Lefmogiv Team`;
                return sendNotification(userData.email, subject, body)
                    .then(() => {
                        return db.collection('approveusers').doc(userId).update({
                            interviewLocation: location,
                            interviewPerson: person,
                            interviewDate: interviewTimestamp,  
                            interviewStatus: 'Scheduled', 
                            remarks: remarks || ''
                        });
                    })
                    .then(() => {
                        console.log("Interview details updated successfully.");
                        const scheduleButton = document.getElementById('scheduleInterviewBtn');
                        scheduleButton.innerHTML = 'Approve User'; 
                        scheduleButton.onclick = function() { 
                            showApproveUserModal(userId); 
                        };
                        document.getElementById("scheduleModal").style.display = "none";
                        fetchApprovedUsers(); 
                        showSuccessModal(); 
                    });
            } else {
                return Promise.reject(new Error("User not found"));
            }
        })
        .catch((error) => {
            console.error("Error in scheduling interview:", error);
            alert("Failed to schedule interview or send notification.");
        });
}
function sendNotification(email, subject, body) {
    const url = '../Admin/send_notification.php'; 
    console.log("Fetching:", url);
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, body })
    })
    .then(response => {
        return response.text().then(text => {
            console.log('Raw response:', text);
            if (!response.ok) throw new Error('Failed to send notification');
            return JSON.parse(text);
        });        
    })
    .then(data => {
        if (data.status !== 'success') {
            throw new Error(data.message || 'Unknown error occurred');
        }
        return data;
    })
    .catch(error => console.error('Error sending notification:', error));
}
document.getElementById("scheduleForm").onsubmit = submitScheduleInterviewForm;
document.getElementById("cancelScheduleButton").onclick = function() {
    document.getElementById("scheduleModal").style.display = "none";
};
function showSuccessModal() {
    document.getElementById("successModal").style.display = "block";
    document.getElementById("successButton").onclick = function() {
        document.getElementById("successModal").style.display = "none";
    };
}



// contract
function setContract() {
    const contractDateTime = document.getElementById('contractDateTime').value;
    const userId = document.getElementById('contractUserId').value;
    const username = document.getElementById('contractUsername').value;
    if (!contractDateTime || !userId || !username) {
        alert('Please fill out all required fields.');
        return;
    }
    const [contractDate, contractTime] = contractDateTime.split('T'); 
    const approveUsersRef = db.collection('approveusers');
    approveUsersRef.doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                const subject = "Contract Signed";
                const body = `Dear ${username},<br><br>
                              We are pleased to inform you that your contract has been successfully signed.<br><br>
                              Contract Date: ${contractDate}<br>
                              Contract Time: ${contractTime}<br><br>
                              Thank you for your cooperation.<br><br>
                              Best regards,<br>
                              Lefmogiv Team`;
                return sendNotification(userData.email, subject, body)
                    .then(() => {
                        return db.collection('approveusers').doc(userId).update({
                            contractDate: contractDate,
                            contractTime: contractTime,
                            contractStatus: 'Signed', 
                            interviewStatus: 'Complete'  
                        });
                    })
                    .then(() => {
                        console.log("Contract details updated successfully.");
                        showSuccessModal(); 
                        closeContractModal();
                    });
            } else {
                return Promise.reject(new Error("User not found"));
            }
        })
        .catch((error) => {
            console.error("Error in signing contract:", error);
            alert("Failed to sign contract or send notification.");
        });
}
function sendNotification(email, subject, body) {
    const url = '../Admin/send_notification.php'; 
    console.log("Fetching:", url);
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, body })
    })
    .then(response => {
        return response.text().then(text => {
            console.log('Raw response:', text);
            if (!response.ok) throw new Error('Failed to send notification');
            return JSON.parse(text);
        });        
    })
    .then(data => {
        if (data.status !== 'success') {
            throw new Error(data.message || 'Unknown error occurred');
        }
        return data;
    })
    .catch(error => console.error('Error sending notification:', error));
}
function closeContractModal() {
    const contractModal = document.getElementById('contractModal');
    if (contractModal) {
        contractModal.style.display = 'none';
    } else {
        console.error('Contract modal not found.');
    }
}

document.getElementById('cancelContractButton').addEventListener('click', closeContractModal);
function setContractDuration(months) {
    const contractStartDateInput = document.getElementById('contractStartDate');
    const contractEndDateInput = document.getElementById('contractEndDate');
    const startDate = new Date(contractStartDateInput.value);
    if (isNaN(startDate)) {
        alert('Please select a valid start date.');
        return;
    }
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + months); // Add the selected number of months
    const formattedStartDate = startDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
    const formattedEndDate = endDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
    contractStartDateInput.value = formattedStartDate;
    contractEndDateInput.value = formattedEndDate;
}


// proceed
function showProceedModal(userId, username) {
    const modal = document.getElementById('proceedModal');
    const approveUsersRef = db.collection('approveusers');
    approveUsersRef.doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                document.getElementById('username-placeholder').textContent = username;
                document.getElementById('email-placeholder').textContent = userData.email;
                const defaultStartDate = new Date(userData.contractDate).toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
                document.getElementById('contractStartDate').value = defaultStartDate;
                setContractDuration(6); 
                modal.style.display = 'block';
                const proceedButton = modal.querySelector('.btn-ok');
                proceedButton.onclick = function() {
                    proceedWithUser(userId);
                    closeProceedModal(); // Close the modal after proceeding
                };
            } else {
                alert('User not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            alert('Error displaying user data.');
        });
}
function closeProceedModal() {
    const modal = document.getElementById('proceedModal');
    modal.style.display = 'none';  
}
function proceedWithUser(userId) {
    const approveUsersRef = db.collection('approveusers');
    const personnelsRef = db.collection('personnels');
    const contractStartDate = document.getElementById('contractStartDate').value;
    const contractEndDate = document.getElementById('contractEndDate').value;
    if (!contractStartDate || !contractEndDate) {
        alert('Please select both contract start and end dates.');
        return;
    }
    approveUsersRef.doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                return personnelsRef.doc(userId).set({
                    ...userData,
                    contractStartDate: contractStartDate,
                    contractEndDate: contractEndDate,
                    status: 'Pending', 
                }).then(() => {
                    return approveUsersRef.doc(userId).delete();
                });
            } else {
                throw new Error('User not found');
            }
        })
        .then(() => {
            showSuccessModal();  
            fetchApprovedUsers(); 
        })
        .catch(error => {
            console.error('Error proceeding with user:', error);
            alert('Failed to proceed with user.');
        });
}
function showSuccessModal() {
    const successModal = document.getElementById('successModal');
    successModal.style.display = 'block';
}
function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    successModal.style.display = 'none';
}
