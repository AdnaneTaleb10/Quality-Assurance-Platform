<?php

// ======================
// MUST BE FIRST (NO OUTPUT BEFORE)
// ======================
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// ======================
// HANDLE CORS PRE-FLIGHT
// ======================
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ======================
// DATABASE (IMPORTANT: no output inside db.php)
// ======================
require_once __DIR__ . "/../../config/db.php";

// ======================
// READ INPUT SAFELY
// ======================
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

// DEBUG (remove later if needed)
// if (!$data) { var_dump($raw); exit; }

// ======================
// VALIDATION
// ======================
if (
    empty($data["name"]) ||
    empty($data["email"]) ||
    empty($data["password"]) ||
    empty($data["role"])
) {
    http_response_code(400);
    echo json_encode(["message" => "All fields are required"]);
    exit;
}

// ======================
// CLEAN DATA
// ======================
$name = trim($data["name"]);
$email = trim($data["email"]);
$role = trim($data["role"]);
$password = password_hash($data["password"], PASSWORD_BCRYPT);

try {

    // CHECK EMAIL
    $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);

    if ($check->fetch()) {
        http_response_code(409);
        echo json_encode(["message" => "Email already exists"]);
        exit;
    }

    // INSERT USER
    $stmt = $pdo->prepare("
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
    ");

    $stmt->execute([$name, $email, $password, $role]);

    echo json_encode([
        "message" => "User created successfully"
    ]);

} catch (Exception $e) {

    http_response_code(500);
    echo json_encode([
        "message" => "Server error",
        "error" => $e->getMessage()
    ]);
}