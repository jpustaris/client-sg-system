document.addEventListener('DOMContentLoaded', () => {
    fetchData(); 
});
async function fetchData() {
    try {
        const homeInfoCollection = collection(db, "homeinfo");
        const querySnapshot = await getDocs(homeInfoCollection);
        if (querySnapshot.empty) {
            displayNoData();
            return;
        }
        clearPreview();
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            document.getElementById('titlePreview').innerText = data.homeTitle || "No data text found";
            document.getElementById('aboutUsPreview').innerText = data.aboutUs || "No data text found";
            document.getElementById('locationInfoPreview').innerText = data.locationInfo || "No data text found";
            document.getElementById('faqPreview').innerText = data.faq || "No data text found";
        });
    } catch (error) {
        console.error("Error fetching data: ", error);
        displayNoData();
    }
}

function clearPreview() {
    document.getElementById('titlePreview').innerText = "Loading...";
    document.getElementById('aboutUsPreview').innerText = "Loading...";
    document.getElementById('locationInfoPreview').innerText = "Loading...";
    document.getElementById('faqPreview').innerText = "Loading...";
}

function displayNoData() {
    document.getElementById('titlePreview').innerText = "No data available";
    document.getElementById('aboutUsPreview').innerText = "No data available";
    document.getElementById('locationInfoPreview').innerText = "No data available";
    document.getElementById('faqPreview').innerText = "No data available";
}

function clearText(previewId) {
    const previewBox = document.getElementById(previewId);
    previewBox.innerText = "";
}

function toggleEdit(previewId) {
    const previewBox = document.getElementById(previewId);
    if (previewBox.contentEditable === "true") {
        previewBox.contentEditable = "false"; // Disable editing
        const updatedData = previewBox.innerText;
        saveData(previewId, updatedData);
    } else {
        previewBox.contentEditable = "true"; // Enable editing
        previewBox.focus(); // Focus on the editable box
    }
}

function saveData(previewId, updatedData) {
    const docId = "yourDocumentId";
    const fieldMapping = {
        titlePreview: "homeTitle",
        aboutUsPreview: "aboutUs",
        locationInfoPreview: "locationInfo",
        faqPreview: "faq"
    };

    db.collection("homeinfo").doc(docId).update({
        [fieldMapping[previewId]]: updatedData
    }).then(() => {
        console.log("Data successfully updated!");
    }).catch((error) => {
        console.error("Error updating document: ", error);
    });
}

var modal = document.getElementById("myModal");
var btn = document.getElementById("lefmoButton");
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
