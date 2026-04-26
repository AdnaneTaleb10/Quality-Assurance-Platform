<?php
// controllers/admin/review_answer.php
// Called by: POST /api/admin/answers/{answerId}/review
// Router sets $_GET['answer_id'] from the URL segment.
// Body (JSON): { status: "APPROVED"|"REJECTED", comment?: string }

// session_start() is already called in index.php

$answerId = isset($_GET['answer_id']) ? (int) $_GET['answer_id'] : 0;

if ($answerId <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'answerId is required and must be a positive integer']);
    exit;
}

$body    = json_decode(file_get_contents('php://input'), true) ?? [];
$status  = strtoupper(trim($body['status']  ?? ''));
$comment = trim($body['comment'] ?? '');

if (!in_array($status, ['APPROVED', 'REJECTED'], true)) {
    http_response_code(400);
    echo json_encode(['error' => 'status must be APPROVED or REJECTED']);
    exit;
}

if ($status === 'REJECTED' && strlen($comment) < 3) {
    http_response_code(400);
    echo json_encode(['error' => 'A rejection reason of at least 3 characters is required']);
    exit;
}

$adminId = $_SESSION['user']['id'] ?? null;

if (!$adminId) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthenticated']);
    exit;
}

try {
    // Verify answer exists
    $check = $pdo->prepare("SELECT id FROM answers WHERE id = :id");
    $check->execute([':id' => $answerId]);
    if (!$check->fetch()) {
        http_response_code(404);
        echo json_encode(['error' => 'Answer not found']);
        exit;
    }

    // Upsert — uses the UNIQUE constraint on validations(answer_id)
    // Neon is Postgres so ON CONFLICT works perfectly
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
        ':comment'   => $comment ?: null,
    ]);

    http_response_code(200);
    echo json_encode([
        'message'   => 'Answer ' . strtolower($status),
        'answer_id' => $answerId,
        'status'    => $status,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error'  => 'Failed to review answer',
        'detail' => $e->getMessage(),
    ]);
}