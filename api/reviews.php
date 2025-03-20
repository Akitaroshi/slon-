<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!checkAuth()) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Требуется авторизация']);
        exit;
    }

    $data = readData();
    $review = json_decode(file_get_contents('php://input'), true);
    
    foreach ($data['sellers'] as &$seller) {
        if ($seller['id'] === $review['sellerId']) {
            $review['date'] = date('d.m.Y');
            $seller['reviews'][] = $review;
            
            // Пересчитываем рейтинг
            $total = array_sum(array_column($seller['reviews'], 'rating'));
            $seller['rating'] = round($total / count($seller['reviews']));
            break;
        }
    }
    
    writeData($data);
    echo json_encode(['success' => true]);
} 