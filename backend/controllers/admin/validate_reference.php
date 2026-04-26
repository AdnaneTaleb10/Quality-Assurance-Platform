<?php
// controllers/admin/validate_reference.php
// POST /api/admin/references/validate?user_id={id}&reference_id={id}
//
// Bulk approve/reject all answers under a reference for one user.
// Body: { status: "APPROVED"|"REJECTED", comment?: string, revalidate?: bool }
// If revalidate=true, also overrides already-validated answers.
//
// Requires UNIQUE constraint on validations(answer_id):
//   ALTER TABLE validations ADD CONSTRAINT validations_answer_id_key UNIQUE (answer_id);

require_once __DIR__ . '/../../db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$userId      = $_GET['user_id']      ?? null;
$referenceId = $_GET['reference_id'] ?? null;

if (!$userId || !is_numeric($userId) || !$referenceId || !is_numeric($referenceId)) {
    http_response_code(400);
    echo json_encode(['error' => 'user_id and reference_id are required numeric values']);
    exit;
}

$body       = json_decode(file_get_contents('php://input'), true);
$status     = strtoupper(trim($body['status']  ?? ''));
$comment    = trim($body['comment'] ?? '');
$revalidate = !empty($body['revalidate']);

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

session_start();
$adminId = $_SESSION['user_id'] ?? null;
if (!$adminId) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthenticated']);
    exit;
}

try {
    // Select answer ids to process
    if ($revalidate) {
        // Include already-validated answers (will upsert over them)
        $sel = $pdo->prepare("
            SELECT a.id
            FROM answers a
            JOIN questions q ON q.id = a.question_id
            WHERE a.user_id = :uid
              AND q.reference_id = :rid
        ");
    } else {
        // Only pending (no validation row yet)
        $sel = $pdo->prepare("
            SELECT a.id
            FROM answers a
            JOIN questions    q ON q.id         = a.question_id
            LEFT JOIN validations v ON v.answer_id = a.id
            WHERE a.user_id = :uid
              AND q.reference_id = :rid
              AND v.id IS NULL
        ");
    }

    $sel->execute([':uid' => $userId, ':rid' => $referenceId]);
    $ids = array_column($sel->fetchAll(PDO::FETCH_ASSOC), 'id');

    if (empty($ids)) {
        echo json_encode([
            'message' => 'No answers to validate',
            'updated' => 0,
        ]);
        exit;
    }

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        INSERT INTO validations (answer_id, admin_id, status, comment, validated_at)
        VALUES (:answer_id, :admin_id, :status, :comment, NOW())
        ON CONFLICT (answer_id) DO UPDATE SET
            status       = EXCLUDED.status,
            comment      = EXCLUDED.comment,
            admin_id     = EXCLUDED.admin_id,
            validated_at = NOW()
    ");

    foreach ($ids as $aid) {
        $stmt->execute([
            ':answer_id' => (int) $aid,
            ':admin_id'  => $adminId,
            ':status'    => $status,
            ':comment'   => $comment,
        ]);
    }

    $pdo->commit();

    echo json_encode([
        'message' => 'Reference validated',
        'updated' => count($ids),
        'status'  => $status,
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'error'  => 'Failed to validate reference',
        'detail' => $e->getMessage(),
    ]);
}