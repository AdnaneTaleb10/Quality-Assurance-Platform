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

session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'domain'   => '',     
    'secure'   => false, 
    'httponly' => true,
    'samesite' => 'Lax', 
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

if ($method === 'POST' && preg_match('#^/admin/answers/(\d+)/review$#', $uri, $m)) {
    $_GET['answer_id'] = $m[1];
    require __DIR__ . '/../controllers/admin/review_answer.php';
    exit;
}

// ── Admin — bulk validate a reference ────────────────────────────────────────

if ($method === 'POST' && preg_match('#^/admin/users/(\d+)/references/(\d+)/validate$#', $uri, $m)) {
    $_GET['user_id']      = $m[1];
    $_GET['reference_id'] = $m[2];
    require __DIR__ . '/../controllers/admin/validate_reference.php';
    exit;
}

// GET /api/admin/roles  — fetch all roles for dropdowns
if ($method === 'GET' && $uri === '/admin/roles') {
    require __DIR__ . '/../controllers/admin/roles.php';
    exit;
}
 
// PUT /api/admin/users/:id/role  — update a user's role
if ($method === 'PUT' && preg_match('#^/admin/users/(\d+)/role$#', $uri, $m)) {
    $_GET['user_id'] = $m[1];
    require __DIR__ . '/../controllers/admin/update_user_role.php';
    exit;
}
 
// DELETE /api/admin/users/:id
if ($method === 'DELETE' && preg_match('#^/admin/users/(\d+)$#', $uri, $m)) {
    $_GET['user_id'] = $m[1];
    require __DIR__ . '/../controllers/admin/delete_user.php';
    exit;
}

// ── User dashboard ────────────────────────────────────────────────────────────
if ($method === 'GET' && $uri === '/dashboard') {
    require __DIR__ . '/../controllers/user/dashboard.php';
    exit;
}


// GET /api/evaluation/next  — must come BEFORE /api/evaluation/:id
if ($method === 'GET' && $uri === '/evaluation/next') {
    require __DIR__ . '/../controllers/evaluation/next_question.php';
    exit;
}
 
// GET /api/evaluation/:questionId
if ($method === 'GET' && preg_match('#^/evaluation/(\d+)$#', $uri, $m)) {
    $_GET['question_id'] = $m[1];
    require __DIR__ . '/../controllers/evaluation/get_question.php';
    exit;
}
 
// POST /api/evaluation/submit
if ($method === 'POST' && $uri === '/evaluation/submit') {
    require __DIR__ . '/../controllers/evaluation/submit_answer.php';
    exit;
}

// ── My Answers
if ($method === 'GET' && $uri === '/my-answers') {
    require __DIR__ . '/../controllers/user/my_answers.php';
    exit;
}

if (
    $method === 'GET' &&
    preg_match('#^/uploads/proofs/([^/]+)$#', $uri, $m)
) {
    $filename = basename($m[1]); // basename() blocks directory traversal
    $filepath = __DIR__ . '/../uploads/proofs/' . $filename;
 
    if (!file_exists($filepath) || !is_file($filepath)) {
        http_response_code(404);
        echo json_encode(['error' => 'File not found']);
        exit;
    }
 
    $ext   = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $mimes = [
        'pdf'  => 'application/pdf',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif'  => 'image/gif',
        'webp' => 'image/webp',
    ];
    $mime = $mimes[$ext] ?? 'application/octet-stream';
 
    header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
    header('Content-Type: ' . $mime);
    header('Content-Length: ' . filesize($filepath));
    header('Content-Disposition: inline; filename="' . $filename . '"');
    header('Cache-Control: private, max-age=3600');
 
    readfile($filepath);
    exit;
}

// ── 404 fallback ──────────────────────────────────────────────────────────────

http_response_code(404);
echo json_encode([
    'error' => 'Route not found',
    'uri'   => $uri,
]);