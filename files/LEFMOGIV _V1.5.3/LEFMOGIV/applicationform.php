<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LEFMOGIV | Application Form</title>
    <link rel="stylesheet" href="assets/css/applicationform.css">
    <link href="assets/img/Layer 1.png" rel="icon">
    <link href="assets/css/form.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css">
    <script src="https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js" type="module"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js" type="module"></script>
</head>
<body>
        

<div class="form-container">
    <header class="step-indicator-header">
        <div class="step-numbers">
            <div class="step-number-container active" id="stepNumber1">
                <div class="step-number">1</div>
                <div class="step-title">Document No.</div>
            </div>
            <div class="step-number-container inactive" id="stepNumber2">
                <div class="step-number">2</div>
                <div class="step-title">Personal Data</div>
            </div>
            <div class="step-number-container inactive" id="stepNumber3">
                <div class="step-number">3</div>
                <div class="step-title">Educational Attainment</div>
            </div>
            <div class="step-number-container inactive" id="stepNumber4">
                <div class="step-number">4</div>
                <div class="step-title">Family background</div>
            </div>
            <div class="step-number-container inactive" id="stepNumber5">
                <div class="step-number">5</div>
                <div class="step-title">Additional Information</div>
            </div>
        </div>
    </header>
    <main class="form-steps-content">
        <form id="applicationform">
                <div class="form-step" id="step-1"> 
                    <div class="form-content">
                        <div class="instruction">
                            <h3>Instruction</h3>
                            <p>Read Slowly & Carefully Before filling Up</p>
                            <p>Don't leave any blank. Answer all questions</p>
                        </div>

                        <div class="step-1-grid">
                        <div class="upload-section">
                                <h2>Upload Picture</h2>
                                <span class="upload-instruction-image">Upload 2x2 picture</span>
                                <div class="upload-picture">
                                    <div class="image-preview" id="imagePreview">
                                        <img src="" alt="Image Preview" id="uploadedImage" style="display:none;">
                                        <span id="noImageText" style="text-align:center;">Choose file</span>
                                    </div>
                                    <div class="upload-container">

                                    <input type="file" id="picture" name="picture" accept="image/jpeg, image/jpg" onchange="updateImagePreview(event)" style="display:none;">
                                    <button type="button" onclick="document.getElementById('picture').click()" class="upload-btn">Upload</button>

                                    </div>
                                </div>
                                <button type="button" id="removeImageBtn" class="unique-remove-btn" style="display:none;" onclick="removeImage()">Remove</button>
                            </div>
                            <div class="upload-document"></div>
                            <div class="document-section">
                                <h2>Government Identification Numbers</h2>
                                <span class="document-subtitle">Please use a valid government-issued ID number</span>
                                <div class="document-no">
                                        <div class="input-row">
                                            <div class="input-group">
                                                <label for="license-no">License No.<span style="color: red;">*</span></label>
                                                <input type="text" id="license-no" name="licenseNo" 
                                                    oninput="formatInput(this, 'license'); saveInput(this);" 
                                                    maxlength="15" placeholder="Max 15 digits">
                                                <small class="error-message" style="color: red;"></small>
                                            </div>
                                            <div class="input-group">
                                                <label for="phil-health-no">Phil Health No.<span style="color: red;">*</span></label>
                                                <input type="text" id="phil-health-no" name="philHealthNo" 
                                                    oninput="formatInput(this, 'philHealth'); saveInput(this);" 
                                                    maxlength="12" placeholder="12 Digit No.">
                                                <small class="error-message" style="color: red;"></small>
                                            </div>
                                        </div>
                                        <div class="input-row">
                                            <div class="input-group">
                                                <label for="sss-no">SSS No.<span style="color: red;">*</span></label>
                                                <input type="text" id="sss-no" name="sssNo" 
                                                    oninput="formatInput(this, 'sss'); saveInput(this);" 
                                                    maxlength="10" placeholder="10-digit SSS No.">
                                                <small class="error-message" style="color: red;"></small>
                                            </div>
                                            <div class="input-group">
                                                <label for="tin-no">TIN<span style="color: red;">*</span></label>
                                                <input type="text" id="tin-no" name="tin" 
                                                    oninput="formatInput(this, 'tin'); saveInput(this);" 
                                                    maxlength="9" placeholder="9-digit TIN">
                                                <small class="error-message" style="color: red;"></small>
                                            </div>
                                        </div>
                                        <div class="input-row">
                                            <div class="input-group">
                                                <label for="pag-ibig-no">Pag-IBIG No.<span style="color: red;">*</span></label>
                                                <input type="text" id="pag-ibig-no" name="pagIbigNo" 
                                                    oninput="formatInput(this, 'pagIbig'); saveInput(this);" 
                                                    maxlength="12" placeholder="12-digit Pag-IBIG No.">
                                                <small class="error-message" style="color: red;"></small>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>

                    <div class="button-container">
                        <button type="button" class="next-button" onclick="showNextStep()">Next</button>
                    </div>
                </div>


                <div class="form-step" id="step-2" style="display: none;">
                    <div class="form-content">
                        <h2>Personal Data</h2>
                        <div class="personal-data">
                            <div class="step-2-grid">
                                <div class="input-row-step-2">
                                    <div class="input-group-step-2">
                                        <label for="fullName">Last Name, First Name, M.I <span style="color: red;">*</span></label>
                                        <input type="text" id="fullName" name="fullName" oninput="saveInput(this)" placeholder="Enter your full name">
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                    </div>
                                    <div class="input-group-step-2">
                                        <label for="dob">Date of Birth <span>(18 to 40 years old)</span><span style="color: red;">*</span></label>
                                        <input type="date" id="dob" name="dob" oninput="calculateAge(); saveInput(this);" placeholder="Select your date of birth">
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                    </div>
                                    <div class="input-group-step-2">
                                        <label for="age">Age <span style="color: red;">*</span></label>
                                        <input type="text" id="age" name="age" readonly placeholder="Your age will be calculated">
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                    </div>
                                    <div class="input-group-step-2">
                                        <label for="status">Marital Status <span style="color: red;">*</span></label>
                                        <input type="text" id="status" name="status" list="statusOptions" oninput="saveInput(this)" placeholder="Select your marital status">
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                        <datalist id="statusOptions">
                                            <option value="Single">
                                            <option value="Married">
                                            <option value="Divorced">
                                            <option value="Widowed">
                                            <option value="Separated">
                                        </datalist>
                                    </div>
                                </div>
                                <div class="input-row-step-2">
                                    <div class="input-group-step-2">
                                        <label for="presentAddress">Present Address <span style="color: red;">*</span></label>
                                        <input type="text" id="presentAddress" name="presentAddress" oninput="saveInput(this)" placeholder="Enter your complete current address">
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                    </div>
                                    <div class="input-group-step-2">
                                        <label for="citizenship">Citizenship <span style="color: red;">*</span></label>
                                        <input type="text" id="citizenship" name="citizenship" oninput="saveInput(this)" placeholder="Enter your citizenship">
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                    </div>
                                    <div class="input-group-step-2">
                                        <label for="placeOfBirth">Place of Birth<span style="color: red;">*</span></label>
                                        <input type="text" id="placeOfBirth" name="placeOfBirth" oninput="saveInput(this)" placeholder="Enter your place of birth">
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                    </div>
                                    <div class="input-group-step-2">
                                        <label for="religion">Religion <span style="color: red;">*</span></label>
                                        <input type="text" id="religion" name="religion" list="religionOptions" oninput="saveInput(this)" placeholder="Select your religion">
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                        <datalist id="religionOptions">
                                            <option value="Catholic">
                                            <option value="Protestant">
                                            <option value="Islam">
                                            <option value="Iglesia ni Cristo">
                                            <option value="Buddhism">
                                            <option value="Hinduism">
                                            <option value="Atheism">
                                            <option value="Agnosticism">
                                        </datalist>
                                    </div>
                                </div>
                                <div class="input-row-step-2">
                                    <div class="input-group-step-2">
                                    <label for="telNo">Cellphone No. <span style="color: red;">*</span> <span color: gray;"> ex. 09XX-XXX-XXXX</span></label>
                                        <input type="tel" id="telNo" name="telNo" oninput="formatPhoneNumber(this); saveInput(this)" placeholder="Enter your phone number">
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                    </div>
                                    <div class="input-group-step-2">
                                    <label for="dialectsSpoken">Dialect Spoken <span style="color: red;">*</span> <span color: gray;"> ex. tagalog</span></label>
                                        <input type="text" id="dialectsSpoken" name="dialectsSpoken" oninput="saveInput(this)" placeholder="Enter dialects spoken">
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                    </div>
                                    <div class="input-group-step-2">
                                    <label for="hobbies">Hobbies  <span color: gray;">(If none, type N/A)</span></label>
                                        <input type="text" id="hobbies" name="hobbies" oninput="saveInput(this)" placeholder="Enter your hobbies">
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                    </div>
                                    <div class="input-group-step-2">
                                    <label for="birthMarks">Birth Marks  <span color: gray;">(If none, type N/A)</span></label>
                                        <input type="text" id="birthMarks" name="birthMarks" oninput="saveInput(this)" placeholder="Enter any birth marks">
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                    </div>
                                </div>
                                <div class="input-row-step-2">
                                    <div class="input-group-step-2">
                                        <label for="bloodType">Blood Type <span style="color: red;">*</span> </label>
                                        <input type="text" id="bloodType" name="bloodType" list="bloodTypeOptions" oninput="saveInput(this)" placeholder="Select your blood type">
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                        <datalist id="bloodTypeOptions">
                                            <option value="A+">
                                            <option value="A-">
                                            <option value="B+">
                                            <option value="B-">
                                            <option value="AB+">
                                            <option value="AB-">
                                            <option value="O+">
                                            <option value="O-">
                                        </datalist>
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                    </div>
                                    <div class="input-group-step-2">
                                        <label for="height">Height <span style="color: red;">*</span> </label>
                                        <input type="text" id="height" name="height" oninput="formatHeight(this); saveInput(this)" placeholder="Enter height in cm">
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                    </div>
                                    <div class="input-group-step-2">
                                        <label for="weight">Weight <span style="color: red;">*</span> </label>
                                        <input type="text" id="weight" name="weight" oninput="formatWeight(this); saveInput(this)" placeholder="Enter weight in kg">
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                    </div>
                                    <div class="input-group-step-2">
                                        <label for="sports">Sports <span color: gray;">(If none, type N/A)</span></label>
                                        <input type="text" id="sports" name="sports" oninput="saveInput(this)" placeholder="Enter your sports">
                                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="button-container">
                            <button type="button" class="prev-button" onclick="showPrevStep()">Previous</button>
                            <button type="button" class="next-button" onclick="showNextStep()">Next</button>
                        </div>
                    </div>
                </div>


            <div class="form-step" id="step-3" style="display: none;">
                <div class="form-content">
                    <h2>Highest Educational Attainment</h2><br>
                    <div class="highest-education-data">
                        <div class="step-2-grid">
                            <div class="input-field">
                                <label for="schoolName">Name of School<span style="color: red;">*</span></label>
                                <input type="text" id="schoolName" name="schoolName" oninput="saveInput(this)" placeholder="Enter complete school name">
                                <small class="error-message" style="color: red;"></small> <!-- Error message -->
                            </div>
                            <div class="input-field">
                                <label for="schoolAddress">School Address<span style="color: red;">*</span></label>
                                <input type="text" id="schoolAddress" name="schoolAddress" oninput="saveInput(this)" placeholder="Enter complete school address">
                                <small class="error-message" style="color: red;"></small> <!-- Error message -->
                            </div>
                            <div class="input-field">
                                <label for="yearGraduated">Year Graduated<span style="color: red;">*</span></label>
                                <select id="yearGraduated" name="yearGraduated" onchange="saveInput(this)">
                                    <option value="" disabled selected>Select Year</option>
                                    <!-- Generate options for the last 50 years -->
                                    <script>
                                        const currentYear = new Date().getFullYear();
                                        for (let year = currentYear; year >= currentYear - 50; year--) {
                                            document.write(`<option value="${year}">${year}</option>`);
                                        }
                                    </script>
                                </select>
                                <small class="error-message" style="color: red;"></small> <!-- Error message -->
                            </div>
                            <div class="input-field">
                                <label for="extraCurriculum">Extra Curriculum</label><span color: gray;">(If none, type N/A)</span></label>
                                <input type="text" id="extraCurriculum" name="extraCurriculum" oninput="saveInput(this)" placeholder="Enter curriculum details">
                                <small class="error-message" style="color: red;"></small>     
                            </div>
                            <div class="input-field">
                                <label for="militaryTraining">Military / Police and Trainings</label><span color: gray;">(If none, type N/A)</span></label>
                                <input type="text" id="militaryTraining" name="militaryTraining" oninput="saveInput(this)" placeholder="Enter training details">
                                <small class="error-message" style="color: red;"></small> <!-- Error message -->
                            </div>
                            <div class="input-field">
                                <label for="unitLocation">Location of Unit</label><span color: gray;">(If none, type N/A)</span></label>
                                <input type="text" id="unitLocation" name="unitLocation" oninput="saveInput(this)" placeholder="Enter location unit">
                                <small class="error-message" style="color: red;"></small> <!-- Error message -->
                            </div>
                            <div class="input-field">
                                <label for="highestRank">Highest Military & Police Rank</label><span color: gray;">(If none, type N/A)</span></label>
                                <input type="text" id="highestRank" name="highestRank" oninput="saveInput(this)" placeholder="Enter highest rank">
                                <small class="error-message" style="color: red;"></small> <!-- Error message -->
                            </div>
                            <div class="input-field">
                                <label for="awards">Awards and Recommendation</label><span color: gray;">(If none, type N/A)</span></label>
                                <input type="text" id="awards" name="awards" oninput="saveInput(this)" placeholder="Enter Recommendation">
                                <small class="error-message" style="color: red;"></small> <!-- Error message -->
                            </div>
                        </div>
                        <h2 style="margin-bottom: 10px; margin-top: 10px;">Previous Employment</h2>
                        <div class="step-2-grid">
                            <div class="input-field">
                                <label for="previousCompany">Company<span style="color: red;">*</span></label>
                                <input type="text" id="previousCompany" name="previousCompany" oninput="saveInput(this)" placeholder="Enter company details">
                                <small class="error-message" style="color: red;"></small> <!-- Error message -->
                            </div>
                            <div class="input-field">
                                <label for="positionHeld">Position Held<span style="color: red;">*</span></label>
                                <select id="positionHeld" name="positionHeld" onchange="saveInput(this)">
                                    <option value="" disabled selected>Select Position</option>
                                    <option value="1">Security Guard</option>
                                    <option value="2">Security Officer</option>
                                    <option value="3">Security Supervisor</option>
                                    <option value="4">Security Manager</option>
                                    <option value="5">Security Consultant</option>
                                </select>
                                <small class="error-message" style="color: red;"></small> <!-- Error message -->
                            </div>
                            <div class="input-field">
                                <label for="fromDate">From<span style="color: red;">*</span></label>
                                <input type="date" id="fromDate" name="fromDate" oninput="saveInput(this)">
                                <small class="error-message" style="color: red;"></small> <!-- Error message -->
                            </div>
                            <div class="input-field">
                                <label for="toDate">To<span style="color: red;">*</span></label>
                                <input type="date" id="toDate" name="toDate" oninput="saveInput(this)">
                                <small class="error-message" style="color: red;"></small> <!-- Error message -->
                            </div>
                            <div class="input-field">
                                <label for="reasonForLeaving">Reason for Leaving Employment<span style="color: red;">*</span></label>
                                <input type="text" id="reasonForLeaving" name="reasonForLeaving" oninput="saveInput(this)" placeholder="Enter reason for leaving in essay, maximum of 200 words">
                                <small class="error-message" style="color: red;"></small> <!-- Error message -->
                            </div>
                        </div>
                    </div>
                    <div class="button-container">
                        <button type="button" class="prev-button" onclick="showPrevStep()">Previous</button>
                        <button type="button" class="next-button" onclick="showNextStep()">Next</button>
                    </div>
                </div>
            </div>

            <div class="form-step" id="step-4" style="display: none;">
    <div class="form-content">
        <h2>Background Information</h2>
        <div class="highest-education-data">
            <div class="step-2-grid">
                <div class="family-relatives">
                    <h3 style="display: flex; justify-content: space-between; align-items: center;">
                        Family Relatives
                    </h3>
                    <button type="button" class="add-btn small-btn" onclick="addSibling('brother')">Add Brother</button>
                            <button type="button" class="add-btn small-btn" onclick="addSibling('sister')">Add Sister</button>
                    <div class="input-row">
                        <div class="input-field">
                            <label for="fatherName">Father<span style="color: red;">*</span></label>
                            <input type="text" id="fatherName" name="fatherName" oninput="saveInput(this)" placeholder="Enter Father Name">
                            <small class="error-message" style="color: red;"></small> <!-- Error message -->
                        </div>
                        <div class="input-field">
                            <label for="fatherAge">Age<span style="color: red;">*</span></label>
                            <input type="text" id="fatherAge" name="fatherAge" oninput="saveInput(this)" placeholder="Enter age">
                            <small class="error-message" style="color: red;"></small> <!-- Error message -->
                        </div>
                        <div class="input-field">
                            <label for="fatherOccupation">Occupation<span style="color: red;">*</span></label>
                            <input type="text" id="fatherOccupation" name="fatherOccupation" oninput="saveInput(this)" placeholder="Enter occupation">
                            <small class="error-message" style="color: red;"></small> <!-- Error message -->
                        </div>
                    </div>
                    <div class="input-row">
                        <div class="input-field">
                            <label for="motherName">Mother<span style="color: red;">*</span></label>
                            <input type="text" id="motherName" name="motherName" oninput="saveInput(this)" placeholder="Enter Name">
                            <small class="error-message" style="color: red;"></small> <!-- Error message -->
                        </div>
                        <div class="input-field">
                            <label for="motherAge">Age<span style="color: red;">*</span></label>
                            <input type="text" id="motherAge" name="motherAge" oninput="saveInput(this)" placeholder="Enter age">
                            <small class="error-message" style="color: red;"></small> <!-- Error message -->
                        </div>
                        <div class="input-field">
                            <label for="motherOccupation">Occupation<span style="color: red;">*</span></label>
                            <input type="text" id="motherOccupation" name="motherOccupation" oninput="saveInput(this)" placeholder="Enter occupation">
                            <small class="error-message" style="color: red;"></small> <!-- Error message -->
                        </div>
                    </div>
                    <div id="siblingsList"></div> 
                </div>

                <div class="reference-info">
                <h3 style="display: flex; justify-content: space-between; align-items: center;">
                    Spouse Information
                </h3>
                <button type="button" class="add-btn small-btn" onclick="addChild('son')">Add Son</button>
                <button type="button" class="add-btn small-btn" onclick="addChild('daughter')">Add Daughter</button>
                <div class="input-row">
                    <div class="input-field">
                        <label for="spouseName">Spouse Name</label><span color: gray;">(If none, type N/A)</span></label>
                        <input type="text" id="spouseName" name="spouseName" oninput="saveInput(this)" placeholder="Enter name">
                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                    </div>
                    <div class="input-field">
                        <label for="spouseAge">Age</label><span color: gray;">(If none, type N/A)</span></label>
                        <input type="text" id="spouseAge" name="spouseAge" oninput="saveInput(this)" placeholder="Enter age">
                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                    </div>
                    <div class="input-field">
                        <label for="spouseAddress">Address</label><span color: gray;">(If none, type N/A)</span></label>
                        <input type="text" id="spouseAddress" name="spouseAddress" oninput="saveInput(this)" placeholder="Enter address">
                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                    </div>
                </div>
                <div id="childrenList"></div> <!-- Ensure this container is present -->
                </div>
            </div>
            <div class="footer-info">
            <h3 style="display: flex; justify-content: space-between; align-items: center;">
                        Reference Information
                        <span>                  
                              <button type="button" class="add-btn small-btn" onclick="addReference()">Add Reference</button>
                        </span>
                    </h3>
                    <div id="referenceList">
                        <div class="input-row">
                            <div class="input-field">
                                <label for="referenceName-0">Name<span style="color: red;">*</span></label>
                                <input type="text" id="referenceName-0" name="referenceName-0" placeholder="Enter reference name">
                                <small class="error-message" style="color: red;"></small> <!-- Error message -->
                            </div>
                            <div class="input-field">
                                <label for="referenceOccupation-0">Occupation<span style="color: red;">*</span></label>
                                <input type="text" id="referenceOccupation-0" name="referenceOccupation-0">
                                <small class="error-message" style="color: red;"></small> <!-- Error message -->
                            </div>
                            <div class="input-field">
                                <label for="referenceAddress-0">Address<span style="color: red;">*</span></label>
                                <input type="text" id="referenceAddress-0" name="referenceAddress-0">
                                <small class="error-message" style="color: red;"></small> <!-- Error message -->
                            </div>
                            <div class="input-field">
                                <label for="referencePhone-0">Phone Number<span style="color: red;">*</span></label>
                                <input type="text" id="referencePhone-0" oninput="formatPhoneNumber(this);"  name="referencePhone-0" >
                                <small class="error-message" style="color: red;"></small> <!-- Error message -->
                            </div>
                        </div>
                    </div>
            </div>
            <div class="footer-info">
                <h3 class="add-info">Referral Information</h3>
                <div class="input-field">
                    <label for="referralSource">Who referred you to this agency?</label><span color: gray;">(If none, type N/A)</span></label>
                    <input type="text" id="referralSource" name="referralSource" oninput="saveInput(this)" placeholder="Enter referral name">
                    <small class="error-message" style="color: red;"></small> <!-- Error message -->
                </div>
                <div class="input-field">
                    <label for="referralContact">Telephone no</label><span color: gray;">(If none, type N/A)</span></label>
                    <input type="text" id="referralContact" name="referralContact" oninput="saveInput(this)" placeholder="Enter contact no.">
                    <small class="error-message" style="color: red;"></small> <!-- Error message -->
                </div>
            </div>
        </div>
                <div class="button-container">
                    <button type="button" class="prev-button" onclick="showPrevStep()">Previous</button>
                    <button type="button" class="next-button" onclick="showNextStep()">Next</button>
                </div>
            </div>
        </div>

            <div class="form-step" id="step-5" style="display: none;">
                <div class="form-content">
                    <h2>Additional Information</h2>
                    <div class="step-5-grid">
                        
                    <div class="input-group-step-5">
                <label >Do you have pending cases in Military or Civil Court?<span style="color: red;">*</span></label>
                <div class="custom-radio-group" data-group="pendingCases">
                    <div class="custom-radio" data-value="yes" onclick="selectRadio(this)">
                        Yes
                    </div>
                    <div class="custom-radio" data-value="no" onclick="selectRadio(this)">
                        No
                    </div>
                </div>
                <small class="error-message" style="color: red;"></small> <!-- Error message -->
            </div>
            <div class="input-group-step-5">
                <label>Are you willing to be assigned anywhere as the Agency may desire?<span style="color: red;">*</span></label>
                <div class="custom-radio-group" data-group="willingToRelocate">
                    <div class="custom-radio" data-value="yes" onclick="selectRadio(this)">
                        Yes
                    </div>
                    <div class="custom-radio" data-value="no" onclick="selectRadio(this)">
                        No
                    </div>
                </div>
            </div>
            <div class="input-group-step-5">
                <label>Are you willing to submit yourself to a personality and character check?<span style="color: red;">*</span></label>
                <div class="custom-radio-group" data-group="personalityCheck">
                    <div class="custom-radio" data-value="yes" onclick="selectRadio(this)">
                        Yes
                    </div>
                    <div class="custom-radio" data-value="no" onclick="selectRadio(this)">
                        No
                    </div>
                </div>
                <small class="error-message" style="color: red;"></small> <!-- Error message -->
            </div>

            <div class="input-group-step-5">
                <label>Are you willing to authorize this Agency to check the authenticity of all entries?</label>
                <div class="custom-radio-group" data-group="authenticityCheck">
                    <div class="custom-radio" data-value="yes" onclick="selectRadio(this)">
                        Yes
                    </div>
                    <div class="custom-radio" data-value="no" onclick="selectRadio(this)">
                        No
                    </div>
                </div>
                <small class="error-message" style="color: red;"></small> <!-- Error message -->
            </div>
        </div>
        <div class="why-choose-us-title">
            <h3>Why did you choose us</h3>
        </div>
                <div class="input-group-step-5">
                        <label for="conviction">Have you ever been convicted of any crime? If any, state crime.<span style="color: red;">*</span></label>
                        <textarea id="conviction" name="conviction" oninput="saveInput(this)" placeholder="Enter in essay format"></textarea>
                        <small class="error-message" style="color: red;"></small> <!-- Error message -->
                    </div>
                <div class="input-group-step-5-full">
                    <label for="reasons">State in not less than 100 words why you chose this job?<span style="color: red;">*</span></label>
                    <textarea id="reasons" name="reasons" oninput="saveInput(this)" placeholder="Enter in essay format here"></textarea>
                    <small class="error-message" style="color: red;"></small> <!-- Error message -->
                </div>

                <div class="button-container">
                    <button type="button" class="prev-button" onclick="showPrevStep()">Previous</button>
                    <button type="submit" class="next-button" id="submit_button_id">Done</button>
                </div>
                </div>
            </div>
        </form>
    </div>
</div>
</main>
</div>


<div id="emailVerifiedModal" class="email-verified-modal">
    <div class="email-verified-content">
        <div class="email-verified-header">
            <img src="assets/img/mail.png" alt="Success Icon" class="email-verified-icon">
            <h2 class="email-verified-title">Email Verified Successfully!</h2>
        </div>
        <div class="email-verified-announcement">
            <p>You are now authorized to proceed with filling out the form.</p>
        </div>
        <div class="email-verified-columns">
            <!-- Left column: Steps to fill out the form -->
            <div class="email-verified-steps">
                <h3>Steps to Fill Out the Form:</h3>
                <ol>
                    <li>Provide accurate personal information in the required fields.</li>
                    <li>Double-check all your details before submitting the form.</li>
                    <li>Upload a high-quality profile picture.</li>
                    <li>You must be 18 years old or older to apply.</li>
                    <li>Click the "Submit" button once you have completed all fields.</li>
                </ol>
            </div>

            <!-- Right column: Things not to do -->
            <div class="email-verified-not-to-do">
                <h3>Things Not to Do:</h3>
                <ul>
                    <li>Do not use inappropriate language.</li>
                    <li>Do not provide false information.</li>
                    <li>Do not upload a low-quality or misleading profile picture.</li>
                    <li>All entered information must be kept up to date.</li>
                </ul>
            </div>
        </div>

        <div class="email-verified-agreement">
            <div class="checkbox-prompt">
                <strong>Attention:</strong>
                <ul class="checkbox-info">
                    <li>Make sure to read the Terms and Conditions before proceeding.</li>
                    <li>If you think you made a wrong account for registration, <a href="#">click here</a>.</li>
                </ul>
            </div>
        </div>
        <div class="email-verified-actions">
        <button id="closeEmailVerifiedButton">Proceed</button>
        </div>
    </div>
</div>

<div id="applicationConfirmationModal" class="custom-modal confirmation-modal" style="display:none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title">Confirmation</h2>
        </div>
        <p class="instruction-text">Are you sure that you input correct information before you submit? Click OK to continue.</p>
        <div class="modal-actions">
            <button id="confirmApplicationSubmit" class="btn-close">Yes</button> <!-- Yes Button -->
            <button id="cancelApplicationSubmit" class="btn-close">No</button> <!-- No Button -->
        </div>
        <!-- Loading spinner -->
        <div id="loadingSpinner" class="loading-spinner" style="display:none;">
            <div class="spinner"></div>
            <p>Submitting...</p>
        </div>
    </div>
</div>


</body>
<script src="js/form.js" type="module"></script>
    <script src="js/formf.js"></script>
    <script src="js/submit.js" type="module" ></script>
</html>