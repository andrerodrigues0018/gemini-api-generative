import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3000;

const produtos = [123]; // Array para armazenar produtos

// Rota GET para obter todos os produtos
app.get('/gemini/test', (req, res) => {
    const payload = {
        "contents": [
            {
                "parts": [
                    { "text": "De maneira breve, Qual foi o ultimo rei de roma" }
                ]
            }
        ]
    };
    const API_KEY = process.env.API_KEY

    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + API_KEY, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            if(data.candidates){
                res.json(data.candidates[0].content.parts[0].text);
            }else{
                res.status(400)
            }
        });



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