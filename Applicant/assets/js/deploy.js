// Firebase configuration
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

document.addEventListener("DOMContentLoaded", async () => {
  const historyTableBody = document.querySelector("#historyTable tbody");
  const db = firebase.firestore();
  const auth = firebase.auth();
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      console.log("Logged-in user:", user.uid);
      await fetchHistory(user.uid);
    } else {
      console.error("No user is logged in.");
      historyTableBody.innerHTML = `<tr><td colspan="8">Please log in to view your data.</td></tr>`;
    }
  });

  // Fetch Deployment History
  async function fetchHistory(userUID) {
    try {
      console.log("Querying with userUID:", userUID);

      const reportCollection = db.collection("report").where("personnelId", "==", userUID);
      const querySnapshot = await reportCollection.get();

      if (querySnapshot.empty) {
        console.error("No matching documents found for userUID:", userUID);
        console.log("Checking available documents in 'report' collection...");
        
        // Log all documents in the 'report' collection for debugging
        const allReports = await db.collection("report").get();
        allReports.forEach((doc) => {
          console.log("Available document:", doc.id, doc.data());
        });

        historyTableBody.innerHTML = `<tr><td colspan="8">No data available.</td></tr>`;
        return;
      }

      let rowIndex = 0;
      historyTableBody.innerHTML = ""; // Clear previous entries

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const { deploymentHistory } = data;

        if (deploymentHistory && deploymentHistory.length > 0) {
          deploymentHistory.forEach((item) => {
            const date = new Date(item.startDate).toLocaleDateString();
            const companyName = item.companyName;
            const equipmentIssued = item.equipmentIssued;
            const shiftTime = item.shiftTime;

            const row = `
              <tr>
                <td>${date}</td>
                <td>${companyName}</td>
                <td>
                  <button class="btn btn-sm btn-primary download-btn"
                    data-user-uid="${doc.id}"
                    data-company-name="${companyName}"
                    data-end-date="${item.endDate}"
                    data-equipment-issued="${equipmentIssued}"
                    data-shift-time="${shiftTime}"
                    data-start-date="${item.startDate}"
                    data-row="${rowIndex}">
                    Download PDF
                  </button>
                </td>
              </tr>
            `;
            historyTableBody.insertAdjacentHTML("beforeend", row);
            rowIndex++;
          });
        }
      });

      if (rowIndex === 0) {
        historyTableBody.innerHTML = `<tr><td colspan="8">No data available.</td></tr>`;
      }

      attachDownloadListeners();
    } catch (error) {
      console.error("Error fetching history data:", error);
      historyTableBody.innerHTML = `<tr><td colspan="8">Error loading data. Please try again later.</td></tr>`;
    }
  }

  // Attach Event Listeners to Download Buttons
  function attachDownloadListeners() {
    const downloadButtons = document.querySelectorAll(".download-btn");

    downloadButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const userUID = event.target.getAttribute("data-user-uid");
        const rowIndex = event.target.getAttribute("data-row");
        const companyName = event.target.getAttribute("data-company-name");
        const endDate = event.target.getAttribute("data-end-date");
        const equipmentIssued = event.target.getAttribute("data-equipment-issued");
        const shiftTime = event.target.getAttribute("data-shift-time");
        const startDate = event.target.getAttribute("data-start-date");

        console.log("Button clicked with data:", {
          userUID,
          companyName,
          endDate,
          equipmentIssued,
          shiftTime,
          startDate,
        });

        generateRowPdf(companyName, startDate, endDate, equipmentIssued, shiftTime);
      });
    });
  }

  // Generate PDF for a Row
  function generateRowPdf(companyName, startDate, endDate, equipmentIssued, shiftTime) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("LEFMOGIV Security Agency Corp.", pdf.internal.pageSize.width / 2, 20, { align: "center" });
    pdf.setFontSize(14);
    pdf.text("Deployment Report", 10, 30);
    pdf.setFontSize(12);
    pdf.text("Check the details carefully", 10, 36);
    const tableStartY = 50;
    const tableWidth = pdf.internal.pageSize.width - 20;
    const columnWidths = [tableWidth * 0.4, tableWidth * 0.6];
    const rowHeight = 10;
    const tableData = [
      ["", ""], // Header row
      ["Company Name", companyName],
      ["Start Date", new Date(startDate).toLocaleDateString()],
      ["End Date", new Date(endDate).toLocaleDateString()],
      ["Equipment Issued", equipmentIssued],
      ["Shift Time", shiftTime],
    ];
  
    // Draw table
    let currentY = tableStartY;
  
    tableData.forEach((row, index) => {
      const isHeader = index === 0;
      const rowX = 10;
  
      // Draw row background (optional for headers)
      if (isHeader) {
        pdf.setFillColor(200, 200, 200); // Light gray for header
        pdf.rect(rowX, currentY, tableWidth, rowHeight, "F");
      } else {
        pdf.rect(rowX, currentY, tableWidth, rowHeight);
      }
  
      // Add columns
      pdf.setFontSize(12);
      pdf.text(row[0], rowX + 5, currentY + 7); // Field column
      pdf.text(row[1], rowX + columnWidths[0] + 5, currentY + 7); // Value column
  
      currentY += rowHeight; // Move to next row
    });
  
    // Add footer
    const footerY = pdf.internal.pageSize.height - 20;
    pdf.setFontSize(10);
    pdf.text(
      "This is generated in Lefmogiv system.",
      pdf.internal.pageSize.width / 2,
      footerY,
      { align: "center" }
    );
  
    // Save the PDF
    pdf.save(`${companyName}_Deployment_Details.pdf`);
  }
  
  
});
