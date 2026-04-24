<?php

header("Content-Type: application/json");

require_once __DIR__ . "/../../db.php";

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove /api/evaluation prefix from uri
$uri = str_replace("/api/evaluation", "", $uri);

// GET evaluation progress for a user
if ($method === "GET" && $uri === "/progress") {

    $userId = $_GET['user_id'] ?? null;
    $domainId = $_GET['domain_id'] ?? null;

    if (!$userId || !$domainId) {
        http_response_code(400);
        echo json_encode(["error" => "user_id and domain_id are required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT 
                COUNT(DISTINCT a.id) as total_answers,
                SUM(CASE WHEN a.answer IS NOT NULL THEN 1 ELSE 0 END) as answered,
                SUM(CASE WHEN a.file_path IS NOT NULL THEN 1 ELSE 0 END) as with_proof
            FROM answers a
            JOIN questions q ON a.question_id = q.id
            JOIN references_table r ON q.reference_id = r.id
            JOIN champs c ON r.champ_id = c.id
            WHERE a.user_id = ? AND c.domain_id = ?
        ");
        
        $stmt->execute([$userId, $domainId]);
        $progress = $stmt->fetch();
        
        echo json_encode([
            "progress" => $progress,
            "percentage" => $progress['total_answers'] > 0 ? 
                round(($progress['answered'] / $progress['total_answers']) * 100) : 0
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// GET questions for evaluation with answer status
if ($method === "GET" && $uri === "/questions") {

    $userId = $_GET['user_id'] ?? null;
    $domainId = $_GET['domain_id'] ?? null;

    if (!$userId || !$domainId) {
        http_response_code(400);
        echo json_encode(["error" => "user_id and domain_id are required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT 
                q.id,
                q.code,
                q.text,
                q.reference_id,
                r.id as reference_id,
                r.code as reference_code,
                c.id as champ_id,
                c.code as champ_code,
                c.title as champ_title,
                a.id as answer_id,
                a.answer as user_answer,
                a.file_path as proof_file
            FROM questions q
            JOIN references_table r ON q.reference_id = r.id
            JOIN champs c ON r.champ_id = c.id
            LEFT JOIN answers a ON q.id = a.question_id AND a.user_id = ?
            WHERE c.domain_id = ?
            ORDER BY c.id, r.id, q.id
        ");
        
        $stmt->execute([$userId, $domainId]);
        $questions = $stmt->fetchAll();
        
        echo json_encode($questions);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// POST save answer
if ($method === "POST" && $uri === "/answers") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['user_id']) || !isset($data['question_id']) || !isset($data['answer'])) {
        http_response_code(400);
        echo json_encode(["error" => "user_id, question_id, and answer are required"]);
        exit;
    }

    try {
        $userId = $data['user_id'];
        $questionId = $data['question_id'];
        $answer = $data['answer'];

        // Check if answer exists
        $stmt = $pdo->prepare("SELECT id FROM answers WHERE user_id = ? AND question_id = ?");
        $stmt->execute([$userId, $questionId]);
        $existingAnswer = $stmt->fetch();

        if ($existingAnswer) {
            // Update existing answer
            $stmt = $pdo->prepare("UPDATE answers SET answer = ?, updated_at = NOW() WHERE user_id = ? AND question_id = ?");
            $stmt->execute([$answer, $userId, $questionId]);
            echo json_encode(["message" => "Answer updated", "answer_id" => $existingAnswer['id']]);
        } else {
            // Insert new answer
            $stmt = $pdo->prepare("INSERT INTO answers (user_id, question_id, answer, created_at) VALUES (?, ?, ?, NOW())");
            $stmt->execute([$userId, $questionId, $answer]);
            echo json_encode(["message" => "Answer saved", "answer_id" => $pdo->lastInsertId()]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// POST upload proof file
if ($method === "POST" && $uri === "/upload") {

    if (!isset($_POST['user_id']) || !isset($_POST['question_id'])) {
        http_response_code(400);
        echo json_encode(["error" => "user_id and question_id are required"]);
        exit;
    }

    if (!isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(["error" => "No file provided"]);
        exit;
    }

    try {
        $userId = $_POST['user_id'];
        $questionId = $_POST['question_id'];
        $file = $_FILES['file'];

        // Validate file
        $allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];
        $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        if (!in_array($fileExtension, $allowedExtensions)) {
            http_response_code(400);
            echo json_encode(["error" => "File type not allowed"]);
            exit;
        }

        if ($file['size'] > 5 * 1024 * 1024) { // 5MB limit
            http_response_code(400);
            echo json_encode(["error" => "File size exceeds 5MB limit"]);
            exit;
        }

        // Create upload directory if it doesn't exist
        $uploadDir = __DIR__ . '/../../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Generate unique filename
        $fileName = $userId . '_' . $questionId . '_' . uniqid() . '.' . $fileExtension;
        $filePath = $uploadDir . $fileName;

        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to upload file"]);
            exit;
        }

        // Save file path to database
        $stmt = $pdo->prepare("SELECT id FROM answers WHERE user_id = ? AND question_id = ?");
        $stmt->execute([$userId, $questionId]);
        $answer = $stmt->fetch();

        if ($answer) {
            $stmt = $pdo->prepare("UPDATE answers SET file_path = ? WHERE id = ?");
            $stmt->execute([$fileName, $answer['id']]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO answers (user_id, question_id, file_path, created_at) VALUES (?, ?, ?, NOW())");
            $stmt->execute([$userId, $questionId, $fileName]);
        }

        http_response_code(200);
        echo json_encode([
            "message" => "File uploaded successfully",
            "file_path" => $fileName
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// Default 404 for evaluation routes
http_response_code(404);
echo json_encode(["error" => "Evaluation route not found"]);
