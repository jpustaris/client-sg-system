

function toggleCheckbox(selectAllCheckbox) {
    const checkboxes = document.querySelectorAll('#table-1-body input[type="checkbox"]');
    const actionButton = document.getElementById('actionButton');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAllCheckbox.checked;
    });

    updateActionButtonVisibility();
}

function calculateDaysSinceRejection(rejectionTimestamp) {
    const currentDate = new Date();
    const rejectionDate = new Date(rejectionTimestamp);
    const timeDiff = currentDate - rejectionDate;
    const daysDiff = timeDiff / (1000 * 3600 * 24); 
    return Math.floor(daysDiff); 
}

function updateActionButtonVisibility() {
    const checkboxes = document.querySelectorAll('#table-1-body input[type="checkbox"]');
    const actionButton = document.getElementById('actionButton');
    const anyChecked = Array.from(checkboxes).some((checkbox) => checkbox.checked);
    actionButton.style.display = anyChecked ? 'inline-block' : 'none';
}

// Modified to call the function from rejectedapplicant.js
function confirmArchiveUser(userId, username) {
    // Show the confirm modal before calling archiveUserData
    showConfirmModal(userId, username);
}

document.getElementById('closeSuccessModal').addEventListener('click', function() {
    document.getElementById('successModal').style.display = 'none';
});

document.getElementById('cancelButton').addEventListener('click', function(event) {
    document.getElementById('confirmModal').style.display = 'none';  
    event.stopPropagation();  
});

document.getElementById('confirmModal').addEventListener('click', function(event) {
    if (event.target === document.getElementById('confirmModal')) {
        document.getElementById('confirmModal').style.display = 'none'; 
    }
});

async function showConfirmModal(userId, username) {
    document.getElementById('confirmModal').style.display = 'flex';
    const confirmButton = document.getElementById('confirmButton');

    const confirmed = await new Promise((resolve) => {
        document.getElementById('confirmButton').onclick = () => resolve(true);
        document.getElementById('cancelButton').onclick = () => resolve(false);
    });

    confirmButton.disabled = true;
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    const confirmText = confirmButton.querySelector('.confirming-text');
    if (confirmText) {
        confirmText.innerText = 'Confirming...'; 
    }
    confirmButton.appendChild(spinner);

    // If not confirmed, reset and exit
    if (!confirmed) {
        confirmButton.disabled = false;
        confirmButton.innerHTML = 'Confirm'; 
        spinner.remove(); 
        document.getElementById('confirmModal').style.display = 'none';
        return; 
    }

    // Call the global archiveUserData function after confirmation
    const success = await window.archiveUserData(userId, username);

    if (success) {
        // Close the modal and show success message after confirmation
        setTimeout(() => {
            document.getElementById('confirmModal').style.display = 'none';
            document.getElementById('successModal').style.display = 'flex';
            confirmButton.disabled = false;
            confirmButton.innerHTML = 'Confirm'; 
            spinner.remove(); 
        }, 2000);
    }
}











function sortTable(column, order) {
    const tableBody = document.getElementById('table-1-body');
    const rows = Array.from(tableBody.getElementsByTagName('tr'));
    let columnIndex;
    if (column === 'name') columnIndex = 1; 
    else if (column === 'date') columnIndex = 2; 
    else if (column === 'rejectionDate') columnIndex = 3; 
    rows.sort((a, b) => {
        const cellA = a.getElementsByTagName('td')[columnIndex];
        const cellB = b.getElementsByTagName('td')[columnIndex];
        let valueA = cellA ? cellA.textContent.trim() : '';
        let valueB = cellB ? cellB.textContent.trim() : '';
        if (column === 'date' || column === 'rejectionDate') {
            valueA = valueA ? new Date(valueA) : new Date(0);  
            valueB = valueB ? new Date(valueB) : new Date(0);  
        }

        if (valueA < valueB) return order === 'asc' ? -1 : 1;
        if (valueA > valueB) return order === 'asc' ? 1 : -1;
        return 0;
    });
    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));
}
function openDetailsModal() {
    // Hide all modals first to ensure no modal is visible
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
    
    // Now open the specific modal (detailsModal)
    document.getElementById('detailsModal').style.display = 'flex';
}
function viewDetails(useruid) {
    document.getElementById('loadingModal').style.display = 'flex';
    console.log("Fetching details for rejected applicant with useruid:", useruid);
    
    // Reference to the specific 'detailsModal' for user details
    const rejectedApplicantRef = firebase.firestore().collection('rejectedapplicant').doc(useruid);
    rejectedApplicantRef.get()
        .then((doc) => {
            document.getElementById('loadingModal').style.display = 'none';

            if (doc.exists) {
                const data = doc.data();
                
                // Ensure that data.time is a Firebase Timestamp and convert it to a JavaScript Date
                const formattedTime = formatTimestamp(data.time);  // Format the timestamp

                const detailsData = `
                    <div class="user-details-row">
                        <strong>User ID:</strong> 
                        <span class="user-details-value" id="userIdValue">${useruid || 'N/A'}</span>
                        <i class="bi bi-copy" id="copyUserId" style="cursor: pointer; margin-left: 10px;"></i>
                        <span id="copyMessage" style="margin-left: 10px; color: green; display: none;">Copied!</span>
                    </div>
                    <div class="user-details-row">
                        <strong>Username:</strong> <span class="user-details-value">${data.username || 'N/A'}</span>
                    </div>
                    <div class="user-details-row">
                        <strong>Email:</strong> 
                        <span class="user-details-value">
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${data.email || ''}" target="_blank" class="email-link">${data.email || 'N/A'}</a>
                        </span>
                    </div>
                    <div class="user-details-row">
                        <strong>Registered:</strong> <span class="user-details-value">${formattedTime || 'N/A'}</span>
                    </div>
                `;

                // Populate the details into the modal content
                document.getElementById('detailsContent').innerHTML = detailsData;

                // Add event listener for the copy icon
                document.getElementById('copyUserId').addEventListener('click', function() {
                    const userId = document.getElementById('userIdValue').textContent.trim();
                    if (userId) {
                        // Copy User ID to clipboard
                        navigator.clipboard.writeText(userId).then(() => {
                            // Show the "Copied!" message
                            const copyMessage = document.getElementById('copyMessage');
                            copyMessage.style.display = 'inline';  // Display the "Copied!" message
                            setTimeout(() => {
                                copyMessage.style.display = 'none';  // Hide the message after 2 seconds
                            }, 2000);
                        }).catch((err) => {
                            console.error('Error copying text: ', err);
                        });
                    }
                });

                // Open the user details modal
                document.getElementById('detailsModal').style.display = 'block';
            } else {
                console.log("No data found for the specified rejected applicant useruid.");
            }
        })
        .catch((error) => {
            console.error("Error fetching rejected applicant details:", error);
            document.getElementById('loadingModal').style.display = 'none';
        });
}


function closeModal() {
    document.getElementById('detailsModal').style.display = 'none';
}

function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A'; 
    if (timestamp instanceof firebase.firestore.Timestamp) {
        const date = timestamp.toDate();
        return date.toLocaleString();  
    }
    const date = new Date(timestamp); 
    return date.toLocaleString();
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
