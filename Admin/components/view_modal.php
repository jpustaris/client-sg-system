
<div id="viewModal" class="unique-view-applicant-modal">
    <div class="unique-view-modal-content">
    <div class="unique-view-modal-header">
        <img src="../assets/img/Layer 1.png" alt="Logo" class="logo-image unique-logo">
        <div class="header-text">
            <h1 class="unique-view-modal-title">Applicant Information Form</h1>
            <div class="unique-view-modal-details">Details of the information provided during registration.
            </div>
        </div>
    </div>
        <div class="step-indicator-title-container">
            <h3 class="step-indicator-title">View / Application Form Details</h3>
            <span class="icon-container">
                <i class="bi bi-info-circle icon" data-tooltip="Application form data has been retrieved from user's registration process, including the correct steps."></i>
            </span>
        </div>
        <div class="two-column-layout-all">
            <div class="step-indicators">
                <h4 class="step-indicator-title-1">Form Steps</h4> 
                <div id="stepIndicator1" class="step-indicator">STEP 1</div>
                <div id="stepIndicator2" class="step-indicator">STEP 2</div>
                <div id="stepIndicator3" class="step-indicator">STEP 3</div>
                <div id="stepIndicator4" class="step-indicator">STEP 4</div>
                <div id="stepIndicator5" class="step-indicator">STEP 5</div>
                <div class="unique-view-modal-actions">
                    <button id="prevBtn" class="prev-button" onclick="prevStep()">Previous</button>
                    <button id="nextBtn" class="next-button" onclick="nextStep()">Next</button>
                </div>
            </div>
            <div class="unique-view-modal-body">
                <div id="step1" class="unique-view-modal-step modal-step">Step 1 Content</div>
                <div id="step2" class="unique-view-modal-step modal-step">Step 2 Content</div>
                <div id="step3" class="unique-view-modal-step modal-step">Step 3 Content</div>
                <div id="step4" class="unique-view-modal-step modal-step">Step 4 Content</div>
                <div id="step5" class="unique-view-modal-step modal-step">Step 5 Content</div>
            </div>
        </div>
        <div class="unique-view-modal-close">
            <button class="cancel-button" onclick="closeViewModal()">Close</button>
        </div>
    </div>
</div>