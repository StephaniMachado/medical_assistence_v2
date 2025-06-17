const { createClient } = supabase;

const supabaseUrl = 'https://jtazctpzzbfszxttiolz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0YXpjdHB6emJmc3p4dHRpb2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjYwODIsImV4cCI6MjA2NTYwMjA4Mn0.LT2LQgJe_Xl8beCb7vgAgRVmnmGmhqnHMvxeJq9ab1o';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

const especialidadeSelect = document.getElementById('especialidade');
const profissionalSelect = document.getElementById('profissional');
const horarioSelect = document.getElementById('horario');
const pacienteSelect = document.getElementById('paciente');
const agendarBtn = document.getElementById('agendarBtn');

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
  profissionalSelect.innerHTML = '<option value="">Selecione...</option>';
  horarioSelect.innerHTML = '<option value="">Selecione...</option>';

  const esp = especialidadeSelect.value;

  const { data, error } = await supabaseClient
    .from('funcionarios')
    .select('*')
    .eq('formacao', esp);

  console.log('Especialidade selecionada:', esp);
  console.log('Profissionais retornados:', data);
  if (error) console.error('Erro Supabase:', error);

  if (data && data.length > 0) {
    data.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = p.nome_completo; // campo correto agora
      profissionalSelect.appendChild(option);
    });
  } else {
    console.warn('Nenhum profissional encontrado com formacao =', esp);
  }
});

profissionalSelect.addEventListener('change', async () => {
  horarioSelect.innerHTML = '<option value="">Selecione...</option>';
  const profissionalId = profissionalSelect.value;
  const { data } = await supabaseClient.from('horarios').select('*').eq('profissional_id', profissionalId);
  if (data) {
    data.forEach(h => {
      const option = document.createElement('option');
      option.value = h.id;
      option.textContent = `${h.dia} - ${h.horario}`;
      horarioSelect.appendChild(option);
    });
  }
});

agendarBtn.addEventListener('click', async () => {
  const especialidade = especialidadeSelect.value;
  const profissional_id = profissionalSelect.value;
  const horario_id = horarioSelect.value;
  const paciente_id = pacienteSelect.value;

  if (!especialidade || !profissional_id || !horario_id || !paciente_id) {
    alert('Preencha todos os campos!');
    return;
  }

  const { error } = await supabaseClient.from('agendamentos').insert({
    especialidade,
    profissional_id,
    horario_id,
    paciente_id
  });

  if (!error) {
    alert('Agendamento realizado com sucesso!');
  } else {
    alert('Erro ao agendar.');
  }
});

carregarPacientes();
