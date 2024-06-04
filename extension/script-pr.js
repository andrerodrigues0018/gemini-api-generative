const button = document.querySelector('.button-enviar');
const userStoryName = document.querySelector('input');
const description = document.querySelector('textarea');
const resposta = document.querySelector('.resposta-layer');
const respostaRenderizada = document.querySelector('.resposta-renderizada');

button.addEventListener('click', processRequest); // Adiciona o manipulador de eventos

function processRequest() {
        // Desativar o botão
    // button.disabled = true;

    // Alterar o texto do botão
    button.textContent = 'Carregando...';
    fetch('https://cloudflare-works.andre-rodrigues0018.workers.dev', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userStoryName: userStoryName.value,
            description: description.value 
        })
    })
    .then(response => response.json())
    .then(data => {
        const text = data.markdown
        
        resposta.innerHTML = text
        console.log(data)
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

    