// Firebase configuration
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
var btn = document.getElementById("lefmoButton");
var span = document.getElementsByClassName("close")[0];

function handleErrorRedirect(error) {
    console.error("Error checking admin status:", error);
    handleNonAdminRedirect();
}

    
    

    
function updatePaginationInfo() {
    const totalPages = Math.ceil(personnelData.length / rowsPerPage);
    document.getElementById("currentPage").textContent = currentPage;
    document.getElementById("itemRange").textContent = `Showing ${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, personnelData.length)} of ${personnelData.length} items`;
    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(personnelData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
}

function sortTable(column) {
    if (sortedColumn === column) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        sortedColumn = column;
        sortOrder = 'asc';
    }

    personnelData.sort((a, b) => {
        if (a[column] < b[column]) return sortOrder === 'asc' ? -1 : 1;
        if (a[column] > b[column]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    renderTable();
}

// Initialize the table

document.addEventListener('DOMContentLoaded', function() {
    loadPersonnels(); 
});

let currentPage = 1;
const rowsPerPage = 50;
let sortedColumn = null;
let sortOrder = 'asc';
let pollInterval;

async function loadPersonnels() {
    const personnelCollection = db.collection('personnels');
    const applicationsCollection = db.collection('applications');
    const tableBody = document.getElementById('table-1-body');
    const noDataRow = document.getElementById('noDataRow');
    tableBody.innerHTML = '';
    try {
        const snapshot = await personnelCollection.get();
        if (snapshot.empty) {
            if (noDataRow) {
                noDataRow.style.display = '';
            }
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="8" class="text-center" style="height: 492px;">
                    <div style="display: flex; justify-content: center; align-items: center; height: 100%;">No users found.</div>
                </td>
            `;
            tableBody.appendChild(row);
            return;
        }
        if (noDataRow) {
            noDataRow.style.display = 'none';
        }
        personnelData = [];
        for (const doc of snapshot.docs) {
            const data = doc.data();
            const personnelId = doc.id;
            let imageURL = 'https://example.com/default-image.jpg';
            if (personnelId) {
                try {
                    const userApplicationDoc = await applicationsCollection.where('userId', '==', personnelId).get();
                    if (!userApplicationDoc.empty) {
                        userApplicationDoc.forEach(applicationDoc => {
                            const applicationData = applicationDoc.data();
                            if (applicationData && applicationData.imageURL) {
                                imageURL = applicationData.imageURL;
                            }
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching application data for personnel ${personnelId}:`, error);
                }
            }
            const startDate = data.startDate ? new Date(data.startDate) : null;
            const expirationDate = data.expirationDate ? new Date(data.expirationDate) : null;
            let duration = 'N/A';
            if (startDate && expirationDate) {
                const diffTime = expirationDate - startDate;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                duration = diffDays + ' days';
            }
            personnelData.push({
                id: doc.id,
                username: data.username || 'N/A',
                email: data.email || 'N/A',
                companyName: data.companyName || 'N/A',
                duration: duration,
                status: data.status,
                imageURL: imageURL,
                startDate: startDate,
                expirationDate: expirationDate,
            });
        }
        renderTable();
    } catch (error) {
        console.error('Error loading personnel data:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center" style="height: 475px;">
                    <div style="display: flex; justify-content: center; align-items: center; height: 100%;">An error occurred while loading personnel data.</div>
                </td>
            </tr>
        `;
    }
}

function startRealTimeListener() {
    const personnelCollection = db.collection('personnels');
    const applicationsCollection = db.collection('applications');
    personnelCollection.onSnapshot(async snapshot => {
        if (snapshot.metadata.hasPendingWrites) {
            return;
        }
        personnelData = [];
        const promises = [];
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        snapshot.forEach(doc => {
            const data = doc.data();
            const personnelId = doc.id;
            let imageURL = 'https://example.com/default-image.jpg';
            if (personnelId) {
                const userApplicationDocPromise = applicationsCollection
                    .where('userId', '==', personnelId)
                    .get()
                    .then(userApplicationDoc => {
                        if (!userApplicationDoc.empty) {
                            userApplicationDoc.forEach(applicationDoc => {
                                const applicationData = applicationDoc.data();
                                if (applicationData && applicationData.imageURL) {
                                    imageURL = applicationData.imageURL;
                                }
                            });
                        }
                    });
                promises.push(userApplicationDocPromise);
                const deployment = data.deployment || {};
                const startDate = deployment.startDate ? new Date(deployment.startDate) : null;
                const expirationDate = deployment.expirationDate ? new Date(deployment.expirationDate) : null;
                let displayStatus = 'pending';
                if (startDate && expirationDate) {
                    startDate.setHours(0, 0, 0, 0);
                    expirationDate.setHours(0, 0, 0, 0);
                    if (startDate <= now && expirationDate >= now) {
                        displayStatus = 'deployed';
                    } else if (expirationDate < now) {
                        displayStatus = 'expired';
                    }
                }
                personnelData.push({
                    id: doc.id,
                    username: data.username || 'N/A',
                    email: data.email || 'N/A',
                    companyName: deployment.companyName || 'N/A',
                    duration: data.duration || 'N/A',
                    status: displayStatus,
                    imageURL: imageURL,
                    startDate: startDate,
                    expirationDate: expirationDate,
                    interviewDate: data.interviewDate,
                    interviewLocation: data.interviewLocation,
                });
            }
        });
        await Promise.all(promises);
        renderTable();
    });
}

startRealTimeListener();

async function updateExpiredRecords() {
    const personnelCollection = db.collection('personnels');
    const snapshot = await personnelCollection.get();
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    for (const doc of snapshot.docs) {
        const data = doc.data();
        const deployment = data.deployment || {};
        const expirationDate = deployment.expirationDate ? new Date(deployment.expirationDate) : null;
        if (expirationDate && expirationDate < now) {
            await personnelCollection.doc(doc.id).update({
                status: 'pending',
                'deployment.clientID': 'none',
                'deployment.companyName': 'none',
                'deployment.expirationDate': 'none',
                'deployment.startDate': 'none',
            });
            console.log(`Document ${doc.id} updated: deployment expired.`);
        }
    }
    await loadPersonnels();
}



// Function to render the table dynamically
async function renderTable() {
    const tableBody = document.getElementById('table-1-body');
    const noDataRow = document.getElementById('noDataRow');
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const uniquePersonnelData = personnelData.reduce((acc, current) => {
        const exists = acc.find(item => item.id === current.id);
        if (!exists) acc.push(current);
        return acc;
    }, []);
    const pageData = uniquePersonnelData.slice(startIndex, endIndex);
    if (pageData.length === 0) {
        if (currentPage !== 1) {
            currentPage--;
            renderTable(); 
        } else if (noDataRow) {
            noDataRow.style.display = ''; 
        }
        return;
    } else if (noDataRow) {
        noDataRow.style.display = 'none'; 
    }

    const statusClasses = {
        'pending': 'status-pending',
        'deployed': 'status-green',
        'floating': 'status-yellow', 
        'relieved': 'status-pending',
        'reassigned': 'status-yellow',
    };
    pageData.forEach(personnel => {
        let interviewStatus = personnel.status?.toLowerCase(); 
        if (!interviewStatus) {
            interviewStatus = 'pending';
        }
        const statusClass = statusClasses[interviewStatus] || statusClasses['pending']; 
        let actionCell = '';
        if (interviewStatus === 'pending') {
            actionCell = ` 
                <button class="btn btn-confirm" onclick="deployUser('${personnel.id}')">Deploy</button>
            `;
        } else if (interviewStatus === 'deployed') {
            actionCell = ` 
                <button class="btn btn-confirm" onclick="deploymentUserDetails('${personnel.id}')">Deployment Details</button>
            `;
        } else if (interviewStatus === 'floating') {
            actionCell = ` 
                <button class="btn btn-warning" onclick="deployUser('${personnel.id}')">Redeploy</button>
            `;
        }
        const imageURL = personnel.imageURL || 'https://example.com/default-image.jpg';
        const companyData = personnel.companyName || 'N/A';
        let row = document.getElementById(`row-${personnel.id}`);
        if (!row) {
            row = document.createElement('tr');
            row.id = `row-${personnel.id}`; // Assign a unique ID to the row
            tableBody.appendChild(row);
        }
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center;">
                    <img 
                        src="${imageURL}" 
                        alt="Profile Picture" 
                        style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px; cursor: pointer;" 
                        ondblclick="openProfileModal('${imageURL}')"
                    />
                    <span>${personnel.username}</span>
                </div>
            </td>
            <td>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${personnel.email}" class="email-link" title="Click to email" target="_blank">
                    ${personnel.email}
                </a>
                <i class="bi bi-copy" style="cursor: pointer; margin-left: 5px;" 
                data-tooltip="Click to copy email" onclick="copyToClipboard('${personnel.email}', this)"></i>
            </td>
            <td class="text-center">
                <span class="${statusClass}">
                    ${interviewStatus}
                </span>
            </td>
            <td class="text-center">
                ${actionCell}
            </td>
            <td class="text-center">
                <div class="dropdown">
                    <button class="btn p-0" id="dropdownMenuButton-${personnel.id}" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton-${personnel.id}">
                        <li>
                            <a class="dropdown-item" href="#" onclick="viewDetails('${personnel.id}')">View Details</a>
                        </li>
                        ${interviewStatus === 'deployed' ? `
                        <li>
                            <a class="dropdown-item" href="#" onclick="relieveUser('${personnel.id}')">Relieve</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#" onclick="reassignUser('${personnel.id}')">Reassign</a>
                        </li>
                        ` : ''}
                    </ul>
                </div>
            </td>
        `;
    });

    updatePaginationInfo();
}

let currentUserId = null; 
function closeDeployModal() {
    const modal = document.getElementById('deployModal');
    modal.style.display = 'none';  
}





// relieved user
function relieveUser(userId) {
    currentUserId = userId;
    document.getElementById('relieveModal').style.display = 'block';
}

async function confirmRelieve() {
    const reason = document.getElementById('relieveReason').value.trim();
    if (!reason) {
        alert("Please provide a reason for relieving the user.");
        return;
    }
    try {
        const personnelDoc = await db.collection("personnels").doc(currentUserId).get();
        const personnelData = personnelDoc.data();
        if (!personnelData || !personnelData.deployment) {
            alert("No active deployment found for this personnel.");
            return;
        }
        const companyName = personnelData.deployment.companyName;
        const currentDate = new Date().toISOString();
        await db.collection("personnels").doc(currentUserId).update({
            status: 'relieved',
            deployment: null,
            relievedReason: reason,
            Approved: false,
        });
        console.log(`Successfully updated personnel ${currentUserId} status to relieved and Approved to false.`);
        await db.collection("rejectedapplicant").doc(currentUserId).set({
            ...personnelData,
            status: 'relieved',
            relievedReason: reason,
            relievedDate: currentDate,
            transferredAt: currentDate,
            Approved: false,
        });
        console.log(`Successfully transferred user ${currentUserId} to rejectedapplicant collection with Approved set to false.`);
        const subject = "Relieved Notification";
        const body = `Dear ${personnelData.username},<br><br>We regret to inform you that you have been relieved from your current assignment at ${companyName}.<br><br>Relief Reason: ${reason}<br><br>Date of Relieved: ${currentDate}<br><br>We appreciate your contributions during your time with us.<br><br>Best regards,<br>Lefmogiv Team`;
        await sendNotification(personnelData.email, subject, body);
        const reportQuerySnapshot = await db.collection("report").get();
        console.log(`Found ${reportQuerySnapshot.size} reports in total.`);
        reportQuerySnapshot.forEach(async (doc) => {
            const reportData = doc.data();
            if (Array.isArray(reportData.deploymentHistory)) {
                const sortedDeployments = reportData.deploymentHistory.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
                const latestDeployment = sortedDeployments[0];
                if (latestDeployment.personnelId === currentUserId && latestDeployment.companyName === companyName) {
                    const updatedDeploymentHistory = reportData.deploymentHistory.map((deployment) => {
                        if (deployment === latestDeployment) {
                            return {
                                ...deployment,
                                relievedDate: currentDate,
                                updatedAt: currentDate,
                            };
                        }
                        return deployment;
                    });
                    await db.collection("report").doc(doc.id).update({
                        deploymentHistory: updatedDeploymentHistory,
                        updatedAt: currentDate,
                    });
                    console.log(`Successfully updated report ${doc.id} with relievedDate.`);
                }
            } else {
                console.error(`Deployment history is not an array for report ${doc.id}`);
            }
        });
        await db.collection("personnels").doc(currentUserId).delete();
        console.log(`Successfully removed personnel ${currentUserId} from personnels collection.`);
        await loadPersonnels();
        showRelieveSuccessModal();
        closeRelieveModal();
    } catch (error) {
        console.error("Error updating documents: ", error);
    }
}


// Function to send the email notification
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
document.addEventListener('DOMContentLoaded', function () {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const timeInputs = document.querySelectorAll('input[type="time"]');
    dateInputs.forEach(input => {
        input.addEventListener('keydown', function (event) {
            event.preventDefault(); 
        });
        const today = new Date().toISOString().split('T')[0];
        input.setAttribute('min', today);
    });
    timeInputs.forEach(input => {
        input.addEventListener('keydown', function (event) {
            event.preventDefault();  
        });
    });
    const shiftStartTimeInput = document.getElementById('shiftStartTime');
    const shiftEndTimeInput = document.getElementById('shiftEndTime');
    shiftStartTimeInput.addEventListener('change', function () {
        const startTimeValue = shiftStartTimeInput.value;
        if (startTimeValue) {
            const [startHours, startMinutes] = startTimeValue.split(':').map(num => parseInt(num));
            let endHours = startHours + 12;
            let endMinutes = startMinutes;
            if (endHours >= 24) {
                endHours -= 24;
            }
            const endTimeFormatted = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
            shiftEndTimeInput.value = endTimeFormatted;
        }
    });
});
function closeRelieveModal() {
    document.getElementById('relieveModal').style.display = 'none';
    document.getElementById('relieveReason').value = ''; // Clear the input field
    currentUserId = null;
}
function showRelieveSuccessModal() {
    document.getElementById('relieveSuccessModal').style.display = 'block';
}
function closeRelieveSuccessModal() {
    document.getElementById('relieveSuccessModal').style.display = 'none';
}
function reassignUser(userId) {
    currentUserId = userId;
    document.getElementById('reassignModal').style.display = 'block';
}

// comfirm reassign
async function confirmReassign() {
    try {
        const reassignedDate = new Date().toISOString();
        const personnelDoc = await db.collection("personnels").doc(currentUserId).get();
        const personnelData = personnelDoc.data();
        if (!personnelData) {
            throw new Error("Personnel data not found.");
        }
        const subject = "Reassignment Notification";
        const body = `Dear ${personnelData.username},<br><br>
                      We would like to inform you that your assignment status has been updated.<br><br>
                      Reassignment Date: ${reassignedDate}<br>
                      You are now waiting to be redeployed.<br><br>
                      Please await further instructions.<br><br>
                      Best regards,<br>
                      Lefmogiv Team`;

        await sendNotification(personnelData.email, subject, body);
        await db.collection("personnels") 
            .doc(currentUserId) 
            .update({
                status: 'pending',   
                deployment: null,  
                reassignedDate: reassignedDate, 
            });
        await loadPersonnels(); 
        showReassignSuccessModal();
        closeReassignModal();
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}


// Function to send the email notification
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


function closeReassignModal() {
    document.getElementById('reassignModal').style.display = 'none';
    currentUserId = null;
}
function showReassignSuccessModal() {
    document.getElementById('reassignSuccessModal').style.display = 'block';
}
function closeReassignSuccessModal() {
    document.getElementById('reassignSuccessModal').style.display = 'none';
}

async function updateExpiredRecordsAndRender() {
    await updateExpiredRecords();
    renderTable();
}
window.onload = updateExpiredRecordsAndRender;

function previewDeploymentPDF(personnelId) {
    if (!personnelId) {
        console.error('Personnel ID is missing!');
        return;
    }
    console.log(`Fetching data for Personnel ID: ${personnelId}`);
    db.collection('report')
        .doc(personnelId)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                console.error('No deployment data found for this ID in the report collection.');
                return;
            }
            const reportData = doc.data();
            console.log('Fetched Report Data:', reportData);
            return db.collection('personnels')
                .doc(personnelId)
                .get()
                .then((personnelDoc) => {
                    if (!personnelDoc.exists) {
                        console.error('No personnel found for this ID in the personnels collection.');
                        return;
                    }
                    const personnelData = personnelDoc.data();
                    console.log('Fetched Personnel Data:', personnelData);
                    const combinedData = {
                        personnelId: personnelId,
                        name: personnelData.name || 'Unknown Name',
                        username: personnelData.username || 'Unknown Username', // Already included
                        status: personnelData.status || 'Not Available',
                        deploymentHistory: reportData.deploymentHistory || [],
                    };
                    if (combinedData.deploymentHistory.length === 0) {
                        console.error('No deployment history found.');
                        return;
                    }
                    const previewUrl = `../Admin/Preview_report.php?personnelData=${encodeURIComponent(
                        JSON.stringify(combinedData)
                    )}&deploymentHistory=${encodeURIComponent(
                        JSON.stringify(combinedData.deploymentHistory)
                    )}`;
                    window.open(previewUrl, '_blank'); // Open in a new tab
                });
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}
document.querySelectorAll('.bi-download').forEach((icon) => {
    icon.addEventListener('click', (event) => {
        const personnelId = event.target.closest('tr').getAttribute('data-personnel-id');
        previewDeploymentPDF(personnelId);
    });
});

    function viewDetails() {
        document.getElementById('viewDetailsModal').style.display = 'block';
    }
    function closeDropdownDetailsModal() {
        document.getElementById('viewDetailsModal').style.display = 'none';
    }
        
    
    function closeDropdownDetailsModal() {
        document.getElementById("viewDetailsModal").style.display = "none";
    }

function copyToClipboard(email, iconElement) {
    navigator.clipboard.writeText(email).then(() => {
        iconElement.setAttribute('data-tooltip', 'Email copied!');
        setTimeout(() => {
            iconElement.setAttribute('data-tooltip', 'Click to copy email');
        }, 2000);
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}
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



let currentModal = null; 
function openModal(modalId, personnelId) {
    const personnel = personnelData.find(person => person.id === personnelId);
    if (personnel) {
        if (modalId === 'interviewDetailsModal') {
            document.getElementById('modal-username').textContent = personnel.username;
            document.getElementById('modal-email').textContent = personnel.email;
            document.getElementById('modal-interviewDate').textContent = personnel.interviewDate ? new Date(personnel.interviewDate.seconds * 1000).toLocaleString() : 'N/A';
            document.getElementById('modal-interviewLocation').textContent = personnel.interviewLocation || 'N/A';
        }
        document.getElementById(modalId).style.display = 'block';
        currentModal = modalId;
    }
}
function closeInterviewDetails() {
    const modal = document.getElementById('interviewDetailsModal');
    if (modal) {
        modal.style.display = 'none'; 
    }
}








//confirm start
function openConfirmInterviewModal(personnelId) {
    window.currentPersonnelId = personnelId; // Store personnel ID globally
    const modal = document.getElementById('confirmInterviewModal');
    modal.style.display = 'block'; // Show the modal
}

function closeConfirmInterviewModal() {
    const modal = document.getElementById('confirmInterviewModal');
    modal.style.display = 'none'; // Hide the modal
}

function closeConfirmInterviewModal() {
    const modal = document.getElementById('confirmInterviewModal');
    modal.style.display = 'none'; // Hide the modal
}
async function confirmInterviewStatus() {
    const personnelId = window.currentPersonnelId; // Retrieve the stored personnelId
    const confirmButton = document.getElementById('confirmButton');
    const confirmText = document.getElementById('confirmText');
    try {
        confirmText.innerHTML = 'Confirming... <div class="spinner"></div>';
        const personnelRef = db.collection('personnels').doc(personnelId); // Get personnel document reference
        const doc = await personnelRef.get();
        if (!doc.exists) {
            console.error('Personnel not found');
            return;
        }
        await personnelRef.update({
            interviewStatus: 'Complete',
            status: 'pending'
        });
        await loadPersonnels(); 
        closeConfirmInterviewModal();
        renderTable();
        showSuccessModal();
    } catch (error) {
        console.error('Error updating interview status:', error);
    } finally {
        confirmText.innerHTML = 'Confirm';
    }
}
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';
}

// Function to close the success modal
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
}

//confirm end






function undoMoveToApproveUsers(userId) {
    // Step 1: Get the user data from the 'personnels' collection
    db.collection('personnels').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();

                // Step 2: Move the user back to the 'approveusers' collection
                return db.collection('approveusers').doc(userId).set(userData)
                    .then(() => {
                        // Step 3: Remove the user from the 'personnels' collection
                        return db.collection('personnels').doc(userId).delete();
                    })
                    .then(() => {
                        console.log("User successfully moved back to approveusers collection.");
                        // Refresh the table (you can replace this with your actual table refresh function)
                        reloadTableData();
                    })
                    .catch((error) => {
                        console.error("Error moving user back to approveusers:", error);
                    });
            } else {
                console.log("No such user in personnels collection.");
            }
        })
        .catch((error) => {
            console.error("Error fetching user data from personnels:", error);
        });
}


























// Open the modal and populate Guard Name, Email, and Status
function deployUser(personnelId) {
    currentPersonnelId = personnelId;
    const guardNameField = document.getElementById('deploymentGuardName');
    const emailField = document.getElementById('deploymentEmail');
    const statusField = document.getElementById('deploymentStatus');
    
    db.collection('personnels').doc(personnelId).get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                guardNameField.value = data.username || "N/A";  // Populate with guard's username
                emailField.value = data.email || "N/A";  // Populate with email
                statusField.value = data.status || "N/A";  // Populate with status
            } else {
                alert('Personnel not found.');
            }
        })
        .catch((error) => {
            console.error('Error fetching personnel data:', error);
        });

    // Show the modal
    document.getElementById('deployModal').style.display = 'block';
}

function closeDeployModal() {
    document.getElementById('deployModal').style.display = 'none';
    const trigger = document.getElementById('clientInformationTrigger');
    trigger.innerHTML = `<span>Select a client</span>`;  // Reset to default text
    document.getElementById('clientInformationOptions').style.display = 'none';
}

function nextStep(step) {
    // Check if we're transitioning from Step 2 to Step 3
    if (step === 3) {
        const clientName = document.getElementById("clientInformationTrigger").textContent.trim(); // Get the client name text
        const invalidFeedback = document.querySelector('.invalid-feedback');
        
        // Validate that a client has been selected
        if (clientName === "Select a client" || clientName === "") {
            // If no client selected, show error and stop the transition
            invalidFeedback.style.display = "block"; // Show the error message
            return; // Stop the next step from happening
        } else {
            // If client is selected, clear the error and proceed
            invalidFeedback.style.display = "none"; // Hide the error message
        }
    }

    // Hide all form steps
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(stepElement => stepElement.style.display = 'none');

    // Show the selected step
    document.getElementById(`step${step}`).style.display = 'block';

    // If we're on Step 2 (Client Selection), fetch the client data from Firebase
    if (step === 2) {
        fetchClientData();
    }
}


// Show client profile (e.g., image and name)
function showClientProfile(clientData) {
    const profileDiv = document.getElementById('clientProfile');
    
    // Check if the element exists before changing its style
    if (profileDiv) {
        profileDiv.style.display = 'block';  // Show profile section
    } else {
        console.error('Client profile div not found');
    }

    // Update the client image and name
    const clientImage = document.getElementById('clientImage');
    const clientName = document.getElementById('clientName');
    
    if (clientImage) {
        clientImage.src = clientData.imageUrl || 'https://via.placeholder.com/100';  // Default image
    }
    if (clientName) {
        clientName.textContent = clientData.companyName || 'Unnamed Client';
    }
}

function toggleDropdown() {
    const options = document.getElementById('clientInformationOptions');
    // Check if the options are visible or hidden and toggle
    if (options.style.display === 'none' || options.style.display === '') {
        options.style.display = 'block'; // Show options
    } else {
        options.style.display = 'none'; // Hide options
    }
}
// Ensure fetchClientData is defined before calling it
// Function to fetch and display client data
function fetchClientData() {
    const clientContainer = document.getElementById('clientInformationOptions');
    clientContainer.innerHTML = ''; // Clear previous options

    const today = new Date(); // Current date

    db.collection('LEFMOGIVclient').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const clientData = doc.data();
                const clientId = doc.id;

                // Parse contractExpiry as a Date and ensure the client has a valid contract
                const contractExpiryDate = new Date(clientData.contractExpiry);

                // Only include clients with valid contracts
                if (contractExpiryDate >= today) {
                    // Create a custom option element with the client's image and name
                    const optionDiv = document.createElement('div');
                    optionDiv.classList.add('custom-option');
                    optionDiv.setAttribute('data-id', clientId);

                    const img = document.createElement('img');
                    img.src = clientData.imageUrl || 'https://via.placeholder.com/40';  // Default image if none exists

                    const text = document.createElement('span');
                    text.textContent = clientData.companyName || 'Unnamed Client';  // Default to 'Unnamed Client' if no name exists

                    optionDiv.appendChild(img);
                    optionDiv.appendChild(text);

                    // Add event listener to select client on click
                    optionDiv.addEventListener('click', function () {
                        selectClient(clientId, clientData);
                    });

                    clientContainer.appendChild(optionDiv);
                }
            });
        })
        .catch((error) => {
            console.error('Error fetching client data:', error);
        });
}

// Fetch client data when necessary
fetchClientData();

// Function to handle the client selection and display in the dropdown trigger
function selectClient(clientId, clientData) {
    const trigger = document.getElementById('clientInformationTrigger');
    const clientName = clientData.companyName || 'Unnamed Client';
    const clientImage = clientData.imageUrl || 'https://via.placeholder.com/40';  // Default image if no image exists

    // Update the client profile in the trigger (dropdown)
    trigger.innerHTML = `<img src="${clientImage}" alt="Client Image" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;" /> <span>${clientName}</span>`;

    // Optionally store the clientId for later use
    const selectedClientId = clientId;

    // Update the personnel document with the selected client ID
    updatePersonnelClientId(selectedClientId, clientData);

    // Hide the dropdown options after selection
    document.getElementById('clientInformationOptions').style.display = 'none';

    // Optionally close the dropdown after selection
    toggleDropdown(); // Ensure the dropdown is closed after client is selected
}

// Function to update the personnel document with the selected client ID
function updatePersonnelClientId(clientId, clientData) {
    const personnelRef = db.collection('personnels').doc(currentPersonnelId);  // Assuming currentPersonnelId is set

    // Update the personnel document with the selected clientId and companyName
    personnelRef.update({
        'deployment.clientID': clientId,  // Store the client ID
        'deployment.companyName': clientData.companyName || 'Unnamed Client',  // Store the client name
    })
    .then(() => {
        console.log('Client ID and company name updated successfully in personnel document.');
    })
    .catch((error) => {
        console.error('Error updating client ID in personnel document:', error);
    });
}


// Ensure that the clientID is added to the personnel document during deployment
async function submitDeployment() {
    const deployButton = document.getElementById('deployButton');
    const deployText = document.getElementById('deployText');  // Get deployText element

    try {
        // Show "Deploying..." animation
        deployText.innerHTML = 'Deploying... <div class="spinner"></div>';
        deployText.style.display = 'inline';  // Make deployText visible as a span
        deployButton.disabled = true;

        // Get the form data
        const deploymentDateElem = document.getElementById('deploymentStartDate');
        const expirationDateElem = document.getElementById('deploymentEndDate');
        const shiftStartTimeElem = document.getElementById('shiftStartTime');
        const shiftEndTimeElem = document.getElementById('shiftEndTime');
        const equipmentCategoryElem = document.getElementById('equipmentCategory');
        const equipmentIDElem = document.getElementById('equipmentID');
        const equipmentDetailsElem = document.getElementById('equipmentDetails');
        
        // Access the client information from the custom dropdown
        const clientInformationElem = document.getElementById('clientInformationTrigger');
        const clientInformation = clientInformationElem ? clientInformationElem.innerText : null;

        // Check if any element is not found and log an error
        if (!deploymentDateElem || !expirationDateElem || !shiftStartTimeElem || !shiftEndTimeElem || !equipmentCategoryElem || !equipmentIDElem || !equipmentDetailsElem || !clientInformation) {
            console.error('One or more form elements are missing:', {
                deploymentDateElem,
                expirationDateElem,
                shiftStartTimeElem,
                shiftEndTimeElem,
                equipmentCategoryElem,
                equipmentIDElem,
                equipmentDetailsElem,
                clientInformationElem
            });
            alert('Form elements are missing. Please try again.');
            return;
        }

        const deploymentDate = deploymentDateElem.value;
        const expirationDate = expirationDateElem.value;
        const shiftStartTime = shiftStartTimeElem.value;
        const shiftEndTime = shiftEndTimeElem.value;
        const equipmentCategory = equipmentCategoryElem.value;
        const equipmentID = equipmentIDElem.value;
        const equipmentDetails = equipmentDetailsElem.value;

        // Validate form data
        if (!deploymentDate || !expirationDate || !shiftStartTime || !shiftEndTime || !equipmentCategory || !equipmentID || !equipmentDetails || !clientInformation) {
            alert('Please fill in all fields.');
            return;
        }

        // Reference to the personnel document
        const personnelRef = db.collection('personnels').doc(currentPersonnelId);
        const doc = await personnelRef.get();

        if (!doc.exists) {
            alert('Personnel not found.');
            return;
        }

        // Retrieve clientID from the selected client data (from the custom dropdown)
        const clientID = doc.data().deployment ? doc.data().deployment.clientID : null;

        if (!clientID) {
            console.error('clientID is missing or undefined in the personnel document.');
            alert('Client ID is missing. Deployment cannot proceed.');
            return;
        }

        // Reference to the report collection to track deployments
        const reportRef = db.collection('report').doc(currentPersonnelId);
        const reportDoc = await reportRef.get();

        // Get the current timestamp before adding to the array
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();

        // Prepare the deployment details object
        const deploymentDetails = {
            companyName: clientInformation || 'Unnamed Client', // Default to 'Unnamed Client' if empty
            clientID: clientID, // Use the retrieved clientID
            startDate: deploymentDate ? new Date(deploymentDate).toISOString() : null, // Convert to ISO string
            endDate: expirationDate ? new Date(expirationDate).toISOString() : null, // Convert expiration date to ISO string
            shiftTime: `${shiftStartTime} - ${shiftEndTime}`, // Combine start and end times
            equipmentIssued: `${equipmentCategory} - ${equipmentID}`, // Include category and ID
            status: `Company Deploy #${reportDoc.exists ? reportDoc.data().deploymentHistory.length + 1 : 1}`,
            equipmentDetails: equipmentDetails, // Additional details about the equipment
        };

        // Update the personnel document with deployment information
        await personnelRef.update({
            status: 'deployed',
            deployment: {
                companyName: clientInformation,
                clientID: clientID, 
                startDate: deploymentDate,
                expirationDate: expirationDate,
                equipmentIssued: `${equipmentCategory} - ${equipmentID}` // Include this field
            },
        });

        // Add the new deployment to the report collection (or create it if not exists)
        if (!reportDoc.exists) {
            await reportRef.set({
                personnelId: currentPersonnelId, // Personnel ID is at the root level
                deploymentHistory: [deploymentDetails], // Add the deployment details as an array element
                createdAt: timestamp, // Set the timestamp at the root level
                updatedAt: timestamp, // Set the updatedAt timestamp at the root level
            });
        } else {
            await reportRef.update({
                deploymentHistory: firebase.firestore.FieldValue.arrayUnion(deploymentDetails), // Add the deployment to the array
                updatedAt: timestamp, // Update the timestamp separately at the root level
            });
        }

        // Send email notification with the updated message
        const personnelData = doc.data();
        const subject = 'Deployment Confirmation';
        const body = `Dear ${personnelData.username},<br><br>
                      You are now proceeding with your deployment. Please check your email for all the details.<br><br>
                      Best regards,<br>
                      Lefmogiv Team`;

        // Send the email
        await sendNotification(personnelData.email, subject, body);

        // Reload personnel data and table
        await loadPersonnels();
        renderTable();

        // Show success modal
        showDeploySuccessModal();
        closeDeployModal();

    } catch (error) {
        console.error('Error during deployment:', error);
        alert('Failed to complete deployment. Please try again.');
    } finally {
        deployText.innerHTML = 'Submit';  // Reset the text to 'Submit'
        deployText.style.display = 'none';  // Hide the text after completion
        deployButton.disabled = false;
    }
}

// Function to send the email notification
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


function showDeploySuccessModal() {
    const modal = document.getElementById('deploySuccessModal');
    modal.style.display = 'block';
}

function closeDeploySuccessModal() {
    const modal = document.getElementById('deploySuccessModal');
    modal.style.display = 'none';
}






function deploymentUserDetails(personnelId) {
    const personnelCollection = db.collection('personnels');
    const deploymentCollection = db.collection('report'); // Assuming deployment details are stored here

    personnelCollection.doc(personnelId).get()
        .then(doc => {
            if (!doc.exists) {
                console.error("Personnel not found!");
                showErrorModal('Personnel data could not be found.');
                return;
            }
            const personnelData = doc.data();
            deploymentCollection.where('personnelId', '==', personnelId).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        console.error("No deployment details found!");
                        showErrorModal('No deployment details found for this personnel.');
                        return;
                    }

                    snapshot.forEach(deploymentDoc => {
                        const deploymentData = deploymentDoc.data();
                        const deploymentHistory = deploymentData.deploymentHistory || [];
                        if (deploymentHistory.length === 0) {
                            console.log("No deployments found in deploymentHistory.");
                            showErrorModal('No deployments found.');
                            return;
                        }

                        // Get the latest deployment (most recent deployment)
                        const latestDeployment = deploymentHistory[deploymentHistory.length - 1]; // Last element is the newest

                        // Handle startDate, endDate, and updatedAt
                        const startDate = latestDeployment.startDate ? new Date(latestDeployment.startDate) : 'N/A';
                        const endDate = latestDeployment.endDate ? new Date(latestDeployment.endDate) : 'N/A';
                        const updatedAt = deploymentData.updatedAt ? new Date(deploymentData.updatedAt.seconds * 1000) : 'N/A';

                        // Format date function to handle 'N/A' and invalid dates
                        const formatDate = (date) => {
                            if (date === 'N/A' || isNaN(date)) return 'N/A';
                            return date.toLocaleDateString() + ', ' + date.toLocaleTimeString();
                        }

                        // Populate modal with details
                        document.getElementById('username').innerText = personnelData.username || 'N/A';
                        document.getElementById('email').innerText = personnelData.email || 'N/A';
                        document.getElementById('status').innerText = personnelData.status || 'N/A';
                        document.getElementById('companyName').innerText = latestDeployment.companyName || 'N/A';
                        document.getElementById('equipmentReleased').innerText = latestDeployment.equipmentIssued || 'N/A'; // Corrected to use equipmentIssued
                        document.getElementById('startDate').innerText = formatDate(startDate);
                        document.getElementById('endDate').innerText = formatDate(endDate);  // New line to display the endDate
                        document.getElementById('updatedAt').innerText = formatDate(updatedAt);

                        openDeploymentDetailsModal();  // Show the modal with deployment details
                    });
                })
                .catch(error => {
                    console.error("Error fetching deployment details:", error);
                    showErrorModal('An error occurred while fetching deployment details.');
                });
        })
        .catch(error => {
            console.error("Error fetching personnel data:", error);
            showErrorModal('An error occurred while fetching personnel data.');
        });
}


function openDeploymentDetailsModal() {
    const modal = document.getElementById('deploymentDetailsModal');
    modal.style.display = 'block';
}

function closeDeploymentDetailsModal() {
    const modal = document.getElementById('deploymentDetailsModal');
    modal.style.display = 'none';
}

function showErrorModal(message) {
    const detailsContent = document.getElementById('detailsContent');
    detailsContent.innerHTML = `<p class="error-message">${message}</p>`;
    openDeploymentDetailsModal();
}










