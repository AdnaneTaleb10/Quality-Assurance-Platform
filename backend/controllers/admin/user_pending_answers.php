<?php

require_once __DIR__ . '/../../db.php';

$userId = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;

if ($userId <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'userId is required and must be numeric']);
    exit;
}

try {
    // ── User ─────────────────────────────────────────────────────────────────
    $uStmt = $pdo->prepare("
        SELECT
            u.id,
            u.name,
            u.email,
            COALESCE(r.name, 'USER') AS role
        FROM users u
        LEFT JOIN roles r ON r.id = u.role_id
        WHERE u.id = :id
    ");
    $uStmt->execute([':id' => $userId]);
    $user = $uStmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        exit;
    }

    $user['joined_at'] = null;

    // ── Pending answers ───────────────────────────────────────────────────────
    $sql = "
        SELECT
            ref.id                                          AS reference_id,
            COALESCE(ref.code, ref.description, 'Reference') AS reference_title,
            q.id                                            AS question_id,
            q.text                                          AS question_text,
            a.id                                            AS answer_id,
            a.answer                                        AS response,
            a.created_at                                    AS submitted_at,
            p.file_path                                     AS proof_file_path,
            p.uploaded_at                                   AS proof_uploaded_at
        FROM answers a
        JOIN questions            q   ON q.id         = a.question_id
        JOIN references_table     ref ON ref.id        = q.reference_id
        LEFT JOIN proofs          p   ON p.answer_id  = a.id
        LEFT JOIN validations     v   ON v.answer_id  = a.id
        WHERE a.user_id = :uid
          AND (v.id IS NULL OR v.status = 'PENDING')
        ORDER BY ref.code ASC, q.id ASC, a.id ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':uid' => $userId]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ── Group by reference ────────────────────────────────────────────────────
    $refsMap = [];
    foreach ($rows as $row) {
        $rid = (int) $row['reference_id'];

        if (!isset($refsMap[$rid])) {
            $refsMap[$rid] = [
                'reference_id'    => $rid,
                'reference_title' => $row['reference_title'],
                'answers'         => [],
            ];
        }

        // Map file_path → proof object shape the frontend (ProofViewer) expects
        $proof = null;
        if (!empty($row['proof_file_path'])) {
            $proof = [
                'url'        => $row['proof_file_path'],  // use file_path as url
                'mime_type'  => null,
                'file_name'  => basename($row['proof_file_path']),
                'size_bytes' => null,
            ];
        }

        $refsMap[$rid]['answers'][] = [
            'answer_id'     => (int) $row['answer_id'],
            'question_id'   => (int) $row['question_id'],
            'question_text' => $row['question_text'],
            'response'      => $row['response'],
            'comment'       => null,
            'submitted_at'  => $row['submitted_at'],
            'proof'         => $proof,
        ];
    }

    $references   = array_values($refsMap);
    $totalPending = array_sum(
        array_map(fn($r) => count($r['answers']), $references)
    );

    echo json_encode([
        'user'          => $user,
        'total_pending' => $totalPending,
        'references'    => $references,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error'  => 'Failed to fetch pending answers',
        'detail' => $e->getMessage(),
    ]);
}