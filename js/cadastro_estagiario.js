//  Conexão com Supabase
const { createClient } = supabase;
const supabaseClient = createClient(
  'https://jtazctpzzbfszxttiolz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0YXpjdHB6emJmc3p4dHRpb2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjYwODIsImV4cCI6MjA2NTYwMjA4Mn0.LT2LQgJe_Xl8beCb7vgAgRVmnmGmhqnHMvxeJq9ab1o'
);
//  Elementos DOM
const form = document.querySelector('[data-form]');
const alerta = document.getElementById('alerta');

//  Função para exibir mensagens
function exibirAlerta(mensagem, tipo = 'erro') {
  alerta.textContent = mensagem;
  alerta.className = `alerta ${tipo}`;
  alerta.classList.remove('oculto');
  setTimeout(() => alerta.classList.add('oculto'), 4000);
}

//  Evento de envio do formulário
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nomeCompleto = document.querySelector('[data-nome-completo]').value.trim();
  const curso = document.querySelector('[data-curso]').value.trim();
  const matricula = document.querySelector('[data-matricula]').value.trim();
  const profissionalResponsavel = document.querySelector('[data-profissional-responsavel]').value.trim();
  const telefone = document.querySelector('[data-telefone]').value.trim();
  const email = document.querySelector('[data-email]').value.trim();

  // Validação simples
  if (!nomeCompleto || !curso || !matricula || !profissionalResponsavel || !telefone || !email) {
    exibirAlerta('Preencha todos os campos obrigatórios!');
    return;
  }

  // Enviar para o Supabase
  const { data, error } = await supabaseClient
    .from('estagiario') // Nome da tabela no Supabase
    .insert([{
      nome_completo: nomeCompleto,
      curso,
      matricula,
      profissional_responsavel: profissionalResponsavel,
      telefone,
      email
    }]);

  if (error) {
    console.error(error);
    exibirAlerta('Erro ao cadastrar estagiário!');
  } else {
    exibirAlerta('Estagiário cadastrado com sucesso!', 'sucesso');
    form.reset();
  }
});
