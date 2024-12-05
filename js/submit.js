import { auth } from './firebase_init.js';
import { getFirestore, collection, addDoc } from './firebase_init.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from './firebase_init.js';

const db = getFirestore();
const storage = getStorage();
let isSubmitting = false;

function showAlert(message) {
    alert(message);
}

// Function to compress the image before uploading
function compressImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = function(event) {
            img.src = event.target.result;
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);

        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const MAX_WIDTH = 800; // max width
            const MAX_HEIGHT = 800; // max height
            let width = img.width;
            let height = img.height;

            // Resize image if it's larger than max dimensions
            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
                width = width * ratio;
                height = height * ratio;
            }

            // Set canvas size and draw image
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Convert canvas to file (JPEG or PNG)
            canvas.toBlob(resolve, 'image/jpeg', 0.7); // 0.7 is quality for JPEG
        };
    });
}
async function submitFormData(event) {
    event.preventDefault();

    if (isSubmitting) {
        return;
    }
    isSubmitting = true;

    const jsonData = {};  // Initialize jsonData here

    // Collect data from the form
    const form = document.getElementById('applicationform');
    const formData = new FormData(form);

    // Collect all form fields into jsonData
    formData.forEach((value, key) => {
        if (key !== 'picture') { // Skip the picture field
            jsonData[key] = value;  // Add each field to jsonData
            sessionStorage.setItem(key, value);  // Optionally store form data in sessionStorage
        }
    });

    // Ensure user is authenticated
    const user = auth.currentUser;
    if (!user) {
        showAlert('User is not authenticated');
        isSubmitting = false;
        return;
    }

    jsonData['userId'] = user.uid;  // Add userId to jsonData

    // Handle image upload if present (from either input or sessionStorage)
    const storedImage = sessionStorage.getItem('uploadedImage');  // Check sessionStorage for image URL
    if (storedImage) {
        jsonData['imageURL'] = storedImage;  // Use image URL from sessionStorage
    } else {
        const pictureInput = document.getElementById('picture');
        if (pictureInput && pictureInput.files.length > 0) {
            const file = pictureInput.files[0];
            const fullName = document.getElementById('fullName').value.trim(); // Get full name input
            const storageRef = ref(storage, `applicantprofile/${fullName}/${file.name}`);

            try {
                // Compress the image before uploading
                const compressedFile = await compressImage(file);

                const snapshot = await uploadBytes(storageRef, compressedFile);  // Upload image to Firebase storage
                const imageURL = await getDownloadURL(snapshot.ref);  // Get the uploaded image URL
                jsonData['imageURL'] = imageURL;  // Save image URL to jsonData
                sessionStorage.setItem('uploadedImage', imageURL);  // Store the image URL in sessionStorage
            } catch (error) {
                console.error('Error uploading image:', error);
                showAlert('Error uploading image. Please try again.');
                isSubmitting = false;
                return;  // Exit if there's an error
            }
        } else {
            showAlert('No image file found to upload.');
            isSubmitting = false;
            return;
        }
    }

    // Submit form data to Firestore
    try {
        console.log('Submitting Form Data:', jsonData);  // For debugging purposes
        const docRef = await addDoc(collection(db, 'applications'), jsonData); // Save to Firestore
        showAlert('Form submitted successfully!');

        // Reset the form and clear sessionStorage
        form.reset();
        sessionStorage.clear();  // Clear sessionStorage after successful submission
        localStorage.clear();    // Optionally clear localStorage

        // Store a flag to indicate that the form was submitted
        sessionStorage.setItem('formSubmitted', 'true');

        // Optionally, display the uploaded image
        const preview = document.getElementById('uploadedImage');
        if (preview) {
            preview.setAttribute('src', jsonData['imageURL']);
            preview.style.display = 'block';
        }

        document.getElementById('noImageText').textContent = 'No file chosen';  // Update the text after submission
        window.location.href = "../completeform.html"; // Redirect after successful submission
    } catch (error) {
        console.error('Error storing form data:', error);
        showAlert('Error storing form data. Please try again.');
    } finally {
        isSubmitting = false; // Reset the submitting flag
        hideLoadingSpinner();  // Hide spinner after submission attempt
    }
}



// Show the loading spinner and disable buttons
function showLoadingSpinner() {
    const modal = document.getElementById('applicationConfirmationModal');
    const spinner = document.getElementById('loadingSpinner');
    const confirmButton = document.getElementById('confirmApplicationSubmit');
    const cancelButton = document.getElementById('cancelApplicationSubmit');

    confirmButton.style.display = 'none';  // Hide "Yes" button
    cancelButton.style.display = 'none';  // Hide "No" button
    spinner.style.display = 'block';      // Show the spinner
}

// Hide the loading spinner
function hideLoadingSpinner() {
    const modal = document.getElementById('applicationConfirmationModal');
    const spinner = document.getElementById('loadingSpinner');
    const confirmButton = document.getElementById('confirmApplicationSubmit');
    const cancelButton = document.getElementById('cancelApplicationSubmit');

    confirmButton.style.display = 'block';  // Show "Yes" button
    cancelButton.style.display = 'block';  // Show "No" button
    spinner.style.display = 'none';        // Hide the spinner
}
// Define the validateForm function
function validateForm(event) {
    event.preventDefault();

    const requiredFields = document.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    // Validate required text fields
    requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('missing-input');
        } else {
            field.classList.remove('missing-input');
        }
    });

    // Check if an image is selected either in the file input or in sessionStorage
    const storedImage = sessionStorage.getItem('uploadedImage');  // Get the stored image from sessionStorage
    
    if (!storedImage) {
        isValid = false;
        console.warn('No image file selected.');
        showAlert('Please select an image to upload.');
    }

    // If all fields are valid, show the confirmation modal
    if (isValid) {
        showConfirmationModal();
    } else {
        showAlert('Please fill out all required fields.');
    }
}
// Function to show the confirmation modal
function showConfirmationModal() {
    const modal = document.getElementById('applicationConfirmationModal');
    modal.style.display = 'block';  // Show the modal
}

// Function to handle closing the modal (cancel the submission)
function closeConfirmationModal() {
    const modal = document.getElementById('applicationConfirmationModal');
    modal.style.display = 'none';  // Hide the modal
}

// Function to handle confirming the submission
function confirmSubmission() {
    const modal = document.getElementById('applicationConfirmationModal');
    showLoadingSpinner();  // Show loading spinner before submission
    submitFormData(new Event('submit'));  // Trigger form submission
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('applicationform');
    if (form) {
        form.addEventListener('submit', validateForm);  // Validate form before showing modal
        form.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();  // Prevent the form from submitting
            }
        });
    }

    const confirmButton = document.getElementById('confirmApplicationSubmit');
    confirmButton.addEventListener('click', confirmSubmission);  // Confirm submission

    const cancelButton = document.getElementById('cancelApplicationSubmit');
    cancelButton.addEventListener('click', closeConfirmationModal);  // Close modal without submitting
});
