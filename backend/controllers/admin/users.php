<?php
// controllers/admin/users.php
// GET /api/admin/users?search={optional}
//
// users table columns: id, name, email, password, role_id
// (no created_at, no role — role comes from JOIN roles)

require_once __DIR__ . '/../../db.php';

try {
    $whereClause = '';
    $params      = [];

    if (!empty($_GET['search'])) {
        $whereClause = 'WHERE u.name ILIKE :search OR u.email ILIKE :search';
        $params[':search'] = '%' . trim($_GET['search']) . '%';
    }

    $sql = "
        SELECT
            u.id,
            u.name,
            u.email,
            COALESCE(r.name, 'USER')                          AS role,
            COUNT(a.id)                                       AS total_answers,
            COUNT(CASE
                WHEN v.id IS NULL OR v.status = 'PENDING'
                THEN 1 END)                                   AS pending_count,
            COUNT(CASE WHEN v.status = 'APPROVED' THEN 1 END) AS approved_count,
            COUNT(CASE WHEN v.status = 'REJECTED' THEN 1 END) AS rejected_count,
            MAX(a.created_at)                                 AS last_submission
        FROM users u
        LEFT JOIN roles       r ON r.id        = u.role_id
        LEFT JOIN answers     a ON a.user_id   = u.id
        LEFT JOIN validations v ON v.answer_id = a.id
        $whereClause
        GROUP BY u.id, u.name, u.email, r.name
        ORDER BY MAX(a.created_at) DESC NULLS LAST, u.name ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($rows as &$r) {
        $r['joined_at']      = null;   // column doesn't exist in this schema
        $r['total_answers']  = (int) $r['total_answers'];
        $r['pending_count']  = (int) $r['pending_count'];
        $r['approved_count'] = (int) $r['approved_count'];
        $r['rejected_count'] = (int) $r['rejected_count'];
    }
    unset($r);

    echo json_encode($rows);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error'  => 'Failed to fetch users',
        'detail' => $e->getMessage(),
    ]);
}