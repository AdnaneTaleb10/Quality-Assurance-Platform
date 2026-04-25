<?php

header("Content-Type: application/json");

require_once __DIR__ . "/../../db.php";

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Get URL parameters
$request = isset($_GET['action']) ? $_GET['action'] : '';

try {
    switch ($method) {
        case 'GET':
            handleGetRequest($request);
            break;
        case 'POST':
            handlePostRequest($request);
            break;
        case 'PUT':
            handlePutRequest($request);
            break;
        case 'DELETE':
            handleDeleteRequest($request);
            break;
        default:
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error: " . $e->getMessage()]);
}

// ============= GET REQUESTS =============
function handleGetRequest($request) {
    global $pdo;

    switch ($request) {
        case 'all':
            getAllUsers();
            break;
        case 'search':
            searchUsers();
            break;
        case 'filter':
            filterUsersByRole();
            break;
        case 'stats':
            getUserStats();
            break;
        default:
            http_response_code(400);
            echo json_encode(["message" => "Invalid action"]);
    }
}

// Get all users
function getAllUsers() {
    global $pdo;

    try {
        $stmt = $pdo->prepare("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
        $stmt->execute();

        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "message" => "Users retrieved successfully",
            "data" => $users,
            "count" => count($users)
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

// Search users by name or email
function searchUsers() {
    global $pdo;

    $query = isset($_GET['q']) ? $_GET['q'] : '';

    if (empty($query)) {
        http_response_code(400);
        echo json_encode(["message" => "Search query is required"]);
        return;
    }

    try {
        $searchTerm = "%$query%";
        $stmt = $pdo->prepare("SELECT id, name, email, role, created_at FROM users WHERE name ILIKE ? OR email ILIKE ? ORDER BY created_at DESC");
        $stmt->execute([$searchTerm, $searchTerm]);

        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "message" => "Search completed",
            "data" => $users,
            "count" => count($users)
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

// Filter users by role
function filterUsersByRole() {
    global $pdo;

    $role = isset($_GET['role']) ? $_GET['role'] : '';

    if (empty($role)) {
        http_response_code(400);
        echo json_encode(["message" => "Role filter is required"]);
        return;
    }

    try {
        if ($role === 'ALL') {
            $stmt = $pdo->prepare("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
            $stmt->execute();
        } else {
            $stmt = $pdo->prepare("SELECT id, name, email, role, created_at FROM users WHERE role = ? ORDER BY created_at DESC");
            $stmt->execute([$role]);
        }

        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "message" => "Users filtered successfully",
            "data" => $users,
            "count" => count($users)
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

// Get user statistics
function getUserStats() {
    global $pdo;

    try {
        $stmt = $pdo->prepare("
            SELECT 
                COUNT(*) as total_users,
                COUNT(CASE WHEN role = 'Admin' THEN 1 END) as admin_count,
                COUNT(CASE WHEN role = 'User' THEN 1 END) as user_count,
                COUNT(CASE WHEN role = 'Head of Department' THEN 1 END) as head_count,
                COUNT(CASE WHEN role = 'Dean' THEN 1 END) as dean_count
            FROM users
        ");
        $stmt->execute();

        $stats = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "message" => "User statistics retrieved",
            "data" => $stats
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

// ============= POST REQUESTS =============
function handlePostRequest($request) {
    global $pdo;

    $data = json_decode(file_get_contents("php://input"), true);

    switch ($request) {
        case 'create':
            createUser($data);
            break;
        default:
            http_response_code(400);
            echo json_encode(["message" => "Invalid action"]);
    }
}

// Create new user
function createUser($data) {
    global $pdo;

    // Validate input
    if (!isset($data['name']) || !isset($data['email']) || !isset($data['role'])) {
        http_response_code(400);
        echo json_encode(["message" => "Name, email, and role are required"]);
        return;
    }

    $name = trim($data['name']);
    $email = trim($data['email']);
    $role = trim($data['role']);
    $password = isset($data['password']) ? password_hash($data['password'], PASSWORD_BCRYPT) : password_hash('default123', PASSWORD_BCRYPT);

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid email format"]);
        return;
    }

    try {
        // Check if email already exists
        $checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $checkStmt->execute([$email]);

        if ($checkStmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(["message" => "Email already exists"]);
            return;
        }

        // Create user
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->execute([$name, $email, $password, $role]);

        http_response_code(201);
        echo json_encode([
            "message" => "User created successfully",
            "data" => [
                "id" => $pdo->lastInsertId(),
                "name" => $name,
                "email" => $email,
                "role" => $role
            ]
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

// ============= PUT REQUESTS =============
function handlePutRequest($request) {
    global $pdo;

    $data = json_decode(file_get_contents("php://input"), true);

    switch ($request) {
        case 'update':
            updateUser($data);
            break;
        default:
            http_response_code(400);
            echo json_encode(["message" => "Invalid action"]);
    }
}

// Update user
function updateUser($data) {
    global $pdo;

    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(["message" => "User ID is required"]);
        return;
    }

    $id = $data['id'];
    $name = isset($data['name']) ? trim($data['name']) : null;
    $email = isset($data['email']) ? trim($data['email']) : null;
    $role = isset($data['role']) ? trim($data['role']) : null;

    try {
        $fields = [];
        $params = [];

        if ($name) {
            $fields[] = "name = ?";
            $params[] = $name;
        }
        if ($email) {
            $fields[] = "email = ?";
            $params[] = $email;
        }
        if ($role) {
            $fields[] = "role = ?";
            $params[] = $role;
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(["message" => "No fields to update"]);
            return;
        }

        $params[] = $id;

        $sql = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(["message" => "User not found"]);
            return;
        }

        echo json_encode([
            "message" => "User updated successfully",
            "data" => [
                "id" => $id,
                "name" => $name,
                "email" => $email,
                "role" => $role
            ]
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

// ============= DELETE REQUESTS =============
function handleDeleteRequest($request) {
    global $pdo;

    switch ($request) {
        case 'delete':
            deleteUser();
            break;
        default:
            http_response_code(400);
            echo json_encode(["message" => "Invalid action"]);
    }
}

// Delete user
function deleteUser() {
    global $pdo;

    $id = isset($_GET['id']) ? $_GET['id'] : '';

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(["message" => "User ID is required"]);
        return;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(["message" => "User not found"]);
            return;
        }

        echo json_encode([
            "message" => "User deleted successfully",
            "id" => $id
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

?>
