<div id="rejectModal" class="applicant-modal">
    <div class="modal-content-rejecteduser">
        <h1 class="modal-title title-reject">Reject Applicant</h1>
        <p class="instruction-text">
            By clicking "OK," the applicant will be rejected and their status will be updated.
        </p>
        <div class="profile-container-rejectuser">
            <img id="rejectProfileImage" src="" alt="Profile Image" class="profile-circle-reject">
            <div class="applicant-info-reject">
                        <span class="label">Name:</span>
                        <span class="data" id="rejectFullName">N/A</span>
                        <span class="label">Email:</span>
                        <span class="data" id="rejectEmail">N/A</span>
                        <span class="label">Date Registered:</span>
                        <span class="data" id="rejectDateRegistered">N/A</span>
             </div>
        </div>
        <input type="hidden" id="rejectUserId">
        <div class="modal-actions">
            <button class="btn btn-cancel" onclick="closeRejectModal()">Cancel</button>
            <button class="btn btn-confirm-reject" onclick="showRejectConfirmModal()">Reject</button>
        </div>
    </div>
</div>