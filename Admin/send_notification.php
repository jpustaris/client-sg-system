<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require '../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['email'], $data['subject'], $data['body'])) {
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
        exit;
    }
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'lefmogivcorp@gmail.com'; 
        $mail->Password = 'wetu kvgq dcph poew'; 
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->setFrom('lefmogivcorp@gmail.com', 'LEFMOGIV Support Service');
        $mail->addAddress($data['email']); 
        $mail->isHTML(true);
        $mail->Subject = $data['subject'];
        $mail->Body = $data['body'];

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Notification sent successfully']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => "Mailer Error: {$mail->ErrorInfo}"]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
