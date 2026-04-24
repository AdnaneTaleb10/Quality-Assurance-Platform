<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// SESSION + CORE SETUP
session_start();

require_once __DIR__ . "/../db.php";

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri    = preg_replace('#^.*?/api#', '', $uri);
$uri    = rtrim($uri, '/');

// AUTH ROUTES
if ($method === "POST" && $uri === "/auth/register") {
    require __DIR__ . "/../controllers/auth/register.php";
    exit;
}

if ($method === "POST" && $uri === "/auth/login") {
    require __DIR__ . "/../controllers/auth/login.php";
    exit;
}

if ($method === "POST" && $uri === "/auth/logout") {
    require __DIR__ . "/../controllers/auth/logout.php";
    exit;
}

if ($method === "GET" && $uri === "/auth/me") {
    require __DIR__ . "/../controllers/auth/me.php";
    exit;
}

// ADMIN ROUTES
if ($uri === '/admin/stats' && $method === 'GET') {
    require __DIR__ . '/../controllers/admin/stats.php';
    exit;
}

if ($uri === '/admin/answers' && $method === 'GET') {
    require __DIR__ . '/../controllers/admin/answers.php';
    exit;
}

if ($uri === '/admin/validate' && $method === 'POST') {
    require __DIR__ . '/../controllers/admin/validate.php';
    exit;
}

// FALLBACK (404)
http_response_code(404);
echo json_encode([
    "error" => "Route not found",
    "uri"   => $uri
]);