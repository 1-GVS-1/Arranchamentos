/* js/jsonbin.js */
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3';
const JSONBIN_MASTER_KEY = '<YOUR_JSONBIN_MASTER_KEY>'; // Substitua pela sua chave
const BIN_ID = '<YOUR_BIN_ID>';                 // ID do bin onde armazenaremos os dados

async function getBinData() {
  const res = await fetch(`${JSONBIN_BASE_URL}/b/${BIN_ID}/latest`, {
    headers: { 'X-Master-Key': JSONBIN_MASTER_KEY }
  });
  const data = await res.json();
  return data.record;
}

async function updateBinData(record) {
  const res = await fetch(`${JSONBIN_BASE_URL}/b/${BIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_MASTER_KEY
    },
    body: JSON.stringify(record)
  });
  return res.json();
}

/* js/main.js */
// Cadastro de militar
document.getElementById('cadastroForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const matricula = document.getElementById('matricula').value;
  const posto = document.getElementById('posto').value;
  const senha = document.getElementById('senha').value;

  const bin = await getBinData();
  bin.militares = bin.militares || [];
  bin.militares.push({ nome, matricula, posto, senha });
  await updateBinData(bin);
  alert('Cadastro realizado com sucesso!');
  window.location.href = 'index.html';
});

// Login de militar
document.getElementById('loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const matricula = document.getElementById('matricula').value;
  const senha = document.getElementById('senha').value;

  const bin = await getBinData();
  const user = (bin.militares || []).find(m => m.matricula === matricula && m.senha === senha);
  if (!user) { alert('Credenciais inválidas'); return; }
  sessionStorage.setItem('user', JSON.stringify(user));
  window.location.href = 'arranchamento.html';
});

// Arranchamento de refeições
document.getElementById('arranchForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const refeicao = document.querySelector('input[name="refeicao"]:checked').value;
  const today = new Date().toISOString().split('T')[0];

  const bin = await getBinData();
  bin.arranchamentos = bin.arranchamentos || [];
  bin.arranchamentos.push({ matricula: user.matricula, refeicao, data: today });
  await updateBinData(bin);
  alert('Arranchamento registrado com sucesso!');
  // opcional: redirecionar ou limpar form
});
