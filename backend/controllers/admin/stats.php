<?php
// controllers/admin/stats.php
// GET /api/admin/stats

require_once __DIR__ . '/../../db.php';

header('Content-Type: application/json');

try {
    // Total answers submitted
    $total = (int) $pdo->query("SELECT COUNT(*) FROM answers")->fetchColumn();

    // Approved — has a row in validations with status APPROVED
    $approved = (int) $pdo->query("
        SELECT COUNT(*) FROM validations WHERE status = 'APPROVED'
    ")->fetchColumn();

    // Pending — answers with NO row in validations yet
    $pending = (int) $pdo->query("
        SELECT COUNT(*) FROM answers a
        LEFT JOIN validations v ON v.answer_id = a.id
        WHERE v.id IS NULL
    ")->fetchColumn();

    // Critical alerts — REJECTED in the last 7 days  (PostgreSQL syntax)
    $alerts = (int) $pdo->query("
        SELECT COUNT(*) FROM validations
        WHERE status = 'REJECTED'
          AND validated_at >= NOW() - INTERVAL '7 days'
    ")->fetchColumn();

    $completionRate = $total > 0 ? round(($approved / $total) * 100, 1) : 0;

    echo json_encode([
        'completion_rate'     => $completionRate,
        'pending_validations' => $pending,
        'total_answers'       => $total,
        'critical_alerts'     => $alerts,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    // TEMP: expose message while debugging. Remove $e->getMessage() in production.
    echo json_encode(['error' => 'Failed to fetch stats', 'detail' => $e->getMessage()]);
}
