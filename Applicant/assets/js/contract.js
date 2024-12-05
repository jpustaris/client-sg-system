        // data/secrets
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(); 
const db = firebase.firestore(); 

function formatDate(timestamp) {
    if (timestamp && timestamp.toDate) {
        const date = timestamp.toDate();
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    return "To be announced";
}
function formatTime(time) {
    if (!time) return "To be announced"; 
    if (time instanceof firebase.firestore.Timestamp) {
        time = time.toDate().toISOString().split('T')[1].slice(0, 5); 
    }
    if (typeof time !== 'string') {
        console.error("Invalid time format:", time);
        return "Invalid time format";  
    }
    const timeParts = time.split(':');
    if (timeParts.length === 2) {
        let hours = parseInt(timeParts[0], 10);
        const minutes = timeParts[1];
        let ampm = "AM";
        if (hours >= 12) {
            ampm = "PM";
            if (hours > 12) hours -= 12; 
        } else if (hours === 0) {
            hours = 12; 
        }
        return `${hours}:${minutes} ${ampm}`;
    }

    return "Invalid time format";
}

function safeUpdate(selector, content) {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = content;
    } else {
        console.error(`Element not found: ${selector}`);
    }
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const userId = user.uid;
        console.log("User ID:", userId); 

        fetchUserDataFromCollection("approveusers", userId)
            .then((data) => {
                if (data) {
                    handleApproveUserData(data);
                } else {
                    fetchUserDataFromCollection("personnels", userId)
                        .then((personnelData) => {
                            if (personnelData) {
                                handlePersonnelData(personnelData);
                            } else {
                                console.log("No data found for user in personnels.");
                                safeUpdate(".application-status .info-box", `<span>Status:</span> Not available`);
                            }
                        })
                        .catch((error) => {
                            console.error("Error fetching data from personnels:", error);
                            safeUpdate(".application-status .info-box", `<span>Status:</span> Error fetching data`);
                        });
                }
            })
            .catch((error) => {
                console.error("Error fetching data from approveusers:", error);
                safeUpdate(".application-status .info-box", `<span>Status:</span> Error fetching data`);
            });

    } else {
        console.log("User is not logged in.");
    }
});

// Fetch user data from any collection
function fetchUserDataFromCollection(collection, userId) {
    return db.collection(collection).doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                return doc.data();
            } else {
                return null;
            }
        })
        .catch((error) => {
            console.error(`Error fetching data from ${collection}:`, error);
            return null;
        });
}

// Handle data from 'approveusers' collection
function handleApproveUserData(data) {
    console.log("Fetched data from approveusers:", data);
    const status = data.status || "To be announced"; 
    const interviewStatus = data.interviewStatus || "To be announced";
    safeUpdate(".application-status .info-box", `<span>Status:</span> ${status}`);
    const interviewDate = formatDate(data.interviewDate); 
    const interviewTime = formatTime(data.time || "To be announced");
    const interviewLocation = data.interviewLocation || "To be announced";
    if (interviewStatus === "Complete") {
        const contractDate = formatDate(data.contractDate) || "To be announced"; 
        const contractTime = formatTime(data.contractTime || "To be announced");
        const contractStatus = data.contractStatus || "To be announced";
        document.getElementById("interviewDate").textContent = contractDate;
        document.getElementById("interviewTime").textContent = contractTime;
        document.getElementById("locationRow").style.display = "none"; 
        safeUpdate(".interview-contract-schedule .info-box", `
            <span><strong>Contract Details</strong></span><br>
            <span>Date:</span> ${contractDate}<br>
            <span>Time:</span> ${contractTime}<br>
            <span>Status:</span> ${contractStatus}<br>
            <span>Note:</span> The contract has been signed and is now in effect.
        `);
    } else {
        document.getElementById("interviewDate").textContent = interviewDate;
        document.getElementById("interviewTime").textContent = interviewTime;
        document.getElementById("interviewLocation").textContent = interviewLocation;
        document.getElementById("locationRow").style.display = "table-row"; 
        safeUpdate(".interview-contract-schedule .info-box", `
            <span><strong>Interview Details</strong></span><br>
            <span>Date:</span> ${interviewDate}<br>
            <span>Time:</span> ${interviewTime}<br>
            <span>Location:</span> ${interviewLocation}<br>
            <span>Status:</span> Interview in progress<br>
            <span>Note:</span> The interview is still pending completion.
        `);
    }
}

function handlePersonnelData(personnelData) {
    console.log("Fetched data from personnels:", personnelData);
    const status = personnelData.status || "Not available";
    safeUpdate(".application-status .info-box", `<span>Status:</span> ${status}`);
    const interviewStatusElement = document.getElementById("interviewStatus");
    const contractStatusElement = document.getElementById("contractStatus");
    const deploymentInfoElement = document.querySelector(".deployment-info .info-box");
    if (interviewStatusElement && contractStatusElement) {
        interviewStatusElement.textContent = status; 
        contractStatusElement.textContent = status; 
    } else {
        console.error("One or more elements are missing: interviewStatus or contractStatus.");
    }
    if (deploymentInfoElement) {
        safeUpdate(".interview-contract-schedule .info-box", `
            <span><strong>Contract and Interview Status</strong></span><br>
            <span>Status:</span> ${status}<br>
            <span>Note:</span> The contract and interview status based on the fetched data.
        `);
    } else {
        console.error("Deployment info box element is missing.");
    }
    const deployment = personnelData.deployment || {};
    const clientName = deployment.companyName || "Not available";
    const equipmentIssued = deployment.equipmentIssued || "Not available";
    const startDate = formatDate(deployment.startDate || "Not available");
    const expirationDate = formatDate(deployment.expirationDate || "Not available");
    const deploymentDateElement = document.getElementById("deploymentDate");
    const positionElement = document.getElementById("position");
    const departmentElement = document.getElementById("department");
    const locationElement = document.getElementById("location");
    if (deploymentDateElement) {
        deploymentDateElement.textContent = clientName;
    } else {
        console.error("Deployment Date element is missing.");
    }
    if (positionElement) {
        positionElement.textContent = equipmentIssued; 
    } else {
        console.error("Position element is missing.");
    }
    if (departmentElement) {
        departmentElement.textContent = startDate;
    } else {
        console.error("Department element is missing.");
    }
    if (locationElement) {
        locationElement.textContent = expirationDate; 
    } else {
        console.error("Location element is missing.");
    }

    safeUpdate(".deployment-info .info-box", `
        <span><strong>Deployment Details</strong></span><br>
        <span>Client:</span> ${clientName}<br>
        <span>Equipment Issued:</span> ${equipmentIssued}<br>
        <span>Start Date:</span> ${startDate}<br>
        <span>Expiration Date:</span> ${expirationDate}
    `);
}



function formatDate(date) {
    if (date instanceof firebase.firestore.Timestamp) {
        const jsDate = date.toDate(); 
        return `${jsDate.getDate()}/${jsDate.getMonth() + 1}/${jsDate.getFullYear()}`;
    }
    if (typeof date === 'string' && date) {
        const jsDate = new Date(date);
        return `${jsDate.getDate()}/${jsDate.getMonth() + 1}/${jsDate.getFullYear()}`;
    }
    return "To be announced";
}
