<?php
require_once 'config.php';

header('Content-Type: application/json');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Получение конкретного продавца
            $data = readData();
            $seller = null;
            foreach ($data['sellers'] as $s) {
                if ($s['id'] === $_GET['id']) {
                    $seller = $s;
                    break;
                }
            }
            echo json_encode(['success' => true, 'seller' => $seller]);
        } else {
            // Получение всех продавцов
            echo json_encode(['success' => true, 'sellers' => readData()['sellers']]);
        }
        break;

    case 'POST':
        if (!checkAuth()) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Требуется авторизация']);
            exit;
        }

        $data = readData();
        $seller = json_decode(file_get_contents('php://input'), true);
        
        $seller['id'] = uniqid();
        $seller['rating'] = 5;
        $seller['reviews'] = [];
        
        $data['sellers'][] = $seller;
        writeData($data);
        
        echo json_encode(['success' => true, 'seller' => $seller]);
        break;
} 