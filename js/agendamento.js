// Conexão com Supabase
const { createClient } = supabase;
const supabaseClient = createClient(
  'https://jtazctpzzbfszxttiolz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0YXpjdHB6emJmc3p4dHRpb2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjYwODIsImV4cCI6MjA2NTYwMjA4Mn0.LT2LQgJe_Xl8beCb7vgAgRVmnmGmhqnHMvxeJq9ab1o'
);

// Elementos da interface
const especialidadeSelect = document.getElementById('especialidade');
const dataSelect = document.getElementById('dataConsulta');
const horarioSelect = document.getElementById('horario');
const pacienteSelect = document.getElementById('paciente');
const agendarBtn = document.getElementById('agendarBtn');

let horariosDisponiveis = [];

async function carregarPacientes() {
  const { data } = await supabaseClient.from('paciente').select('*');
  if (data) {
    data.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = p.nome;
      pacienteSelect.appendChild(option);
    });
  }
}

especialidadeSelect.addEventListener('change', async () => {
  dataSelect.innerHTML = '<option value="">Carregando datas...</option>';
  horarioSelect.innerHTML = '<option value="">Selecione a data primeiro</option>';

  const esp = especialidadeSelect.value;
  if (!esp) return;

  const { data: profissionais } = await supabaseClient
    .from('funcionarios')
    .select('id')
    .eq('formacao', esp);

  const profIds = profissionais.map(p => p.id);

  const { data: horarios } = await supabaseClient
    .from('horarios')
    .select('*')
    .in('profissional_id', profIds)
    .eq('status', 'disponivel');

  horariosDisponiveis = horarios;

  const datasUnicas = [...new Set(horarios.map(h => h.data))];
  dataSelect.innerHTML = '<option value="">Selecione...</option>';
  datasUnicas.forEach(d => {
    const option = document.createElement('option');
    option.value = d;
    option.textContent = new Date(d).toLocaleDateString('pt-BR');
    dataSelect.appendChild(option);
  });
});

dataSelect.addEventListener('change', () => {
  const dataSelecionada = dataSelect.value;
  const horarios = horariosDisponiveis.filter(h => h.data === dataSelecionada);

  horarioSelect.innerHTML = '<option value="">Selecione...</option>';
  horarios.forEach(h => {
    const option = document.createElement('option');
    option.value = h.id;
    option.textContent = h.horario;
    horarioSelect.appendChild(option);
  });
});

agendarBtn.addEventListener('click', async () => {
  const especialidade = especialidadeSelect.value;
  const dataConsulta = dataSelect.value;
  const horario_id = horarioSelect.value;
  const paciente = pacienteSelect.value;

  if (!especialidade || !dataConsulta || !horario_id || !paciente) {
    alert('Preencha todos os campos!');
    return;
  }

  const horarioSelecionado = horariosDisponiveis.find(h => h.id == horario_id);
  if (!horarioSelecionado) {
    alert('Horário inválido.');
    return;
  }

  const profissional = horarioSelecionado.profissional_id;
  const horario = horarioSelecionado.horario;

  const { error } = await supabaseClient.from('agendamentos').insert({
    especialidade,
    data: dataConsulta,
    horario,
    paciente,
    profissional
  });

  if (error) {
    console.error('Erro ao agendar:', error);
    alert('Erro ao agendar.');
  } else {
    alert('Agendamento realizado com sucesso!');
  }
});

carregarPacientes();
