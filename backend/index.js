import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/students", (req, res) => {
  res.json([
    { id: 1, nom: "Dupont", prenom: "Jean" },
    { id: 2, nom: "Martin", prenom: "Alice" }
  ]);
});

app.listen(PORT, '0.0.0.0' () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});