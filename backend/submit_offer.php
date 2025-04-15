<?php
// Enable CORS
header("Access-Control-Allow-Origin: http://localhost:5173");  // Adjust with your React app URL
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
$config = require_once 'config.php';

// Read JSON data from the request body
$data = json_decode(file_get_contents('php://input'), true);

// Extract the incoming data
$technician_id = $data['technician_id'];
$user_id = $data['user_id'];
$offer_details = $data['offer_details'];

// Connect to the database
try {
    $pdo = new PDO("mysql:host=localhost;dbname=fcm-demo", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch the token for the user from the database (use 'fcm_token' instead of 'token')
    $stmt = $pdo->prepare("SELECT fcm_token FROM user_fcm_tokens WHERE user_id = :user_id LIMIT 1");
    $stmt->execute(['user_id' => $user_id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        $user_token = $row['fcm_token'];  // Use 'fcm_token' instead of 'token'

        // Prepare the notification data
        $notification_data = [
            'to' => $user_token,
            'notification' => [
                'title' => '🎉 New Offer',
                'body' => $offer_details,
                'icon' => '/icon.png'
            ]
        ];

        // Send the notification via Firebase Cloud Messaging
        $fcm_server_key = $config['fcm_server_key'];  // FCM server key from config.php

        // Initialize cURL session
        $ch = curl_init();

        // Set cURL options
        curl_setopt($ch, CURLOPT_URL, "https://fcm.googleapis.com/fcm/send");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: key=$fcm_server_key",
            "Content-Type: application/json"
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($notification_data));

        // Execute the cURL session
        $result = curl_exec($ch);

        // Check if the request was successful
        if ($result === false) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to send notification. cURL error: ' . curl_error($ch)
            ]);
        } else {
            echo json_encode([
                'status' => 'success',
                'message' => 'Offer sent and notification triggered.',
                'response' => $result
            ]);
        }

        // Close the cURL session
        curl_close($ch);

    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'User fcm_token not found.'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
