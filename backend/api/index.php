<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/../db.php";

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = preg_replace('#^.*?/api#', '', $uri);
$uri = rtrim($uri, '/');

// Auth
if ($method === "POST" && $uri === "/auth/register") {
    require __DIR__ . "/../controllers/auth/register.php";
    exit;
}

if ($method === "POST" && $uri === "/auth/login") {
    require __DIR__ . "/../controllers/auth/login.php";
    exit;
}

http_response_code(404);
echo json_encode(["error" => "Route not found", "uri" => $uri]);