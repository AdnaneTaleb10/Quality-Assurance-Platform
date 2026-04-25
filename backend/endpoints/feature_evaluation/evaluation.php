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

// GET all evaluation domains
if ($method === "GET" && $uri === "/domains") {
    try {
        $stmt = $pdo->prepare("
            SELECT DISTINCT 
                d.id,
                d.name,
                d.description,
                COUNT(DISTINCT c.id) as total_champs
            FROM domains d
            LEFT JOIN champs c ON d.id = c.domain_id
            GROUP BY d.id, d.name, d.description
            ORDER BY d.name
        ");
        
        $stmt->execute();
        $domains = $stmt->fetchAll();
        
        echo json_encode([
            "message" => "Domains retrieved successfully",
            "data" => $domains
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// GET single domain details
if ($method === "GET" && $uri === "/domain") {
    $domainId = $_GET['domain_id'] ?? null;
    
    if (!$domainId) {
        http_response_code(400);
        echo json_encode(["error" => "domain_id is required"]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("
            SELECT 
                d.id,
                d.name,
                d.description,
                COUNT(DISTINCT q.id) as total_questions
            FROM domains d
            LEFT JOIN champs c ON d.id = c.domain_id
            LEFT JOIN references_table r ON c.id = r.champ_id
            LEFT JOIN questions q ON r.id = q.reference_id
            WHERE d.id = ?
            GROUP BY d.id, d.name, d.description
        ");
        
        $stmt->execute([$domainId]);
        $domain = $stmt->fetch();
        
        if (!$domain) {
            http_response_code(404);
            echo json_encode(["error" => "Domain not found"]);
            exit;
        }
        
        echo json_encode([
            "message" => "Domain retrieved successfully",
            "data" => $domain
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// GET evaluation statistics for user
if ($method === "GET" && $uri === "/stats") {
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
                COUNT(DISTINCT q.id) as total_questions,
                COUNT(DISTINCT a.id) as answered_questions,
                SUM(CASE WHEN a.file_path IS NOT NULL THEN 1 ELSE 0 END) as with_proof,
                MAX(a.updated_at) as last_modified
            FROM questions q
            JOIN references_table r ON q.reference_id = r.id
            JOIN champs c ON r.champ_id = c.id
            LEFT JOIN answers a ON q.id = a.question_id AND a.user_id = ?
            WHERE c.domain_id = ?
        ");
        
        $stmt->execute([$userId, $domainId]);
        $stats = $stmt->fetch();
        
        $percentage = $stats['total_questions'] > 0 ? 
            round(($stats['answered_questions'] / $stats['total_questions']) * 100) : 0;
        
        echo json_encode([
            "message" => "Statistics retrieved successfully",
            "data" => [
                "total_questions" => (int)$stats['total_questions'],
                "answered_questions" => (int)$stats['answered_questions'],
                "with_proof" => (int)$stats['with_proof'],
                "completion_percentage" => $percentage,
                "last_modified" => $stats['last_modified']
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// GET single answer
if ($method === "GET" && $uri === "/answer") {
    $userId = $_GET['user_id'] ?? null;
    $questionId = $_GET['question_id'] ?? null;
    
    if (!$userId || !$questionId) {
        http_response_code(400);
        echo json_encode(["error" => "user_id and question_id are required"]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("
            SELECT 
                id,
                user_id,
                question_id,
                answer,
                file_path,
                created_at,
                updated_at
            FROM answers
            WHERE user_id = ? AND question_id = ?
        ");
        
        $stmt->execute([$userId, $questionId]);
        $answer = $stmt->fetch();
        
        if (!$answer) {
            http_response_code(404);
            echo json_encode(["error" => "Answer not found"]);
            exit;
        }
        
        echo json_encode([
            "message" => "Answer retrieved successfully",
            "data" => $answer
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// DELETE answer
if ($method === "DELETE" && $uri === "/answer") {
    $userId = $_GET['user_id'] ?? null;
    $questionId = $_GET['question_id'] ?? null;
    
    if (!$userId || !$questionId) {
        http_response_code(400);
        echo json_encode(["error" => "user_id and question_id are required"]);
        exit;
    }
    
    try {
        // Get file path if exists
        $stmt = $pdo->prepare("SELECT file_path FROM answers WHERE user_id = ? AND question_id = ?");
        $stmt->execute([$userId, $questionId]);
        $answer = $stmt->fetch();
        
        if (!$answer) {
            http_response_code(404);
            echo json_encode(["error" => "Answer not found"]);
            exit;
        }
        
        // Delete file if exists
        if ($answer['file_path']) {
            $filePath = __DIR__ . '/../../uploads/' . $answer['file_path'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }
        
        // Delete answer from database
        $stmt = $pdo->prepare("DELETE FROM answers WHERE user_id = ? AND question_id = ?");
        $stmt->execute([$userId, $questionId]);
        
        echo json_encode([
            "message" => "Answer deleted successfully"
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// GET download file
if ($method === "GET" && $uri === "/download") {
    $fileName = $_GET['file'] ?? null;
    
    if (!$fileName) {
        http_response_code(400);
        echo json_encode(["error" => "file parameter is required"]);
        exit;
    }
    
    try {
        $filePath = __DIR__ . '/../../uploads/' . basename($fileName);
        
        if (!file_exists($filePath)) {
            http_response_code(404);
            echo json_encode(["error" => "File not found"]);
            exit;
        }
        
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
        header('Content-Length: ' . filesize($filePath));
        
        readfile($filePath);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// POST submit evaluation (mark as completed)
if ($method === "POST" && $uri === "/submit") {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['user_id']) || !isset($data['domain_id'])) {
        http_response_code(400);
        echo json_encode(["error" => "user_id and domain_id are required"]);
        exit;
    }
    
    try {
        $userId = $data['user_id'];
        $domainId = $data['domain_id'];
        
        // Check if evaluation_submissions table exists
        $stmt = $pdo->prepare("
            INSERT INTO evaluation_submissions (user_id, domain_id, submitted_at, status)
            VALUES (?, ?, NOW(), 'completed')
            ON CONFLICT (user_id, domain_id) DO UPDATE
            SET submitted_at = NOW(), status = 'completed'
        ");
        
        $stmt->execute([$userId, $domainId]);
        
        echo json_encode([
            "message" => "Evaluation submitted successfully"
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
