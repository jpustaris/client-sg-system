function showApplicantInfo(button) {
    var row = button.closest("tr");
    var profileImageSrc = row.querySelector(".profile-pic").getAttribute("src");
    var name = row.querySelector(".applicant-name").textContent;
    var documentNo = row.querySelector(".document-no").textContent;
  
    document.getElementById("uploadedImage").setAttribute("src", profileImageSrc);
    document.getElementById("applicantName").textContent = name;
    document.getElementById("documentNo").textContent = documentNo;
  }
  
  document.addEventListener("DOMContentLoaded", function () {

    const sidebarToggleBtn = document.querySelector('.toggle-sidebar-btn');
    const sidebar = document.querySelector('#sidebar');
  
    sidebarToggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('active');
    });
  
  });
  