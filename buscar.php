<?php
header('Content-Type: application/json');

// Conexão com o banco
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$db = 'arranchamento';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(['erro' => 'Erro na conexão: ' . $conn->connect_error]);
    exit;
}

// Consulta os arranchamentos
$sql = "SELECT data, matricula, refeicoes FROM arranchamentos";
$result = $conn->query($sql);

$arranchamentos = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $refeicoes = json_decode($row['refeicoes'], true); // transforma JSON do banco em array
        $arranchamentos[] = [
            'data' => $row['data'],
            'matricula' => $row['matricula'],
            'refeicoes' => $refeicoes
        ];
    }
}

echo json_encode($arranchamentos);
$conn->close();
?>
