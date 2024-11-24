const express = require('express');
const app = express();

app.use(express.json());

let items = [];

// Listar todos os itens
app.get('/api/items', (req, res) => {
  res.json(items);
});

// Adicionar um item
app.post('/api/items', (req, res) => {
  const { item } = req.body;
  if (item) {
    items.push(item);
    res.status(201).json({ message: 'Item adicionado!' });
  } else {
    res.status(400).json({ message: 'Item inválido!' });
  }
});

// Remover um item
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  items = items.filter((_, index) => index !== id);
  res.json({ message: 'Item removido!' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
