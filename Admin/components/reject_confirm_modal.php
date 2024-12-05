<div id="rejectConfirmModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-rejectuser">
        <h3 class="modal-title title-reject">Reject Applicant</h3>
        <div class="modal-title-sure">Are you sure you want to reject this applicant?</div>
        <div class="modal-actions">
            <button class="btn btn-cancel" onclick="closeRejectConfirmModal()">Cancel</button>
            <button id="submitRejectRemarksButton" class="btn btn-confirm-reject" onclick="submitRejectConfirmation()">Confirm</button> <!-- Updated onclick -->
        </div>
    </div>
</div>
<div id="rejectSuccessModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-successful-reject">
        <h3 class="modal-title title-reject">Success</h3>
        <div class="modal-title-sure">Applicant has been successfully rejected.</div>
        <div class="modal-actions">
            <button class="btn btn-ok" onclick="closeRejectionSuccessModal()">Close</button>
        </div>
    </div>
</div>
<div id="profileModal" class="applicant-modal" style="display:none;">
    <div class="modal-content-confirmuser">
        <h3 class="modal-title title-approve">Profile Image</h3>
        <div class="modal-body">
            <img id="modalProfileImage" src="" alt="Profile Picture" style="max-width: 100%; height: auto;"/>
        </div>
        <div class="modal-actions">
            <button class="btn btn-confirm" onclick="closeProfileModal()">Close</button>
        </div>
    </div>
</div>