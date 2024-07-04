// npm install express mysql2 joi

// const express = require('express');
// const mysql = require('mysql2/promise');
// const Joi = require('joi');

// const app = express();
// const port = 3000;

// app.use(express.json());

// // MySQL database connection configuration
// const dbConfig = {
//   host: 'localhost',
//   user: 'your_username',
//   password: 'your_password',
//   database: 'your_database',
// };

// // Create a MySQL pool
// const pool = mysql.createPool(dbConfig);

// // Define Joi validation schema
// const itemSchemaValidation = Joi.object({
//   name: Joi.string().required(),
//   description: Joi.string().required(),
// });

// // CRUD Operations

// // Create
// app.post('/api/items', async (req, res) => {
//   try {
//     // Validate request body
//     const { error } = itemSchemaValidation.validate(req.body);
//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }

//     // Create new item
//     const connection = await pool.getConnection();
//     const [results] = await connection.query('INSERT INTO items (name, description) VALUES (?, ?)', [req.body.name, req.body.description]);
//     connection.release();

//     const newItem = {
//       id: results.insertId,
//       name: req.body.name,
//       description: req.body.description,
//     };

//     res.status(201).json(newItem);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Read (Get all items)
// app.get('/api/items', async (req, res) => {
//   try {
//     const connection = await pool.getConnection();
//     const [results] = await connection.query('SELECT * FROM items');
//     connection.release();

//     res.json(results);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Update
// app.put('/api/items/:id', async (req, res) => {
//   try {
//     // Validate request body
//     const { error } = itemSchemaValidation.validate(req.body);
//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }

//     // Update item
//     const connection = await pool.getConnection();
//     const [results] = await connection.query('UPDATE items SET name = ?, description = ? WHERE id = ?', [req.body.name, req.body.description, req.params.id]);
//     connection.release();

//     if (results.affectedRows === 0) {
//       return res.status(404).json({ error: 'Item not found' });
//     }

//     const updatedItem = {
//       id: parseInt(req.params.id),
//       name: req.body.name,
//       description: req.body.description,
//     };

//     res.json(updatedItem);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Delete
// app.delete('/api/items/:id', async (req, res) => {
//   try {
//     // Delete item
//     const connection = await pool.getConnection();
//     const [results] = await connection.query('DELETE FROM items WHERE id = ?', [req.params.id]);
//     connection.release();

//     if (results.affectedRows === 0) {
//       return res.status(404).json({ error: 'Item not found' });
//     }

//     res.json({ message: 'Item deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Start the Express server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
