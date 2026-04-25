<?php
// controllers/user/dashboard.php
// Called by: GET /api/dashboard

$userId   = $_SESSION['user']['id']   ?? null;
$userRole = $_SESSION['user']['role'] ?? null; // stored as role name string

if (!$userId || !$userRole) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthenticated']);
    exit;
}

try {
    // ── 1. Resolve role_id from role name ─────────────────────────────────────
    $roleStmt = $pdo->prepare("SELECT id FROM roles WHERE name = :name");
    $roleStmt->execute([':name' => $userRole]);
    $roleId = $roleStmt->fetchColumn();

    if (!$roleId) {
        http_response_code(403);
        echo json_encode(['error' => 'Unknown role: ' . $userRole]);
        exit;
    }

    // ── 2. Stats ──────────────────────────────────────────────────────────────

    $domainsStmt  = $pdo->query("SELECT COUNT(*) FROM domains");
    $totalDomains = (int) $domainsStmt->fetchColumn();

    $champsStmt   = $pdo->query("SELECT COUNT(*) FROM champs");
    $activeChamps = (int) $champsStmt->fetchColumn();

    $verifiedStmt = $pdo->query("
        SELECT COUNT(DISTINCT q.reference_id)
        FROM validations v
        JOIN answers   a ON a.id = v.answer_id
        JOIN questions q ON q.id = a.question_id
        WHERE v.status = 'APPROVED'
    ");
    $verifiedRefs = (int) $verifiedStmt->fetchColumn();

    // ── 3. Questions assigned to this role that the user has NOT answered ──────
    // - Filters by question_roles so each role only sees their questions
    // - Excludes questions already answered by this user
    // - proofs_required = count of proof items from the docx per question
    //   stored as a subquery counting rows in a proofs_list lookup,
    //   but since we have no separate table for required proofs count,
    //   we count distinct proof numbers mentioned (hardcoded via CASE).
    //   If you later add a proofs_required column to questions, swap the CASE.

    $questionsStmt = $pdo->prepare("
        SELECT
            q.id           AS question_id,
            q.text         AS question_text,
            q.code         AS question_code,

            rt.id          AS reference_id,
            rt.code        AS reference_code,
            rt.description AS reference_title,

            c.title        AS champ_name,
            c.code         AS champ_code,

            -- Number of required proofs per question (from the source document)
            CASE q.code
                WHEN 'I1.1.1' THEN 3
                WHEN 'I1.1.2' THEN 2
                WHEN 'I1.2.1' THEN 3
                WHEN 'I1.2.2' THEN 3
                WHEN 'I1.2.3' THEN 3
                WHEN 'I2.1.1' THEN 3
                WHEN 'I2.1.2' THEN 2
                WHEN 'I2.2.1' THEN 5
                WHEN 'I2.3.1' THEN 2
                WHEN 'I2.3.2' THEN 2
                WHEN 'I3.1.1' THEN 2
                WHEN 'I3.1.2' THEN 1
                WHEN 'I3.2.1' THEN 6
                WHEN 'I3.2.2' THEN 4
                WHEN 'I4.1.1' THEN 4
                WHEN 'I4.2.1' THEN 2
                WHEN 'I4.2.2' THEN 2
                WHEN 'I4.3.1' THEN 3
                WHEN 'I4.3.2' THEN 3
                WHEN 'I5.1.1' THEN 5
                WHEN 'I5.2.1' THEN 6
                WHEN 'I5.2.2' THEN 8
                ELSE 0
            END AS proofs_required

        FROM questions        q
        JOIN references_table rt ON rt.id = q.reference_id
        JOIN champs           c  ON c.id  = rt.champ_id

        -- Only questions assigned to the current user's role
        JOIN question_roles   qr ON qr.question_id = q.id
                                 AND qr.role_id     = :role_id

        -- Exclude questions the user has already answered
        WHERE NOT EXISTS (
            SELECT 1 FROM answers a
            WHERE a.question_id = q.id
              AND a.user_id     = :uid
        )

        ORDER BY c.id, rt.id, q.id
    ");

    $questionsStmt->execute([
        ':role_id' => $roleId,
        ':uid'     => $userId,
    ]);

    $questions = $questionsStmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($questions as &$q) {
        $q['question_id']     = (int) $q['question_id'];
        $q['reference_id']    = (int) $q['reference_id'];
        $q['proofs_required'] = (int) $q['proofs_required'];
    }
    unset($q);

    echo json_encode([
        'stats' => [
            'total_domains' => $totalDomains,
            'active_champs' => $activeChamps,
            'verified_refs' => $verifiedRefs,
        ],
        'questions' => $questions,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error'  => 'Failed to load dashboard',
        'detail' => $e->getMessage(),
    ]);
}