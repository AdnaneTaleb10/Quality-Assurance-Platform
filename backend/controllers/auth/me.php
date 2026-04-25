<?php

if (empty($_SESSION["user"])) {
    http_response_code(401);
    echo json_encode(["message" => "Not authenticated"]);
    exit;
}

echo json_encode(["user" => $_SESSION["user"]]);