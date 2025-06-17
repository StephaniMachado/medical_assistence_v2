//  Conexão com Supabase
const { createClient } = supabase;
const supabaseClient = createClient(
  'https://jtazctpzzbfszxttiolz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0YXpjdHB6emJmc3p4dHRpb2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjYwODIsImV4cCI6MjA2NTYwMjA4Mn0.LT2LQgJe_Xl8beCb7vgAgRVmnmGmhqnHMvxeJq9ab1o'
);

//  Referência dos campos
const form = document.querySelector('[data-form]');
const fields = {
  nome: document.querySelector('[data-nome]'),
  cpf: document.querySelector('[data-cpf]'),
  nascimento: document.querySelector('[data-data_nascimento]'),
  sexo: document.querySelector('[data-sexo_biologico]'),
  email: document.querySelector('[data-email]'),
  telefone: document.querySelector('[data-telefone]')
};

//  Funções utilitárias
const formatarCPF = (value) =>
  value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

const validarCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  const calc = (len) =>
    [...cpf].slice(0, len).reduce((acc, cur, i) => acc + cur * (len + 1 - i), 0);
  return (
    (calc(9) * 10) % 11 % 10 === +cpf[9] &&
    (calc(10) * 10) % 11 % 10 === +cpf[10]
  );
};

const formatarTelefone = (value) =>
  value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
    .replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');

//  Máscaras
fields.cpf.addEventListener('input', (e) => {
  e.target.value = formatarCPF(e.target.value);
});
fields.telefone.addEventListener('input', (e) => {
  e.target.value = formatarTelefone(e.target.value);
});

//  Envio do formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const paciente = {
    nome: fields.nome.value.trim(),
    cpf: fields.cpf.value.trim(),
    data_nascimento: fields.nascimento.value,
    sexo_biologico: fields.sexo.value,
    email: fields.email.value.trim(),
    telefone: fields.telefone.value.trim()
  };

  if (!validarCPF(paciente.cpf)) {
    return alert('CPF inválido!');
  }

  const { error } = await supabaseClient.from('paciente').insert([paciente]);

  if (error) {
    console.error(error);
    alert('Erro ao cadastrar: ' + error.message);
  } else {
    alert('Paciente cadastrado com sucesso!');
    form.reset();
  }
});
