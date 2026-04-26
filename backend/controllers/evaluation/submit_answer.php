<?php
// controllers/evaluation/submit_answer.php
// POST /api/evaluation/submit  (multipart/form-data)
// Fields: question_id, answer (YES|NO), file_0 ... file_N

$userId = $_SESSION['user']['id'] ?? null;
if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthenticated']);
    exit;
}

$questionId = (int) ($_POST['question_id'] ?? 0);
$answer     = strtoupper(trim($_POST['answer'] ?? ''));

if (!$questionId) {
    http_response_code(400);
    echo json_encode(['error' => 'question_id is required']);
    exit;
}

if (!in_array($answer, ['YES', 'NO'])) {
    http_response_code(400);
    echo json_encode(['error' => 'answer must be YES or NO']);
    exit;
}

// Collect uploaded files (file_0, file_1, ...)
$files = [];
foreach ($_FILES as $key => $file) {
    if (str_starts_with($key, 'file_') && $file['error'] === UPLOAD_ERR_OK) {
        $files[$key] = $file; // keep key for ordering
    }
}
// Sort by key so file_0, file_1, file_2 stay in order
ksort($files);
$files = array_values($files);

// Upload directory — relative to project root
$uploadDir = __DIR__ . '/../../uploads/proofs/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

try {
    $pdo->beginTransaction();

    // Guard: not already answered
    $check = $pdo->prepare(
        "SELECT id FROM answers WHERE question_id = :qid AND user_id = :uid"
    );
    $check->execute([':qid' => $questionId, ':uid' => $userId]);
    if ($check->fetch()) {
        $pdo->rollBack();
        http_response_code(409);
        echo json_encode(['error' => 'Already answered']);
        exit;
    }

    // Insert answer — column is "answer" (matches DB schema)
    $answerStmt = $pdo->prepare("
        INSERT INTO answers (user_id, question_id, answer)
        VALUES (:uid, :qid, :answer)
        RETURNING id
    ");
    $answerStmt->execute([
        ':uid'    => $userId,
        ':qid'    => $questionId,
        ':answer' => $answer,
    ]);
    $answerId = (int) $answerStmt->fetchColumn();

    // Save each proof file
    foreach ($files as $file) {
        $ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed  = ['pdf', 'png', 'jpg', 'jpeg'];
        if (!in_array($ext, $allowed)) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode(['error' => 'Only PDF and image files are allowed']);
            exit;
        }

        $filename = uniqid('proof_', true) . '.' . $ext;
        $dest     = $uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $dest)) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'File upload failed for: ' . $file['name']]);
            exit;
        }

        $proofStmt = $pdo->prepare("
            INSERT INTO proofs (answer_id, file_path)
            VALUES (:answer_id, :file_path)
        ");
        $proofStmt->execute([
            ':answer_id' => $answerId,
            ':file_path' => 'uploads/proofs/' . $filename,
        ]);
    }

    $pdo->commit();

    // Return next unanswered question for the user's role
    $userRole = $_SESSION['user']['role'] ?? null;
    $nextStmt = $pdo->prepare("
        SELECT q.id AS next_id
        FROM questions      q
        JOIN question_roles qr ON qr.question_id = q.id
        JOIN roles          r  ON r.id = qr.role_id AND r.name = :role
        WHERE q.id > :current_id
          AND NOT EXISTS (
              SELECT 1 FROM answers a
              WHERE a.question_id = q.id AND a.user_id = :uid
          )
        ORDER BY q.id ASC
        LIMIT 1
    ");
    $nextStmt->execute([
        ':role'       => $userRole,
        ':current_id' => $questionId,
        ':uid'        => $userId,
    ]);
    $next = $nextStmt->fetch();

    echo json_encode([
        'message'          => 'Answer submitted',
        'answer_id'        => $answerId,
        'next_question_id' => $next ? (int) $next['next_id'] : null,
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Failed to submit answer', 'detail' => $e->getMessage()]);
}