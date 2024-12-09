// Seletores
const itens = document.getElementById('itens');
const totalquantidade = document.getElementById('quantity');
const imagemInput = document.getElementById('imagem');  // Novo campo para a imagem
const adicionar = document.getElementById('adicionar');
const lista = document.getElementById('lista');
const modal = document.getElementById('myModal');
const Editmodal = document.getElementById('editModal');
const span = document.getElementsByClassName('close')[0];
const confirmButton = document.getElementsByClassName('closeEdit')[0];
const modalTitle = modal.querySelector('h1');
const removeButton = document.getElementById('removeItem');
const modalQuantity = document.getElementById('modalQuantity');
const atualizarItem = document.getElementById('attItem');
const editItemName = document.getElementById('editItemName');
const editItemQuantity = document.getElementById('editItemQuantity');
const updateButton = document.getElementById('updateItem');

let currentItem; // Item Atual

// Função para converter a imagem em base64
const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);  // Lê o arquivo como uma URL base64
  });
};

// Função para adicionar item na lista
const addItem = async () => {
  const item = itens.value.trim();
  const quantidade = totalquantidade.value.trim(); 
  const imagemFile = imagemInput.files[0];  // Pega a imagem do campo

  if (item === '') {
    alert('Por favor, insira um item válido!');
    return;
  }

  if (quantidade < 0 || quantidade > 50) {
    alert('Por favor, insira uma quantidade válida (entre 1 e 50)!');
    return;
  }

  let imagemBase64 = '';
  if (imagemFile) {
    try {
      imagemBase64 = await convertImageToBase64(imagemFile);  // Converte a imagem em base64
    } catch (error) {
      alert('Erro ao converter imagem!');
      return;
    }
  }

  fetch('http://localhost:3000/api/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ item, quantidade, imagem: imagemBase64 })  // Envia a imagem base64
  })
  .then(response => response.json())
  .then(data => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${data.item} <span>Quantidade:</span> ${data.quantidade} 
      <img src="${data.imagem}" alt="${data.item}" style="width: 50px; height: 50px; object-fit: cover;">
      <button onclick="openModal(this, ${data.id}, '${data.item}', ${data.quantidade}, '${data.createdAt}')">
        <i class="bi bi-arrow-90deg-left"></i>
      </button>`;
    lista.appendChild(li);
    itens.value = '';
    imagemInput.value = '';  // Limpa o campo de imagem após o envio
  })
  .catch(error => console.error('Error:', error));
};

// Função para abrir o modal
const openModal = (button, id, itemName, quantity, createdAt) => {
  currentItem = { element: button.parentElement, id }; // Store the current item
  modalTitle.textContent = itemName;
  modal.style.display = 'block';
  modalQuantity.textContent = `Quantidade: ${quantity}`;
  editItemName.value = itemName;
  editItemQuantity.value = quantity;
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

// Função para atualizar item
const patchItem = () => {
  const updatedItem = editItemName.value.trim();
  const updatedQuantity = editItemQuantity.value.trim();

  if (updatedItem === '' || updatedQuantity === '') {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  fetch(`http://localhost:3000/api/items/${currentItem.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ item: updatedItem, quantidade: updatedQuantity })
  })
  
  .then(response => response.json())
  .then(data => {
    currentItem.element.querySelector('span').textContent = `Quantidade: ${updatedQuantity}`;
    currentItem.element.querySelector('button').setAttribute('onclick', `openModal(this, ${currentItem.id}, '${updatedItem}', ${updatedQuantity}, '${data.createdAt}')`);
    modal.style.display = 'none';
    window.location.reload()
  })
  .catch(error => console.error('Error:', error));
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
        li.innerHTML = `
          ${item.item} <span>Quantidade:</span> ${item.quantidade} 
          <img src="${item.imagem}" alt="${item.item}" style="width: 50px; height: 50px; object-fit: cover;">
          <button onclick="openModal(this, ${item.id}, '${item.item}', ${item.quantidade}, '${item.createdAt}')">
            <i class="bi bi-arrow-90deg-left"></i>
          </button>`;
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
updateButton.addEventListener('click', patchItem);

// Buscar e exibir itens ao carregar a página
document.addEventListener('DOMContentLoaded', fetchItems);