document.addEventListener('DOMContentLoaded', function() {
    const isImageUploaded = localStorage.getItem('isImageUploaded');
    if (isImageUploaded === 'true') {
        document.getElementById('imageIcon').style.display = 'none';
    }
});

document.getElementById('imageUpload').addEventListener('change', function() {
    const fileInput = this;
    const uploadedImage = document.getElementById('uploadedImage');
    const uploadText = document.getElementById('uploadText');
    const removeImageButton = document.getElementById('removeImageButton');
    const imageIcon = document.getElementById('imageIcon');

    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const fileType = file.type.toLowerCase();

        if (fileType === 'image/jpeg' || fileType === 'image/png') {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImage.src = e.target.result;
                uploadedImage.style.display = 'block';
                uploadText.style.display = 'none';
                removeImageButton.style.display = 'block';
                imageIcon.style.display = 'none';
                document.getElementById('imagePreviewContainer').style.display = 'block';
                localStorage.setItem('isImageUploaded', 'true');
            };

            reader.readAsDataURL(file);
        } else {
            document.getElementById('filePreview').innerText = file.name;
            document.getElementById('filePreviewContainer').style.display = 'block';
        }
    }
});

document.getElementById('mediaUpload').addEventListener('change', function() {
    const fileInput = this;
    const removeDocumentButton = document.getElementById('removeDocumentButton');

    if (fileInput.files && fileInput.files[0]) {
        removeDocumentButton.style.display = 'block';
    }
});

document.getElementById('removeImageButton').addEventListener('click', function() {
    const uploadedImage = document.getElementById('uploadedImage');
    uploadedImage.src = '#';
    uploadedImage.style.display = 'none';
    document.getElementById('uploadText').style.display = 'block';
    document.getElementById('imageUpload').value = '';
    this.style.display = 'none';
    document.getElementById('imagePreviewContainer').style.display = 'none';
    localStorage.removeItem('isImageUploaded');
});
document.getElementById('removeDocumentButton').addEventListener('click', function() {
    const mediaUpload = document.getElementById('mediaUpload');
    mediaUpload.value = '';
    this.style.display = 'none';
});
document.getElementById('mediaUpload').addEventListener('change', function() {
const fileInput = this;
const removeDocumentButton = document.getElementById('removeDocumentButton');
const itemNameInput = document.getElementById('itemName'); 

if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    const fileName = file.name.replace(/\.[^/.]+$/, ""); 
    removeDocumentButton.style.display = 'block'; 
    itemNameInput.value = fileName; 
}
});