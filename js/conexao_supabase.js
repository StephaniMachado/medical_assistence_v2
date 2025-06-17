// Conexão com o Supabase
const { createClient } = supabase;

const supabaseUrl = 'https://jtazctpzzbfszxttiolz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0YXpjdHB6emJmc3p4dHRpb2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjYwODIsImV4cCI6MjA2NTYwMjA4Mn0.LT2LQgJe_Xl8beCb7vgAgRVmnmGmhqnHMvxeJq9ab1o';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

const form = document.getElementById('form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  const { data, error } = await supabaseClient
    .from('pacientes')
    .insert([{ nome, email }]);

  if (error) {
    alert('Erro ao salvar!');
    console.error(error);
  } else {
    alert('Salvo com sucesso!');
  }
});
