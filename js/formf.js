let currentStep = 1;
let isLoggedOnce = false; // Flag to check if sessionStorage has been logged once

function updateStepHeader() {
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`stepNumber${i}`).classList.toggle('active', i === currentStep);
        document.getElementById(`stepNumber${i}`).classList.toggle('inactive', i !== currentStep);
    }
}

// Document ready logic for loading form data and handling user session
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already registered
    const userEmail = sessionStorage.getItem('userEmail');
    const userName = sessionStorage.getItem('userName');
    
    // Check if form has been submitted already
    const formSubmitted = sessionStorage.getItem('formSubmitted');
    if (formSubmitted === 'true') {
        window.location.href = '../completeform.html'; // Redirect to confirmation page
        return; // Exit the function
    }

    // If the user is not registered (no email or username in sessionStorage)
    if (!userEmail || !userName) {
        // Redirect to register.php (can open in the same tab or in a new tab)
        window.location.href = 'register.php';
        return; // Exit the function to prevent further code execution
    }

    // If the user is registered, proceed with loading the form
    console.log("Current sessionStorage content (user data):", { userEmail, userName });
    const form = document.getElementById('applicationform');
    loadCurrentStep(); // Ensure step is loaded from sessionStorage
    loadImagePreview(); // Ensure image preview is loaded from sessionStorage
});

// Function to mark form as submitted and clear the flag
function markFormAsSubmitted() {
    sessionStorage.setItem('formSubmitted', 'true');
    isLeavingPage = false; // Allow leaving the page once the form is submitted
}

function saveCurrentStep() {
    sessionStorage.setItem('currentStep', currentStep);
}

function loadCurrentStep() {
    if (sessionStorage.getItem('currentStep')) {
        currentStep = parseInt(sessionStorage.getItem('currentStep'));
        document.querySelectorAll('.form-step').forEach((step, index) => {
            step.style.display = index + 1 === currentStep ? 'block' : 'none';
        });

        // Update buttons based on image upload state
        updateUploadButton();
        updateRemoveButton();
        updateStepHeader();
    }
}

function updateUploadButton() {
    const uploadedImage = sessionStorage.getItem('uploadedImage');
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadedImage) {
        uploadBtn.style.display = 'none'; // Hide if an image is uploaded
    } else {
        uploadBtn.style.display = 'inline'; // Show if no image is uploaded
        uploadBtn.innerText = 'Upload';
    }
}

function updateRemoveButton() {
    const removeBtn = document.getElementById('removeImageBtn');
    const uploadedImage = sessionStorage.getItem('uploadedImage');
    if (uploadedImage) {
        removeBtn.style.display = 'inline'; // Show the remove button
        removeBtn.innerText = 'Remove';
    } else {
        removeBtn.style.display = 'none'; // Hide remove button if no image
    }
}

function updateImagePreview(event) {
    const fileInput = document.getElementById('picture');
    const file = fileInput.files[0];
    const preview = document.getElementById('uploadedImage');
    const noImageText = document.getElementById('noImageText');
    const removeBtn = document.getElementById('removeImageBtn');
    const uploadBtn = document.querySelector('.upload-btn');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64String = e.target.result;
            preview.src = base64String;
            preview.style.display = 'block';
            noImageText.style.display = 'none';
            sessionStorage.setItem('uploadedImage', base64String); // Save to sessionStorage

            removeBtn.style.display = 'inline';
            uploadBtn.style.display = 'none';
        };
        reader.readAsDataURL(file);
    } else {
        resetImagePreview();
    }
}

function loadImagePreview() {
    const preview = document.getElementById('uploadedImage');
    const noImageText = document.getElementById('noImageText');
    const removeBtn = document.getElementById('removeImageBtn');
    const uploadBtn = document.querySelector('.upload-btn');

    const storedImage = sessionStorage.getItem('uploadedImage');
    if (storedImage) {
        preview.src = storedImage; // Set the preview image to the stored Base64 string
        preview.style.display = 'block'; // Show the image
        noImageText.style.display = 'none'; // Hide the "Choose file" text
        removeBtn.style.display = 'inline'; // Show the remove button
        uploadBtn.style.display = 'none'; // Hide the upload button
    } else {
        resetImagePreview(); // Reset if no image is stored
    }
}

function resetImagePreview() {
    const preview = document.getElementById('uploadedImage');
    const noImageText = document.getElementById('noImageText');
    const removeBtn = document.getElementById('removeImageBtn');
    const uploadBtn = document.querySelector('.upload-btn');
    const fileInput = document.getElementById('picture');

    preview.style.display = 'none';
    noImageText.style.display = 'block';
    fileInput.value = ''; // Reset file input
    removeBtn.style.display = 'none'; // Hide remove button
    uploadBtn.style.display = 'inline'; // Show upload button
    uploadBtn.innerText = 'Upload'; // Reset button text
}

function removeImage() {
    resetImagePreview(); // Reset the image preview and input
    sessionStorage.removeItem('uploadedImage'); // Remove the image from sessionStorage
}

// Event listener for the remove button
document.getElementById('removeImageBtn').addEventListener('click', removeImage);

// For moving between steps:
function showNextStep() {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    const inputs = currentStepElement.querySelectorAll('input, textarea, select');
    let allFilled = true;

    // Clear previous error messages
    inputs.forEach(input => {
        const errorMessage = input.nextElementSibling;
        if (errorMessage) {
            errorMessage.innerText = ''; // Clear previous error messages
        }
    });

    inputs.forEach(input => {
        const value = input.value.trim();
        if (input.type !== 'file' && value === '') {
            allFilled = false;
            input.classList.add('highlight');
            const errorMessage = input.nextElementSibling;
            if (errorMessage) {
                errorMessage.innerText = 'This field cannot be empty.';
            }
        } else {
            input.classList.remove('highlight');
        }
    });

    // Check for uploaded image
    const uploadedImage = sessionStorage.getItem('uploadedImage');
    if (!uploadedImage) {
        allFilled = false;
        const imagePreviewSection = document.getElementById('imagePreview');
        imagePreviewSection.classList.add('highlight-upload');
    }
    updateUploadButton(); // Update button visibility and text
    if (allFilled) {
        currentStepElement.style.display = 'none';
        currentStep++;
        document.getElementById(`step-${currentStep}`).style.display = 'block';
        updateStepHeader();
        saveCurrentStep();
    } else {
    }
}




function showPrevStep() {
    document.getElementById(`step-${currentStep}`).style.display = 'none';
    currentStep--;
    document.getElementById(`step-${currentStep}`).style.display = 'block';
    updateStepHeader();
    saveCurrentStep();
}

function saveInput(input) {
    if (input.type !== 'file') {
        // Save the input value to sessionStorage
        sessionStorage.setItem(input.id, input.value);
    } else {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function() {
                // Save the Base64 image data to sessionStorage
                sessionStorage.setItem(input.id, reader.result);
                // Call to update the image preview
                updateImagePreview(reader.result);
            };
            reader.readAsDataURL(file); 
        } else {
            sessionStorage.removeItem(input.id); // Remove if no file selected
            resetImagePreview(); // Reset preview if no file is chosen
        }
    }
}

function loadInput() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        const storedValue = sessionStorage.getItem(input.id);
        if (storedValue) {
            if (input.type === 'file') {
                loadImagePreview();
            } else {
                input.value = storedValue;
            }
        }
    });

    // Load saved radio button selections
    const radioGroups = document.querySelectorAll('[data-group]');
    radioGroups.forEach(group => {
        const dataGroup = group.getAttribute('data-group');
        const storedValue = sessionStorage.getItem(`radio-${dataGroup}`);

        if (storedValue) {
            const selectedRadio = group.querySelector(`.custom-radio[data-value="${storedValue}"]`);
            if (selectedRadio) {
                selectedRadio.classList.add('selected');
            }
        }
    });

    renderSiblings();
    renderReferences();
    renderChildren();
}

function updateImagePreview(event) {
    if (!event || !event.target) {
        console.error("Event or event target is undefined.");
        return;
    }

    const fileInput = event.target;
    console.log("Event target received:", fileInput);

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        return;
    }

    const file = fileInput.files[0];
    const preview = document.getElementById('uploadedImage');
    const noImageText = document.getElementById('noImageText');
    const removeBtn = document.getElementById('removeImageBtn');
    const uploadBtn = document.querySelector('.upload-btn');

    console.log("File selected:", file);

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const base64String = e.target.result;
            console.log('Base64 Image:', base64String);  // Check the base64 string
            sessionStorage.setItem('uploadedImage', base64String);
            preview.src = base64String;
            preview.style.display = 'block';
            noImageText.style.display = 'none';

            removeBtn.style.display = 'inline';
            uploadBtn.style.display = 'none';
        };

        reader.readAsDataURL(file);
    } else {
        resetImagePreview();
    }
}

function loadImagePreview() {
    const preview = document.getElementById('uploadedImage');
    const noImageText = document.getElementById('noImageText');
    const removeBtn = document.getElementById('removeImageBtn');
    const uploadBtn = document.querySelector('.upload-btn');

    const storedImage = sessionStorage.getItem('uploadedImage');

    if (storedImage) {
        preview.src = storedImage;
        preview.style.display = 'block';
        noImageText.style.display = 'none';
        removeBtn.style.display = 'inline';
        uploadBtn.style.display = 'none';
    } else {
        resetImagePreview();
    }
}

function resetImagePreview() {
    const preview = document.getElementById('uploadedImage');
    const noImageText = document.getElementById('noImageText');
    const removeBtn = document.getElementById('removeImageBtn');
    const uploadBtn = document.querySelector('.upload-btn');
    const fileInput = document.getElementById('picture');

    preview.style.display = 'none';
    noImageText.style.display = 'block';

    fileInput.value = '';
    removeBtn.style.display = 'none';
    uploadBtn.style.display = 'inline';
    uploadBtn.innerText = 'Upload';
}






// select on step 2 starts here 
function showStatusOptions() {
    document.getElementById('statusSuggestions').style.display = 'block';
}

function showDialectOptions() {
    document.getElementById('dialectSuggestions').style.display = 'block';
}

function showReligionOptions() {
    document.getElementById('religionSuggestions').style.display = 'block';
}

function showBloodTypeOptions() {
    document.getElementById('bloodTypeSuggestions').style.display = 'block';
}

function hideSuggestions() {
    const suggestions = document.querySelectorAll('.suggestions');
    suggestions.forEach(suggestion => {
        suggestion.style.display = 'none';
    });
}

document.addEventListener('click', function (event) {
    const target = event.target;
    if (!target.closest('.input-field')) {
        hideSuggestions();
    }
});

// Handle option selection and set input value
function selectOption(value, inputId) {
    const input = document.getElementById(inputId);
    input.value = value; // Set selected value
    hideSuggestions(); // Hide suggestions
    saveInput(input); // Save the selected value
}







// Function to close the email verified modal
function closeEmailVerifiedModal() {
    const modal = document.getElementById('emailVerifiedModal');
    modal.classList.remove('fade-in'); // Remove fade-in class if present
    modal.classList.add('fade-out'); // Add fade-out class

    // Wait for the fade-out transition to complete before hiding the modal
    setTimeout(() => {
        modal.style.display = 'none'; // Hide the modal
        modal.classList.remove('fade-out'); // Remove fade-out class
    }, 300); // Match timeout with CSS transition duration
}

// Call loadCurrentStep on page load to set the initial step
window.onload = function() {
    loadCurrentStep();
    loadInput(); // Load saved input values
};

function calculateAge() {
    const dobInput = document.getElementById('dob');
    const ageInput = document.getElementById('age');
    
    // Get the date of birth from the input
    const dob = new Date(dobInput.value);
    
    // Get the current date
    const today = new Date();
    
    // Calculate the age in years
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    // Adjust age if the birth month has not occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    // Set the age input value
    ageInput.value = age;

    // Save the age to sessionStorage
    saveInput(ageInput); // Save age to sessionStorage

    // Validate age is between 18 and 40
    if (age < 18 || age > 40) {
        ageInput.setCustomValidity('Age must be between 18 and 40 years old.');
    } else {
        ageInput.setCustomValidity(''); // Clear any previous error message
    }
}

// Set the max date for the date of birth input
function setMaxDate() {
    const dobInput = document.getElementById('dob');
    const today = new Date();
    const maxDate = new Date(today.setFullYear(today.getFullYear() - 18)); // 18 years ago
    const year = maxDate.getFullYear();
    const month = String(maxDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(maxDate.getDate()).padStart(2, '0');

    // Set the max attribute of the date input
    dobInput.setAttribute('max', `${year}-${month}-${day}`);
}

// Call setMaxDate when the page loads
window.onload = function() {
    setMaxDate();
    loadCurrentStep();
    loadInput(); // Load saved input values
};

let siblingCount = 0; // To track sibling count

// Function to add a sibling
function addSibling(gender) {
    siblingCount++;
    const siblingId = `sibling-${siblingCount}`;

    // Create sibling data structure
    const siblingData = { name: '', age: '', occupation: '', gender: gender };

    // Save the new sibling data to sessionStorage
    sessionStorage.setItem(siblingId, JSON.stringify(siblingData));

    // Render siblings, and ensure all existing sibling data is saved
    renderSiblings();
}

// Function to render siblings
function renderSiblings() {
    const siblingsContainer = document.getElementById('siblingsList');
    siblingsContainer.innerHTML = ''; // Clear existing rows

    // Iterate over sessionStorage to find siblings
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key.startsWith('sibling-')) {
            const siblingData = JSON.parse(sessionStorage.getItem(key));
            const siblingRow = document.createElement('div');
            siblingRow.classList.add('input-row');
            siblingRow.id = key;

            siblingRow.innerHTML = `
                <div class="input-field">
                    <label for="${key}-name">${siblingData.gender === 'brother' ? 'Brother Name' : 'Sister Name'}</label>
                    <input type="text" id="${key}-name" name="${key}-name" value="${siblingData.name}" oninput="saveSiblingInput('${key}', this)" placeholder="Enter name">
                    <small class="error-message" style="color: red;"></small> <!-- Error message -->
                </div>
                <div class="input-field">
                    <label for="${key}-age">Age</label>
                    <input type="text" id="${key}-age" name="${key}-age" value="${siblingData.age}" oninput="saveSiblingInput('${key}', this)" placeholder="Enter age">
                    <small class="error-message" style="color: red;"></small> <!-- Error message -->
                </div>
                <div class="input-field">
                    <label for="${key}-occupation">Occupation</label>
                    <input type="text" id="${key}-occupation" name="${key}-occupation" value="${siblingData.occupation}" oninput="saveSiblingInput('${key}', this)" placeholder="Enter address">
                    <small class="error-message" style="color: red;"></small> <!-- Error message -->
                </div>
                <button type="button" class="remove-btn" onclick="removeSibling('${key}')">
                    <i class="bi bi-trash" style="font-size: 14px;"></i>
                </button>
            `;

            siblingsContainer.appendChild(siblingRow);
        }
    }
}

// Function to save sibling input in sessionStorage
function saveSiblingInput(siblingId, input) {
    const siblingData = JSON.parse(sessionStorage.getItem(siblingId)) || {};
    siblingData[input.name.split('-')[2]] = input.value; // Save the value based on input name
    sessionStorage.setItem(siblingId, JSON.stringify(siblingData));
}

// Function to remove a sibling
function removeSibling(key) {
    sessionStorage.removeItem(key); // Remove from sessionStorage
    renderSiblings(); // Re-render siblings
}

// Ensure that input values are saved before re-rendering siblings
document.addEventListener('DOMContentLoaded', function() {
    renderSiblings(); // Render siblings on page load
});



let referenceCount = 0; // Starts from 0 since reference-0 is the first reference

// Function to add a reference
function addReference() {
    referenceCount++;
    const referenceId = `reference-${referenceCount}`;
    
    // Create reference data structure
    const referenceData = { name: '', occupation: '', address: '', phone: '' };

    // Save the new reference data to sessionStorage
    sessionStorage.setItem(referenceId, JSON.stringify(referenceData));
    
    // Call function to render references
    renderReferences();
}

// Function to render references
function renderReferences() {
    const referenceContainer = document.getElementById('referenceList');
    referenceContainer.innerHTML = ''; // Clear existing rows

    // Ensure 'reference-0' is initialized
    if (!sessionStorage.getItem('reference-0')) {
        const defaultReferenceData = { name: '', occupation: '', address: '', phone: '' };
        sessionStorage.setItem('reference-0', JSON.stringify(defaultReferenceData));
    }

    // Iterate over sessionStorage to find all references and render them
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key.startsWith('reference-')) {
            let referenceData = null;

            try {
                // Parse the data from sessionStorage, but first check if it's valid
                const storedData = sessionStorage.getItem(key);
                if (storedData) {
                    referenceData = JSON.parse(storedData);
                }
            } catch (error) {
                console.error(`Error parsing reference data for key: ${key}`, error);
                referenceData = { name: '', occupation: '', address: '', phone: '' }; // Use default values if parsing fails
            }

            // If referenceData is still null, use default values
            if (!referenceData) {
                referenceData = { name: '', occupation: '', address: '', phone: '' };
            }

            const referenceRow = document.createElement('div');
            referenceRow.classList.add('input-row');
            referenceRow.id = key;

            // Render reference fields
            referenceRow.innerHTML = `
                <div class="input-field">
                    <label for="${key}-name">Name</label>
                    <input type="text" id="${key}-name" name="name" value="${referenceData.name}" oninput="saveReferenceInput('${key}', this)" placeholder="Enter name">
                    <small class="error-message" style="color: red;"></small> <!-- Error message -->
                </div>
                <div class="input-field">
                    <label for="${key}-occupation">Occupation</label>
                    <input type="text" id="${key}-occupation" name="occupation" value="${referenceData.occupation}" oninput="saveReferenceInput('${key}', this)" placeholder="Enter occupation">
                    <small class="error-message" style="color: red;"></small> <!-- Error message -->
                </div>
                <div class="input-field">
                    <label for="${key}-address">Address</label>
                    <input type="text" id="${key}-address" name="address" value="${referenceData.address}" oninput="saveReferenceInput('${key}', this)" placeholder="Enter address">
                    <small class="error-message" style="color: red;"></small> <!-- Error message -->
                </div>
                <div class="input-field">
                    <label for="${key}-phone">Phone Number</label>
                    <input type="text" id="${key}-phone" name="phone" value="${referenceData.phone}" oninput="saveReferenceInput('${key}', this)" placeholder="Enter phone no.">
                    <small class="error-message" style="color: red;"></small> <!-- Error message -->
                </div>
            `;

            // Add the trash icon only if it's not the first reference (reference-0)
            if (key !== 'reference-0') {
                const removeButton = document.createElement('button');
                removeButton.type = 'button';
                removeButton.classList.add('remove-btn');
                removeButton.innerHTML = `<i class="bi bi-trash" style="font-size: 14px;"></i>`;
                removeButton.onclick = () => removeReference(key);
                referenceRow.appendChild(removeButton);
            }

            referenceContainer.appendChild(referenceRow);
        }
    }
}

// Function to save reference input
function saveReferenceInput(referenceId, inputElement) {
    const referenceData = JSON.parse(sessionStorage.getItem(referenceId));
    
    // Ensure only the specific field (name, occupation, address, or phone) is updated
    referenceData[inputElement.name] = inputElement.value;
    sessionStorage.setItem(referenceId, JSON.stringify(referenceData));  // Update sessionStorage
}

// Function to remove reference
function removeReference(key) {
    sessionStorage.removeItem(key); // Remove from sessionStorage
    renderReferences(); // Re-render references
}

// Ensure that the first reference row is always there when the page loads
document.addEventListener('DOMContentLoaded', function() {
    renderReferences(); // Render the references on page load
});


// Initialize the step5Data object at the top of your script
const step5Data = {};
function selectRadio(element) {
    const group = element.parentNode;
    const radios = group.querySelectorAll('.custom-radio');

    // Remove 'selected' class from all radios
    radios.forEach(radio => {
        radio.classList.remove('selected');
    });

    // Add 'selected' class to the clicked radio
    element.classList.add('selected');

    // Get the selected value
    const value = element.getAttribute('data-value');
    console.log("Selected value:", value);

    // Store the selected value in the step5Data object dynamically
    const dataGroup = group.getAttribute('data-group');
    step5Data[dataGroup] = value; // Ensure step5Data is defined before this line

    // Save the selected radio value to sessionStorage
    sessionStorage.setItem(`radio-${dataGroup}`, value);
}




let childCount = 0; 

function addChild(gender) {
    const childId = `child-${childCount}`; 
    childCount++; 
    const childData = { name: '', age: '', address: '', gender: gender, occupation: '' }; // Store gender and occupation
    sessionStorage.setItem(childId, JSON.stringify(childData));
    renderChildren();
}

// Function to render children
function renderChildren() {
    const childrenContainer = document.getElementById('childrenList');
    childrenContainer.innerHTML = ''; // Clear existing rows to prevent repetition

    // Iterate over sessionStorage to find all children and render them
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key.startsWith('child-')) {
            const childData = JSON.parse(sessionStorage.getItem(key));
            const childRow = document.createElement('div');
            childRow.classList.add('input-row');
            childRow.id = key;

            // Render child fields with dynamic labels based on gender
            childRow.innerHTML = `
                <div class="input-field">
                    <label for="${key}-name">${childData.gender.charAt(0).toUpperCase() + childData.gender.slice(1)} Name</label>
                    <input type="text" id="${key}-name" name="${key}-name" value="${childData.name}" oninput="saveChildInput('${key}', this)" placeholder="Enter name">
                    <small class="error-message" style="color: red;"></small> <!-- Error message -->
                </div>
                <div class="input-field">
                    <label for="${key}-age">Age</label>
                    <input type="text" id="${key}-age" name="${key}-age" value="${childData.age}" oninput="saveChildInput('${key}', this)" placeholder="Enter age">
                    <small class="error-message" style="color: red;"></small> <!-- Error message -->
                </div>
                <div class="input-field">
                    <label for="${key}-address">Address</label>
                    <input type="text" id="${key}-address" name="${key}-address" value="${childData.address}" oninput="saveChildInput('${key}', this)" placeholder="Enter address">
                    <small class="error-message" style="color: red;"></small> <!-- Error message -->
                </div>
            `;

            // Add a remove button for each child
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.classList.add('remove-btn');
            removeButton.innerHTML = `<i class="bi bi-trash" style="font-size: 14px;"></i>`;
            removeButton.onclick = () => removeChild(key);
            childRow.appendChild(removeButton);

            childrenContainer.appendChild(childRow); // Append the child row
        }
    }
}
function saveChildInput(childId, input) {
    const childData = JSON.parse(sessionStorage.getItem(childId)) || {};
    childData[input.name.split('-')[2]] = input.value; // Save the value based on name
    sessionStorage.setItem(childId, JSON.stringify(childData));
}
function removeChild(key) {
    sessionStorage.removeItem(key); // Remove from sessionStorage
    renderChildren(); // Re-render children
}
document.addEventListener('DOMContentLoaded', function() {
    renderChildren(); // Render the children on page load
});
function validateInput(input, regex) {
    const errorMessage = input.nextElementSibling; // Assuming small is immediately after input
    if (!regex.test(input.value)) {
        errorMessage.textContent = 'Invalid format';
    } else {
        errorMessage.textContent = ''; // Clear error message
    }
}
function formatInput(input, type) {
    let value = input.value;
    switch (type) {
        case 'license':
            // Remove all characters except letters and numbers, then convert to uppercase
            let licenseText = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        
            // Add the hyphen after the first three characters if the length is at least 4
            if (licenseText.length > 3) {
                input.value = licenseText.substring(0, 3) + '-' + licenseText.substring(3, 15);
            } else {
                input.value = licenseText; // Keep the input as is if fewer than 4 characters
            }
            break;
        
        
        case 'philHealth':
            // Format PhilHealth No. as xx-xxxxxxxxx-x
            let philHealthDigits = value.replace(/\D/g, ''); // Get only numeric digits
            if (philHealthDigits.length >= 12) {
                input.value = philHealthDigits.replace(/(\d{2})(\d{9})(\d{1})/, '$1-$2-$3');
            } else {
                input.value = philHealthDigits; // Keep the raw digit input
            }
            break;
        case 'sss':
            // Format SSS No. as xx-xxxxxxx-x
            let sssDigits = value.replace(/\D/g, '');
            if (sssDigits.length >= 10) {
                input.value = sssDigits.replace(/(\d{2})(\d{7})(\d{1})/, '$1-$2-$3');
            } else {
                input.value = sssDigits; // Keep the raw digit input
            }
            break;
        case 'tin':
            let tinDigits = value.replace(/\D/g, '');
            if (tinDigits.length >= 9) {
                input.value = tinDigits.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
            } else {
                input.value = tinDigits; // Keep the raw digit input
            }
            break;
        case 'pagIbig':
            let pagIbigDigits = value.replace(/\D/g, '');
            if (pagIbigDigits.length >= 12) {
                input.value = pagIbigDigits.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
            } else {
                input.value = pagIbigDigits; // Keep the raw digit input
            }
            break;
        default:
            break;
    }
}
function formatPhoneNumber(input) {
    const cleaned = input.value.replace(/\D/g, '');
    if (cleaned.length === 0) {
        input.value = ''; // Clear the input if nothing is entered
        return;
    }
    let formatted = '';
    if (cleaned.length >= 4) {
        formatted = cleaned.slice(0, 4); // First four digits
        if (cleaned.length > 4) {
            formatted += '-' + cleaned.slice(4, 7); // Next three digits
        }
        if (cleaned.length > 7) {
            formatted += '-' + cleaned.slice(7, 11); // Last four digits
        }
    } else {
        formatted = cleaned; // If less than 4 digits, keep as is
    }
    input.value = formatted.trim();
    saveInput(input);
}

function formatHeight(input) {
    const cleaned = input.value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 3);
    if (limited.length === 0) {
        input.value = '';
        return;
    }
    input.value = limited + ' cm';
    setCursorToBeforeSuffix(input, ' cm');
    saveInput(input);
}

function formatWeight(input) {
    const cleaned = input.value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 3);
    if (limited.length === 0) {
        input.value = '';
        return;
    }
    input.value = limited + ' kg';
    setCursorToBeforeSuffix(input, ' kg');
    saveInput(input);
}

function setCursorToBeforeSuffix(input, suffix) {
    const position = input.value.length - suffix.length;
    input.setSelectionRange(position, position);
}

function repopulateDatalists() {
    // Get the datalists
    const statusDatalist = document.getElementById('statusOptions');
    const religionDatalist = document.getElementById('religionOptions');

    // Restore Marital Status options
    if (!statusDatalist.options.length) {
        statusDatalist.innerHTML = `
            <option value="Single">
            <option value="Married">
            <option value="Divorced">
            <option value="Widowed">
            <option value="In a relationship">
        `;
    }

    // Restore Religion options
    if (!religionDatalist.options.length) {
        religionDatalist.innerHTML = `
            <option value="Catholicism">
            <option value="Protestantism">
            <option value="Islam">
            <option value="Iglesia ni Cristo">
            <option value="Buddhism">
            <option value="Hinduism">
            <option value="Atheism">
            <option value="Agnosticism">
        `;
    }
}