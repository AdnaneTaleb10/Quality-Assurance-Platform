<?php
// controllers/admin/validate.php
// POST /api/admin/validate

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

if (!in_array($status, ['APPROVED', 'REJECTED'])) {
    http_response_code(400);
    echo json_encode(['error' => 'status must be APPROVED or REJECTED']);
    exit;
}

try {
    // Check answer exists
    $check = $pdo->prepare("SELECT id FROM answers WHERE id = :id");
    $check->execute([':id' => $answerId]);
    if (!$check->fetch()) {
        http_response_code(404);
        echo json_encode(['error' => 'Answer not found']);
        exit;
    }

    // Upsert into validations table (insert or update if already reviewed)
    $stmt = $pdo->prepare("
        INSERT INTO validations (answer_id, admin_id, status, comment, validated_at)
        VALUES (:answer_id, :admin_id, :status, :comment, NOW())
        ON DUPLICATE KEY UPDATE
            status       = VALUES(status),
            comment      = VALUES(comment),
            validated_at = NOW()
    ");

    // TODO: replace hardcoded 1 with the session's authenticated admin id
    $stmt->execute([
        ':answer_id' => $answerId,
        ':admin_id'  => 1,
        ':status'    => $status,
        ':comment'   => $comment,
    ]);

    echo json_encode(['message' => 'Validation updated']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update validation']);
}