<?php
// Настройки
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', '1');
define('DB_FILE', __DIR__ . '/database.json');

// Функция для чтения данных
function readData() {
    if (file_exists(DB_FILE)) {
        return json_decode(file_get_contents(DB_FILE), true);
    }
    return ['sellers' => []];
}

// Функция для записи данных
function writeData($data) {
    file_put_contents(DB_FILE, json_encode($data, JSON_PRETTY_PRINT));
}

// Функция проверки авторизации
function checkAuth() {
    session_start();
    return isset($_SESSION['isAdmin']) && $_SESSION['isAdmin'] === true;
} 