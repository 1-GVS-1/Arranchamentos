<?php
// home.php
session_start();

// Verificar se o usuário está logado
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.html"); // Se não estiver logado, redireciona para o login
    exit;
}

// Conectar ao banco de dados para verificar o status de adm
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "arranchamento";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Obter o status de adm do usuário logado
$usuario_id = $_SESSION['usuario_id'];
$sql = "SELECT adm FROM usuarios WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$stmt->bind_result($adm);
$stmt->fetch();
$stmt->close();
$conn->close();

echo "<h1>Bem-vindo, " . $_SESSION['usuario_nome'] . "!</h1>";
echo "<a href='logout.php'>Sair</a>"; // Link para logout
?>

<!-- home -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <title>Cadastro - Arranchamento</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <!-- Contêiner principal para centralizar o conteúdo -->
  <div class="container mt-4">
    <!-- Botão para o arranchamento -->
    <a href="arranchamento.php">
      <button class="btn btn-primary">Fazer Arranchamento</button>
    </a>

    <!-- Mostrar o botão Dashboard apenas se o usuário for administrador -->
    <?php if ($adm === 'Sim'): ?>
      <a href="admin.php">
        <button class="btn btn-secondary">Dashboard</button>
      </a>
    <?php endif; ?>

    <!-- Imagem do arranchamento com espaçamento adequado -->
    <div class="mt-4">
      <h2>Imagem do Arranchamento</h2>
      <img src="./img/cardapio.jpg" alt="Imagem do Arranchamento" style="width: 100%; max-width: 500px;" />
    </div>
  </div>

</body>
</html>