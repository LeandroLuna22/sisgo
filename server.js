require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sessão
app.use(session({
  secret: 'chave_secreta',
  resave: false,
  saveUninitialized: true,
}));

// Servir CSS e arquivos estáticos

app.use(express.static(path.join(__dirname, 'public')));

// Conexão MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect(err => {
  if (err) return console.error("Erro no banco:", err);
  console.log("Conexão realizada com sucesso!");
});

// Middleware de autenticação
function auth(req, res, next) {
  if (req.session.user) next();
  else res.redirect('/login.html');
}

// Login
app.post('/login', (req, res) => {
  const { nome, senha } = req.body;

  connection.query(
    "SELECT * FROM usuarios WHERE nome = ? AND senha = ?",
    [nome, senha],
    (err, results) => {
      if (err) return res.status(500).send("Erro no login.");

      if (results.length > 0) {
        req.session.user = {
          id: results[0].id,
          nome: results[0].nome,
          tipo: results[0].tipo
        };
        res.redirect('/principal.html');
      } else {
        res.send("Usuário ou senha incorretos!");
      }
    }
  );
});

// Endpoint para dados do usuário logado
app.get('/user', auth, (req, res) => {
  res.json(req.session.user);
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

// Rota para cadastrar usuário
app.post('/cadastrar', auth, (req, res) => {
  const { nome, senha, apartamento, tipo } = req.body;

  const query = "INSERT INTO usuarios (nome, senha, apartamento, tipo) VALUES (?, ?, ?, ?)";
  connection.query(query, [nome, senha, apartamento, tipo], (err, result) => {
    if (err) return res.status(500).send("Erro ao cadastrar usuário.");
    res.send("Usuário cadastrado com sucesso!");
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
