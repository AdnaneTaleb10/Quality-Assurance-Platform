<?php
// public/index.php  (your API router)

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── Session cookie config ─────────────────────────────────────────────────────
// Must be called BEFORE session_start().
// For local dev (HTTP):  samesite=Lax,  secure=false
// For production (HTTPS): samesite=None, secure=true
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'domain'   => '',     // empty = current hostname (works for localhost)
    'secure'   => false,  // ← set to true in production (HTTPS only)
    'httponly' => true,
    'samesite' => 'Lax',  // ← set to 'None' in production
]);
session_start();

require_once __DIR__ . "/../db.php";

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri    = preg_replace('#^.*?/api#', '', $uri);
$uri    = rtrim($uri, '/');

// ── Auth ──────────────────────────────────────────────────────────────────────

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

// ── Admin — dashboard stats ───────────────────────────────────────────────────

if ($method === 'GET' && $uri === '/admin/stats') {
    require __DIR__ . '/../controllers/admin/stats.php';
    exit;
}

// ── Admin — answers queue ─────────────────────────────────────────────────────

if ($method === 'GET' && $uri === '/admin/answers') {
    require __DIR__ . '/../controllers/admin/answers.php';
    exit;
}

if ($method === 'POST' && $uri === '/admin/validate') {
    require __DIR__ . '/../controllers/admin/validate.php';
    exit;
}

// ── Admin — users list ────────────────────────────────────────────────────────

if ($method === 'GET' && $uri === '/admin/users') {
    require __DIR__ . '/../controllers/admin/users.php';
    exit;
}

// ── Admin — per-user pending answers ─────────────────────────────────────────
// ORDER MATTERS: must come before /submissions

if ($method === 'GET' && preg_match('#^/admin/users/(\d+)/answers/pending$#', $uri, $m)) {
    $_GET['user_id'] = $m[1];
    require __DIR__ . '/../controllers/admin/user_pending_answers.php';
    exit;
}

// ── Admin — per-user all submissions ─────────────────────────────────────────

if ($method === 'GET' && preg_match('#^/admin/users/(\d+)/submissions$#', $uri, $m)) {
    $_GET['user_id'] = $m[1];
    require __DIR__ . '/../controllers/admin/user_submissions.php';
    exit;
}

// ── Admin — single answer review ─────────────────────────────────────────────
// POST /api/admin/answers/{answerId}/review

if ($method === 'POST' && preg_match('#^/admin/answers/(\d+)/review$#', $uri, $m)) {
    $_GET['answer_id'] = $m[1];
    require __DIR__ . '/../controllers/admin/review_answer.php';
    exit;
}

// ── Admin — bulk validate a reference ────────────────────────────────────────
// POST /api/admin/users/{userId}/references/{referenceId}/validate

if ($method === 'POST' && preg_match('#^/admin/users/(\d+)/references/(\d+)/validate$#', $uri, $m)) {
    $_GET['user_id']      = $m[1];
    $_GET['reference_id'] = $m[2];
    require __DIR__ . '/../controllers/admin/validate_reference.php';
    exit;
}

// ── 404 fallback ──────────────────────────────────────────────────────────────

http_response_code(404);
echo json_encode([
    'error' => 'Route not found',
    'uri'   => $uri,
]);