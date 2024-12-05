// pending applicant user email notification, parehas in reject and approve functions

//approve
document.addEventListener('DOMContentLoaded', () => {
    const successModal = document.getElementById('successModal');
    successModal.style.display = 'none';
    const isUserApproved = localStorage.getItem('userApproved');
    const isModalClosed = localStorage.getItem('successModalClosed');

    if (isUserApproved === 'true' && isModalClosed !== 'true') {
        setTimeout(() => {
            successModal.style.display = 'flex'; 
            localStorage.removeItem('userApproved'); 
        }, 100); 
    }
});

function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    successModal.style.display = 'none';
    localStorage.setItem('successModalClosed', 'true'); 
}
    const closeButton = document.querySelector('.btn-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeSuccessModal);
    }

    
function approveUser(userId, remarks) {
    const okButton = document.querySelector('.btn-confirm');
    const originalButtonText = okButton.innerHTML;

    okButton.innerHTML = '<span class="confirming-text">Confirming...</span><div class="spinner"></div>';
    okButton.disabled = true;

    db.collection('unapproveUsers').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                userData.remarks = remarks || '';
                userData.Approved = true;
                return db.collection('approveusers').doc(userId).set(userData)
                    .then(() => {
                        return db.collection('unapproveUsers').doc(userId).delete();
                    })
                    .then(() => {
                        console.log(`User approved and moved to approveusers: ${userId}`);
                        return sendNotification(userData.email, "Approval of Your Registration", 
                            `Dear ${userData.email},<br><br>
                            We are pleased to inform you that your registration has been successfully approved.<br><br>
                            Our administrator has reviewed and accepted your application form, and you are now eligible to serve as a security guard. You may log in using the account credentials you provided during registration. Please ensure that you upload the necessary documents at your earliest convenience. You can check your dashboard for the timeline allotted by the administrator for submitting your documents.<br><br>
                            Thank you for choosing Lefmogiv.<br><br>
                            If you did not initiate this request, you may disregard this email.<br><br>
                            Sincerely,<br>
                            Lefmogiv Team`
                        );
                    });
            } else {
                console.log("No user found with ID:", userId);
                okButton.innerHTML = originalButtonText; 
                okButton.disabled = false;
                return Promise.reject(new Error("User not found"));
            }
        })
        .then(() => {
            document.getElementById('confirmModal').style.display = 'none';
            localStorage.setItem('userApproved', 'true');

            if (typeof successModal !== 'undefined') {
                successModal.style.display = 'flex';
            } else {
                console.warn("successModal is not defined.");
            }
            okButton.innerHTML = originalButtonText;
            okButton.disabled = false;
            fetchUnapprovedUsers();
        })
        .catch((error) => {
            console.error("Error approving user:", error);
            okButton.innerHTML = originalButtonText; 
            okButton.disabled = false;
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
function openModal(userId) {
    db.collection('unapproveUsers').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const fullName = userData.username || "N/A";
                const email = userData.email || "N/A";
                const dateRegistered = formatTime(userData.time);

                db.collection('applications').where('userId', '==', userId).get()
                    .then((appSnapshot) => {
                        if (!appSnapshot.empty) {
                            appSnapshot.forEach((appDoc) => {
                                const appData = appDoc.data();
                                const profileImageUrl = appData.imageURL || 'default-profile.png';
                                document.getElementById('fullName').textContent = fullName;
                                document.getElementById('email').textContent = email;
                                document.getElementById('dateRegistered').textContent = dateRegistered;
                                document.getElementById('profileImage').src = profileImageUrl;
                                document.getElementById('applicantModal').style.display = 'block';
                                window.currentUserId = userId;
                            });
                        } else {
                            console.log("No application found for user:", userId);
                        }
                    })
                    .catch((error) => {
                        console.log("Error fetching application data:", error);
                    });
            } else {
                console.log("No user found with ID:", userId);
            }
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
}

function openConfirmModal() {
    document.getElementById('applicantModal').style.display = 'none';
    const okButton = document.querySelector('.btn-confirm');
    okButton.innerHTML = 'Confirm'; 
    okButton.disabled = false; 
    const spinner = okButton.querySelector('.spinner');
    if (spinner) {
        spinner.remove(); 
    }
    document.getElementById('confirmModal').style.display = 'flex';
}
function confirmApproval() {
    const remarks = document.getElementById('remarks').value;
    approveUser(window.currentUserId, remarks);
}
function submitRemarks(userId) {
    console.log(`Preparing to submit remarks for user with ID: ${userId}.`);
    openModal(userId); 
}
function viewDetails(userId) {
    db.collection('unapproveUsers').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const fullName = userData.username || "N/A"; 
                const email = userData.email || "N/A"; 
                const dateRegistered = formatTime(userData.time); 
                console.log(`User Details: ${fullName}, ${email}, Registered on: ${dateRegistered}`);
                alert(`User Details:\nFull Name: ${fullName}\nEmail: ${email}\nRegistered on: ${dateRegistered}`); // Optional: Show an alert with details
            } else {
                console.log("No user found with ID:", userId);
            }
        })
        .catch((error) => {
            console.log("Error fetching user data:", error);
        });
}

function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none'; 
}
function closeApplicantModal() {
    document.getElementById('applicantModal').style.display = 'none'; 
}













// reject

function rejectUser(userId) {
    db.collection('unapproveUsers').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const fullName = userData.username || "N/A";
                const email = userData.email || "N/A";
                const dateRegistered = formatTime(userData.time);

                db.collection('applications').where('userId', '==', userId).get()
                    .then((appSnapshot) => {
                        if (!appSnapshot.empty) {
                            appSnapshot.forEach((appDoc) => {
                                const appData = appDoc.data();
                                const profileImageUrl = appData.imageURL || 'default-profile.png';
                                openRejectModal(fullName, profileImageUrl, email, dateRegistered, userId);
                            });
                        } else {
                            console.log("No application found for user:", userId);
                        }
                    })
                    .catch((error) => {
                        console.log("Error fetching application data:", error);
                    });
            } else {
                console.log("No user found with ID:", userId);
            }
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
}
function openRejectModal(fullName, profileImageUrl, email, dateRegistered, userId) {
    document.getElementById('rejectFullName').textContent = fullName;
    document.getElementById('rejectProfileImage').src = profileImageUrl;
    document.getElementById('rejectEmail').textContent = email;
    document.getElementById('rejectDateRegistered').textContent = dateRegistered;
    document.getElementById('rejectUserId').value = userId; 
    document.getElementById('rejectModal').style.display = 'block';
}
function closeRejectModal() {
    document.getElementById('rejectModal').style.display = 'none';
}
function showRejectConfirmModal() {
    closeRejectModal(); 
    document.getElementById('rejectConfirmModal').style.display = 'block'; 
}
function closeRejectConfirmModal() {
    document.getElementById('rejectConfirmModal').style.display = 'none';
}
function submitRejectConfirmation() {
    const userId = document.getElementById('rejectUserId').value;
    const okButton = document.getElementById('submitRejectRemarksButton');
    const originalButtonText = okButton.innerHTML;
    okButton.innerHTML = '<span class="confirming-text">Confirming...</span><div class="spinner"></div>';
    okButton.disabled = true;
    disapproveUser(userId)
        .then(() => {
            openRejectionSuccessModal();
            closeRejectConfirmModal(); 
            fetchUnapprovedUsers(); 
        })
        .catch((error) => {
            console.error("Error processing rejection:", error);
            okButton.innerHTML = originalButtonText; 
            okButton.disabled = false;
        });
}
function disapproveUser(userId) {
    return db.collection('unapproveUsers').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const remarks = ""; 
              return db.collection('rejectedapplicant').doc(userId).set({
                    username: userData.username,
                    email: userData.email,
                    remarks: remarks,
                    time: userData.time,
                    rejectionTimestamp: new Date().toISOString()
                }).then(() => {
                    return db.collection('unapproveUsers').doc(userId).delete();
                }).then(() => {
                    return sendNotification(userData.email, "Rejection of Your Application", 
                        `Dear ${userData.username},<br><br>
                        We regret to inform you that, after reviewing your application, we have decided not to proceed with your registration at this time.<br><br>
                        Thank you for considering Lefmogiv. If you have any questions, please feel free to contact us.<br><br>
                        Sincerely,<br>
                        Lefmogiv Team`
                    );
                });
            } else {
                console.log("No user found with ID:", userId);
                return Promise.reject(new Error("User not found"));
            }
        });
}
function openRejectionSuccessModal() {
    document.getElementById('rejectSuccessModal').style.display = 'block';
}
function closeRejectionSuccessModal() {
    document.getElementById('rejectSuccessModal').style.display = 'none';
}
