const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../../'))); 

const db = new sqlite3.Database('./itemsdb.sqlite', (err) => {
  if (err) {
    console.error('Ocorreu um erro ao conectar ao Banco de dados:', err.message);
  } else {
    console.log('Conexão foi realizada com sucesso.');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item TEXT NOT NULL,
    quantidade REAL CHECK(quantidade >= 0),
    imagem TEXT,
    criadoEm TEXT DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Ocorreu um erro ao criar a tabela.', err.message);
  }
});

// Listar todos os itens
app.get('/api/items', (req, res) => {
  const query = `SELECT * FROM items`;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(200).json(rows);  // Agora envia também a imagem base64
    }
  });
});


// Adicionar um item
app.post('/api/items', (req, res) => {
  const { item, quantidade, imagem } = req.body;  // Agora inclui imagem
  const query = `INSERT INTO items (item, quantidade, imagem) VALUES (?, ?, ?)`;
  db.run(query, [item, quantidade, imagem], function(err) {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(201).json({ id: this.lastID, item, quantidade, imagem });
    }
  });
});


// Remover um item
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM items WHERE id = ?`;
  db.run(query, id, function(err) {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(200).json({ message: 'Item removido com sucesso' });
    }
  });
});

// Atualizar um item
app.patch('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const { item, quantidade } = req.body;
  
  const query = `UPDATE items SET item = ?, quantidade = ? WHERE id = ?`;
  db.run(query, [item, quantidade, id], function (err) {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(200).json({ message: 'Item atualizado com sucesso' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor esta rodando em: ${PORT}`);
});