<?php
// controllers/admin/answers.php
// GET /api/admin/answers

require_once __DIR__ . '/../../db.php';

header('Content-Type: application/json');

try {
    $conditions = [];
    $params     = [];

    if (!empty($_GET['status'])) {
        $s = strtoupper(trim($_GET['status']));
        if ($s === 'PENDING') {
            $conditions[] = 'v.id IS NULL';
        } else {
            $conditions[] = 'v.status = :status';
            $params[':status'] = $s;
        }
    }

    $limit = '';
    if (!empty($_GET['limit']) && is_numeric($_GET['limit'])) {
        $limit = 'LIMIT ' . (int) $_GET['limit'];
    }

    $where = count($conditions) ? 'WHERE ' . implode(' AND ', $conditions) : '';

    // NOTE: "user" is a reserved word in PostgreSQL — alias must be quoted.
    $sql = "
        SELECT
            a.id                          AS answer_id,
            u.name                        AS \"user\",
            q.text                        AS question,
            a.answer,
            p.file_path                   AS proof,
            COALESCE(v.status, 'PENDING') AS status,
            v.comment,
            a.created_at
        FROM answers a
        JOIN users     u ON u.id = a.user_id
        JOIN questions q ON q.id = a.question_id
        LEFT JOIN proofs      p ON p.answer_id = a.id
        LEFT JOIN validations v ON v.answer_id = a.id
        $where
        ORDER BY a.created_at DESC
        $limit
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch answers', 'detail' => $e->getMessage()]);
}
