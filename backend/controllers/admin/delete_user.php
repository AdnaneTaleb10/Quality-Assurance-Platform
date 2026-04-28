<?php

require_once __DIR__ . '/../../db.php';

header('Content-Type: application/json');

$userId = (int) ($_GET['user_id'] ?? 0);
if (!$userId) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid user id']);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Delete validations that reference this user's answers
    $pdo->prepare("
        DELETE FROM validations
        WHERE answer_id IN (SELECT id FROM answers WHERE user_id = :uid)
    ")->execute([':uid' => $userId]);

    // 2. Delete proofs that reference this user's answers
    $pdo->prepare("
        DELETE FROM proofs
        WHERE answer_id IN (SELECT id FROM answers WHERE user_id = :uid)
    ")->execute([':uid' => $userId]);

    // 3. Delete the user's answers
    $pdo->prepare("DELETE FROM answers WHERE user_id = :uid")
        ->execute([':uid' => $userId]);

    // 4. Finally delete the user
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = :uid");
    $stmt->execute([':uid' => $userId]);

    if ($stmt->rowCount() === 0) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        exit;
    }

    $pdo->commit();
    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete user', 'detail' => $e->getMessage()]);
}