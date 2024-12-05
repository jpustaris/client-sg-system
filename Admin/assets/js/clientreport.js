document.getElementById("downloadClientReportBtn").addEventListener("click", () => {
    if (currentClientId) {
        generateClientReport(currentClientId);
    } else {
        alert("Client ID is missing. Please select a client.");
    }
});
async function generateClientReport(clientId) {
    const { jsPDF } = window.jspdf; 
    const doc = new jsPDF('p', 'mm', 'a4');
    const db = firebase.firestore(); 
    try {
        const clientDoc = await db.collection("LEFMOGIVclient").doc(clientId).get();
        if (!clientDoc.exists) {
            alert("Client not found.");
            return;
        }
        const client = clientDoc.data();
        const clientData = [
            ["Company Name", client.companyName || "N/A"],
            ["Location", client.location || "N/A"],
            ["Start Date", client.startDate || "N/A"],
            ["Contract Expiry", client.contractExpiry || "N/A"],
            ["Contract Duration", client.contractDuration || "N/A"],
            ["Details", client.clientDetails || "N/A"],
            ["Contact Person", client.contactPerson || "N/A"],
            ["Contact Position", client.contactPosition || "N/A"],
            ["Contact Number", client.contactNumber || "N/A"],
            ["Email Address", client.emailAddress || "N/A"],
            ["Industry", client.industry || "N/A"],
            ["Social Media Links", client.socialMediaLinks || "N/A"]
        ];
        const fields = clientData.map(item => item[0]);  
        const values = clientData.map(item => item[1]);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(14);
        doc.text("LEFMOGIV Security Agency Corp.", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.text("Client Report", 105, 30, { align: "center" });
        doc.autoTable({
            startY: 40,
            head: [fields],
            body: [values],
            theme: "grid",
            styles: {
                font: "Helvetica",
                fontSize: 8,
                halign: "center",
                cellPadding: 1,
                valign: "middle",
                overflow: "linebreak",
            },
            headStyles: {
                fillColor: [22, 160, 133],
                textColor: [255, 255, 255],
                fontStyle: "bold",
            },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 45 },
                2: { cellWidth: 45 },
                3: { cellWidth: 45 },
                4: { cellWidth: 45 },
                5: { cellWidth: 45 },
                6: { cellWidth: 45 },
                7: { cellWidth: 45 },
                8: { cellWidth: 45 },
                9: { cellWidth: 45 },
                10: { cellWidth: 45 },
                11: { cellWidth: 45 },
            },
            margin: { left: 15, right: 15, top: 35, bottom: 10 },
            bodyStyles: {
                fontSize: 8,
            },
            tableWidth: 'wrap',
        });
        doc.setFontSize(8);
        doc.text("This report is system-generated. No signature is required.", 105, 290, { align: "center" });
        doc.text("© 2024 LEFMOGIV Security Agency Corp. All rights reserved.", 105, 295, { align: "center" });
        const pdfBlob = doc.output("blob");
        const pdfURL = URL.createObjectURL(pdfBlob);
        window.open(pdfURL);
    } catch (error) {
        console.error("Error generating client report:", error);
        alert("Failed to generate client report.");
    }
}
