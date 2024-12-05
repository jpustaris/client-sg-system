<?php
// Start session at the beginning of the file
session_start();

// Check if user is logged in
if (!isset($_SESSION['username'])) {
    // Redirect to login page if session not found
    header('Location: ../login.php');
    exit();
}

// Check if user is an applicant
if (!isset($_SESSION['isApplicant']) || $_SESSION['isApplicant'] !== true) {
    // If the user is not an applicant, redirect to a non-applicant page (e.g., home or dashboard)
    header('Location: ../index.php'); // Ensure the path is correct
    exit();
}
?>
