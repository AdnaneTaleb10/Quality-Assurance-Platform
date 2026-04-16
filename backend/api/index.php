<?php

header("Content-Type: application/json");

require_once __DIR__ . "/../db.php";

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// remove /api prefix
$uri = str_replace("/api", "", $uri);

// DOMAINS
if ($method === "GET" && $uri === "/domains") {

    $stmt = $pdo->query("SELECT id, name FROM domains");
    echo json_encode($stmt->fetchAll());
    exit;
}

// CHAMPS
if ($method === "GET" && $uri === "/champs") {

    $domainId = $_GET['domain_id'] ?? null;

    if (!$domainId) {
        http_response_code(400);
        echo json_encode(["error" => "domain_id is required"]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT id, domain_id, code, title 
        FROM champs 
        WHERE domain_id = ?
    ");

    $stmt->execute([$domainId]);

    echo json_encode($stmt->fetchAll());
    exit;
}

// REFERENCES
if ($method === "GET" && $uri === "/references") {

    $champId = $_GET['champ_id'] ?? null;

    if (!$champId) {
        http_response_code(400);
        echo json_encode(["error" => "champ_id is required"]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT id, champ_id, code, description, interpretation
        FROM references_table
        WHERE champ_id = ?
    ");

    $stmt->execute([$champId]);

    echo json_encode($stmt->fetchAll());
    exit;
}

// QUESTIONS
if ($method === "GET" && $uri === "/questions") {

    $referenceId = $_GET['reference_id'] ?? null;

    if (!$referenceId) {
        http_response_code(400);
        echo json_encode(["error" => "reference_id is required"]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT id, reference_id, code, text
        FROM questions
        WHERE reference_id = ?
    ");

    $stmt->execute([$referenceId]);

    echo json_encode($stmt->fetchAll());
    exit;
}

// DEFAULT 404
http_response_code(404);
echo json_encode(["error" => "Route not found"]);