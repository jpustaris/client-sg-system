<?php
// Start session at the beginning of the file
session_start();

// Check if user is logged in
if (!isset($_SESSION['username'])) {
    // Redirect to login page if session not found
    header('Location: ../login.php');
    exit();
}

// Check if user is an admin
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    // If the user is not an admin, redirect to a non-admin page (e.g., home or dashboard)
    header('Location: ../index.php'); // Ensure the path is correct
    exit();
}

// Set userId in sessionStorage or pass it directly to your JavaScript if needed
?>
