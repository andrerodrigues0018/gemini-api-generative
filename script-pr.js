const button = document.querySelector('.button-enviar');
const userStoryName = document.querySelector('input');
const description = document.querySelector('textarea');
const resposta = document.querySelector('.resposta-layer');
const respostaRenderizada = document.querySelector('.resposta-renderizada');

button.addEventListener('click', processRequest); // Adiciona o manipulador de eventos
const API_URL = process.env.API_URL;

function processRequest() {
        // Desativar o botão
    button.disabled = true;

    // Alterar o texto do botão
    button.textContent = 'Carregando...';

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
        Em ${userStoryName.value} : ${description.value}
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
    const API_KEY = 'API_KEY'

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
        resposta.innerHTML = text
        const htmlContent = markdownToHtml(text);
        respostaRenderizada.innerHTML = htmlContent;
        button.disabled = false;
        button.textContent = "Gerar Descrição"
        alert('Gerada descrição do PR com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao enviar imagem:', error);
        alert('Erro ao enviar imagem.');
    });

}

            function markdownToHtml(markdownText) {
                // Regular expressions for common markdown elements:
                const boldRegex = /\*\*(.*?)\*\*/;
                const italicRegex = /\_(.*?)\_/;
                const codeRegex = /`(.*?)`/;
                const blockquoteRegex = /^> (.*)$/gm; // Multi-line blockquotes
                const listRegex = /^-\s+(.*)$/;
                const linkInlineRegex = /\[(.*?)\]\((.*?)\)/; // Inline links
                const linkReferenceRegex = /\[(.*?)\]\[(.*?)\]/g; // Reference links (needs separate parsing)
                const headingRegex = /^(#{1,6})\s+(.*)$/;
                const plainTextRegex = /^([^#*-+]+)$/; // Matches lines without special formatting


                let html = "";
                const lines = markdownText.split("\n");
                for (const line of lines) {
                    let processedLine = line;
                    processedLine = processedLine.replace(listRegex, "<li>$1</li>");

                    const headingMatch = headingRegex.exec(line);
                    if (headingMatch) {
                        const level = headingMatch[1].length;
                        processedLine = `<h${level}>${headingMatch[2]}</h${level}>`;
                        console.log("Processed Heading:", processedLine);
                    }
                    processedLine = processedLine.replace(boldRegex, "<strong>$1</strong>");
                    processedLine = processedLine.replace(italicRegex, "<em>$1</em>");
                    processedLine = processedLine.replace(codeRegex, "<code>$1</code>");
                    processedLine = processedLine.replace(blockquoteRegex, function (match, content) {
                        return `<blockquote><p>${content.replace(/\n/g, "</p><p>")}</p></blockquote>`;
                    });
                
                    processedLine = processedLine.replace(linkInlineRegex, function (match, text, url) {
                        return `<a href="${url}">${text}</a>`;
                    });
                    const referenceLinks = {};
                    markdownText.split("\n").forEach(line => {
                        const referenceMatch = line.match(/^(\[(.*?)\]):\s+(.*)$/);
                        if (referenceMatch) {
                            referenceLinks[referenceMatch[2]] = referenceMatch[3];
                        }
                    });

                    // Process reference links (after loop to avoid order issues):
                    processedLine = processedLine.replace(linkReferenceRegex, function (match, text, reference) {
                        if (referenceLinks[reference]) {
                            return `<a href="${referenceLinks[reference]}">${text}</a>`;
                        } else {
                            // Handle broken reference links (optional):
                            console.warn(`Broken reference link: ${reference}`);
                            return match; // Or provide a default text or class for broken links
                        }
                    });

                    html += processedLine + "\n"; // Add newline for proper formatting
                }

                return html;
            }

    