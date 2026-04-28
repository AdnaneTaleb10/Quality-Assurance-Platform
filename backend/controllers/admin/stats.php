<?php

require_once __DIR__ . '/../../db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // Single query for all counts to avoid multiple round-trips
    $row = $pdo->query("
        SELECT
            COUNT(a.id)                                                        AS total_answers,
            COUNT(CASE WHEN v.status = 'APPROVED' THEN 1 END)                  AS approved_answers,
            COUNT(CASE WHEN v.status = 'REJECTED' THEN 1 END)                  AS rejected_answers,
            COUNT(CASE WHEN v.id IS NULL           THEN 1 END)                  AS pending_validations,
            COUNT(CASE WHEN v.status = 'REJECTED'
                        AND v.validated_at >= NOW() - INTERVAL '7 days'
                   THEN 1 END)                                                 AS critical_alerts
        FROM answers a
        LEFT JOIN validations v ON v.answer_id = a.id
    ")->fetch(PDO::FETCH_ASSOC);

    $total          = (int) $row['total_answers'];
    $approved       = (int) $row['approved_answers'];
    $rejected       = (int) $row['rejected_answers'];
    $pending        = (int) $row['pending_validations'];
    $alerts         = (int) $row['critical_alerts'];
    $completionRate = $total > 0 ? round(($approved / $total) * 100, 1) : 0.0;

    echo json_encode([
        'completion_rate'     => $completionRate,
        'pending_validations' => $pending,
        'total_answers'       => $total,
        'approved_answers'    => $approved,
        'rejected_answers'    => $rejected,
        'critical_alerts'     => $alerts,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error'  => 'Failed to fetch stats',
        'detail' => $e->getMessage(),
    ]);
}