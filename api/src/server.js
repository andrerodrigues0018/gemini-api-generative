import express from 'express';
const app = express();
const port = 3000;

const produtos = [123]; // Array para armazenar produtos

// Rota GET para obter todos os produtos
app.get('/produtos', (req, res) => {
  res.json(produtos);
});

// Rota POST para criar um novo produto
app.post('/produtos', (req, res) => {
  const novoProduto = req.body; // Recebe o produto do corpo da requisição
  produtos.push(novoProduto); // Adiciona o produto à lista
  res.json({ message: 'Produto criado com sucesso!' });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});