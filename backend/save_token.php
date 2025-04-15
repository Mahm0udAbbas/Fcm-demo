<?php
// CORS headers to allow requests from the frontend (Vite dev server)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Import the config file to use the Firebase server key and DB settings
$config = require_once "config.php";

// Get the JSON data sent from the frontend
$input = json_decode(file_get_contents("php://input"), true);

// Extract user_id and token from the request
$userId = $input["user_id"] ?? null;
$token = $input["token"] ?? null;

// Validate input
if (!$userId || !$token) {
    http_response_code(400);
    echo json_encode(["error" => "Missing user_id or token"]);
    exit();
}

// Connect to the database using PDO
$pdo = new PDO("mysql:host=localhost;dbname=fcm-demo", "root", "");

// Insert or update the FCM token for the given user_id
$stmt = $pdo->prepare("
    INSERT INTO user_fcm_tokens (user_id, fcm_token)
    VALUES (:user_id, :token)
    ON DUPLICATE KEY UPDATE fcm_token = :token
");

$stmt->execute([
    ":user_id" => $userId,
    ":token" => $token
]);

// Return a success message
echo json_encode(["message" => "Token saved successfully"]);
