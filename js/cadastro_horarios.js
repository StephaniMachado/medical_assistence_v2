// Conexão com Supabase
const { createClient } = supabase;
const supabaseClient = createClient(
  'https://jtazctpzzbfszxttiolz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0YXpjdHB6emJmc3p4dHRpb2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjYwODIsImV4cCI6MjA2NTYwMjA4Mn0.LT2LQgJe_Xl8beCb7vgAgRVmnmGmhqnHMvxeJq9ab1o'
);

const profissionalSelect = document.getElementById('profissional');
const salvarBtn = document.getElementById('salvarBtn');
const tabelaHorarios = document.getElementById('tabela-horarios');

const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

function gerarHorarios() {
  const horarios = [];

  function addIntervalos(inicio, fim) {
    let [h, m] = inicio.split(':').map(Number);
    const [endH, endM] = fim.split(':').map(Number);

    while (h < endH || (h === endH && m < endM)) {
      horarios.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      m += 15;
      if (m === 60) {
        h += 1;
        m = 0;
      }
    }
  }

  addIntervalos('09:00', '13:00');
  addIntervalos('14:00', '17:00');

  return horarios;
}

function montarTabela() {
  const horarios = gerarHorarios();
  diasSemana.forEach(dia => {
    const row = document.createElement('tr');
    const cellDia = document.createElement('td');
    cellDia.textContent = dia;
    row.appendChild(cellDia);

    const cellHorarios = document.createElement('td');
    horarios.forEach(h => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = `${dia}_${h}`;
      checkbox.dataset.dia = dia;
      checkbox.dataset.horario = h;

      const label = document.createElement('label');
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${h}`));
      cellHorarios.appendChild(label);
    });
    row.appendChild(cellHorarios);
    tabelaHorarios.appendChild(row);
  });
}

async function carregarProfissionais() {
  const { data, error } = await supabaseClient.from('funcionarios').select('*');
  if (data) {
    data.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = p.nome_completo;
      profissionalSelect.appendChild(option);
    });
  }
}

salvarBtn.addEventListener('click', async () => {
  const profissional_id = profissionalSelect.value;
  if (!profissional_id) {
    alert('Selecione um profissional.');
    return;
  }

  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  const registros = Array.from(checkboxes).map(cb => ({
    profissional_id,
    dia: cb.dataset.dia,
    horario: cb.dataset.horario,
    status: 'disponivel'
  }));

  if (registros.length === 0) {
    alert('Selecione pelo menos um horário.');
    return;
  }

  const { error } = await supabaseClient.from('horarios').insert(registros);
  if (!error) {
    alert('Horários cadastrados com sucesso!');
  } else {
    alert('Erro ao salvar os horários.');
    console.error(error);
  }
});

carregarProfissionais();
montarTabela();
