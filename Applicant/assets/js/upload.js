        // data/secrets

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const storage = firebase.storage();
const db = firebase.firestore();


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("User is logged in:", user.email);
        checkUploadedFiles(); 
    } else {
        console.error("No user is logged in.");
        alert("Please log in to access this feature.");
    }
});
isUserLoggedIn().then((isLoggedIn) => {
    if (isLoggedIn) {
        console.log("User is logged in");
    } else {
        console.log("User is not logged in");
    }
});

function uploadFiles() {
    if (!auth.currentUser) {
        alert("You must be logged in to upload files.");
        return;
    }

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
        const fileKey = input.id;
        const file = input.files[0];

        if (file) {
            uploadFile(fileKey, file); 
        }
    });
}

function uploadFile(fileKey, file) {
    const user = auth.currentUser;
    if (!user) {
        console.error("No user is logged in.");
        return;
    }
    const storageRef = storage.ref(`/issueddocumentfolder/${user.uid}/${fileKey}/${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
        },
        (error) => {
            console.error("File upload failed:", error);
            alert("File upload failed. Please try again.");
        },
        async () => {
            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
            console.log("File available at:", downloadURL);

            const db = firebase.firestore();
            const docRef = db.collection('issuedocument').doc(user.uid);

            const fileData = {
                fileName: file.name,
                fileType: file.type,
                fileUrl: downloadURL,
                uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'under approval',
            };

            try {
                await docRef.set(
                    {
                        files: {
                            [fileKey]: fileData,
                        },
                    },
                    { merge: true }
                );
                console.log(`Document successfully updated under key: ${fileKey}`);
                showSuccessModal("File uploaded successfully!");
                localStorage.setItem(`${fileKey}_uploaded`, "true");
                updateUIAfterUpload(fileKey);
            } catch (error) {
                console.error("Error writing document:", error);
            }
        }
    );
}

// Update UI after a file upload
function updateUIAfterUpload(fileKey) {
    const fileInput = document.getElementById(fileKey);
    const statusElement = document.getElementById(`${fileKey}-status`);
    const uploadBtn = document.getElementById(`${fileKey}-uploadBtn`);
    const label = document.querySelector(`label[for=${fileKey}]`);
    const section = document.getElementById(`${fileKey}-section`);

    if (fileInput && statusElement) {
        fileInput.disabled = true;
        statusElement.style.display = 'block';
        statusElement.innerHTML = `${fileKey.replace('_', ' ').toUpperCase()} Submit Success`;

        if (uploadBtn) {
            uploadBtn.disabled = true;
            uploadBtn.textContent = 'Uploaded';
        }

        if (label) {
            label.style.display = 'inline';
        }

        if (fileInput) {
            fileInput.style.display = 'none';
        }

        if (section) {
            section.style.display = 'block';
        }
    }
}

// Check if a file exists in Firestore
async function checkFileInFirestore(fileKey) {
    const user = auth.currentUser;
    if (!user) {
        return false;
    }

    const db = firebase.firestore();
    const docRef = db.collection('issuedocument').doc(user.uid);

    try {
        const doc = await docRef.get();
        if (doc.exists) {
            const files = doc.data().files || {};
            return files[fileKey]?.fileUrl || false;
        }
    } catch (error) {
        console.error("Error checking Firestore:", error);
    }
    return false;
}

// Check uploaded files and update the UI on page load
function checkUploadedFiles() {
    const fileKeys = ['pagibig', 'tin', 'sss', 'philhealth', 'psa', 'diploma', 'police_clearance', 'brgy_clearance', 'lesp', 'training_certificate', 'neuro_and_drugtest'];

    fileKeys.forEach(async (fileKey) => {
        const fileExists = await checkFileInFirestore(fileKey);
        const fileInput = document.getElementById(fileKey);
        const statusElement = document.getElementById(`${fileKey}-status`);
        const uploadBtn = document.getElementById(`${fileKey}-uploadBtn`);
        const section = document.getElementById(`${fileKey}-section`);
        const label = document.querySelector(`label[for=${fileKey}]`);

        if (fileExists) {
            if (fileInput) fileInput.disabled = true;
            if (statusElement) {
                statusElement.style.display = 'block';
                statusElement.innerHTML = `${fileKey.replace('_', ' ').toUpperCase()} Submit Success`;
            }
            if (uploadBtn) {
                uploadBtn.disabled = true;
                uploadBtn.textContent = 'Uploaded';
            }
            if (fileInput) fileInput.style.display = 'none';
            if (label) label.style.display = 'inline';
            if (section) section.style.display = 'block';
        }
    });
}

// Run checks on page load
window.onload = checkUploadedFiles;




// Show success modal with dynamic message
function showSuccessModal(message) {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message; // Set dynamic success message
    successModal.show();
}

// Close the success modal
function closeSuccessModal() {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.hide();
}

// Confirm save changes
function saveChanges() {
    closeConfirmationModal();
    showSuccessModal("Changes saved successfully!");
}

// Open confirmation modal before saving
function openConfirmationModal() {
    const viewDetailsModal = new bootstrap.Modal(document.getElementById('viewDetailsModal'));
    viewDetailsModal.show();
}

// Close confirmation modal
function closeConfirmationModal() {
    const viewDetailsModal = new bootstrap.Modal(document.getElementById('viewDetailsModal'));
    viewDetailsModal.hide();
}

// Event listeners for buttons
document.getElementById("uploadBtn").addEventListener("click", uploadFiles);
document.getElementById("confirmSaveBtn").addEventListener("click", saveChanges);

// Ensure all modals have close functionality
document.querySelectorAll('.btn-close').forEach(button => {
    button.addEventListener('click', closeSuccessModal);
});
