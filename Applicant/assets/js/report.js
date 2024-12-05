const firebaseConfig = {
  apiKey: "AIzaSyAwZg1CODurIz0uJRiMxus28eKSd2CTHi4",
  authDomain: "lefmogiv-f49b3.firebaseapp.com",
  projectId: "lefmogiv-f49b3",
  storageBucket: "lefmogiv-f49b3.appspot.com",
  messagingSenderId: "687909819475",
  appId: "1:687909819475:web:60699d8e2a96376939e2a6",
  measurementId: "G-C7YD21Q71Y",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); 
}

const db = firebase.firestore();
const auth = firebase.auth();

async function fetchLatestHistoryByPersonnelId(personnelId) {
  try {
    const historyTableBody = document.querySelector("#historyTable tbody");
    historyTableBody.innerHTML = ""; 
    console.log(`Fetching latest history for personnelId: ${personnelId}`);
    const reportCollection = db.collection("report").where("personnelId", "==", personnelId);
    const querySnapshot = await reportCollection.get();
    if (querySnapshot.empty) {
      console.log(`No data found for personnelId: ${personnelId}`);
      historyTableBody.innerHTML = `<tr><td colspan="7">No data available.</td></tr>`;
      return;
    }
    let latestDeployment = null;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const { deploymentHistory } = data;

      if (deploymentHistory && Array.isArray(deploymentHistory)) {
        deploymentHistory.forEach((deployment) => {
          if (!latestDeployment || new Date(deployment.startDate) > new Date(latestDeployment.startDate)) {
            latestDeployment = {
              ...deployment,
              personnelId,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            };
          }
        });
      }
    });
    if (!latestDeployment) {
      console.log(`No deployment history found for personnelId: ${personnelId}`);
      historyTableBody.innerHTML = `<tr><td colspan="7">No deployment history available.</td></tr>`;
      return;
    }
    historyTableBody.innerHTML = createTableRow(latestDeployment);
  } catch (error) {
    console.error("Error fetching history data:", error);
    document.querySelector("#historyTable tbody").innerHTML = `<tr><td colspan="7">Error loading data. Please try again later.</td></tr>`;
  }
}

function createTableRow(data) {
  return `
    <tr>
      <td>${data.companyName || "N/A"}</td>
      <td>${data.shiftTime || "N/A"}</td>
      <td>${data.equipmentIssued || "N/A"}</td>
      <td>${data.equipmentDetails || "N/A"}</td>
      <td>${data.startDate ? new Date(data.startDate).toLocaleDateString() : "N/A"}</td>
      <td>${data.endDate ? new Date(data.endDate).toLocaleDateString() : "N/A"}</td>
      <td>${data.updatedAt ? new Date(data.updatedAt.seconds * 1000).toLocaleDateString() : "N/A"}</td>
    </tr>
  `;
}

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User logged in:", user.uid);

    const personnelId = user.uid;
    fetchLatestHistoryByPersonnelId(personnelId);
  } else {
    console.log("No user is logged in.");
    document.querySelector("#historyTable tbody").innerHTML = `<tr><td colspan="7">No user logged in. Please log in to view deployment history.</td></tr>`;
  }
});
