// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAwZg1CODurIz0uJRiMxus28eKSd2CTHi4",
    authDomain: "lefmogiv-f49b3.firebaseapp.com",
    projectId: "lefmogiv-f49b3",
    storageBucket: "lefmogiv-f49b3.appspot.com",
    messagingSenderId: "687909819475",
    appId: "1:687909819475:web:60699d8e2a96376939e2a6",
    measurementId: "G-C7YD21Q71Y"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // Use the already initialized app
}
const storage = firebase.storage(); 
const db = firebase.firestore();    

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        const userId = user.uid; // Get the current user's UID
        console.log("User is logged in with UID:", userId);

        // UI elements
        const uploadImageButton = document.getElementById("uploadImageButton");
        const removeImageButton = document.getElementById("removeImageButton");
        const profileImageInput = document.getElementById("profileImageInput");

        // Function to get user's full name from Firestore
        async function getUserFullName() {
            const userDoc = await db.collection("applications").where("userId", "==", userId).get();
            if (!userDoc.empty) {
                const doc = userDoc.docs[0];
                const userData = doc.data();
                return userData.fullName;  // Assuming 'fullName' field exists in Firestore
            } else {
                console.error("No application data found for userId:", userId);
                return null;
            }
        }

        // Function to set up image handlers
        async function setUpImageHandlers() {
            const fullName = await getUserFullName();
            if (!fullName) return; // Exit if no full name is found
            
            const folderName = fullName.trim(); // Use full name as folder name

            // Trigger file input when upload button is clicked
            uploadImageButton.addEventListener("click", () => {
                profileImageInput.click();
            });

            // Handle file input change (upload image)
            profileImageInput.addEventListener("change", async (event) => {
                const file = event.target.files[0];
                if (file) {
                    const storageRef = storage.ref(`applicantprofile/${folderName}/profile.jpg`);
                    const uploadTask = storageRef.put(file); // Upload file to Firebase Storage

                    uploadTask.on("state_changed", null, (error) => {
                        console.error("Error uploading file:", error);
                    }, async () => {
                        // Get the download URL after upload
                        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                        console.log("File available at", downloadURL);

                        // Save the image URL in Firestore
                        await db.collection("applications")
                            .where("userId", "==", userId)
                            .get()
                            .then(querySnapshot => {
                                if (!querySnapshot.empty) {
                                    querySnapshot.forEach(doc => {
                                        db.collection("applications").doc(doc.id).update({
                                            imageURL: downloadURL
                                        }).then(() => {
                                            console.log("Profile image URL saved to Firestore.");
                                        }).catch(error => {
                                            console.error("Error saving image URL to Firestore:", error);
                                        });
                                    });
                                } else {
                                    console.log("No application data found to update.");
                                }
                            })
                            .catch(error => console.error("Error querying Firestore:", error));
                    });
                }
            });

            // Remove profile image functionality
            removeImageButton.addEventListener("click", async (event) => {
                event.preventDefault(); // Prevent default link behavior
                const defaultImageUrl = "assets/img/images.jpg"; // Default image

                // Query Firestore to find the user's document
                await db.collection("applications")
                    .where("userId", "==", userId)
                    .get()
                    .then(querySnapshot => {
                        if (!querySnapshot.empty) {
                            querySnapshot.forEach(doc => {
                                const applicantData = doc.data();
                                const imageUrl = applicantData.imageURL;

                                // Check if the user has an image URL to delete
                                if (imageUrl && imageUrl.trim() !== "") {
                                    // Create a reference to the image in Firebase Storage
                                    const storageRef = storage.refFromURL(imageUrl);

                                    // Delete image from Firebase Storage
                                    storageRef.delete().then(async () => {
                                        console.log("Image removed from Firebase Storage.");

                                        // Update Firestore to remove the image URL
                                        await db.collection("applications").doc(doc.id).update({
                                            imageURL: ""  // Remove the image URL from Firestore
                                        }).then(() => {
                                            console.log("Profile image URL removed from Firestore.");
                                        }).catch(error => {
                                            console.error("Error removing image URL from Firestore:", error);
                                        });

                                        // Update the profile image preview to the default image
                                        profileImage.src = defaultImageUrl;

                                    }).catch(error => {
                                        console.error("Error deleting image from Firebase Storage:", error);
                                    });
                                } else {
                                    console.log("No image to remove.");
                                }
                            });
                        } else {
                            console.log("No application data found for userId:", userId);
                        }
                    })
                    .catch(error => console.error("Error querying Firestore:", error));
            });
        }
        setUpImageHandlers();

    } else {
        console.log("User is not logged in.");
    }
});



// Firebase authentication
firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const currentPasswordInput = document.getElementById("currentPassword");
      const newPasswordInput = document.getElementById("newPassword");
      const renewPasswordInput = document.getElementById("renewPassword");
      const changePasswordForm = document.getElementById("changePasswordForm");
  
      // Handle form submission
      changePasswordForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission
  
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const renewPassword = renewPasswordInput.value;
  
        // Validate the form inputs
        if (newPassword !== renewPassword) {
          showModal("Error", "New password and re-entered password do not match.", "error");
          return;
        }
  
        if (newPassword.length < 6) {
          showModal("Error", "New password should be at least 6 characters.", "error");
          return;
        }
  
        try {
          // Re-authenticate the user to change the password
          const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            currentPassword
          );
  
          await user.reauthenticateWithCredential(credential);
  
          // Update the password
          await user.updatePassword(newPassword);
  
          showModal("Success", "Password updated successfully!", "success");
  
          // Optionally, clear the form
          changePasswordForm.reset();
        } catch (error) {
          console.error("Error changing password:", error);
          showModal("Error", "Error changing password. Please try again.", "error");
        }
      });
    } else {
      console.log("User is not logged in.");
    }
});

// Function to show the modal
function showModal(title, message, type) {
  const modalTitle = document.getElementById("passwordChangeModalLabel");
  const modalMessage = document.getElementById("passwordChangeMessage");

  // Set modal title and message
  modalTitle.textContent = title;
  modalMessage.textContent = message;

  // Set modal color based on success or error
  if (type === "success") {
    modalMessage.classList.remove("text-danger");
    modalMessage.classList.add("text-success");
  } else {
    modalMessage.classList.remove("text-success");
    modalMessage.classList.add("text-danger");
  }

  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById('passwordChangeModal'));
  modal.show();
}





firebase.auth().onAuthStateChanged(user => {
    if (user) {
        const userId = user.uid;
        const userName = user.displayName || "User Username"; // Fallback to "User Username"
        const db = firebase.firestore();
        const approvalStatusDiv = document.querySelector(".status-div"); // Assuming class exists for approval status
        const profileImage = document.querySelector(".profile-image"); // Assuming class for profile image
        const applicantName = document.getElementById("applicantName"); // Keep the ID for applicantName
        const applicantRole = document.querySelector(".applicant-role"); // Select by class now, no ID

        // Set default statuses and profile image
        approvalStatusDiv.innerText = "Status: Retrieving Data...";
        approvalStatusDiv.className = "status-div status-retrieving";
        profileImage.src = "./assets/img/images.jpg"; // Default profile image
        applicantName.innerText = userName;
        applicantRole.innerText = "Security Personnel"; // Role remains as Security Personnel
        db.collection('personnels').doc(userId).get()
            .then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    const approvedStatus = userData.Approved === true || userData.Approved === "true";
                    approvalStatusDiv.innerText = approvedStatus
                        ? "Status: Approved"
                        : "Status: Not Approved";
                    approvalStatusDiv.className = approvedStatus
                        ? "status-div status-approved"
                        : "status-div status-not-approved";
                } else {
                    console.log("User not found in 'personnels'. Checking 'approveusers'...");
                    // Fallback to 'approveusers'
                    db.collection('approveusers').doc(userId).get()
                        .then(unapproveDoc => {
                            if (unapproveDoc.exists) {
                                const unapproveUserData = unapproveDoc.data();
                                console.log("User data from 'approveusers':", unapproveUserData);

                                // Set "Not Approved" status
                                approvalStatusDiv.innerText = "Status: Not Approved";
                                approvalStatusDiv.className = "status-div status-not-approved";
                            }
                        })
                        .catch(error => console.error("Error fetching from 'approveusers':", error));
                }
            })
            .catch(error => console.error("Error fetching from 'personnels':", error));

        // Fetch applicant-specific details
        fetchProfileDetails(userId);

        // Fetch the applicant's profile image URL from 'applications' collection
        db.collection('applications').where("userId", "==", userId).onSnapshot(
            querySnapshot => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach(doc => {
                        const applicantData = doc.data();
                        const imageUrl = applicantData.imageURL && applicantData.imageURL.trim() !== ""
                            ? applicantData.imageURL
                            : "/assets/img/images.jpg";  // Default image if not available
            
                        profileImage.src = imageUrl; // Set the image source
                    });
                } else {
                    console.log("No application data found for userId:", userId);
                }
            },
            error => {
                console.error("Error fetching from 'applications':", error);
            }
        );
        
    } else {
        console.log("No user is logged in.");
    }
});



function fetchProfileDetails(userId) {
    const db = firebase.firestore();
    const fullNameDiv = document.getElementById("fullName");
    const addressDiv = document.getElementById("address");
    const phoneDiv = document.getElementById("phone");
    const emailDiv = document.getElementById("email");

    // Set default values
    fullNameDiv.innerText = "No Data";
    addressDiv.innerText = "No Data";
    phoneDiv.innerText = "No Data";
    emailDiv.innerText = "No Data";  // Default email value
    console.log("Fetching applicant details for userId:", userId);

    // Fetch from 'applications'
    db.collection('applications').where("userId", "==", userId).get()
        .then(querySnapshot => {
            if (!querySnapshot.empty) {
                console.log("Applicant data found in 'applications':", querySnapshot.docs.length);
                querySnapshot.forEach(doc => {
                    const appData = doc.data();
                    // Populate fields with application data
                    fullNameDiv.innerText = appData.fullName || "No Data";
                    addressDiv.innerText = appData.presentAddress || "No Data";
                    phoneDiv.innerText = appData.telNo || "No Data";
                });
            } else {
                console.log("No applicant data found for userId:", userId);
            }
        })
        .catch(error => console.error("Error fetching from 'applications':", error));

    // Fetch email from 'personnels' or 'approveusers'
    db.collection('personnels').doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                const personnelData = doc.data();
                emailDiv.innerText = personnelData.email || "No Data";
            } else {
                console.log("User not found in 'personnels'. Checking 'approveusers'...");
                // Check 'approveusers'
                db.collection('approveusers').doc(userId).get()
                    .then(approveDoc => {
                        if (approveDoc.exists) {
                            console.log("Approve user document found:", approveDoc.data());
                            const approveUserData = approveDoc.data();
                            emailDiv.innerText = approveUserData.email || "No Data";
                        } else {
                            console.log("User not found in 'approveusers' either.");
                            emailDiv.innerText = "No Data";  // Fallback if no email found
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching from 'approveusers':", error);
                    });
            }
        })
        .catch(error => {
            console.error("Error fetching from 'personnels':", error);
        });
}
