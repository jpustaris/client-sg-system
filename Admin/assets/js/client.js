        // data/secrets
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  var modal = document.getElementById("myModal");
  var btn = document.getElementById("lefmoButton");
  var span = document.getElementsByClassName("close")[0];

  
const addClientModal = document.getElementById('myModal');
const viewClientModal = document.getElementById('viewClientModal');
const closeAddClient = document.querySelector('.close');
const closeViewClient = document.querySelector('.close-view');
function openAddClientModal() {
    addClientModal.style.display = "block";
}
closeAddClient.onclick = function() {
    addClientModal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target === addClientModal) {
        addClientModal.style.display = "none";
    }
    if (event.target === viewClientModal) {
        viewClientModal.style.display = "none";
    }
}
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
};
const closeButtons = document.querySelectorAll('.close');
closeButtons.forEach(button => {
    button.onclick = function() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = "none";
        });
    };
});
window.onclick = function(event) {
  if (event.target == viewClientModal) {
    viewClientModal.style.display = "none";
  }
}


let currentClientId = null;

function openViewClientModal(clientData, clientId) {
    currentClientId = clientId;
    console.log("Current Client ID set to:", currentClientId);
    
    if (!clientId) {
        console.error("Client ID is invalid or missing");
        return;
    }

    const clientDetailsContainer = document.getElementById('clientDetailsContainer');
    const clientDetailsHeading = document.querySelector('.client-details h3');
    const clientStartDate = new Date(clientData.startDate);
    const contractExpiryDate = new Date(clientData.contractExpiry);
    const currentDate = new Date();
    let daysActive;
    
    // Calculate days active
    if (currentDate > contractExpiryDate) {
        const timeDifference = contractExpiryDate - clientStartDate;
        daysActive = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        clientDetailsHeading.innerHTML = `Contract expired. Active for <span class="highlight">${daysActive} ${daysActive === 1 ? 'day' : 'days'}</span>`;
    } else {
        const timeDifference = currentDate - clientStartDate;
        daysActive = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        clientDetailsHeading.innerHTML = `Active for <span class="highlight">${daysActive} ${daysActive === 1 ? 'day' : 'days'}</span>`;
    }

    // Calculate contract duration in months and days
    const contractDurationInDays = Math.floor((contractExpiryDate - clientStartDate) / (1000 * 60 * 60 * 24)); // In days
    const contractDurationInMonths = Math.floor(contractDurationInDays / 30); // Approximate months (assuming 30 days per month)
    const remainingDays = contractDurationInDays % 30; // Remaining days after calculating months

    let contractDurationText = 'N/A';
    if (contractDurationInDays > 0) {
        // If duration is greater than 1 month, display in months and days
        contractDurationText = `${contractDurationInMonths} month${contractDurationInMonths !== 1 ? 's' : ''} ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
    }

    // Clear and update the client details container
    clientDetailsContainer.innerHTML = `
        ${clientData.imageUrl ? `<img src="${clientData.imageUrl}" alt="${clientData.companyName || ''}" class="client-details-image">` : ''}
        <div class="client-details-grid">
            <div class="client-details-row">
                <i class="fas fa-building client-details-icon"></i>
                <span class="client-details-label">Company Name:</span>
                <span class="client-details-value">${clientData.companyName || 'N/A'}</span>
            </div>
            <div class="client-details-row">
                <i class="fas fa-map-marker-alt client-details-icon"></i>
                <span class="client-details-label">Location:</span>
                <span class="client-details-value">${clientData.location || 'N/A'}</span>
            </div>
            <div class="client-details-row">
                <i class="fas fa-calendar-check client-details-icon"></i>
                <span class="client-details-label">Start Date:</span>
                <span class="client-details-value">${clientData.startDate || 'N/A'}</span>
            </div>
            <div class="client-details-row">
                <i class="fas fa-calendar-times client-details-icon"></i>
                <span class="client-details-label">Contract Expiry:</span>
                <span class="client-details-value">${clientData.contractExpiry || 'N/A'}</span>
            </div>
            <div class="client-details-row">
                <i class="fas fa-clock client-details-icon"></i>
                <span class="client-details-label">Contract Duration:</span>
                <span class="client-details-value">${contractDurationText}</span>
            </div>
            <div class="client-details-row">
                <i class="fas fa-info-circle client-details-icon"></i>
                <span class="client-details-label">Details:</span>
                <span class="client-details-value">${clientData.clientDetails || 'N/A'}</span>
            </div>
            <div class="client-details-row">
                <i class="fas fa-user client-details-icon"></i>
                <span class="client-details-label">Contact Person:</span>
                <span class="client-details-value">${clientData.contactPerson || 'N/A'}</span>
            </div>
            <div class="client-details-row">
                <i class="fas fa-briefcase client-details-icon"></i>
                <span class="client-details-label">Contact Position:</span>
                <span class="client-details-value">${clientData.contactPosition || 'N/A'}</span>
            </div>
            <div class="client-details-row">
                <i class="fas fa-phone client-details-icon"></i>
                <span class="client-details-label">Contact Number:</span>
                <span class="client-details-value">${clientData.contactNumber || 'N/A'}</span>
            </div>
            <div class="client-details-row">
                <i class="fas fa-envelope client-details-icon"></i>
                <span class="client-details-label">Email Address:</span>
                <span class="client-details-value">${clientData.emailAddress || 'N/A'}</span>
            </div>
            <div class="client-details-row">
                <i class="fas fa-industry client-details-icon"></i>
                <span class="client-details-label">Industry/Category:</span>
                <span class="client-details-value">${clientData.industry || 'N/A'}</span>
            </div>
            <div class="client-details-row">
                <i class="fas fa-link client-details-icon"></i>
                <span class="client-details-label">Social Media Links:</span>
                <span class="client-details-value"><a href="${clientData.socialMediaLinks || '#'}" target="_blank">${clientData.socialMediaLinks || 'N/A'}</a></span>
            </div>
        </div>
    `;
    const viewClientModal = document.getElementById('viewClientModal');
    viewClientModal.style.display = "block";
    displaySecurityGuards([clientId]); 
}

// delete client
document.getElementById("deleteClientButton").addEventListener("click", function () {
    console.log("Delete button clicked. Current Client ID:", currentClientId);
    if (currentClientId) {
        deleteClient(currentClientId);
    } else {
        console.error("No client ID set");
    }
});
async function deleteClient(clientId) {
    if (typeof clientId !== 'string' || clientId.trim() === '') {
        console.error("Client ID must be a non-empty string");
        return;
    }
    try {
        await db.collection("LEFMOGIVclient").doc(clientId).delete();
        console.log(`Client with ID ${clientId} successfully deleted!`);
        const viewClientModal = document.getElementById("myModal");
        if (viewClientModal) {
            viewClientModal.style.display = "none";
        }
        showConfirmDeleteModal();
        await displayClients(); 

    } catch (error) {
        console.error("Error removing client: ", error);
    }
}
function showConfirmDeleteModal() {
    const confirmDeleteModal = document.getElementById("confirmDeleteModal");
    confirmDeleteModal.style.display = "block"; 
}
function closeConfirmDeleteModal() {
    const confirmDeleteModal = document.getElementById("confirmDeleteModal");
    confirmDeleteModal.style.display = "none"; 
}

window.addEventListener("click", function(event) {
    const confirmDeleteModal = document.getElementById("confirmDeleteModal");
    if (event.target === confirmDeleteModal) {
        closeConfirmDeleteModal(); 
    }
});


// security guard list
function displaySecurityGuards(clientIds) {
    const container = document.getElementById('securityGuardListContainer');
    container.innerHTML = '';
    db.collection('personnels').where('deployment.clientID', 'in', clientIds).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            container.classList.add('empty');
            container.innerHTML = '<tr><td colspan="3" class="text-center">No security guards available</td></tr>';
            return;
        }
        const currentDate = new Date();
        querySnapshot.forEach((doc) => {
            const guardData = doc.data();
            const username = guardData.username || 'N/A';
            const email = guardData.email || 'N/A';
            const status = guardData.approved ? 'Approved' : 'Pending';
            const deployment = guardData.deployment || {};
            const isDeployed = guardData.status === "deployed";
            const startDate = new Date(deployment.startDate);
            const expirationDate = new Date(deployment.expirationDate);
            if (!isDeployed || expirationDate < currentDate || startDate > currentDate) return;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="small-text">${username}</td>
                <td class="small-text">${email}</td>
                <td class="small-text">${status}</td>
            `;
            container.appendChild(row);
        });
    }).catch((error) => {
        container.innerHTML = '<tr><td colspan="3" class="text-center">Error fetching security guards</td></tr>';
    });
}



// display client
closeViewClient.onclick = function() {
    viewClientModal.style.display = "none";
};
let clientsArray = [];
let originalClientsArray = []; 
function displayClients() {
    const clientList = document.querySelector('.iconslist');
    clientList.innerHTML = '';
    clientsArray = [];
    originalClientsArray = []; 
    db.collection("LEFMOGIVclient").get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                const noClientsMessage = document.createElement('p');
                noClientsMessage.textContent = "No clients found.";
                clientList.appendChild(noClientsMessage);
                return;
            }
            const processedClientIds = new Set();
            querySnapshot.forEach((doc) => {
                const clientData = doc.data();
                const clientId = doc.id;
                if (processedClientIds.has(clientId)) return;
                processedClientIds.add(clientId);

                const clientObject = {
                    id: clientId,
                    data: clientData,
                };
                clientsArray.push(clientObject);
                originalClientsArray.push(clientObject); 
            });

            displaySortedClients();
        })
        .catch((error) => {
            console.error("Error fetching clients: ", error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = "There was an error loading the client data.";
            clientList.appendChild(errorMessage);
        });
}

// sort table functions
function sortClients(sortType) {
    switch (sortType) {
        case 'name-asc':
            clientsArray.sort((a, b) => a.data.companyName.localeCompare(b.data.companyName));
            break;
        case 'name-random':
            clientsArray.sort(() => Math.random() - 0.5);
            break;
        case 'date-oldest':
            clientsArray.sort((a, b) => new Date(a.data.contractExpiry) - new Date(b.data.contractExpiry));
            break;
        case 'date-newest':
            clientsArray.sort((a, b) => new Date(b.data.contractExpiry) - new Date(a.data.contractExpiry));
            break;
        case 'active':
            clientsArray.sort((a, b) => {
                const aActive = new Date() < new Date(a.data.contractExpiry);
                const bActive = new Date() < new Date(b.data.contractExpiry);
                return bActive - aActive;
            });
            break;
        case 'inactive':
            clientsArray.sort((a, b) => {
                const aActive = new Date() < new Date(a.data.contractExpiry);
                const bActive = new Date() < new Date(b.data.contractExpiry);
                return aActive - bActive;
            });
            break;
    }
    displaySortedClients();
}
function displaySortedClients() {
    const clientList = document.querySelector('.iconslist');
    clientList.innerHTML = ''; 
    clientsArray.forEach((client) => {
        const clientData = client.data;
        const clientItem = document.createElement('div');
        clientItem.classList.add('icon');
        const profilePic = document.createElement('img');
        profilePic.classList.add('profile-pic');
        profilePic.src = clientData.imageUrl || '';
        profilePic.alt = clientData.companyName || 'Profile Picture';
        clientItem.appendChild(profilePic);
        const companyNameLabel = document.createElement('div');
        companyNameLabel.classList.add('label');
        companyNameLabel.innerHTML = `<h5>${clientData.companyName}</h5>`;
        clientItem.appendChild(companyNameLabel);
        const securityDetails = document.createElement('div');
        securityDetails.classList.add('security-details');
        securityDetails.innerHTML = `
            <div class="security-info">
                <span class="security-icon">👤</span>
                ${clientData.totalSecurity || 'N/A'}
            </div>
            <div class="security-info">
                <span class="redeployed-icon">🔄</span>
                ${clientData.redeployedTotal || 'N/A'}
            </div>`;
        clientItem.appendChild(securityDetails);
        const contractExpiryDate = new Date(clientData.contractExpiry);
        const currentDate = new Date();
        const isActive = currentDate < contractExpiryDate;
        const statusText = isActive ? 'Active' : 'Inactive';
        const statusAndButtonContainer = document.createElement('div');
        statusAndButtonContainer.classList.add('status-and-button');
        const statusLabel = document.createElement('div');
        statusLabel.classList.add('status-label');
        statusLabel.innerHTML = `<span class="status ${isActive ? 'green' : 'red'}">${statusText}</span>`;
        statusAndButtonContainer.appendChild(statusLabel);
        const viewButton = document.createElement('button');
        viewButton.classList.add('view-button');
        viewButton.textContent = "View Details";
        viewButton.onclick = () => fetchClientAndOpenModal(client.id);
        statusAndButtonContainer.appendChild(viewButton);
        clientItem.appendChild(statusAndButtonContainer);
        clientList.appendChild(clientItem);
    });
}
function fetchClientAndOpenModal(clientId) {
    db.collection("LEFMOGIVclient").doc(clientId).get().then((doc) => {
        if (doc.exists) {
            const clientData = doc.data();
            openViewClientModal(clientData, doc.id);
        } else {
            console.error("No such document!");
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    displayClients(); 
});


// modal check details confirm new client added details
function showConfirmationModal(data) {
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const confirmButton = document.getElementById('confirmButton');
    confirmationMessage.innerHTML = `
        <p><strong>Company Name:</strong> <span>${data.companyName}</span></p>
        <p><strong>Client Details:</strong> <span>${data.clientDetails}</span></p>
        <p><strong>Location:</strong> <span>${data.location}</span></p>
        <p><strong>Expiration:</strong> <span>${data.contractExpiry}</span></p>
        <p><strong>Started:</strong> <span>${data.startDate}</span></p>
    `;
    confirmationModal.style.display = 'block';
    confirmButton.onclick = function(event) {
        event.preventDefault();
        confirmationModal.style.display = 'none'; 
    };
    const closeButton = document.querySelector(".close");
    closeButton.onclick = function() {
        confirmationModal.style.display = 'none';
    };
}
document.addEventListener('DOMContentLoaded', function() {
    const confirmationModal = document.getElementById('confirmationModal');
    confirmationModal.style.display = 'none';
});
function addGlowingEffect(element) {
    element.classList.add('glowing');
    setTimeout(() => {
        element.classList.remove('glowing');
    }, 1000); 
}
function calculateContractDuration() {
    const startDate = document.getElementById('startDate').value;
    const contractExpiry = document.getElementById('contractExpiry').value;
    const contractDurationField = document.getElementById('contractDuration');
    if (startDate && contractExpiry) {
        const start = new Date(startDate);
        const expiry = new Date(contractExpiry);
        let months = expiry.getMonth() - start.getMonth();
        let years = expiry.getFullYear() - start.getFullYear();
        if (months < 0) {
            months += 12;
            years--;
        }
        let days = expiry.getDate() - start.getDate();
        if (days < 0) {
            months--;
            const lastDayOfPrevMonth = new Date(expiry.getFullYear(), expiry.getMonth(), 0);
            days += lastDayOfPrevMonth.getDate();
        }
        const totalMonths = (years * 12) + months;
        let durationText = '';
        if (totalMonths > 0) durationText += totalMonths + ' month' + (totalMonths > 1 ? 's' : '') + ' ';
        if (days > 0) durationText += days + ' day' + (days > 1 ? 's' : '');
        contractDurationField.value = durationText.trim();
        addGlowingEffect(contractDurationField);
    } else {
        contractDurationField.value = 'Invalid Dates';
    }
}
function updateContractExpiryAndDuration() {
    const duration = parseInt(document.getElementById('contractDurationSelect').value); // Get selected duration
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('contractExpiry');
    if (startDateInput.value && !isNaN(duration)) {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + duration); 
        endDateInput.value = endDate.toISOString().split('T')[0]; 
        addGlowingEffect(endDateInput); 
    }
    calculateContractDuration(); 
}
 document.getElementById('startDate').addEventListener('change', function () {
    const duration = parseInt(document.getElementById('contractDurationSelect').value);
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('contractExpiry');
    if (startDateInput.value && !isNaN(duration)) {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + duration); 
        endDateInput.value = endDate.toISOString().split('T')[0]; 
        addGlowingEffect(startDateInput); 
        addGlowingEffect(endDateInput); 
    }
    calculateContractDuration(); 
});

document.getElementById('contractExpiry').addEventListener('change', function () {
    addGlowingEffect(this); // Apply glowing effect on contract expiry
    calculateContractDuration(); // Recalculate duration when end date changes
});
document.getElementById('contractDurationSelect').addEventListener('change', function () {
    const duration = parseInt(document.getElementById('contractDurationSelect').value); 
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('contractExpiry');
    if (!startDateInput.value) {
        const today = new Date();
        startDateInput.value = today.toISOString().split('T')[0]; 
    }
    if (startDateInput.value && !isNaN(duration)) {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + duration); 
        endDateInput.value = endDate.toISOString().split('T')[0]; 
        addGlowingEffect(endDateInput);
    }
    calculateContractDuration(); 
});
document.addEventListener('DOMContentLoaded', function () {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('contractExpiry');
    const contractDurationSelect = document.getElementById('contractDurationSelect');
    startDateInput.value = '';
    endDateInput.value = '';
    contractDurationSelect.value = '';
    if (!startDateInput.value && contractDurationSelect.value) {
        const today = new Date();
        startDateInput.value = today.toISOString().split('T')[0]; 
    }
    calculateContractDuration();
});
// submission
async function handleSubmit(event) {
    event.preventDefault();
    const submitButton = document.getElementById('submitButton');
    const spinner = document.getElementById('spinner');
    if (!addClientForm.checkValidity()) {
        addClientForm.reportValidity();
        return;
    }
    submitButton.disabled = true;
    spinner.style.display = 'inline-block';
    submitButton.innerHTML = "Submitting... ";
    const clientDetails = addClientForm.elements["clientDetails"].value;
    const location = addClientForm.elements["location"].value;
    const contractExpiry = addClientForm.elements["contractExpiry"].value;
    const startDate = addClientForm.elements["startDate"].value;
    const contractDurationSelect = addClientForm.elements["contractDurationSelect"].value;
    const contractDuration = contractDurationSelect ? `${contractDurationSelect} Months` : ""; // You can adjust this logic as needed
    const contactPerson = addClientForm.elements["contactPerson"].value;
    const contactPosition = addClientForm.elements["contactPosition"].value;
    const contactNumber = addClientForm.elements["contactNumber"].value;
    const emailAddress = addClientForm.elements["emailAddress"].value;
    const industry = addClientForm.elements["industry"].value;
    const socialMediaLinks = addClientForm.elements["socialMediaLinks"].value;
    const file = document.getElementById('companyImage').files[0];
    const data = {
        companyName: companyName,
        clientDetails: clientDetails,
        location: location,
        contractExpiry: contractExpiry,
        startDate: startDate,
        contractDuration: contractDuration, 
        contactPerson: contactPerson,
        contactPosition: contactPosition,
        contactNumber: contactNumber,
        emailAddress: emailAddress,
        industry: industry,
        socialMediaLinks: socialMediaLinks
    };
    const addDocument = async (data) => {
        try {
            const docRef = await db.collection("LEFMOGIVclient").add(data);
            return docRef.id;
        } catch (error) {
            throw error;
        }
    };

    try {
        if (file) {
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child('images/' + file.name);
            await imageRef.put(file);
            const imageUrl = await imageRef.getDownloadURL();
            data.imageUrl = imageUrl;
        }
        await addDocument(data);
        addClientForm.reset();
        addClientModal.style.display = "none";
        showConfirmationModal(data);
        await displayClients();
    } catch (error) {
        console.error("Error adding document: ", error);
    } finally {
        spinner.style.display = 'none';
        submitButton.innerHTML = "Submit";
        submitButton.disabled = false;
    }
}





// Function to open the modal
function openModal() {
    const modal = document.getElementById('myModal');
    const clientTypeButtons = document.querySelector('.client-type-buttons');
    const addClientForm = document.getElementById('addClientForm');
    const modalContent = document.querySelector('.modal-content-add-client');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
    }
    if (clientTypeButtons) clientTypeButtons.style.display = 'flex';
    if (addClientForm) addClientForm.style.display = 'none';
    if (modalContent) modalContent.style.maxWidth = '400px';
}

function closeModal() {
    const modal = document.getElementById('myModal');
    const clientTypeButtons = document.querySelector('.client-type-buttons');
    const addClientForm = document.getElementById('addClientForm');
    const modalContent = document.querySelector('.modal-content-add-client');
    if (modal) modal.style.display = 'none';
    if (clientTypeButtons) clientTypeButtons.style.display = 'block';
    if (addClientForm) addClientForm.style.display = 'none';
    if (modalContent) modalContent.style.maxWidth = '400px';
}

function showNewClientForm() {
    const clientTypeButtons = document.querySelector('.client-type-buttons');
    const addClientForm = document.getElementById('addClientForm');
    const startDateSection = document.getElementById('startDateSection');
    const modalContent = document.querySelector('.modal-content-add-client');
    const headerText = document.querySelector('.client-profile-header');
    const additionalInfoText = document.querySelector('.additional-info-text');
    if (clientTypeButtons) clientTypeButtons.style.display = 'none';
    if (addClientForm) addClientForm.style.display = 'block';
    if (startDateSection) startDateSection.style.display = 'block';
    if (headerText) headerText.textContent = "Add New Client";
    if (additionalInfoText) additionalInfoText.textContent = "Please provide the details of the new client.";
    handleClientTypeChange('new');
    if (modalContent) modalContent.style.maxWidth = '1000px';
}


// Function to show the form for "Old Client"
function showOldClientForm() {
    const clientTypeButtons = document.querySelector('.client-type-buttons');
    const addClientForm = document.getElementById('addClientForm');
    const startDateSection = document.getElementById('startDateSection');
    const modalContent = document.querySelector('.modal-content-add-client');
    const headerText = document.querySelector('.client-profile-header');
    const additionalInfoText = document.querySelector('.additional-info-text');
    if (clientTypeButtons) {
        clientTypeButtons.style.display = 'none'; 
    }
    if (addClientForm) {
        addClientForm.style.display = 'block'; 
    }

    if (startDateSection) {
        startDateSection.style.display = 'block'; 
    }
    if (headerText) {
        headerText.textContent = "Add Existing Client";
    }
    if (additionalInfoText) {
        additionalInfoText.textContent = "Please provide the details of the existing client.";
    }
    handleClientTypeChange('old'); 
    if (modalContent) {
        modalContent.style.maxWidth = '1000px'; 
    }
}

// Handle client type changes (new or old)
function handleClientTypeChange(clientType) {
    const startDateInput = document.getElementById('startDate');
    const contractExpiryInput = document.getElementById('contractExpiry');
    const today = new Date().toISOString().split('T')[0]; 
    if (!startDateInput || !contractExpiryInput) {
        console.error('Date input elements not found.');
        return;
    }
    if (clientType === 'new') {
        startDateInput.setAttribute('min', today); 
        contractExpiryInput.setAttribute('min', today);  
    } 
    else if (clientType === 'old') {
        startDateInput.removeAttribute('min'); 
        contractExpiryInput.removeAttribute('min'); 
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const button = document.querySelector('.btn.btn-secondary');
    if (button) {
        button.onclick = openModal;
    }
    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    const newClientButton = document.getElementById('newClientButton');
    const oldClientButton = document.getElementById('oldClientButton');
    if (newClientButton) {
        newClientButton.addEventListener('click', showNewClientForm);
    }
    if (oldClientButton) {
        oldClientButton.addEventListener('click', showOldClientForm);
    }
});

const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', handleSubmit);

const addClientForm = document.getElementById("addClientForm");
if (addClientForm) {
    addClientForm.addEventListener("submit", (e) => e.preventDefault());
}
































function previewImage(event) {
    const image = document.getElementById('uploadedImage');
    const placeholder = document.getElementById('imagePlaceholder');
    const removeButton = document.getElementById('removeImageButton');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            image.src = e.target.result;
            image.style.display = 'block';
            placeholder.style.backgroundColor = 'transparent'; 
            removeButton.style.display = 'block'; 
        };
        reader.readAsDataURL(file);
    }
}
function removeImage() {
    const image = document.getElementById('uploadedImage');
    const placeholder = document.getElementById('imagePlaceholder');
    const removeButton = document.getElementById('removeImageButton');
    const fileInput = document.getElementById('companyImage');
    image.src = '';
    image.style.display = 'none';
    placeholder.style.backgroundColor = '#f9f9f9'; 
    removeButton.style.display = 'none';
    fileInput.value = ''; 
}
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById("viewClientModal");
    const closeBtn = document.getElementById("closeClientButton");
    function closeModal() {
      modal.style.display = "none";
    }
    closeBtn.addEventListener("click", closeModal);
  });
  function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none"; 
  }
  function toggleDropdown(event, dropdownId) {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    const dropdown = document.getElementById(dropdownId);
    dropdowns.forEach(dd => {
        if (dd !== dropdown) {
            dd.style.display = 'none';
        }
    });
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
    const rect = event.target.closest('.dropdown-toggle').getBoundingClientRect();
    dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    dropdown.style.left = `${rect.left + window.scrollX}px`;
}
function handleOptionSelect(type, value) {
    console.log(`Selected ${type}: ${value}`);
    clientsArray = [...originalClientsArray]; 
    if (type === 'name') {
        if (value === 'Alphabetical') {
            clientsArray.sort((a, b) => a.data.companyName.localeCompare(b.data.companyName));
        } else if (value === 'Reverse Alphabetical') {
            clientsArray.sort((a, b) => b.data.companyName.localeCompare(a.data.companyName));
        }
    } else if (type === 'year') {
        if (value === 'Ascending') {
            clientsArray.sort((a, b) => new Date(a.data.contractExpiry) - new Date(b.data.contractExpiry));
        } else if (value === 'Descending') {
            clientsArray.sort((a, b) => new Date(b.data.contractExpiry) - new Date(a.data.contractExpiry));
        }
    } else if (type === 'active') {
        if (value === 'Active') {
            clientsArray = clientsArray.filter(client => new Date(client.data.contractExpiry) > new Date());
        } else if (value === 'Inactive') {
            clientsArray = clientsArray.filter(client => new Date(client.data.contractExpiry) <= new Date());
        }
    }
    document.getElementById('refreshButton').style.display = clientsArray.length < originalClientsArray.length ? 'inline' : 'none';
    displaySortedClients();
    document.querySelector(`#${type}Dropdown`).style.display = 'none';
}

function refreshClients() {
    clientsArray = [...originalClientsArray];
    document.getElementById('refreshButton').style.display = 'none';
    displaySortedClients();
}
