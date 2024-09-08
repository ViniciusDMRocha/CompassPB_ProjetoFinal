const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Dados fictícios 
let candidates = [
  { id: 1, name: "Candidato 1", votes: 0 },
  { id: 2, name: "Candidato 2", votes: 0 },
  { id: 3, name: "Candidato 3", votes: 0 }
];

// Rota para consultar candidatos e votos
app.get('/candidates', (req, res) => {
  res.json(candidates);
});

// Rota para cadastrar um novo candidato
app.post('/candidates', (req, res) => {
  const newCandidate = {
    id: candidates.length + 1,
    name: req.body.name,
    votes: 0
  };
  candidates.push(newCandidate);
  res.status(201).json(newCandidate);
});

// Rota para votar em um candidato
app.post('/vote', (req, res) => {
  const candidateId = req.body.id;
  const candidate = candidates.find(c => c.id === candidateId);

  if (candidate) {
    candidate.votes += 1;
    res.json({ message: `Você votou em ${candidate.name}`, candidate });
  } else {
    res.status(404).json({ message: "Candidato não encontrado" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
