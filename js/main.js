/* js/main.js */
// Gera tabelas para 7 dias a partir de hoje (múltipla escolha)
function generateWeekForm() {
  const container = document.getElementById('weekContainer');
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() + i);
    const dateIso = day.toISOString().split('T')[0];
    const dateLabel = day.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });

    // Cria tabela
    const table = document.createElement('table');
    table.className = 'day-table';

    // Legenda da tabela
    const caption = document.createElement('caption');
    caption.textContent = `${dateLabel} (${dateIso})`;
    table.appendChild(caption);

    // Cabeçalho
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Refeição', 'Selecionar'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Corpo com opções
    const tbody = document.createElement('tbody');
    const options = [
      { value: 'cafe', label: 'Café da Manhã' },
      { value: 'almoco', label: 'Almoço' },
      { value: 'janta', label: 'Janta' }
    ];
    options.forEach(opt => {
      const tr = document.createElement('tr');
      const tdLabel = document.createElement('td');
      tdLabel.textContent = opt.label;
      const tdInput = document.createElement('td');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = `refeicao-${dateIso}`;
      checkbox.value = opt.value;
      tdInput.appendChild(checkbox);
      tr.appendChild(tdLabel);
      tr.appendChild(tdInput);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.appendChild(table);
  }
}

// Ao carregar a página de arranchamento, geramos o formulário
if (document.getElementById('arranchForm')) {
  window.addEventListener('DOMContentLoaded', generateWeekForm);

  document.getElementById('arranchForm').addEventListener('submit', async e => {
    e.preventDefault();
    const user = JSON.parse(sessionStorage.getItem('user')) || {};
    const hoje = new Date();
    const arranchamentos = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(hoje);
      day.setDate(hoje.getDate() + i);
      const dateIso = day.toISOString().split('T')[0];
      const selected = Array.from(document.querySelectorAll(`input[name="refeicao-${dateIso}"]:checked`)).map(el => el.value);
      if (selected.length > 0) {
        arranchamentos.push({
          matricula: user.matricula,
          data: dateIso,
          refeicoes: selected
        });
      }
    }

    const res = await fetch('salvar.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(arranchamentos)
    });

    if (res.ok) {
      alert('Arranchamentos semanais registrados com sucesso!');
      window.location.href = 'logout_after_submit.php'; // Redireciona para a tela de login após o registro
    } else {
      alert('Erro ao registrar arranchamentos!');
    }
  });
}
