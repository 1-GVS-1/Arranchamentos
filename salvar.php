<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$db = 'arranchamento';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  die("Erro: " . $conn->connect_error);
}

$matricula = $_POST['matricula'];
$data = $_POST['data'];
$refeicoes = json_encode($_POST['refeicoes']);

$stmt = $conn->prepare("INSERT INTO arranchamentos (matricula, data, refeicoes) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $matricula, $data, $refeicoes);

if ($stmt->execute()) {
  echo "OK";
} else {
  echo "Erro ao salvar.";
}

$stmt->close();
$conn->close();
?>
