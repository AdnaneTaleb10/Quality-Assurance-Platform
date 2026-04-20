<?php
// $pdo and $data are already available from index.php

$data = json_decode(file_get_contents("php://input"), true);

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

$name     = trim($data["name"]);
$email    = trim($data["email"]);
$role_id  = (int) $data["role"];
$password = password_hash($data["password"], PASSWORD_BCRYPT);

try {
    $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);

    if ($check->fetch()) {
        http_response_code(409);
        echo json_encode(["message" => "Email already exists"]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO users (name, email, password, role_id)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([$name, $email, $password, $role_id]);

    http_response_code(201);
    echo json_encode(["message" => "User created successfully"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error", "error" => $e->getMessage()]);
}