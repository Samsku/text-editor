import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

// MySQL pool
const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// Signup
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const [result] = await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hash]
    );
    res.json({ user_id: result.insertId, username, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await db.query("DELETE FROM users WHERE user_id = ?", [
      userId,
    ]);
    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create document
app.post("/documents", async (req, res) => {
  const { user_id, title, content } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO documents (user_id, title, content) VALUES (?, ?, ?)",
      [user_id, title, content]
    );
    res.json({ document_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating document" });
  }
});

// Get all documents for specific user
app.get("/users/:id/documents", async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await db.query("SELECT * FROM documents WHERE user_id = ?", [
      userId,
    ]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching documents" });
  }
});

// Update document
app.put("/documents/:id", async (req, res) => {
  const documentId = req.params.id;
  const { title, content } = req.body;
  try {
    await db.query(
      "UPDATE documents SET title = ?, content = ? WHERE document_id = ?",
      [title, content, documentId]
    );
    res.json({ message: "Document updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating document" });
  }
});

// Delete document
app.delete("/documents/:id", async (req, res) => {
  const documentId = req.params.id;
  try {
    await db.query("DELETE FROM documents WHERE document_id = ?", [documentId]);
    res.json({ message: "Document deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting document" });
  }
});

// Start server (port 3000)
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
