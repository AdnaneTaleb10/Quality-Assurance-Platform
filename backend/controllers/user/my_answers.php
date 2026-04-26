<?php

$userId = $_SESSION['user']['id'] ?? null;
if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthenticated']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT
            a.id                AS answer_id,
            a.answer            AS answer,
            a.created_at        AS submitted_at,

            q.code              AS question_code,
            q.text              AS question_text,

            rt.code             AS reference_code,

            COUNT(p.id)         AS proofs_count,

            COALESCE(v.status, 'PENDING') AS validation_status,
            v.comment           AS rejection_comment

        FROM answers a
        JOIN questions        q  ON q.id  = a.question_id
        JOIN references_table rt ON rt.id = q.reference_id
        LEFT JOIN proofs       p  ON p.answer_id = a.id
        LEFT JOIN validations  v  ON v.answer_id = a.id
        WHERE a.user_id = :uid
        GROUP BY
            a.id, a.answer, a.created_at,
            q.code, q.text,
            rt.code,
            v.status, v.comment
        ORDER BY a.created_at DESC
    ");

    $stmt->execute([':uid' => $userId]);
    $answers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($answers as &$row) {
        $row['answer_id']    = (int) $row['answer_id'];
        $row['proofs_count'] = (int) $row['proofs_count'];
    }
    unset($row);

    echo json_encode(['answers' => $answers]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load answers', 'detail' => $e->getMessage()]);
}