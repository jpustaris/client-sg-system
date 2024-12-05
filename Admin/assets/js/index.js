        // data/secrets
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


function fetchUnapprovedUsers(filterType = 'all') {
  const tableBody = document.getElementById('applicantList');
  tableBody.innerHTML = '';
  let startDate, endDate;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Setting filter based on date
  switch (filterType) {
      case 'today':
          startDate = new Date(year, month, currentDate.getDate());
          endDate = new Date(year, month, currentDate.getDate() + 1);
          break;
      case 'thisMonth':
          startDate = new Date(year, month, 1);
          endDate = new Date(year, month + 1, 1);
          break;
      case 'lastYear':
          startDate = new Date(year - 1, 0, 1); 
          endDate = new Date(year, 0, 1); 
          break;
      case 'all':
      default:
          startDate = null; 
          endDate = null;
  }

  let query = db.collection('unapproveUsers').limit(5);  
  if (startDate && endDate) {
      query = query.where("time", ">=", firebase.firestore.Timestamp.fromDate(startDate))
                   .where("time", "<", firebase.firestore.Timestamp.fromDate(endDate));
  }

  // Fetch users from Firestore
  query.get()
  .then((querySnapshot) => {
      tableBody.innerHTML = ''; // Clears previous rows

      let userFound = false;
      
      querySnapshot.forEach((doc) => {
          if (doc.id !== "(donotdelete)W9tC3zJ1gvSkJ4QxZOgt") {
              userFound = true;
              const userData = doc.data();
              const row = document.createElement('tr');
              row.innerHTML = `
                  <td><a class="text-primary fw-bold">${userData.username}</a></td>
                  <td>${formatTime(userData.time)}</td>
                  <td><a href="./pending_list.php" onclick="approveUser('${doc.id}')"><span class="badge bg-success">View</span></a></td>
              `;
              tableBody.appendChild(row);
          }
      });
      if (!userFound) {
          const noUserRow = document.createElement('tr');
          noUserRow.innerHTML = ` 
              <td colspan="8" class="text-center" style="height: 200px;">
                  <div style="display: flex; justify-content: center; align-items: center; height: 100%;"> 
                      No users found.
                  </div>
              </td>
          `;
          tableBody.appendChild(noUserRow);
      }
  })
  .catch((error) => {
      console.error("Error getting unapproved users:", error);
  });
}



function formatTime(timestamp) {
  if (timestamp && timestamp.seconds) {
    const date = new Date(timestamp.seconds * 1000); 
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    return date.toLocaleString('en-US', options);
  } else {
    return "N/A";
  }
}

function updateClientCount() {
  db.collection("LEFMOGIVclient").get().then((querySnapshot) => {
    const clientCount = querySnapshot.size;
    const clientCountElement = document.getElementById('clientCount');
    if (clientCountElement) {
      clientCountElement.textContent = clientCount.toString(); 
    }
  }).catch((error) => {
    console.error("Error fetching client count:", error);
  });
}
document.addEventListener('DOMContentLoaded', function() {
  updateClientCount();
  
});

function updateInventoryCount() {
  db.collection("LEFMOGIVInventory").get().then((querySnapshot) => {
    const totalCount = querySnapshot.size;
    const inventoryCountElement = document.getElementById('inventoryCount');
    if (inventoryCountElement) {
      inventoryCountElement.textContent = totalCount.toString();
    }
  }).catch((error) => {
    console.error("Error fetching inventory count:", error);
  });
}

updateInventoryCount();
async function loadExpiredClients(filterType = 'all', filterDate = null) {
  const tableBody = document.getElementById('contract-table-body');
  tableBody.innerHTML = ''; 
  const currentDate = new Date();
  let startDate, endDate;

  if (!filterDate) {
    switch (filterType) {
      case 'today':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
        break;
      case 'thisMonth':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        break;
      case 'lastYear':
        startDate = new Date(currentDate.getFullYear() - 1, 0, 1);
        endDate = new Date(currentDate.getFullYear(), 0, 1);
        break;
      case 'all':
      default:
        startDate = null;
        endDate = null;
    }
  } else {
    const specifiedDate = new Date(filterDate);
    startDate = new Date(specifiedDate.getFullYear(), specifiedDate.getMonth(), specifiedDate.getDate());
    endDate = new Date(specifiedDate.getFullYear(), specifiedDate.getMonth(), specifiedDate.getDate() + 1);
  }

  try {
    let query = db.collection('LEFMOGIVclient').limit(5);  
    const snapshot = await query.get();

    let expiredClientFound = false; 

    snapshot.forEach(doc => {
      const data = doc.data();
      const [year, month, day] = data.contractExpiry.split('-');
      const contractExpiryDate = new Date(year, month - 1, day);

      if ((!startDate || contractExpiryDate >= startDate) &&
          (!endDate || contractExpiryDate < endDate) &&
          contractExpiryDate < currentDate) {
        expiredClientFound = true; 

        const row = document.createElement('tr');
        row.innerHTML = ` 
            <th scope="row">
                <a>
                    <img src="${data.imageUrl}" alt="" style="max-width: 40px;">
                </a>
            </th>
            <td>
                <a class="text-primary fw-bold">${data.companyName}</a>
            </td>
            <td>${contractExpiryDate.toLocaleDateString()}</td>
            <td class="fw-bold text-danger">Expired contract</td>
            <td>
                <a href="#" class="btn btn-primary btn-sm">View</a>
            </td>
          `;
        tableBody.appendChild(row);
      }
    });
    if (!expiredClientFound) {
      const noDataRow = document.createElement('tr');
      noDataRow.id = 'noDataRow';
      noDataRow.style.display = 'table-row';
      noDataRow.innerHTML = ` 
          <td colspan="5" class="text-center"  style="height: 200px;">
              <div style="display: flex; justify-content: center; align-items: center; height: 100%;"> 
                  No expired company found.
              </div>
          </td>
      `;
      tableBody.appendChild(noDataRow);
    }

  } catch (error) {
    console.error("Error fetching documents: ", error);
  }
}






document.addEventListener('DOMContentLoaded', loadExpiredClients);

window.onload = function() {
  applyPendingListFilter('all');
};
function applyPendingListFilter(filterType) {
  const countElement = document.getElementById("applicantCount");
  let startDate, endDate;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  switch (filterType) {
      case 'today':
          startDate = new Date(year, month, currentDate.getDate());
          endDate = new Date(year, month, currentDate.getDate() + 1);
          break;
      case 'thisMonth':
          startDate = new Date(year, month, 1);
          endDate = new Date(year, month + 1, 1);
          break;
      case 'lastYear':
          startDate = new Date(year - 1, 0, 1);
          endDate = new Date(year, 0, 1);
          break;
      case 'all':
      default:
          startDate = null; 
          endDate = null;
  }
  let query = db.collection('unapproveUsers');
  if (startDate && endDate) {
      query = query.where("time", ">=", firebase.firestore.Timestamp.fromDate(startDate))
                   .where("time", "<", firebase.firestore.Timestamp.fromDate(endDate));
  }
  query.get()
      .then((querySnapshot) => {
          const count = querySnapshot.size;
          countElement.textContent = count;
      })
      .catch((error) => {
          console.error("Error fetching pending users:", error);
      });
}
