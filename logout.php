<?php
// logout.php
session_start();
session_unset(); // Destruir todas as variáveis de sessão
session_destroy(); // Destruir a sessão
header("Location: login.html"); // Redireciona para a página de login
exit;
?>
