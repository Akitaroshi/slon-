<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if ($data['username'] === ADMIN_USERNAME && $data['password'] === ADMIN_PASSWORD) {
        session_start();
        $_SESSION['isAdmin'] = true;
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Неверные учетные данные']);
    }
} 