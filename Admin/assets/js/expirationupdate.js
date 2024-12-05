document.getElementById("downloadReportBtn").addEventListener("click", generatePersonnelReport);

async function generatePersonnelReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape', 'mm', [330, 215.9]);
    const db = firebase.firestore();
    try {
        const personnelSnapshot = await db.collection("personnels").get();
        const personnelData = [];
        let totalIssuedEquipment = 0;
        personnelSnapshot.forEach((doc) => {
            const personnel = doc.data();
            personnelData.push(personnel);
            const equipmentIssued = personnel.deployment?.equipmentIssued || "";
            if (equipmentIssued && equipmentIssued !== "N/A") {
                totalIssuedEquipment++;
            }
        });
        const totalPersonnel = personnelData.length;
        const deployedPersonnel = personnelData.filter(p => (p.status || "").toLowerCase() === "deployed").length;
        const pendingPersonnel = personnelData.filter(p => (p.status || "").toLowerCase() === "pending").length;
        const reassignedPersonnel = personnelData.filter(p => (p.status || "").toLowerCase() === "re-assigned").length;
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(14);
        doc.text("LEFMOGIV Security Agency Corp.", 165, 20, { align: "center" });
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Your SAFETY and SATISFACTION is our Number 1 PRIORITY", 165, 26, { align: "center" });
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Personnel Total: " + totalPersonnel, 10, 40);
        doc.text("Personnel Deployed: " + deployedPersonnel, 10, 46);
        doc.text("Personnel Pending: " + pendingPersonnel, 10, 52);
        doc.text("Personnel Re-assigned: " + reassignedPersonnel, 10, 58);
        const tableData = personnelData.map((personnel) => {
            const deployment = personnel.deployment || {};
            const username = personnel.username || "N/A";
            const email = personnel.email || "N/A";
            const companyName = deployment.companyName || "N/A";
            const expirationDate = deployment.expirationDate || "N/A";
            const startDate = deployment.startDate || "N/A";
            const equipmentIssued = deployment.equipmentIssued || "N/A";
            const status = personnel.status || "N/A";
            return [username, email, companyName, expirationDate, startDate, equipmentIssued, status];
        });
        const headers = ["Username", "Email", "Company Name", "Expiration Date", "Start Date", "Issued Equipment", "Status"];
        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: 70,
            theme: 'grid',
            headStyles: { fillColor: [220, 220, 220], fontStyle: 'bold' },
            margin: { top: 10, bottom: 10, left: 10, right: 10 },
            tableWidth: 'auto',
            styles: { fontSize: 10 },
            columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 50 },
                2: { cellWidth: 50 },
                3: { cellWidth: 50 },
                4: { cellWidth: 50 },
                5: { cellWidth: 50 },
                6: { cellWidth: 40 },
            }
        });
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Total Equipment Issued: " + totalIssuedEquipment, 10, doc.lastAutoTable.finalY + 10);
        doc.setFontSize(8);
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
