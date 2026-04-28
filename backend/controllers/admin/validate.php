<?php

require_once __DIR__ . '/../../db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$body     = json_decode(file_get_contents('php://input'), true);
$answerId = $body['answer_id'] ?? null;
$status   = strtoupper(trim($body['status'] ?? ''));
$comment  = trim($body['comment'] ?? '');

if (!$answerId || !is_numeric($answerId)) {
    http_response_code(400);
    echo json_encode(['error' => 'answer_id is required']);
    exit;
}

if (!in_array($status, ['APPROVED', 'REJECTED'], true)) {
    http_response_code(400);
    echo json_encode(['error' => 'status must be APPROVED or REJECTED']);
    exit;
}

if ($status === 'REJECTED' && $comment === '') {
    http_response_code(400);
    echo json_encode(['error' => 'comment is required when rejecting']);
    exit;
}

try {
    $check = $pdo->prepare("SELECT id FROM answers WHERE id = :id");
    $check->execute([':id' => $answerId]);
    if (!$check->fetch()) {
        http_response_code(404);
        echo json_encode(['error' => 'Answer not found']);
        exit;
    }

    // PostgreSQL UPSERT (requires UNIQUE constraint on validations.answer_id)
    $adminId = $_SESSION['user_id'] ?? 1;

    $stmt = $pdo->prepare("
        INSERT INTO validations (answer_id, admin_id, status, comment, validated_at)
        VALUES (:answer_id, :admin_id, :status, :comment, NOW())
        ON CONFLICT (answer_id) DO UPDATE SET
            status       = EXCLUDED.status,
            comment      = EXCLUDED.comment,
            admin_id     = EXCLUDED.admin_id,
            validated_at = NOW()
    ");

    $stmt->execute([
        ':answer_id' => $answerId,
        ':admin_id'  => $adminId,
        ':status'    => $status,
        ':comment'   => $comment,
    ]);

    echo json_encode(['message' => 'Validation updated', 'status' => $status]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update validation', 'detail' => $e->getMessage()]);
}