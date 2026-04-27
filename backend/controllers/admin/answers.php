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

    // No JOIN on proofs — correlated subquery keeps exactly one row per answer.
    $sql = "
        SELECT
            a.id                          AS answer_id,
            a.user_id,
            u.name                        AS \"user\",
            q.text                        AS question,
            a.answer,
            (
                SELECT json_agg(p.file_path ORDER BY p.id)
                FROM proofs p
                WHERE p.answer_id = a.id
            )                             AS proofs,
            COALESCE(v.status, 'PENDING') AS status,
            v.comment,
            a.created_at
        FROM answers a
        JOIN users        u ON u.id        = a.user_id
        JOIN questions    q ON q.id        = a.question_id
        LEFT JOIN validations v ON v.answer_id = a.id
        $where
        ORDER BY a.created_at DESC
        $limit
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // json_agg returns a JSON string from PostgreSQL — decode it into a PHP array.
    // If no proofs exist, json_agg returns NULL.
    foreach ($rows as &$row) {
        $raw           = $row['proofs'];
        $paths         = ($raw !== null) ? json_decode($raw, true) : [];
        $row['proofs'] = is_array($paths) ? $paths : [];
        $row['proof']  = $row['proofs'][0] ?? null;
    }
    unset($row);

    echo json_encode(array_values($rows));

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch answers', 'detail' => $e->getMessage()]);
}