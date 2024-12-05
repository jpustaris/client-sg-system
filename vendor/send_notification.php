<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require 'autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data (this will work with regular form submissions)
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $email = isset($_POST['email']) ? $_POST['email'] : '';
    $subject = isset($_POST['subject']) ? $_POST['subject'] : '';
    $message = isset($_POST['message']) ? $_POST['message'] : '';
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
        exit;
    }
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'lefmogivcorp@gmail.com'; // Your Gmail address
        $mail->Password = 'wetu kvgq dcph poew'; // Your App Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->setFrom('lefmogivcorp@gmail.com', 'LEFMOGIV Support Service');
        $mail->addAddress('youremail@example.com'); // Replace with your admin email
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = "<p><strong>Name:</strong> $name</p><p><strong>Email:</strong> $email</p><p><strong>Message:</strong> $message</p>";
        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Notification sent successfully']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => "Mailer Error: {$mail->ErrorInfo}"]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
