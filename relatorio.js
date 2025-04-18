/* js/relatorio.js */
// Funções para geração de relatório e PDF

document.getElementById('btnGerar').addEventListener('click', async () => {
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    const refeicaoFiltro = document.getElementById('refeicaoFiltro').value;
  
    if (dataInicio && dataFim && dataInicio > dataFim) {
      alert('A data inicial não pode ser maior que a final.');
      return;
    }
  
    // Pega dados do backend (PHP)
    const response = await fetch('buscar.php');
    const arrs = await response.json();
  
    const filtrados = arrs.filter(item => {
      const d = item.data;
      const inRange = (!dataInicio || d >= dataInicio) && (!dataFim || d <= dataFim);
      const hasMeal = refeicaoFiltro === 'all' || (item.refeicoes && item.refeicoes.includes(refeicaoFiltro));
      return inRange && hasMeal;
    });
  
    // Ordena os dados por data
    filtrados.sort((a, b) => a.data.localeCompare(b.data));
  
    const tbody = document.querySelector('#relatorioTable tbody');
    tbody.innerHTML = '';
  
    if (filtrados.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 3;
      td.textContent = 'Nenhum arranchamento encontrado.';
      td.style.textAlign = 'center';
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }
  
    filtrados.forEach(item => {
      const tr = document.createElement('tr');
      const tdData = document.createElement('td'); tdData.textContent = item.data;
      const tdMat = document.createElement('td'); tdMat.textContent = item.matricula;
      const tdRef = document.createElement('td'); tdRef.textContent = item.refeicoes ? item.refeicoes.join(', ') : '';
      tr.append(tdData, tdMat, tdRef);
      tbody.appendChild(tr);
    });
  });
  
  // Exportar para PDF usando jsPDF
  document.getElementById('btnExportarPDF').addEventListener('click', () => {
    const dataInicio = document.getElementById('dataInicio').value || 'inicio';
    const dataFim = document.getElementById('dataFim').value || 'fim';
    const doc = new window.jspdf.jsPDF();
    doc.text('Relatório de Arranchamentos', 14, 20);
  
    const rows = Array.from(document.querySelectorAll('#relatorioTable tbody tr')).map(tr =>
      Array.from(tr.children).map(td => td.textContent)
    );
  
    doc.autoTable({
      startY: 30,
      head: [['Data', 'Matrícula', 'Refeições']],
      body: rows
    });
  
    const nomeArquivo = `relatorio_arranchamento_${dataInicio}_a_${dataFim}.pdf`;
    doc.save(nomeArquivo);
  });
  