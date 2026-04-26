<?php
// controllers/evaluation/next_question.php
// GET /api/evaluation/next
// Returns the first unanswered question ID for the logged-in user's role.
// Fast single query — no subquery nesting, uses LEFT JOIN anti-pattern.

$userId   = $_SESSION['user']['id']   ?? null;
$userRole = $_SESSION['user']['role'] ?? null;

if (!$userId || !$userRole) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthenticated']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT q.id AS next_id
        FROM questions      q
        JOIN question_roles qr ON qr.question_id = q.id
        JOIN roles          r  ON r.id = qr.role_id AND r.name = :role
        LEFT JOIN answers   a  ON a.question_id = q.id AND a.user_id = :uid
        WHERE a.id IS NULL
        ORDER BY q.id ASC
        LIMIT 1
    ");
    $stmt->execute([':role' => $userRole, ':uid' => $userId]);
    $row = $stmt->fetch();

    echo json_encode(['next_question_id' => $row ? (int) $row['next_id'] : null]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed', 'detail' => $e->getMessage()]);
}