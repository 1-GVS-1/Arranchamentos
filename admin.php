<?php
session_start();

// Verificar se o usuário está logado
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.html"); // Redireciona para o login se não estiver logado
    exit;
}

// Conectar ao banco de dados
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$db = 'arranchamento';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

// Verificar se o usuário é administrador
$usuario_id = $_SESSION['usuario_id'];
$sql = "SELECT adm FROM usuarios WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$stmt->bind_result($adm);
$stmt->fetch();
$stmt->close();
$conn->close();

// Se o usuário não for administrador, exibir mensagem e encerrar o script
if ($adm !== 'Sim') {
    echo "<h1>Você não tem permissão para acessar esta página.</h1>";
    exit;
}
?>
<!-- admin.html -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <title>Admin - Relatórios de Arranchamento</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <main>
    <h1>Administração de Arranchamentos</h1>
    <section id="filtros">
      <label for="dataInicio">Data Início:</label>
      <input type="date" id="dataInicio">

      <label for="dataFim">Data Fim:</label>
      <input type="date" id="dataFim">

      <label for="refeicaoFiltro">Refeição:</label>
      <select id="refeicaoFiltro">
        <option value="all">Todas</option>
        <option value="cafe">Café da Manhã</option>
        <option value="almoco">Almoço</option>
        <option value="janta">Janta</option>
      </select>

      <button id="btnGerar">Gerar Relatório</button>
      <a href="home.php"><button>Voltar</button></a>
    </section>

    <section id="resultado">
      <table id="relatorioTable">
        <thead>
          <tr><th>Data</th><th>Matrícula</th><th>Refeições</th></tr>
        </thead>
        <tbody></tbody>
      </table>
      <button id="btnExportarPDF">Exportar PDF</button>
    </section>
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"></script>
  <script src="js/jsonbin.js"></script>
  <script src="js/relatorio.js"></script>
</body>
</html>