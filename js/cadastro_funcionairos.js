//  Conexão com Supabase
const { createClient } = supabase;
const supabaseClient = createClient(
  'https://jtazctpzzbfszxttiolz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0YXpjdHB6emJmc3p4dHRpb2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjYwODIsImV4cCI6MjA2NTYwMjA4Mn0.LT2LQgJe_Xl8beCb7vgAgRVmnmGmhqnHMvxeJq9ab1o'
);

// Referência ao formulário
const form = document.querySelector('[data-form]');
const alerta = document.getElementById('alerta');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nome_completo = document.querySelector('[data-nome_completo]').value.trim();
  const formacao = document.querySelector('[data-formacao]').value.trim();
  const registro_profissional = document.querySelector('[data-registro_profissional]').value.trim();
  const especialidade = document.querySelector('[data-especialidade]').value.trim();
  const telefone = document.querySelector('[data-telefone]').value.trim();
  const email = document.querySelector('[data-email]').value.trim();

  const { data, error } = await supabaseClient
    .from('funcionarios')
    .insert([
      {
        nome_completo,
        formacao,
        registro_profissional,
        especialidade,
        telefone,
        email
      }
    ]);

  if (error) {
    exibirAlerta('Erro ao cadastrar profissional: ' + error.message, 'erro');
  } else {
    exibirAlerta('Profissional cadastrado com sucesso!', 'sucesso');
    form.reset();
  }
});

// Função de alerta
function exibirAlerta(mensagem, tipo) {
  alerta.textContent = mensagem;
  alerta.className = 'alerta ' + tipo;
  alerta.classList.remove('oculto');

  setTimeout(() => {
    alerta.classList.add('oculto');
  }, 4000);
}
