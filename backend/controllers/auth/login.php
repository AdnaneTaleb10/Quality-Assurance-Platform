<?php

// REMOVED session_start() from here

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data["email"]) || empty($data["password"])) {
    http_response_code(400);
    echo json_encode(["message" => "Email and password are required"]);
    exit;
}

$email    = trim($data["email"]);
$password = $data["password"];

try {
    $stmt = $pdo->prepare("
        SELECT u.id, u.name, u.email, u.password, r.name AS role
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.email = ?
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user["password"])) {
        http_response_code(401);
        echo json_encode(["message" => "Invalid email or password"]);
        exit;
    }

    $_SESSION["user"] = [
        "id"    => $user["id"],
        "name"  => $user["name"],
        "email" => $user["email"],
        "role"  => $user["role"],
    ];

    http_response_code(200);
    echo json_encode([
        "message" => "Login successful",
        "user"    => $_SESSION["user"]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error", "error" => $e->getMessage()]);
}