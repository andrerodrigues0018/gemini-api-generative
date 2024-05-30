import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3000;
const API_KEY = process.env.API_KEY

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
app.post('/gemini/pr', (req, res) => {
    console.log(req.body)
    return 1
    const { userStoryName, description } = req.body;
    const defaultPrompt = `
        Gemini estou precisando descrever em inglês no codecommit as melhorias que fiz no meu projeto.

        Template de exemplo:

        Title: ENG-53 - grant positive access response if course path contains legacy sufix 

        Content in markdown:
        ## Description
        This PR addresses issue ENG-53 created from the blocked content bug, on the old platform (data formation legacy).
        ## Changes Made
        #### 1. Created a condition that send a positive access response for the front-end videoplayer.
        - verified the course path received in route payload, and if it contains the "legacy" sufix, it means that the content shall be accessible (based on 3.0 migration business rule).

        ---

        Agora o que eu fiz: 
        Em ${userStoryName} : ${description}
    `;


    const payload = {
        "contents": [
            {
                "parts": [
                    { "text": defaultPrompt }
                ]
            }
        ]
    };

    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + API_KEY, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        const text = data.candidates[0].content.parts[0].text
        res.json({ text });
    })
    .catch(error => {
        console.error('Erro ao enviar imagem:', error);
        alert('Erro ao enviar imagem.');
    });

});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`);
});