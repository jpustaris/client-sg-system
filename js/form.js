import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';

// Initialize Firebase
// data/secrets



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize storage

function showAlert(message) {
    alert(message);
}

async function submitFormData(event) {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user) {
        showAlert('You must be logged in to submit the form.');
        return;
    }

    // Initialize jsonData as an empty object
    const jsonData = {};

    // Collect all the form data as before
    const step1Data = {
        licenseNo: document.getElementById('license-no').value,
        sssNo: document.getElementById('sss-no').value,
        tin: document.getElementById('tin-no').value,
        pagIbigNo: document.getElementById('pag-ibig-no').value,
        philHealthNo: document.getElementById('phil-health-no').value
    };

    const step2Data = {
        fullName: document.getElementById('fullName').value,
        dob: document.getElementById('dob').value,
        placeOfBirth: document.getElementById('placeOfBirth').value,
        hobbies: document.getElementById('hobbies').value,
        sports: document.getElementById('sports').value,
        birthMarks: document.getElementById('birthMarks').value,
        dialectsSpoken: document.getElementById('dialectsSpoken').value,
        presentAddress: document.getElementById('presentAddress').value,
        age: document.getElementById('age').value,
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value,
        bloodType: document.getElementById('bloodType').value,
        citizenship: document.getElementById('citizenship').value,
        religion: document.getElementById('religion').value,
        status: document.getElementById('status').value,
        telNo: document.getElementById('telNo').value,
    };

    const step3Data = {
        schoolName: document.getElementById('schoolName').value,
        schoolAddress: document.getElementById('schoolAddress').value,
        yearGraduated: document.getElementById('yearGraduated').value,
        extraCurriculum: document.getElementById('extraCurriculum').value,
        militaryTraining: document.getElementById('militaryTraining').value,
        unitLocation: document.getElementById('unitLocation').value,
        highestRank: document.getElementById('highestRank').value,
        awards: document.getElementById('awards').value,
        previousCompany: document.getElementById('previousCompany').value,
        positionHeld: document.getElementById('positionHeld').value,
        fromDate: document.getElementById('fromDate').value,
        toDate: document.getElementById('toDate').value,
        reasonForLeaving: document.getElementById('reasonForLeaving').value
    };

// Define step4Data with arrays for sons and daughters
const step4Data = {
    fatherName: document.getElementById('fatherName').value,
    fatherAge: document.getElementById('fatherAge').value,
    fatherOccupation: document.getElementById('fatherOccupation').value,
    motherName: document.getElementById('motherName').value,
    motherAge: document.getElementById('motherAge').value,
    motherOccupation: document.getElementById('motherOccupation').value,
    
    spouseName: document.getElementById('spouseName').value,
    spouseAge: document.getElementById('spouseAge').value,
    spouseAddress: document.getElementById('spouseAddress').value,

    sonName: [],
    sonAge: [],
    sonOccupation: [],
    daughterName: [],
    daughterAge: [],
    daughterOccupation: [],
    brotherName: [],
    brotherAge: [],
    brotherOccupation: [],
    sisterName: [],
    sisterAge: [],
    sisterOccupation: [],
    referenceName: [],
    referenceOccupation: [],
    referenceAddress: [],
    referencePhone: []
};

// Iterate through sessionStorage to collect child, sibling, and reference data
for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    let data = null;

    try {
        const storedData = sessionStorage.getItem(key);
        if (storedData) {
            data = JSON.parse(storedData);
        }
    } catch (error) {
        continue;
    }

    if (key.startsWith('child-')) {
        // Check if this is a son or daughter and add to the correct arrays
        if (data.gender === 'son') {
            step4Data.sonName.push(data.name);
            step4Data.sonAge.push(data.age);
            step4Data.sonOccupation.push(data.occupation);
        } else if (data.gender === 'daughter') {
            step4Data.daughterName.push(data.name);
            step4Data.daughterAge.push(data.age);
            step4Data.daughterOccupation.push(data.occupation);
        }
    }

    if (key.startsWith('sibling-')) {
        if (data.gender === 'brother') {
            step4Data.brotherName.push(data.name);
            step4Data.brotherAge.push(data.age);
            step4Data.brotherOccupation.push(data.occupation);
        } else if (data.gender === 'sister') {
            step4Data.sisterName.push(data.name);
            step4Data.sisterAge.push(data.age);
            step4Data.sisterOccupation.push(data.occupation);
        }
    }

    if (key.startsWith('reference-')) {
        step4Data.referenceName.push(data.name);
        step4Data.referenceOccupation.push(data.occupation);
        step4Data.referenceAddress.push(data.address);
        step4Data.referencePhone.push(data.phone);
    }
}

// Set other values in step4Data
step4Data.referralSource = document.getElementById('referralSource').value;
step4Data.referralContact = document.getElementById('referralContact').value;

    const step5Data = {
        conviction: document.getElementById('conviction').value,
        pendingCases: document.querySelector('.custom-radio-group[data-group="pendingCases"] .selected') ? 
            document.querySelector('.custom-radio-group[data-group="pendingCases"] .selected').getAttribute('data-value') : "",
        willingToRelocate: document.querySelector('.custom-radio-group[data-group="willingToRelocate"] .selected') ? 
            document.querySelector('.custom-radio-group[data-group="willingToRelocate"] .selected').getAttribute('data-value') : "",
        personalityCheck: document.querySelector('.custom-radio-group[data-group="personalityCheck"] .selected') ? 
            document.querySelector('.custom-radio-group[data-group="personalityCheck"] .selected').getAttribute('data-value') : "",
        authenticityCheck: document.querySelector('.custom-radio-group[data-group="authenticityCheck"] .selected') ? 
            document.querySelector('.custom-radio-group[data-group="authenticityCheck"] .selected').getAttribute('data-value') : "",
        reasons: document.getElementById('reasons').value
    };

    const storedImage = sessionStorage.getItem('uploadedImage');
    if (!storedImage) {
        showAlert('No image found in sessionStorage to upload.');
        return;
    }

// After successful form submission
try {
    // Image upload and Firestore save logic
    const storageRef = ref(storage, `/applicantprofile/${step2Data.fullName}/profile.jpg`);
    const response = await fetch(storedImage);
    const blob = await response.blob();
    const snapshot = await uploadBytes(storageRef, blob);

    const imageURL = await getDownloadURL(snapshot.ref);
    jsonData['imageURL'] = imageURL;

    // Save the form data in Firestore
    await addDoc(collection(db, 'applications'), {
        ...step1Data,
        ...step2Data,
        ...step3Data,
        ...step4Data,
        ...step5Data,
        userId: user.uid,
        imageURL: imageURL,
        timestamp: new Date()
    });

    showAlert('Form and image uploaded successfully.');
    sessionStorage.setItem('formSubmitted', 'true');
    document.getElementById('applicationform').reset();
    window.location.href = '../completeform.html';
} catch (error) {
    console.error("Error occurred: ", error);
    showAlert('Error storing form and image. Please try again.');
}

    
}    

// Add event listener to the form
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('applicationform').addEventListener('submit', submitFormData);
});
