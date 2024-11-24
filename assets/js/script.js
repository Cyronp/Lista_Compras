// Seletores
const itens = document.getElementById('itens');
const adicionar = document.getElementById('adicionar');
const lista = document.getElementById('lista');

// Função para adicionar item na lista
const addItem = () => {
  const notif = itens.value.trim();
  if (notif === '') {
    alert('Por favor, insira um item válido!');
    return;
  }

  // Criação do item da lista
  const li = document.createElement('li');
  li.innerHTML = `${notif} <button onclick="remover(this)">Remover</button>`;
  lista.appendChild(li);

  // Limpar input
  itens.value = '';
};

// Função para remover item
const remover = (btn) => {
  const li = btn.parentElement;
  lista.removeChild(li);
};

// Eventos
adicionar.addEventListener('click', addItem);
itens.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addItem();
});
