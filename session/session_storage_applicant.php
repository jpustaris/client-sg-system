<?php
// session_storage_applicant.php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? null; // Get username from POST data
    // Set session variable for applicants
    $_SESSION['username'] = $username; // Store the username in the session
    $_SESSION['isApplicant'] = true; // Set isApplicant to true

    echo json_encode(['success' => true]);
    exit();
}

// If no session data is set
echo json_encode(['success' => false]);

?>
