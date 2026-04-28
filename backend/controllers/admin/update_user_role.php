<?php

require_once __DIR__ . '/../../db.php';

header('Content-Type: application/json');

$userId = (int) ($_GET['user_id'] ?? 0);
if (!$userId) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid user id']);
    exit;
}

$body   = json_decode(file_get_contents('php://input'), true);
$roleId = (int) ($body['role_id'] ?? 0);

if (!$roleId) {
    http_response_code(400);
    echo json_encode(['error' => 'role_id is required']);
    exit;
}

try {
    // Verify role exists
    $check = $pdo->prepare("SELECT id FROM roles WHERE id = :id");
    $check->execute([':id' => $roleId]);
    if (!$check->fetch()) {
        http_response_code(404);
        echo json_encode(['error' => 'Role not found']);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE users SET role_id = :role_id WHERE id = :id");
    $stmt->execute([':role_id' => $roleId, ':id' => $userId]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        exit;
    }

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update role', 'detail' => $e->getMessage()]);
}