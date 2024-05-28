const button = document.querySelector('.button-enviar');

button.addEventListener('click', sendImage); // Adiciona o manipulador de eventos


function sendImage() {
    const inputElement = document.getElementById('imageInput');
    const file = inputElement.files[0];
    const imagemPreview = document.querySelector('#imagemPreview');
    const descricaoTexto = document.querySelector('#descricaoTexto');

    if (!file) {
        alert('Por favor, selecione uma imagem.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const base64ImageFULL = event.target.result;
        const base64Image = event.target.result.split(',')[1]; // Remove o cabeçalho "data:image/jpeg;base64,"

        imagemPreview.src = base64ImageFULL;
        
        const payload = {
            "contents": [
                {
                    "parts": [
                        { "text": "Explique essa imagem de maneira VERIDICA para mim e de onde ela veio como se você fosse um critico" },
                        {
                            "inline_data": {
                                "mime_type": "image/jpeg",
                                "data": base64Image
                            }
                        }
                    ]
                }
            ]
        };
        const API_KEY = 'API_KEY'

        fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=' + API_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Resposta da API:', data);
                descricaoTexto.textContent = data.candidates[0].content.parts[0].text
                alert('Imagem enviada com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao enviar imagem:', error);
                alert('Erro ao enviar imagem.');
            });
    };

    reader.readAsDataURL(file);
}