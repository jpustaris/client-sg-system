
<div id="applicantModal" class="applicant-modal">
    <div class="modal-content-approveuser">
        <div class="approve-indicator-title-container">
            <h3 class="modal-title title-approve">Approve User</h3>
            <span class="icon-container">
                <i class="bi bi-info-circle icon" data-tooltip="Approve user that do registration process"></i>
            </span>
        </div>
          <div class="modal-body">
              <div class="profile-section">
                  <div class="profile-container-approveuser">
                      <img id="profileImage" src="" alt="Profile Image" class="profile-circle-approve">
                      <div class="applicant-info-approve">
                          <span class="label">Name:</span>
                          <span class="data" id="fullName">N/A</span>
                          <span class="label">Email:</span>
                          <span class="data" id="email">N/A</span>
                          <span class="label">Date Registered:</span>
                          <span class="data" id="dateRegistered">N/A</span>
                      </div>
                  </div>
              </div>
            <div class="remarkstextarea">
                <label for="remarks">Announcement or Instruction</label>
                <textarea class="textarea" id="remarks" placeholder="Enter your announcement"></textarea>
            </div>
        </div>
        <p class="instruction-text-approve">
            <i class="bi bi-exclamation-circle icon-space"></i> By clicking <span style="color: red; font-weight: 600;"> "OK" </span> the applicant will be approved and moved to the next phase of the process.
        </p>
        <div class="modal-actions">
        <button class="btn btn-cancel" onclick="closeApplicantModal()">Cancel</button>
        <button class="btn btn-ok" onclick="openConfirmModal()">Approve</button>
        </div>
    </div>
</div>