<?php
// controllers/evaluation/get_question.php
// GET /api/evaluation/:questionId

$userId   = $_SESSION['user']['id']   ?? null;
$userRole = $_SESSION['user']['role'] ?? null;

if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthenticated']);
    exit;
}

$questionId = (int) ($_GET['question_id'] ?? 0);
if (!$questionId) {
    http_response_code(400);
    echo json_encode(['error' => 'question_id is required']);
    exit;
}

try {
    // ── Question details ──────────────────────────────────────────────────────
    $stmt = $pdo->prepare("
        SELECT
            q.id            AS question_id,
            q.text          AS question_text,
            q.code          AS question_code,
            rt.id           AS reference_id,
            rt.code         AS reference_code,
            rt.description  AS reference_title,
            c.title         AS champ_name
        FROM questions        q
        JOIN references_table rt ON rt.id = q.reference_id
        JOIN champs           c  ON c.id  = rt.champ_id
        WHERE q.id = :qid
    ");
    $stmt->execute([':qid' => $questionId]);
    $question = $stmt->fetch();

    if (!$question) {
        http_response_code(404);
        echo json_encode(['error' => 'Question not found']);
        exit;
    }

    $question['question_id']  = (int) $question['question_id'];
    $question['reference_id'] = (int) $question['reference_id'];

    // ── Proof slots from proof_requirements ───────────────────────────────────
    $proofsStmt = $pdo->prepare("
        SELECT slot_order, title
        FROM proof_requirements
        WHERE question_id = :qid
        ORDER BY slot_order ASC
    ");
    $proofsStmt->execute([':qid' => $questionId]);
    $proofSlots = $proofsStmt->fetchAll();

    // Cast slot_order to int so JS gets a number not a string
    foreach ($proofSlots as &$slot) {
        $slot['slot_order'] = (int) $slot['slot_order'];
    }
    unset($slot);

    $question['proof_slots']     = $proofSlots;
    $question['proofs_required'] = count($proofSlots); // always an int

    // ── Next unanswered question ───────────────────────────────────────────────
    $nextStmt = $pdo->prepare("
        SELECT q.id AS next_id
        FROM questions      q
        JOIN question_roles qr ON qr.question_id = q.id
        JOIN roles          r  ON r.id = qr.role_id AND r.name = :role
        LEFT JOIN answers   a  ON a.question_id = q.id AND a.user_id = :uid
        WHERE q.id > :current_id
          AND a.id IS NULL
        ORDER BY q.id ASC
        LIMIT 1
    ");
    $nextStmt->execute([
        ':role'       => $userRole,
        ':current_id' => $questionId,
        ':uid'        => $userId,
    ]);
    $next = $nextStmt->fetch();
    $question['next_question_id'] = $next ? (int) $next['next_id'] : null;

    echo json_encode($question);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch question', 'detail' => $e->getMessage()]);
}
