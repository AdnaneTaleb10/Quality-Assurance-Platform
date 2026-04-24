public function upload-proof() {
    $answer_id = $_POST['answer_id'];
    $file = $_FILES['file'];

    if ($file['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        $fileName = uniqid() . '_' . basename($file['name']);
        
        if (move_uploaded_file($file['tmp_name'], $uploadDir . $fileName)) {
            // Sauvegarder le chemin dans la BDD
            $db = Database::connect();
            $stmt = $db->prepare("UPDATE answers SET file_path = ? WHERE id = ?");
            $stmt->execute([$fileName, $answer_id]);

            return json_encode(["message" => "File uploaded", "file_path" => $fileName]);
        }
    }
    
    http_response_code(500);
    return json_encode(["message" => "upload error"]);
}