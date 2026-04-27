<?php
// controllers/public/roles.php
// GET /api/roles  — public endpoint, no auth required
// Used by the signup page to populate the role dropdown.

require_once __DIR__ . '/../../db.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT id, name FROM roles ORDER BY name ASC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch roles', 'detail' => $e->getMessage()]);
}