// Seletores
const itens = document.getElementById('itens');
const totalquantidade = document.getElementById('quantity');
const adicionar = document.getElementById('adicionar');
const lista = document.getElementById('lista');
const modal = document.getElementById('myModal');
const Editmodal = document.getElementById('editModal');
const span = document.getElementsByClassName('close')[0];
const confirmButton = document.getElementsByClassName('closeEdit')[0];
const modalTitle = modal.querySelector('h1');
const removeButton = document.getElementById('removeItem');
const modalQuantity = modal.querySelector('p');


let currentItem; // Item Atual

// Função para adicionar item na lista
const addItem = () => {
  const item = itens.value.trim();
  const quantidade = totalquantidade.value.trim(); 

  if (item === '') {
    alert('Por favor, insira um item válido!');
    return;
  }

  fetch('http://localhost:3000/api/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ item, quantidade })
  })
  .then(response => response.json())
  .then(data => {
    const li = document.createElement('li');
    li.innerHTML = `${data.item} <span>Quantidade:</span>${data.quantidade} <button onclick="openModal(this, ${data.id}, '${data.item}', ${data.quantidade}, '${data.createdAt}')"><i class="bi bi-arrow-90deg-left"></i></button>`;
    lista.appendChild(li);
    itens.value = '';
  })
  .catch(error => console.error('Error:', error));
};

// Função para abrir o modal
const openModal = (button, id, itemName, quantidade) => {
  currentItem = { element: button.parentElement, id }; 
  modalTitle.textContent = itemName;
  modal.style.display = 'block';
  modalQuantity.textContent = `Quantidade: ${quantidade}`;
};

const openEditModal = (button, id, itemName, quantidade) => {
  currentItem = { element: button.parentElement, id }; 
  modalTitle.textContent = itemName;
  Editmodal.style.display = 'block';
  modalQuantity.textContent = `QuantidadeAA: ${quantidade}`;
};

// Função para fechar o modal
span.onclick = () => {
  modal.style.display = 'none';
};  

// Fechar o modal quando o usuário clicar fora dele
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

//confirmButton.onclick = () => {
  //Editmodal.style.display = 'none';
//};

// Fechar o modal quando o usuário clicar fora dele
window.onclick = (event) => {
  if (event.target == modal) {
    Editmodal.style.display = 'none';
  }
};

// Função para remover item
const removeItem = () => {
  fetch(`http://localhost:3000/api/items/${currentItem.id}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    lista.removeChild(currentItem.element);
    modal.style.display = 'none';
  })
  .catch(error => console.error('Error:', error));
};

// Função para buscar e exibir itens
const fetchItems = () => {
  fetch('http://localhost:3000/api/items')
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item.item} <span>Quantidade:</span>${item.quantidade} <button onclick="openModal(this, ${item.id}, '${item.item}', ${item.quantidade}, '${item.createdAt}')"><i class="bi bi-arrow-90deg-left"></i></button>`;
        lista.appendChild(li);
      });
    })
    .catch(error => console.error('Error:', error));
};

// Eventos
adicionar.addEventListener('click', addItem);
itens.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addItem();
});
removeButton.addEventListener('click', removeItem);

// Buscar e exibir itens ao carregar a página
document.addEventListener('DOMContentLoaded', fetchItems);