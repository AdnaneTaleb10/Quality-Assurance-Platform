<?php

header("Content-Type: application/json");

require_once __DIR__ . "/../../db.php";

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove /api/myAnswers prefix from uri
$uri = str_replace("/api/myAnswers", "", $uri);

// GET all answers for a user
if ($method === "GET" && $uri === "/answers") {

    $userId = $_GET['user_id'] ?? null;

    if (!$userId) {
        http_response_code(400);
        echo json_encode(["error" => "user_id is required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT 
                a.id as answer_id,
                a.answer,
                a.file_path,
                a.created_at,
                a.updated_at,
                q.id as question_id,
                q.code as question_code,
                q.text as question_text,
                r.id as reference_id,
                r.code as reference_code,
                c.id as champ_id,
                c.code as champ_code,
                c.title as champ_title,
                d.id as domain_id,
                d.name as domain_name
            FROM answers a
            JOIN questions q ON a.question_id = q.id
            JOIN references_table r ON q.reference_id = r.id
            JOIN champs c ON r.champ_id = c.id
            JOIN domains d ON c.domain_id = d.id
            WHERE a.user_id = ?
            ORDER BY a.updated_at DESC, a.created_at DESC
        ");
        
        $stmt->execute([$userId]);
        $answers = $stmt->fetchAll();
        
        if (empty($answers)) {
            echo json_encode([
                "message" => "No answers found",
                "data" => []
            ]);
        } else {
            echo json_encode([
                "message" => "Answers retrieved successfully",
                "count" => count($answers),
                "data" => $answers
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// GET answers for a user filtered by domain
if ($method === "GET" && $uri === "/answers/domain") {

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
                a.id as answer_id,
                a.answer,
                a.file_path,
                a.created_at,
                a.updated_at,
                q.id as question_id,
                q.code as question_code,
                q.text as question_text,
                r.id as reference_id,
                r.code as reference_code,
                c.id as champ_id,
                c.code as champ_code,
                c.title as champ_title,
                d.id as domain_id,
                d.name as domain_name
            FROM answers a
            JOIN questions q ON a.question_id = q.id
            JOIN references_table r ON q.reference_id = r.id
            JOIN champs c ON r.champ_id = c.id
            JOIN domains d ON c.domain_id = d.id
            WHERE a.user_id = ? AND d.id = ?
            ORDER BY a.updated_at DESC, a.created_at DESC
        ");
        
        $stmt->execute([$userId, $domainId]);
        $answers = $stmt->fetchAll();
        
        echo json_encode([
            "message" => "Answers retrieved successfully",
            "count" => count($answers),
            "data" => $answers
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// GET answers for a user filtered by champ (field)
if ($method === "GET" && $uri === "/answers/champ") {

    $userId = $_GET['user_id'] ?? null;
    $champId = $_GET['champ_id'] ?? null;

    if (!$userId || !$champId) {
        http_response_code(400);
        echo json_encode(["error" => "user_id and champ_id are required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT 
                a.id as answer_id,
                a.answer,
                a.file_path,
                a.created_at,
                a.updated_at,
                q.id as question_id,
                q.code as question_code,
                q.text as question_text,
                r.id as reference_id,
                r.code as reference_code,
                c.id as champ_id,
                c.code as champ_code,
                c.title as champ_title,
                d.id as domain_id,
                d.name as domain_name
            FROM answers a
            JOIN questions q ON a.question_id = q.id
            JOIN references_table r ON q.reference_id = r.id
            JOIN champs c ON r.champ_id = c.id
            JOIN domains d ON c.domain_id = d.id
            WHERE a.user_id = ? AND c.id = ?
            ORDER BY a.updated_at DESC, a.created_at DESC
        ");
        
        $stmt->execute([$userId, $champId]);
        $answers = $stmt->fetchAll();
        
        echo json_encode([
            "message" => "Answers retrieved successfully",
            "count" => count($answers),
            "data" => $answers
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// GET summary statistics of answers for a user
if ($method === "GET" && $uri === "/stats") {

    $userId = $_GET['user_id'] ?? null;

    if (!$userId) {
        http_response_code(400);
        echo json_encode(["error" => "user_id is required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT 
                COUNT(DISTINCT a.id) as total_answers,
                COUNT(DISTINCT c.id) as champs_answered,
                COUNT(DISTINCT d.id) as domains_with_answers,
                SUM(CASE WHEN a.file_path IS NOT NULL THEN 1 ELSE 0 END) as answers_with_proof,
                MAX(a.updated_at) as last_answer_date
            FROM answers a
            JOIN questions q ON a.question_id = q.id
            JOIN references_table r ON q.reference_id = r.id
            JOIN champs c ON r.champ_id = c.id
            JOIN domains d ON c.domain_id = d.id
            WHERE a.user_id = ?
        ");
        
        $stmt->execute([$userId]);
        $stats = $stmt->fetch();
        
        echo json_encode([
            "message" => "Statistics retrieved successfully",
            "data" => $stats
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// GET answers with pagination
if ($method === "GET" && $uri === "/answers/paginated") {

    $userId = $_GET['user_id'] ?? null;
    $page = $_GET['page'] ?? 1;
    $limit = $_GET['limit'] ?? 10;

    if (!$userId) {
        http_response_code(400);
        echo json_encode(["error" => "user_id is required"]);
        exit;
    }

    $page = max(1, (int)$page);
    $limit = max(1, min(100, (int)$limit));
    $offset = ($page - 1) * $limit;

    try {
        // Get total count
        $countStmt = $pdo->prepare("
            SELECT COUNT(*) as total
            FROM answers a
            WHERE a.user_id = ?
        ");
        $countStmt->execute([$userId]);
        $totalCount = $countStmt->fetch()['total'];

        // Get paginated results
        $stmt = $pdo->prepare("
            SELECT 
                a.id as answer_id,
                a.answer,
                a.file_path,
                a.created_at,
                a.updated_at,
                q.id as question_id,
                q.code as question_code,
                q.text as question_text,
                r.id as reference_id,
                r.code as reference_code,
                c.id as champ_id,
                c.code as champ_code,
                c.title as champ_title,
                d.id as domain_id,
                d.name as domain_name
            FROM answers a
            JOIN questions q ON a.question_id = q.id
            JOIN references_table r ON q.reference_id = r.id
            JOIN champs c ON r.champ_id = c.id
            JOIN domains d ON c.domain_id = d.id
            WHERE a.user_id = ?
            ORDER BY a.updated_at DESC, a.created_at DESC
            LIMIT ? OFFSET ?
        ");
        
        $stmt->execute([$userId, $limit, $offset]);
        $answers = $stmt->fetchAll();
        
        $totalPages = ceil($totalCount / $limit);
        
        echo json_encode([
            "message" => "Answers retrieved successfully",
            "pagination" => [
                "current_page" => $page,
                "total_pages" => $totalPages,
                "total_items" => $totalCount,
                "items_per_page" => $limit
            ],
            "data" => $answers
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// Default: route not found
http_response_code(404);
echo json_encode(["error" => "Endpoint not found"]);
exit;
