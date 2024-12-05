        // data/secrets
firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  var btn = document.getElementById("lefmoButton");
  var span = document.getElementsByClassName("close")[0];
function fetchUserData(userId) {
    db.collection('isAdmin').doc(userId).get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          const dropdownUsernameElement = document.getElementById('dropdown-username');
          dropdownUsernameElement.textContent = userData.username;
          dropdownUsernameElement.style.display = 'block';
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }
  
  function fetchAdminStatus(userId) {
    return db.collection('isAdmin').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                return userData.isAdmin || false;
            } else {
                return false;
            }
        })
        .catch((error) => {
            console.log("Error getting admin status:", error);
            throw error;
        });
  }
  function signOut() {
    firebase.auth().signOut().then(function() {
        console.log("User signed out");
        window.location.href = "../login.html"; // Redirect to login page after signing out
    }).catch(function(error) {
        console.log("Error signing out:", error);
    });
  }
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Check if the user is an admin
        fetchAdminStatus(user.uid)
            .then((isAdmin) => {
                if (isAdmin) {
                    console.log("User signed in as admin: ", user.email);
                    fetchUserData(user.uid); // Fetch user data
                } else {
                    console.log("User is not an admin, redirecting to home page");
                    window.location.href = "../login.html";
                }
            })
            .catch((error) => {
                console.error("Error checking admin status:", error);
                window.location.href = "../login.html";
            });
    } else {
        console.log("No user signed in, redirecting to login page");
        window.location.href = "../login.html"; // Redirect to login page
    }
  });


  
  let userIdToApprove = null; // Global variable to store the user ID

  function approveUser(userId) {
    userIdToApprove = userId; // Store the user ID to approve
    fetchUserDetails(userId); // Fetch the user details to display in the modal
}
document.addEventListener('DOMContentLoaded', () => {
    fetchData(); // Call fetchData on DOMContentLoaded
});

async function fetchData() {
    try {
        const docId = "yourDocumentId"; // Replace with your actual document ID
        const docRef = db.collection("homeinfo").doc(docId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            console.log("Fetched data: ", data); 
            document.getElementById('titlePreview').innerText = data.homeTitle || "No data text found";
            document.getElementById('mottoPreview').innerText = data.motto || "No motto available";
            document.getElementById('aboutUsTitlePreview').innerText = data.aboutUsTitle || "No About Us Header found";
            document.getElementById('aboutUsParagraphPreview').innerText = data.aboutUsParagraph || "No paragraph available";
            document.getElementById('aboutUsMissionPreview').innerHTML = `<strong>A Legacy of Trust and Reliability</strong><br>${data.aboutUsMission || "No mission available."}`;
            document.getElementById('aboutUsVisionPreview').innerHTML = `<strong>Our Commitment to Excellence</strong><br>${data.aboutUsVision || "No vision available."}`;
            document.getElementById('aboutUsSummaryPreview').innerHTML = `<strong>Summary:</strong> ${data.aboutUsSummary || "No summary available."}`;

            // Display data in Location Information section
            document.getElementById('locationTitlePreview').innerHTML = `<strong>Location:</strong> ${data.locationTitle || "Location not available."}`;
            document.getElementById('locationHoursPreview').innerHTML = `<strong>Hours Open:</strong> ${data.locationHours || "Hours not available."}`;
            document.getElementById('locationCallPreview').innerHTML = `<strong>Call Us:</strong> ${data.locationCall || "Call information not available."}`;

            // Display data in FAQ section
            const faqs = data.faqs || [];
            faqs.forEach((faq, index) => {
                document.getElementById(`faq${index + 1}Preview`).innerHTML = `
                    <strong>Question:</strong> <span class="faq-question">${faq.question || "No question available."}</span><br>
                    <strong>Answer:</strong> <span class="faq-answer">${faq.answer || "No answer available."}</span>
                `;
            });

            // Handle case where there are fewer than 4 FAQs
            for (let i = faqs.length; i < 4; i++) {
                document.getElementById(`faq${i + 1}Preview`).innerHTML = `
                    <strong>Question:</strong> <span class="faq-question">No question available.</span><br>
                    <strong>Answer:</strong> <span class="faq-answer">No answer available.</span>
                `;
            }
        } else {
            console.log("No such document!");
            displayNoData();
        }
    } catch (error) {
        console.error("Error fetching document: ", error);
        displayNoData();
    }
}

// Call fetchData when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    fetchData();
});


// Call the fetch function when the page loads
document.addEventListener("DOMContentLoaded", fetchData);

// Function to display no data message
function displayNoData() {
    const placeholders = [
        'titlePreview',
        'mottoPreview',
        'aboutUsTitlePreview',
        'aboutUsParagraphPreview',
        'aboutUsMissionPreview',
        'aboutUsVisionPreview',
        'aboutUsSummaryPreview',
        'locationTitlePreview',   // Add location IDs here
        'locationHoursPreview',
        'locationCallPreview',
        'faq1Preview',
        'faq2Preview',
        'faq3Preview',
        'faq4Preview'
    ];

    placeholders.forEach(id => {
        document.getElementById(id).innerText = "No data available"; // or "No data found"
    });
}


function toggleHomeEdit() {
    const titlePreview = document.getElementById('titlePreview');
    const mottoPreview = document.getElementById('mottoPreview');
    const isEditable = titlePreview.contentEditable === "true";

    titlePreview.contentEditable = !isEditable; // Toggle title editing
    mottoPreview.contentEditable = !isEditable; // Toggle motto editing

    const editButton = document.querySelector('.home-title .edit-btn');
    editButton.innerText = isEditable ? "Edit Title & Motto" : "Confirm Changes";

    if (!isEditable) {
        titlePreview.focus(); // Focus on the title when editing starts
    } else {
        // Save data after editing
        const updatedTitle = titlePreview.innerText.trim();
        const updatedMotto = mottoPreview.innerText.trim();
        
        // Save updated data for title and motto
        saveData('homeInfo', {
            title: updatedTitle || "No data found",
            motto: updatedMotto || "No data found"
        });
    }
}


function toggleAboutUsEdit() {
    const aboutUsTitlePreview = document.getElementById('aboutUsTitlePreview');
    const aboutUsParagraphPreview = document.getElementById('aboutUsParagraphPreview');
    const aboutUsMissionPreview = document.getElementById('aboutUsMissionPreview');
    const aboutUsVisionPreview = document.getElementById('aboutUsVisionPreview');
    const aboutUsSummaryPreview = document.getElementById('aboutUsSummaryPreview');

    // Toggle contentEditable for all boxes
    const isEditable = aboutUsTitlePreview.contentEditable === "true";

    aboutUsTitlePreview.contentEditable = !isEditable; 
    aboutUsParagraphPreview.contentEditable = !isEditable; 
    aboutUsMissionPreview.contentEditable = !isEditable; 
    aboutUsVisionPreview.contentEditable = !isEditable; 
    aboutUsSummaryPreview.contentEditable = !isEditable; 

    // Change button text based on editing state
    const editButton = document.querySelector('.about-us .edit-btn');
    editButton.innerText = isEditable ? "Edit" : "Confirm Changes";

    if (!isEditable) {
        aboutUsTitlePreview.focus(); 
    } else {
        // Save data after editing
        const updatedTitle = aboutUsTitlePreview.innerText.trim();
        const updatedParagraph = aboutUsParagraphPreview.innerText.trim();
        const updatedMission = aboutUsMissionPreview.innerText.trim();
        const updatedVision = aboutUsVisionPreview.innerText.trim();
        const updatedSummary = aboutUsSummaryPreview.innerText.trim();

        // Save updated data
        saveData('aboutUsPreview', {
            title: updatedTitle || "No data found",
            paragraph: updatedParagraph || "No data found",
            mission: updatedMission || "No data found",
            vision: updatedVision || "No data found",
            summary: updatedSummary || "No data found"
        });
    }
}
function toggleLocationEdit() {
    const titlePreview = document.getElementById('locationTitlePreview');
    const hoursPreview = document.getElementById('locationHoursPreview');
    const callPreview = document.getElementById('locationCallPreview');

    // Check if currently editable
    const isEditable = titlePreview.contentEditable === "true";

    // Toggle contentEditable for each field
    titlePreview.contentEditable = !isEditable;
    hoursPreview.contentEditable = !isEditable;
    callPreview.contentEditable = !isEditable;

    // Change button text based on editing state
    const editButton = document.querySelector('.location-info .edit-btn');
    editButton.innerText = isEditable ? "Edit" : "Confirm Changes";

    // If switching to editable state, focus on the title
    if (!isEditable) {
        titlePreview.focus();
    } else {
        // Save data after editing
        const updatedTitle = titlePreview.innerText.replace("Location: ", "").trim();
        const updatedHours = hoursPreview.innerText.replace("Hours Open: ", "").trim();
        const updatedCall = callPreview.innerText.replace("Call Us: ", "").trim();

        // Update innerHTML to reflect the changes, including no data scenarios
        titlePreview.innerHTML = updatedTitle ? `<strong>Location:</strong> ${updatedTitle}` : `<strong>Location:</strong> No data found`;
        hoursPreview.innerHTML = updatedHours ? `<strong>Hours Open:</strong> ${updatedHours}` : `<strong>Hours Open:</strong> No data found`;
        callPreview.innerHTML = updatedCall ? `<strong>Call Us:</strong> ${updatedCall}` : `<strong>Call Us:</strong> No data found`;

        // Save updated data using correct identifiers
        saveData('locationTitlePreview', updatedTitle || "No data found");
        saveData('locationHoursPreview', updatedHours || "No data found");
        saveData('locationCallPreview', updatedCall || "No data found");
    }
}

function clearText(previewId) {
    document.getElementById(previewId).innerText = "";
}

function toggleClearOptions() {
    const clearOptions = document.getElementById('clearOptions');
    const aboutUsOptions = document.getElementById('aboutUsOptions');
    
    // Hide aboutUsOptions if it is visible
    if (aboutUsOptions.style.display === 'block') {
        aboutUsOptions.style.display = 'none';
    }
    
    // Toggle clearOptions
    clearOptions.style.display = clearOptions.style.display === 'none' ? 'block' : 'none';
}

function toggleAboutUsOptions() {
    const aboutUsOptions = document.getElementById('aboutUsOptions');
    const clearOptions = document.getElementById('clearOptions');
    
    // Hide clearOptions if it is visible
    if (clearOptions.style.display === 'block') {
        clearOptions.style.display = 'none';
    }
    
    // Toggle aboutUsOptions
    aboutUsOptions.style.display = aboutUsOptions.style.display === 'none' ? 'block' : 'none';
}


function clearText(previewId) {
    const previewBox = document.getElementById(previewId);
    previewBox.innerText = ""; // Clear text in the preview
    clearDataFromFirestore(previewId); // Clear data in Firestore
    toggleClearOptions(); // Hide clear options after clearing
}

// Clear data from Firestore
async function clearDataFromFirestore(previewId) {
    const docId = "yourDocumentId"; // Replace with your actual document ID
    const fieldMapping = {
        titlePreview: "homeTitle",
        mottoPreview: "motto", // Add mapping for motto
        aboutUsPreview: "aboutUs",
        locationInfoPreview: "locationInfo",
        faqPreview: "faq"
    };

    try {
        const docRef = db.collection("homeinfo").doc(docId);
        await docRef.update({
            [fieldMapping[previewId]]: firebase.firestore.FieldValue.delete() // Delete the specific field
        });
        console.log("Data successfully cleared from Firestore!");
    } catch (error) {
        console.error("Error clearing data from Firestore: ", error);
    }
}

async function saveData(previewId, updatedData) {
    const docId = "yourDocumentId"; // Replace with your actual document ID
    const fieldMapping = {
        homeInfo: { // For saving home title and motto
            title: "homeTitle",
            motto: "motto"
        },
        aboutUsPreview: {
            title: "aboutUsTitle",
            paragraph: "aboutUsParagraph",
            mission: "aboutUsMission",
            vision: "aboutUsVision",
            summary: "aboutUsSummary"
        },
        // Update mapping for individual location fields
        locationTitlePreview: { 
            title: "locationTitle" 
        },
        locationHoursPreview: {
            hours: "locationHours"
        },
        locationCallPreview: {
            call: "locationCall"
        }
    };

    try {
        const docRef = db.collection("homeinfo").doc(docId);
        
        // Check if the previewId is in the field mapping
        if (fieldMapping[previewId]) {
            const updates = {};
            // Add the data to update based on the previewId
            if (fieldMapping[previewId].title) {
                updates[fieldMapping[previewId].title] = updatedData.title; // Correctly access updated data for title
            }
            if (fieldMapping[previewId].hours) {
                updates[fieldMapping[previewId].hours] = updatedData.hours; // Correctly access updated data for hours
            }
            if (fieldMapping[previewId].call) {
                updates[fieldMapping[previewId].call] = updatedData.call; // Correctly access updated data for call
            }
            
            await docRef.set(updates, { merge: true }); // Merge option to update only the specific fields

            console.log("Data successfully updated!", updates);
        } else {
            console.error("Invalid previewId provided:", previewId);
        }
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}




// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}
