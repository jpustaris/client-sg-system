<?php
session_start(); // Start the session

// Mock login data (replace this with your actual login logic)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? null; // Example: Replace with actual username from login form
    $isAdmin = $_POST['isAdmin'] ?? false; // Example: Replace with actual admin status

    // Example validation
    if ($username && $isAdmin !== null) {
        $_SESSION['username'] = $username; // Store the username in the session
        $_SESSION['isAdmin'] = $isAdmin === 'true'; // Store the isAdmin status in the session
        
        echo json_encode(['success' => true, 'username' => $username, 'isAdmin' => $_SESSION['isAdmin']]);
        exit();
    }
}

// Check if username and isAdmin are set in the session
$response = ['success' => false];

if (isset($_SESSION['username'])) {
    $response['success'] = true;
    $response['username'] = $_SESSION['username'];
    $response['isAdmin'] = isset($_SESSION['isAdmin']) ? $_SESSION['isAdmin'] : false;
}

// Return the response in JSON format
echo json_encode($response);
?>
