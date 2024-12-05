function viewApplicant(userId) {
    console.log("Fetching applicant data for user ID:", userId);
    const applicantRef = firebase.firestore().collection('applications');
    applicantRef.where("userId", "==", userId).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    
                    const step1Data = `
                    <h3 class="step-heading">Government Identification Numbers</h3>
                    <div class="two-column-layout">
                        <div class="column left-column">
                            <p class="data-row"><strong>License No:</strong> <span class="data-value">${data.licenseNo || 'N/A'}</span></p>
                            <p class="data-row"><strong>SSS No:</strong> <span class="data-value">${data.sssNo || 'N/A'}</span></p>
                            <p class="data-row"><strong>TIN:</strong> <span class="data-value">${data.tin || 'N/A'}</span></p>
                            <p class="data-row"><strong>PAG-IBIG No:</strong> <span class="data-value">${data.pagIbigNo || 'N/A'}</span></p>
                            <p class="data-row"><strong>PhilHealth No:</strong> <span class="data-value">${data.philHealthNo || 'N/A'}</span></p>
                        </div>
                                            <div class="vertical-divider"></div> <!-- Vertical Line -->
                        <div class="column">
                        </div>
                    </div>
                `;
                
                const step2Data = `
                    <h3 class="step-heading">Personal Data</h3>
                    <div class="two-column-layout">
                        <div class="column left-column">
                            <p class="data-row"><strong>Full Name:</strong> <span class="data-value">${data.fullName || 'N/A'}</span></p>
                            <p class="data-row"><strong>Date of Birth:</strong> <span class="data-value">${data.dob || 'N/A'}</span></p>
                            <p class="data-row"><strong>Place of Birth:</strong> <span class="data-value">${data.placeOfBirth || 'N/A'}</span></p>
                            <p class="data-row"><strong>Hobbies:</strong> <span class="data-value">${data.hobbies || 'N/A'}</span></p>
                            <p class="data-row"><strong>Sports:</strong> <span class="data-value">${data.sports || 'N/A'}</span></p>
                            <p class="data-row"><strong>Birth Marks:</strong> <span class="data-value">${data.birthMarks || 'N/A'}</span></p>
                            <p class="data-row"><strong>Dialects Spoken:</strong> <span class="data-value">${data.dialectsSpoken || 'N/A'}</span></p>
                            <p class="data-row"><strong>Present Address:</strong> <span class="data-value">${data.presentAddress || 'N/A'}</span></p>
                        </div>
                        <div class="vertical-divider"></div> <!-- Vertical Line -->
                        <div class="column">
                            <p class="data-row"><strong>Age:</strong> <span class="data-value">${data.age || 'N/A'}</span></p>
                            <p class="data-row"><strong>Height:</strong> <span class="data-value">${data.height || 'N/A'}</span></p>
                            <p class="data-row"><strong>Weight:</strong> <span class="data-value">${data.weight || 'N/A'}</span></p>
                            <p class="data-row"><strong>Blood Type:</strong> <span class="data-value">${data.bloodType || 'N/A'}</span></p>
                            <p class="data-row"><strong>Citizenship:</strong> <span class="data-value">${data.citizenship || 'N/A'}</span></p>
                            <p class="data-row"><strong>Religion:</strong> <span class="data-value">${data.religion || 'N/A'}</span></p>
                            <p class="data-row"><strong>Status:</strong> <span class="data-value">${data.status || 'N/A'}</span></p>
                            <p class="data-row"><strong>Telephone No:</strong> <span class="data-value">${data.telNo || 'N/A'}</span></p>
                        </div>
                    </div>
                `;
                
                const step3Data = `
                    <h3 class="step-heading">Educational & Employment Background</h3>
                    <div class="two-column-layout">
                        <div class="column left-column">
                            <p class="data-row-title"><strong>High Educational Attainment</strong></p>
                            <p class="data-row"><strong>School Name:</strong> <span class="data-value">${data.schoolName || 'N/A'}</span></p>
                            <p class="data-row"><strong>School Address:</strong> <span class="data-value">${data.schoolAddress || 'N/A'}</span></p>
                            <p class="data-row"><strong>Year Graduated:</strong> <span class="data-value">${data.yearGraduated || 'N/A'}</span></p>
                            <p class="data-row"><strong>Extra Curriculum:</strong> <span class="data-value">${data.extraCurriculum || 'N/A'}</span></p>
                            <p class="data-row"><strong>Military Training:</strong> <span class="data-value">${data.militaryTraining || 'N/A'}</span></p>
                            <p class="data-row"><strong>Unit Location:</strong> <span class="data-value">${data.unitLocation || 'N/A'}</span></p>
                            <p class="data-row"><strong>Highest Rank:</strong> <span class="data-value">${data.highestRank || 'N/A'}</span></p>
                            <p class="data-row"><strong>Awards:</strong> <span class="data-value">${data.awards || 'N/A'}</span></p>
                        </div>
                         <div class="vertical-divider"></div> <!-- Vertical Line -->
                        <div class="column">
                            <p class="data-row-title"><strong>Previous Employment</strong></p>
                            <p class="data-row"><strong>Previous Company:</strong> <span class="data-value">${data.previousCompany || 'N/A'}</span></p>
                            <p class="data-row"><strong>Position Held:</strong> <span class="data-value">${data.positionHeld || 'N/A'}</span></p>
                            <p class="data-row"><strong>From Date:</strong> <span class="data-value">${data.fromDate || 'N/A'}</span></p>
                            <p class="data-row"><strong>To Date:</strong> <span class="data-value">${data.toDate || 'N/A'}</span></p>
                            <p class="data-row"><strong>Reason for Leaving:</strong> <span class="data-value">${data.reasonForLeaving || 'N/A'}</span></p>
                        </div>
                    </div>
                `;
                
                const step4Data = `
                <h3 class="step-heading">Family Background & References</h3>
                <div class="two-column-layout">
                    <div class="column left-column">
                        <p class="data-row-title"><strong>Parents Background</strong></p>
                        <p class="data-row"><strong>Father's Name:</strong> <span class="data-value">${data.fatherName || 'N/A'}</span></p>
                        <p class="data-row"><strong>Father's Age:</strong> <span class="data-value">${data.fatherAge || 'N/A'}</span></p>
                        <p class="data-row"><strong>Father's Occupation:</strong> <span class="data-value">${data.fatherOccupation || 'N/A'}</span></p>
                        <p class="data-row"><strong>Mother's Name:</strong> <span class="data-value">${data.motherName || 'N/A'}</span></p>
                        <p class="data-row"><strong>Mother's Age:</strong> <span class="data-value">${data.motherAge || 'N/A'}</span></p>
                        <p class="data-row"><strong>Mother's Occupation:</strong> <span class="data-value">${data.motherOccupation || 'N/A'}</span></p>
                    </div>
                    
                    <div class="vertical-divider"></div> <!-- Vertical Line -->
                    
                    <div class="column">
                        <p class="data-row-title"><strong>Family Background</strong></p>
                        <p class="data-row"><strong>Spouse Name:</strong> <span class="data-value">${data.spouseName || 'N/A'}</span></p>
                        <p class="data-row"><strong>Spouse Age:</strong> <span class="data-value">${data.spouseAge || 'N/A'}</span></p>
                        <p class="data-row"><strong>Spouse Address:</strong> <span class="data-value">${data.spouseAddress || 'N/A'}</span></p>
                        
                        ${(data.sonName || []).map((name, index) => `
                            <p class="data-row"><strong>Son's Name:</strong> <span class="data-value">${name || 'N/A'}</span></p>
                            <p class="data-row"><strong>Son's Age:</strong> <span class="data-value">${(data.sonAge || [])[index] || 'N/A'}</span></p>
                            <p class="data-row"><strong>Son's Occupation:</strong> <span class="data-value">${(data.sonOccupation || [])[index] || 'N/A'}</span></p>
                        `).join('')}
                        
                        ${(data.daughterName || []).map((name, index) => `
                            <p class="data-row"><strong>Daughter's Name:</strong> <span class="data-value">${name || 'N/A'}</span></p>
                            <p class="data-row"><strong>Daughter's Age:</strong> <span class="data-value">${(data.daughterAge || [])[index] || 'N/A'}</span></p>
                            <p class="data-row"><strong>Daughter's Occupation:</strong> <span class="data-value">${(data.daughterOccupation || [])[index] || 'N/A'}</span></p>
                        `).join('')}
                        
                        ${(data.siblingName || []).map((name, index) => `
                            <p class="data-row"><strong>Sibling's Name:</strong> <span class="data-value">${name || 'N/A'}</span></p>
                            <p class="data-row"><strong>Sibling's Age:</strong> <span class="data-value">${(data.siblingAge || [])[index] || 'N/A'}</span></p>
                            <p class="data-row"><strong>Sibling's Occupation:</strong> <span class="data-value">${(data.siblingOccupation || [])[index] || 'N/A'}</span></p>
                        `).join('')}
                    </div>
                </div>
                
                <div class="two-column-layout">
                    <div class="column left-column">
                        <p class="data-row-title"><strong>Reference Information</strong></p>
                        
                        ${(data.referenceName || []).map((name, index) => `
                            <p class="data-row"><strong>Reference Name:</strong> <span class="data-value">${name || 'N/A'}</span></p>
                            <p class="data-row"><strong>Reference Occupation:</strong> <span class="data-value">${(data.referenceOccupation || [])[index] || 'N/A'}</span></p>
                            <p class="data-row"><strong>Reference Address:</strong> <span class="data-value">${(data.referenceAddress || [])[index] || 'N/A'}</span></p>
                            <p class="data-row"><strong>Reference Phone:</strong> <span class="data-value">${(data.referencePhone || [])[index] || 'N/A'}</span></p>
                        `).join('')}
                    </div>
                    
                    <div class="vertical-divider"></div> <!-- Vertical Line -->
                    
                    <div class="column">
                        <p class="data-row-title"><strong>Referral Information</strong></p>
                        <p class="data-row"><strong>Referral Source:</strong> <span class="data-value">${data.referralSource || 'N/A'}</span></p>
                        <p class="data-row"><strong>Referral Contact:</strong> <span class="data-value">${data.referralContact || 'N/A'}</span></p>
                    </div>
                </div>
            `;
            
            
                
                const step5Data = `
                    <h3 class="step-heading">Additional Information</h3>
                    <div class="two-column-layout">
                        <div class="column left-column">
                            <p class="data-row"><strong>Conviction:</strong> <span class="data-value">${data.conviction || 'N/A'}</span></p>
                            <p class="data-row"><strong>Pending Cases:</strong> <span class="data-value">${data.pendingCases || 'N/A'}</span></p>
                            <p class="data-row"><strong>Willing to Relocate:</strong> <span class="data-value">${data.willingToRelocate || 'N/A'}</span></p>
                        </div>
                                            <div class="vertical-divider"></div> <!-- Vertical Line -->

                        <div class="column">
                            <p class="data-row"><strong>Personality Check:</strong> <span class="data-value">${data.personalityCheck || 'N/A'}</span></p>
                            <p class="data-row"><strong>Authenticity Check:</strong> <span class="data-value">${data.authenticityCheck || 'N/A'}</span></p>
                            <p class="data-row"><strong>Reasons:</strong> <span class="data-value">${data.reasons || 'N/A'}</span></p>
                        </div>
                    </div>
                `;
                
    
                
                
                
                

                    // Populate step content into modal
                    document.getElementById('step1').innerHTML = step1Data;
                    document.getElementById('step2').innerHTML = step2Data;
                    document.getElementById('step3').innerHTML = step3Data;
                    document.getElementById('step4').innerHTML = step4Data;
                    document.getElementById('step5').innerHTML = step5Data;

                    // Initialize modal at step 1
                    openViewModal(1);
                });
            }
        })
        .catch((error) => {
            console.error("Error fetching applicant data:", error);
        });
}

// Initialize current step
let currentStep = 1; 
function openViewModal(step) {
    const modal = document.getElementById('viewModal');
    modal.style.display = 'block';
    currentStep = step;
    const steps = document.querySelectorAll('.modal-step');
    steps.forEach(stepContent => stepContent.style.display = 'none');

    const currentStepContent = document.getElementById('step' + step);
    if (currentStepContent) {
        currentStepContent.style.display = 'block';
    } else {
        console.error(`Error: Step ${step} content not found.`);
        return;
    }

    updateStepIndicators();

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.style.display = (step === 1) ? 'none' : 'inline'; // Hide if step is 1
    nextBtn.style.display = (step === steps.length) ? 'none' : 'inline'; // Hide if last step
    fetchDataForStep(step);
}

function updateStepIndicators() {
    const indicators = document.querySelectorAll('.step-indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index + 1 === currentStep) {
            indicator.classList.add('active');
        }
    });
}

function fetchDataForStep(step) {
   
}

function nextStep() {
    if (currentStep < document.querySelectorAll('.modal-step').length) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function showStep(step) {
    document.querySelectorAll('.modal-step').forEach((stepDiv, index) => {
        stepDiv.style.display = (index + 1 === step) ? 'block' : 'none';
    });
    updateStepIndicators(); 
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.style.display = (step === 1) ? 'none' : 'inline';
    nextBtn.style.display = (step === document.querySelectorAll('.modal-step').length) ? 'none' : 'inline';
}
function closeViewModal() {
    const modal = document.getElementById('viewModal');
    modal.style.display = 'none';
    currentStep = 1; 
}
