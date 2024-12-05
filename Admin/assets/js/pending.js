        // data/secrets
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  var btn = document.getElementById("lefmoButton");
  var span = document.getElementsByClassName("close")[0];

  
  function formatTime(timestamp) {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000); 
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return date.toLocaleString('en-US', options);
    } else {
      return "N/A";
    }
  }
  let userIdToApprove = null; 
  function approveUser(userId) {
    userIdToApprove = userId; 
    fetchUserDetails(userId); 
}
function fetchUserDetails(userId) {
    Promise.all([
        db.collection('applications').where('userId', '==', userId).get(),
        db.collection('unapproveUsers').doc(userId).get()
    ])
    .then(([appSnapshot, unapproveDoc]) => {
        if (!unapproveDoc.exists) {
            console.log(`No unapproved user found for user ${userId}`);
            return;
        }
        const userData = unapproveDoc.data();
        const email = userData.email || "N/A";
        const dateRegistered = formatTime(userData.time);
        const fullName = userData.username || 'N/A'; 
        let profileImage = 'https://via.placeholder.com/150';
        if (!appSnapshot.empty) {
            const appData = appSnapshot.docs[0].data(); 
            profileImage = appData.imageURL || profileImage;
        }
        openModal(fullName, profileImage, email, dateRegistered);
    })
    .catch((error) => {
        console.log("Error fetching user details:", error);
    });
}

function fetchUnapprovedUsers() {
    const tableBody = document.getElementById('table-1-body');
    const paginationDiv = document.getElementById('pagination');
    if (!tableBody || !paginationDiv) {
        console.error("Table body or pagination div not found.");
        return;
    }

    // Show loading spinner while fetching data
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
                <div style="display: flex; justify-content: center; align-items: center; height: 100%;">No users found.</div>
            </td>
        </tr>
    `;

    const usersData = [];
    db.collection('unapproveUsers').get()
        .then((querySnapshot) => {
            const loadingRow = document.getElementById('loadingRow');
            const noDataRow = document.getElementById('noDataRow');
            loadingRow.style.display = 'none';
            if (querySnapshot.empty) {
                noDataRow.style.display = 'table-row';
                return;
            }
            noDataRow.style.display = 'none';
            const promises = querySnapshot.docs.map((doc) => {
                const userId = doc.id;
                const userData = doc.data();
                const user = {
                    id: userId,
                    username: userData.username || "N/A",
                    email: userData.email || "N/A",
                    time: formatTime(userData.time),
                    isApproved: userData.isApproved || false,
                    profileImage: 'https://via.placeholder.com/150', 
                    applicationStatus: 'Missing', 
                };
                return db.collection('applications').where('userId', '==', userId).get()
                    .then((appSnapshot) => {
                        if (!appSnapshot.empty) {
                            const appData = appSnapshot.docs[0].data();
                            user.profileImage = appData.imageURL || user.profileImage;
                            user.applicationStatus = appData.isComplete ? 'Complete' : 'Missing'; // Check application completeness
                        }
                        usersData.push(user);
                    })
                    .catch((error) => {
                        console.error(`Error fetching application data for user ${userId}:`, error);
                        usersData.push(user);
                    });
            });
            Promise.all(promises).then(() => {
                renderTable(usersData);
                updatePagination(usersData.length);
            }).catch((error) => {
                console.error("Error processing users:", error);
            });
        })
        .catch((error) => {
            console.error("Error fetching unapproved users:", error);
        });
}

function renderTable(users) {
    const tableBody = document.getElementById('table-1-body');
    tableBody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.classList.add('user-row');
        row.innerHTML = `
            <td>
                <div class="applicant-info" style="display: flex; align-items: center;">
                    <img 
                        src="${user.profileImage || 'path/to/your/default/image.jpg'}" 
                        alt="Profile Image" 
                        class="profile-circle" 
                        style="margin-right: 10px; cursor: pointer;" 
                        ondblclick="openProfileModal('${user.profileImage || 'path/to/your/default/image.jpg'}')" 
                        onerror="this.onerror=null; this.src='path/to/your/default/image.jpg';">
                    <span>${user.username}</span>
                </div>
            </td>
            <td>${user.time}</td>
            <td class="text-center">
            <span class="status-pending">
                    Pending
                </span>
            </td>
        
            <td class="text-center">
                <button class="btn btn-primary btn-sm" onclick="viewApplicant('${user.id}')">View</button>
            </td>
            <td class="text-center">
                <button class="btn btn-success btn-sm" onclick="('${user.id}')">Mark as With Complete Requirements</button>
                <button class="btn btn-danger btn-sm" onclick="rejectUser('${user.id}')">Reject</button>
            </td>
            <td class="text-center">
            <div class="dropdown d-inline-block">
                <button class="btn p-0" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><a class="dropdown-item" onclick="viewDetails('${user.id}')">View Details</a></li>
                </ul>
            </div>
        </td>
        `;
        tableBody.appendChild(row);
    });
}


function toggleDropdown(userId) {
    const dropdown = document.getElementById(`dropdown-${userId}`);
    const isCurrentlyVisible = dropdown.style.display === 'block';
    const allDropdowns = document.querySelectorAll('.dropdown-menu');
    allDropdowns.forEach(d => d.style.display = 'none');
    dropdown.style.display = isCurrentlyVisible ? 'none' : 'block';
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

function sortTable(column, order) {
    if (column === 'name') {
        usersData.sort((a, b) => {
            return order === 'asc' 
                ? a.username.localeCompare(b.username) 
                : b.username.localeCompare(a.username);
        });
    } else if (column === 'date') {
        usersData.sort((a, b) => {
            return order === 'asc' 
                ? new Date(a.time) - new Date(b.time) 
                : new Date(b.time) - new Date(a.time);
        });
    }
    renderTable(usersData);
}


function updatePagination(totalUsers) {
    const paginationDiv = document.getElementById('pagination');
    const currentPageElement = document.getElementById('currentPage');
    const itemRangeElement = document.getElementById('itemRange');
    const usersPerPage = 15;
    const totalPages = Math.max(1, Math.ceil(totalUsers / usersPerPage));
    let currentPage = 1;
    function updateDisplay() {
        const startItem = (currentPage - 1) * usersPerPage + 1;
        const endItem = Math.min(currentPage * usersPerPage, totalUsers);
        if (currentPageElement) {
            currentPageElement.innerText = currentPage; // Update dynamic page number
        }
        if (itemRangeElement) {
            itemRangeElement.innerText = `Showing ${startItem}-${endItem} of ${totalUsers} items`; // Update item range
        }
        if (prevIcon) prevIcon.classList.toggle('disabled', currentPage === 1);
        if (nextIcon) nextIcon.classList.toggle('disabled', currentPage === totalPages);
    }
    const prevIcon = document.getElementById('prevPage');
    const nextIcon = document.getElementById('nextPage');
    if (prevIcon) {
        prevIcon.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateDisplay();
            }
        });
    }
    if (nextIcon) {
        nextIcon.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updateDisplay();
            }
        });
    }
    updateDisplay();
}

  function confirmApproval() {
      if (userIdToApprove) {
          db.collection('unapproveUsers').doc(userIdToApprove).update({
              Approved: true 
          }).then(() => {
              console.log("User approved:", userIdToApprove);
              fetchUnapprovedUsers(); 
              userIdToApprove = null; 
          }).catch((error) => {
              console.error("Error approving user:", error);
          });
      }
      closeModal(); 
  }
  function disapproveUser(userId) {
      db.collection('unapproveUsers').doc(userId).update({
        Approved: false 
      }).then(() => {
          console.log("User disapproved:", userId);
          fetchUnapprovedUsers(); 
      }).catch((error) => {
          console.error("Error disapproving user:", error);
      });
  }
   function closeModal() {
    document.getElementById('applicantModal').style.display = 'none';
    document.getElementById('remarks').value = ''; 
}
  document.addEventListener('DOMContentLoaded', function() {
      fetchUnapprovedUsers();
  });
  let userIdToReject; 

