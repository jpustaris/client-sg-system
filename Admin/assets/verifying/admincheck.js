/// Fetch user data to display username | File Index, CLient, Pending, approve, client

function fetchUserData(userId) {
  db.collection('isAdmin').doc(userId).get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        const dropdownUsernameElement = document.getElementById('dropdown-username');
        dropdownUsernameElement.textContent = userData.username || "No Username";
        dropdownUsernameElement.style.display = 'block';
        console.log("Admin data retrieved:", userData);
      } else {
        console.log("No such admin document for userId:", userId);
        alert("You are not authorized as an admin.");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
      alert('An error occurred while fetching user data.');
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
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    fetchAdminStatus(user.uid)
      .then((isAdmin) => {
        if (isAdmin) {
          console.log("User signed in as admin: ", user.email);
          fetchUserData(user.uid); 
          fetchUnapprovedUsers(); 
        } else {
          console.log("User is not an admin, checking connection status");
          if (navigator.onLine) {
            console.log("Connection is available, redirecting to signout page");
            window.location.href = "../Admin/signout.php";
          } else {
            console.log("Connection lost, staying on the current page");
          }
        }
      })
      .catch((error) => {
        console.error("Error checking admin status:", error);
        if (navigator.onLine) {
          window.location.href = "../Admin/signout.php";
        } else {
          console.log("Connection lost, staying on the current page");
        }
      });
  } else {
    console.log("No user signed in, redirecting to signout page");
    if (navigator.onLine) {
      window.location.href = "../Admin/signout.php"; 
    } else {
      console.log("Connection lost, staying on the current page");
    }
  }
});



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
  
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      fetchAdminStatus(user.uid)
        .then((isAdmin) => {
          if (isAdmin) {
            console.log("User signed in as admin: ", user.email);
            fetchUserData(user.uid); 
            fetchUnapprovedUsers(); 
          } else {
            console.log("User is not an admin, checking connection status");
            if (navigator.onLine) {
              console.log("Connection is available, redirecting to signout page");
              window.location.href = "../Admin/signout.php";
            } else {
              console.log("Connection lost, staying on the current page");
            }
          }
        })
        .catch((error) => {
          console.error("Error checking admin status:", error);
          if (navigator.onLine) {
            window.location.href = "../Admin/signout.php";
          } else {
            console.log("Connection lost, staying on the current page");
          }
        });
    } else {
      console.log("No user signed in, redirecting to signout page");
      if (navigator.onLine) {
        window.location.href = "../Admin/signout.php"; 
      } else {
        console.log("Connection lost, staying on the current page");
      }
    }
  });
  