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
    console.error('Error connecting to SQLite:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item TEXT NOT NULL,
    quantity REAL CHECK(quantity >= 0),
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  }
});

// Listar todos os itens
app.get('/api/items', (req, res) => {
  const query = `SELECT * FROM items`;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Adicionar um item
app.post('/api/items', (req, res) => {
  const { item, quantity } = req.body;
  const query = `INSERT INTO items (item, quantity) VALUES (?, ?)`;
  db.run(query, [item, quantity], function(err) {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(201).json({ id: this.lastID, item, quantity });
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
      res.status(200).json({ message: 'Item removed successfully' });
    }
  });
});

// Atualizar um item
app.patch('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const { item, quantity } = req.body;
  
  const query = `UPDATE items SET item = ?, quantity = ? WHERE id = ?`;
  db.run(query, [item, quantity, id], function (err) {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(200).json({ message: 'Item updated successfully' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});