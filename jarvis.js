// ==========================================================================
// 1. GERENCIAMENTO DE DATA E HORA
// ==========================================================================
function atualizarDataHora() {
    const agora = new Date();
    document.getElementById("clock").textContent = agora.toLocaleTimeString("pt-BR");
    document.getElementById("date").textContent = agora.toLocaleDateString("pt-BR", {
        weekday: "long", day: "2-digit", month: "2-digit", year: "numeric"
    });
}
atualizarDataHora();
setInterval(atualizarDataHora, 1000);

// ==========================================================================
// 2. ESTRUTURA DE DADOS PARA MÚLTIPLOS CHATS (HISTÓRICO)
// ==========================================================================
let conversasSalvas = [
    {
        id: "chat-1",
        titulo: "Sugestão para hoje",
        historico: [
            { role: "system", content: "Você é o J.A.R.V.I.S., o assistente virtual inteligente artificial do usuário. Responda de forma prestativa, inteligente e use termos formais como 'Senhor' ou 'Senhora'." },
            { role: "user", content: "Jarvis de uma sugestão do que fazer hoje" },
            { role: "assistant", content: "Certamente, Senhor. Aqui vão algumas sugestões para hoje, dependendo do seu objetivo: se quiser relaxar, recomendo ouvir música ou assistir a uma série..." }
        ]
    },
    {
        id: "chat-2",
        titulo: "Análise de Código",
        historico: [
            { role: "system", content: "Você é o J.A.R.V.I.S..." },
            { role: "user", content: "Você conhece CSS?" },
            { role: "assistant", content: "Sim, Senhor. Conheço CSS muito bem, desde estilização básica até layouts avançados." }
        ]
    },
    {
        id: "chat-3",
        titulo: "Comando Inicial",
        historico: [
            { role: "system", content: "Você é o J.A.R.V.I.S..." },
            { role: "user", content: "Quem é você em poucas palavras" },
            { role: "assistant", content: "Sou J.A.R.V.I.S., seu assistente virtual inteligente - rápido, prestativo e à sua disposição, Senhor." }
        ]
    }
];

let idChatAtivo = "chat-1"; 
let nomeUsuarioGlobal = "Senhor"; 

// NOVA FUNÇÃO: Limpa o Markdown bruto e estrutura o texto por parágrafos/linhas
function limparMarkdown(texto) {
    let textoLimpo = texto
        .replace(/#{1,6}\s?/g, "")    // Remove os marcadores de título (###)
        .replace(/\*\*/g, "")          // Remove os marcadores de negrito (**)
        .replace(/\*/g, "")            // Remove itálicos simples (*)
        .replace(/`{1,3}/g, "");       // Remove crases de código

    // Divide o texto por quebras de linha, limpa espaços extras e junta com espaçamento duplo
    return textoLimpo.split('\n')
        .map(linha => linha.trim())
        .filter(linha => linha !== '') // Remove linhas vazias isoladas
        .join('\n\n');                 // Une as linhas criando blocos bem definidos
}

// ==========================================================================
// 3. RENDERIZAÇÃO DA INTERFACE (DOM)
// ==========================================================================
const chatBox = document.querySelector(".chat-box");
const inputMensagem = document.querySelector(".input-area input");
const botaoEnviar = document.querySelector(".input-area button");
const listaHistoricoHUD = document.querySelector(".chat-history-list");
const botaoNovoChat = document.getElementById("btn-new-chat");

// Cria um balão visual de mensagem na tela
function adicionarMensagemNoChat(texto, remetente) {
    const divMensagem = document.createElement("div");
    divMensagem.classList.add("message", remetente);
    
    // ATUALIZADO: Garante que o navegador respeite as quebras de linha (\n) do texto
    divMensagem.style.whiteSpace = "pre-line";
    
    if (remetente === "bot") {
        divMensagem.textContent = limparMarkdown(texto);
    } else {
        divMensagem.textContent = texto;
    }
    
    chatBox.appendChild(divMensagem);
    chatBox.scrollTop = chatBox.scrollHeight;
    return divMensagem;
}

function renderizarListaHistorico() {
    listaHistoricoHUD.innerHTML = ""; 

    conversasSalvas.forEach(conversa => {
        const itemHistorico = document.createElement("div");
        itemHistorico.classList.add("history-item");
        if (conversa.id === idChatAtivo) {
            itemHistorico.classList.add("active");
        }

        itemHistorico.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; overflow: hidden;">
                <span class="icon">💬</span>
                <span class="title">${conversa.titulo}</span>
            </div>
            <button class="btn-delete-chat" title="Excluir Conversa">🗑️</button>
        `;

        itemHistorico.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-delete-chat")) return;
            carregarConversaNoChat(conversa.id);
        });

        const botaoExcluir = itemHistorico.querySelector(".btn-delete-chat");
        botaoExcluir.addEventListener("click", (e) => {
            e.stopPropagation(); 
            excluirConversa(conversa.id);
        });

        listaHistoricoHUD.appendChild(itemHistorico);
    });
}

function excluirConversa(idChat) {
    if (!confirm("Senhor, tem certeza de que deseja deletar permanentemente este registro de conversa?")) {
        return;
    }

    conversasSalvas = conversasSalvas.filter(c => c.id !== idChat);

    if (idChatAtivo === idChat) {
        if (conversasSalvas.length > 0) {
            carregarConversaNoChat(conversasSalvas[0].id);
        } else {
            acionarNovaConversa();
            return;
        }
    }

    renderizarListaHistorico();
}

function carregarConversaNoChat(idChat) {
    idChatAtivo = idChat;
    chatBox.innerHTML = ""; 

    const conversaCorrente = conversasSalvas.find(c => c.id === idChat);
    
    if (conversaCorrente) {
        conversaCorrente.historico.forEach(msg => {
            if (msg.role === "user") {
                adicionarMensagemNoChat(msg.content, "user");
            } else if (msg.role === "assistant") {
                adicionarMensagemNoChat(msg.content, "bot");
            }
        });
    }
    
    renderizarListaHistorico(); 
}

function acionarNovaConversa() {
    const novoId = "chat-" + Date.now(); 
    const novaConversa = {
        id: novoId,
        titulo: "Nova Conversa...",
        historico: [
            { role: "system", content: "Você é o J.A.R.V.I.S., o assistente virtual inteligente artificial do usuário. Responda de forma prestativa, inteligente e use termos formais como 'Senhor' ou 'Senhora'." }
        ]
    };

    conversasSalvas.unshift(novaConversa); 
    idChatAtivo = novoId;
    
    chatBox.innerHTML = ""; 
    adicionarMensagemNoChat(`Sistemas reinicializados, ${nomeUsuarioGlobal}. Aguardando suas novas diretrizes.`, "bot");
    
    renderizarListaHistorico();
    inputMensagem.focus();
}

// ==========================================================================
// 4. SISTEMA DE AUTENTICAÇÃO E ENVIOS
// ==========================================================================
function autenticarSistema() {
    const inputNome = document.getElementById("user-name");
    const inputPrimeiroComando = document.getElementById("user-first-command");
    const welcomeScreen = document.getElementById("welcome-screen");

    nomeUsuarioGlobal = inputNome.value.trim();
    const primeiroComando = inputPrimeiroComando.value.trim();

    if (nomeUsuarioGlobal === "") {
        inputNome.style.borderColor = "#ff3b3b";
        inputNome.placeholder = "Por favor, digite seu nome!";
        setTimeout(() => inputNome.style.borderColor = "#00eaff", 1000);
        return;
    }

    welcomeScreen.classList.add("hidden");

    chatBox.innerHTML = "";
    adicionarMensagemNoChat(`Olá ${nomeUsuarioGlobal}, os sistemas estão operacionais. Como posso ajudar?`, "bot");
    
    conversasSalvas[0].historico = [
        { role: "system", content: "Você é o J.A.R.V.I.S..." },
        { role: "assistant", content: `Olá ${nomeUsuarioGlobal}, os sistemas estão operacionais. Como posso ajudar?` }
    ];

    if (primeiroComando !== "") {
        setTimeout(() => {
            adicionarMensagemNoChat(primeiroComando, "user");
            conversasSalvas[0].historico.push({ role: "user", content: primeiroComando });
            conversasSalvas[0].titulo = primeiroComando.substring(0, 20) + (primeiroComando.length > 20 ? "..." : "");
            processarRespostaIA();
        }, 400);
    } else {
        renderizarListaHistorico();
    }
}

async function processarRespostaIA() {
    const balaoPensando = adicionarMensagemNoChat("Processando requisição de dados...", "bot");

    inputMensagem.disabled = true;
    botaoEnviar.disabled = true;

    const conversaAtual = conversasSalvas.find(c => c.id === idChatAtivo);
    const respostaIA = await chamarIA(conversaAtual.historico);

    // ATUALIZADO: Garante formatação limpa e quebra de linhas no balão final retornado
    balaoPensando.style.whiteSpace = "pre-line";
    balaoPensando.textContent = limparMarkdown(respostaIA);
    
    conversaAtual.historico.push({ role: "assistant", content: respostaIA });

    inputMensagem.disabled = false;
    botaoEnviar.disabled = false;
    inputMensagem.focus();
}

function lidarComEnvio() {
    const texto = inputMensagem.value.trim();
    if (texto === "") return;

    const conversaAtual = conversasSalvas.find(c => c.id === idChatAtivo);

    if (conversaAtual.historico.length <= 1) {
        conversaAtual.titulo = texto.substring(0, 20) + (texto.length > 20 ? "..." : "");
    }

    adicionarMensagemNoChat(texto, "user");
    conversaAtual.historico.push({ role: "user", content: texto });
    
    inputMensagem.value = "";
    renderizarListaHistorico();
    processarRespostaIA();
}

// ==========================================================================
// 5. EVENT LISTENERS E INICIALIZADORES
// ==========================================================================
botaoEnviar.addEventListener("click", lidarComEnvio);
botaoNovoChat.addEventListener("click", acionarNovaConversa);

inputMensagem.addEventListener("keydown", (e) => { 
    if (e.key === "Enter" && !inputMensagem.disabled) lidarComEnvio(); 
});

document.getElementById("user-first-command").addEventListener("keydown", (e) => {
    if (e.key === "Enter") autenticarSistema();
});

renderizarListaHistorico();

// ==========================================================================
// 6. CONEXÃO DIRETA COM AZURE OPENAI API
// ==========================================================================
async function chamarIA(historico) {
    const url = "";
    const apiKey = ""; 

    const dados = {
        messages: historico,
        model: "gpt-5.4", 
        max_completion_tokens: 4096
    };

    try {
        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + apiKey
            },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            throw new Error("Erro na requisição: " + resposta.status);
        }

        const resultado = await resposta.json();
        return resultado.choices[0].message.content;

    } catch (erro) {
        console.error("Erro ao conectar com o J.A.R.V.I.S.:", erro);
        return "Desculpe, senhor. Houve uma falha de conexão com meus servidores centrais. Verifique os logs do console.";
    }
}

// ==========================================================================
// 7. CONTROLE DE ABRIR/FECHAR JANELA LATERAL (SIDEBAR)
// ==========================================================================
const btnCloseSidebar = document.getElementById("btn-close-sidebar");
const btnOpenSidebar = document.getElementById("btn-open-sidebar");
const containerPrincipal = document.querySelector(".container");

btnCloseSidebar.addEventListener("click", () => {
    containerPrincipal.classList.add("sidebar-closed"); 
    btnOpenSidebar.classList.add("visible");            
});

btnOpenSidebar.addEventListener("click", () => {
    containerPrincipal.classList.remove("sidebar-closed"); 
    btnOpenSidebar.classList.remove("visible");            
});