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
  function fetchUserData(userId) {
    db.collection('isAdmin').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const userNameElement = document.getElementById('user-log-in-name');
                const dropdownUsernameElement = document.getElementById('dropdown-username');
  
                console.log("User Data: ", userData); // Debugging log
  
                userNameElement.textContent = userData.email || "No Email";
                dropdownUsernameElement.textContent = userData.username || "No Username";
  
                // Show the elements now that the data is loaded
                userNameElement.style.display = 'block';
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
function getApplicantId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

function fetchApplicantDetails(applicantId) {
  return db.collection('applications').doc(applicantId).get();
}

document.addEventListener('DOMContentLoaded', function() {
  const applicantId = getApplicantId();
  if (applicantId) {
      fetchApplicantDetails(applicantId)
          .then((doc) => {
              if (doc.exists) {
                  const data = doc.data();
                  updateApplicantDetailsUI(data);
                  console.log("Applicant Data:", data);
              } else {
                  console.error("No such document for applicant ID:", applicantId);
              }
          })
          .catch((error) => {
              console.error("Error getting document for applicant ID:", applicantId, error);
          });
  } else {
      console.error("No applicant ID found in URL");
      // You might want to handle this error by displaying a message to the user
  }
});

function updateApplicantDetailsUI(data) {
  // Update HTML elements with applicant details
  const detailsMap = {
    'licenseNo': 'licenseNo',
    'sssNo': 'sssNo',
    'tin': 'tin',
    'pagIbigNo': 'pagIbigNo',
    'philHealthNo': 'philHealthNo',

    'fullName': 'fullName',
    'dob': 'dob',
    'placeOfBirth': 'placeOfBirth',
    'hobbies': 'hobbies',
    'sports': 'sports', // Added sports field
    'birthMarks': 'birthMarks',
    'dialectsSpoken': 'dialectsSpoken',
    'presentAddress': 'presentAddress',
    'age': 'age',
    'height': 'height',
    'weight': 'weight',
    'bloodType': 'bloodType',
    'citizenship': 'citizenship',
    'religion': 'religion',
    'status': 'status',
    'telNo': 'telNo',

    'schoolName': 'schoolName',
    'schoolAddress': 'schoolAddress',
    'yearGraduated': 'yearGraduated',
    'extraCurriculum': 'extraCurriculum',
    'militaryTraining': 'militaryTraining',
    'unitLocation': 'unitLocation',
    'highestRank': 'highestRank', // Added this line
    'awards': 'awards',
    'previousCompany': 'previousCompany',
    'positionHeld': 'positionHeld',
    'fromDate': 'fromDate',
    'toDate': 'toDate',
    'reasonForLeaving': 'reasonForLeaving',

    'fatherName': 'fatherName',
    'fatherAge': 'fatherAge',
    'fatherOccupation': 'fatherOccupation',
    'motherName': 'motherName',
    'motherAge': 'motherAge',
    'motherOccupation': 'motherOccupation',
    
    'spouseName': 'spouseName', // Added spouse information
    'spouseAge': 'spouseAge',
    'spouseAddress': 'spouseAddress',
    
    // Sibling (sons and daughters) information
    'sonName': 'sonName',
    'sonAge': 'sonAge',
    'sonOccupation': 'sonOccupation',
    'daughterName': 'daughterName',
    'daughterAge': 'daughterAge',
    'daughterOccupation': 'daughterOccupation',
    // Reference data
    'referenceName': 'referenceName',
    'referenceOccupation': 'referenceOccupation',
    'referenceAddress': 'referenceAddress',
    'referencePhone': 'referencePhone',
    'referralSource': 'referralSource',
    'referralContact': 'referralContact',

    'conviction': 'conviction',
    'pendingCases': 'pendingCases',
    'willingToRelocate': 'willingToRelocate',
    'personalityCheck': 'personalityCheck',
    'authenticityCheck': 'authenticityCheck',
    'reasons': 'reasons'
  };

  Object.entries(detailsMap).forEach(([elementId, fieldName]) => {
      const value = data[fieldName] || 'N/A';
      document.getElementById(elementId).textContent = value;
  });
}
