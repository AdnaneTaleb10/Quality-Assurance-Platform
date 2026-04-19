<?php

header("Content-Type: application/json");

require_once __DIR__ . "/../../config/db.php";

// Lire les données JSON envoyées par React
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier les champs
if (!isset($data["email"]) || !isset($data["password"])) {
    http_response_code(400);
    echo json_encode([
        "message" => "Email and password are required"
    ]);
    exit;
}

$email = $data["email"];
$password = $data["password"];

try {
    // Chercher l'utilisateur
    $stmt = $pdo->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
    $stmt->execute([$email]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Vérifier si user existe
    if (!$user) {
        http_response_code(401);
        echo json_encode([
            "message" => "Invalid credentials"
        ]);
        exit;
    }

    // Vérifier password (hash sécurisé)
    if (!password_verify($password, $user["password"])) {
        http_response_code(401);
        echo json_encode([
            "message" => "Invalid credentials"
        ]);
        exit;
    }

    // SUCCESS LOGIN
    echo json_encode([
        "message" => "Login successful",
        "user" => [
            "id" => $user["id"],
            "name" => $user["name"],
            "email" => $user["email"],
            "role" => $user["role"]
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Server error",
        "error" => $e->getMessage()
    ]);
}