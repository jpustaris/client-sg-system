async function generateDeploymentReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape', 'mm', [330, 215.9]);
    const db = firebase.firestore(); 
    try {
        const reportSnapshot = await db.collection("reports").get();
        const personnelData = [];
        reportSnapshot.forEach((reportDoc) => {
            const report = reportDoc.data();
            const deploymentHistory = report.deploymentHistory || [];
            const latestDeployment = getLatestDeployment(deploymentHistory);
            personnelData.push({
                username: report.username || "N/A",
                contractDate: latestDeployment.contractDate || "N/A",
                companyName: latestDeployment.companyName || "N/A",
                expirationDate: latestDeployment.expirationDate || "N/A",
                startDate: latestDeployment.startDate || "N/A"
            });
        });
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(18);
        doc.text("LEFMOGIV Security Agency Corp.", 165, 20, { align: "center" });
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(12);
        doc.text("Deployment Report", 10, 28);
        doc.text("Total Personnel with Deployments: " + personnelData.length, 10, 34);
        doc.line(10, 35, 320, 35);
        const colX1 = 10, colX2 = 70, colX3 = 130, colX4 = 200, colX5 = 270, rowHeight = 10, headerHeight = 10;
        doc.setFont("Helvetica", "bold");
        doc.setFillColor(220, 220, 220);
        doc.rect(10, 40, 310, headerHeight, "F");
        doc.setTextColor(0);
        doc.text("Username", colX1 + 2, 45);
        doc.text("Contract Date", colX2 + 2, 45);
        doc.text("Company Name", colX3 + 2, 45);
        doc.text("Expiration Date", colX4 + 2, 45);
        doc.text("Start Date", colX5 + 2, 45);
        doc.line(10, 50, 320, 50);
        doc.setFont("Helvetica", "normal");
        let startY = 50 + headerHeight;
        personnelData.forEach((personnel, index) => {
            const username = personnel.username || "N/A";
            const contractDate = personnel.contractDate || "N/A";
            const companyName = personnel.companyName || "N/A";
            const expirationDate = personnel.expirationDate || "N/A";
            const startDate = personnel.startDate || "N/A";
            const y = startY + rowHeight * index;
            doc.setFillColor(index % 2 === 0 ? 245 : 255, index % 2 === 0 ? 245 : 255, index % 2 === 0 ? 245 : 255);
            doc.rect(10, y, 310, rowHeight, "F");
            doc.setTextColor(0);
            doc.text(username, colX1 + 2, y + 6);
            doc.text(contractDate, colX2 + 2, y + 6);
            doc.text(companyName, colX3 + 2, y + 6);
            doc.text(expirationDate, colX4 + 2, y + 6);
            doc.text(startDate, colX5 + 2, y + 6);
            doc.line(10, y + rowHeight, 320, y + rowHeight);
        });
        doc.setFontSize(10);
        doc.text("This report is system-generated. No signature is required.", 165, 205, { align: "center" });
        doc.text("© 2024 LEFMOGIV Security Agency Corp. All rights reserved.", 165, 210, { align: "center" });
        const pdfData = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfData);
        window.open(pdfUrl, "_blank");
    } catch (error) {
        console.error("Error fetching personnel data:", error);
        alert("Failed to generate report.");
    }
}
