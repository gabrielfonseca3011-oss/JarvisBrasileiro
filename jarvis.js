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
            { role: "assistant", content: "Certamente, Senhor. Here vão algumas sugestões para hoje, dependendo do seu objetivo: se quiser relaxar, recomendo ouvir música ou assistir a uma série..." }
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

// Limpa o Markdown bruto e estrutura o texto por parágrafos/linhas
function limparMarkdown(texto) {
    let textoLimpo = texto
        .replace(/#{1,6}\s?/g, "")    // Remove os marcadores de título (###)
        .replace(/\*\*/g, "")          // Remove os marcadores de negrito (**)
        .replace(/\*/g, "")            // Remove itálicos simples (*)
        .replace(/`{1,3}/g, "");       // Remove crases de código

    return textoLimpo.split('\n')
        .map(linha => linha.trim())
        .filter(linha => linha !== '') 
        .join('\n\n');                 
}

// ==========================================================================
// 3. RENDERIZAÇÃO DA INTERFACE (DOM)
// ==========================================================================
const chatBox = document.querySelector(".chat-box");
const inputMensagem = document.querySelector(".input-area input");
const botaoEnviar = document.getElementById("btn-enviar"); 
const listaHistoricoHUD = document.querySelector(".chat-history-list");
const botaoNovoChat = document.getElementById("btn-new-chat");

// Cria um balão visual de mensagem na tela com botão de ouvir integrado
function adicionarMensagemNoChat(texto, remetente) {
    const divMensagem = document.createElement("div");
    divMensagem.classList.add("message", remetente);
    
    divMensagem.style.whiteSpace = "pre-line";
    
    if (remetente === "bot") {
        const textoLimpo = limparMarkdown(texto);
        
        // Estrutura o balão com a classe de conteúdo e o botão dedicados
        divMensagem.innerHTML = `
            <div class="message-content">${textoLimpo}</div>
            <button class="btn-listen-msg" type="button" title="Ouvir mensagem">🔊</button>
        `;
        
        // Adiciona o evento de clique diretamente neste botão específico
        const botaoOuvirMsg = divMensagem.querySelector(".btn-listen-msg");
        if (botaoOuvirMsg) {
            botaoOuvirMsg.addEventListener("click", () => {
                falarTexto(textoLimpo);
            });
        }
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
            { role: "system", content: `Você é o J.A.R.V.I.S., o assistente virtual inteligente artificial do usuário. Responda de forma prestativa, inteligente e use termos formais como '${nomeUsuarioGlobal}'.` }
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
// CONFIGURAÇÃO DE AUDIO DA AZURE (SDK OFICIAL VIA WEBSOCKET - SEM ERRO DE CORS)
// ==========================================================================
const botaoAudio = document.getElementById("btn-audio");
let reconhecimentoAzure = null;
let estaGravando = false;
let audioPlayerAtual = null; 

// Função que inicializa o Reconhecimento de Voz usando o microfone
function inicializarReconhecimentoVoz(speechKey, speechRegion) {
    if (reconhecimentoAzure) return; 

    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speechKey, speechRegion);
    speechConfig.speechRecognitionLanguage = "pt-BR";
    
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    reconhecimentoAzure = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    reconhecimentoAzure.recognized = (s, e) => {
        if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
            inputMensagem.value = e.result.text;
            inputMensagem.focus();
        }
    };

    reconhecimentoAzure.sessionStopped = (s, e) => {
        botaoAudio.classList.remove("gravando");
        estaGravando = false;
    };

    reconhecimentoAzure.canceled = (s, e) => {
        console.error("Gravação cancelada ou erro:", e.errorDetails);
        botaoAudio.classList.remove("gravando");
        estaGravando = false;
    };
}

if (botaoAudio) {
    botaoAudio.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const respostaChaves = await fetch('keys.json');
            const chaves = await respostaChaves.json();
            
            if (!chaves.AZURE_SPEECH_KEY || !chaves.AZURE_SPEECH_REGION) {
                console.error("Chaves da Azure Speech ausentes no keys.json");
                return;
            }

            inicializarReconhecimentoVoz(chaves.AZURE_SPEECH_KEY, chaves.AZURE_SPEECH_REGION);

            if (estaGravando) {
                reconhecimentoAzure.stopContinuousRecognitionAsync(
                    () => {
                        botaoAudio.classList.remove("gravando");
                        estaGravando = false;
                    },
                    (erro) => console.error(erro)
                );
            } else {
                botaoAudio.classList.add("gravando");
                estaGravando = true;
                reconhecimentoAzure.startContinuousRecognitionAsync(
                    () => { },
                    (erro) => {
                        console.error(erro);
                        botaoAudio.classList.remove("gravando");
                        estaGravando = false;
                    }
                );
            }
        } catch (erro) {
            console.error("Erro ao carregar o microfone da Azure:", erro);
        }
    });
}

// Função de Síntese de Voz (Text-to-Speech) utilizando o SDK da Azure
async function falarTexto(texto) {
    try {
        if (audioPlayerAtual) {
            audioPlayerAtual.pause();
            audioPlayerAtual.currentTime = 0;
        }

        const respostaChaves = await fetch('keys.json');
        if (!respostaChaves.ok) throw new Error("Erro ao ler keys.json");
        
        const chaves = await respostaChaves.json();
        const speechKey = chaves.AZURE_SPEECH_KEY;
        const speechRegion = chaves.AZURE_SPEECH_REGION;

        if (!speechKey || !speechRegion) throw new Error("Credenciais ausentes.");

        // Inicializa as configurações usando a biblioteca global carregada do HTML
        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speechKey, speechRegion);
        speechConfig.speechSynthesisVoiceName = "pt-BR-FranciscaNeural";

        const sintetizador = new SpeechSDK.SpeechSynthesizer(speechConfig, null);
        const textoLimpo = texto.replace(/[*#`_-]/g, "").trim();

        sintetizador.speakTextAsync(
            textoLimpo,
            (resultado) => {
                if (resultado.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                    const blobAudio = new Blob([resultado.audioData], { type: "audio/mp3" });
                    const urlAudio = URL.createObjectURL(blobAudio);
                    
                    audioPlayerAtual = new Audio(urlAudio);
                    audioPlayerAtual.play().catch(err => {
                        console.warn("Interação prévia do usuário requerida para tocar áudio:", err);
                    });
                } else {
                    console.warn("Síntese incompleta ou rejeitada pela Azure. Detalhes:", resultado.errorDetails);
                    executarVozContingencia(textoLimpo);
                }
                sintetizador.close();
            },
            (erro) => {
                console.error("Erro na síntese da Azure:", erro);
                sintetizador.close();
                executarVozContingencia(textoLimpo);
            }
        );

    } catch (erro) {
        console.error("Falha no barramento de voz Azure, aplicando contingência local:", erro);
        executarVozContingencia(texto);
    }
}

// Sistema de segurança corrigido: Correção de 'SynthesisUtterance' para 'SpeechSynthesisUtterance'
function executarVozContingencia(texto) {
    window.speechSynthesis.cancel();
    const fala = new SpeechSynthesisUtterance(texto.replace(/[*#`_-]/g, ""));
    fala.lang = 'pt-BR';
    window.speechSynthesis.speak(fala);
}

// ==========================================================================
// 4. SISTEMA DE AUTENTICAÇÃO E ENVIOS (RESTAURADO)
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
        { role: "system", content: `Você é o J.A.R.V.I.S., o assistente virtual inteligente artificial do usuário. Responda de forma prestativa, inteligente e use termos formais como '${nomeUsuarioGlobal}'.` },
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

    const textoLimpo = limparMarkdown(respostaIA);

    const containerTexto = balaoPensando.querySelector(".message-content");
    if (containerTexto) {
        containerTexto.textContent = textoLimpo;
    } else {
        balaoPensando.textContent = textoLimpo;
    }
    
    // Repassa o evento de clique para o botão do balão gerado dinamicamente
    const botaoOuvirMsg = balaoPensando.querySelector(".btn-listen-msg");
    if (botaoOuvirMsg) {
        botaoOuvirMsg.addEventListener("click", () => {
            falarTexto(textoLimpo);
        });
    }
    
    conversaAtual.historico.push({ role: "assistant", content: respostaIA });
    renderizarListaHistorico();

    inputMensagem.disabled = false;
    botaoEnviar.disabled = false;
    inputMensagem.focus();
}

function lidarComEnvio() {
    const texto = inputMensagem.value.trim();
    if (texto === "") return;

    const conversaAtual = conversasSalvas.find(c => c.id === idChatAtivo);

    if (conversaAtual && conversaAtual.historico.length <= 1) {
        conversaAtual.titulo = texto.substring(0, 20) + (texto.length > 20 ? "..." : "");
    }

    adicionarMensagemNoChat(texto, "user");
    if (conversaAtual) {
        conversaAtual.historico.push({ role: "user", content: texto });
    }
    
    inputMensagem.value = "";
    renderizarListaHistorico();
    processarRespostaIA();
}

// ==========================================================================
// 5. EVENT LISTENERS E INICIALIZADORES
// ==========================================================================
if (botaoEnviar) botaoEnviar.addEventListener("click", lidarComEnvio);
if (botaoNovoChat) botaoNovoChat.addEventListener("click", acionarNovaConversa);

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
    try {
        const respostaChaves = await fetch('keys.json');
        if (!respostaChaves.ok) {
            throw new Error("Não foi possível carregar as configurações de autenticação.");
        }
        
        const chaves = await respostaChaves.json();
        const apiKey = chaves.AZURE_OPENAI_KEY;
        const urlEndpoint = chaves.AZURE_OPENAI_URL;

        if (!apiKey || !urlEndpoint) {
            throw new Error("Chave ou URL da API não encontradas no arquivo de configuração.");
        }

        const dados = {
            messages: historico,
            model: "gpt-5.4", 
            max_completion_tokens: 4096
        };

        const resposta = await fetch(urlEndpoint, {
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
        return "Desculpe, senhor. Houve uma falha de conexão ou autenticação com meus servidores centrais. Verifique os logs do console.";
    }
}

// ==========================================================================
// 7. CONTROLE DE ABRIR/FECHAR JANELA LATERAL (SIDEBAR)
// ==========================================================================
const btnCloseSidebar = document.getElementById("btn-close-sidebar");
const btnOpenSidebar = document.getElementById("btn-open-sidebar");
const containerPrincipal = document.querySelector(".container");

if (btnCloseSidebar) {
    btnCloseSidebar.addEventListener("click", () => {
        containerPrincipal.classList.add("sidebar-closed"); 
        btnOpenSidebar.classList.add("visible");            
    });
}

if (btnOpenSidebar) {
    btnOpenSidebar.addEventListener("click", () => {
        containerPrincipal.classList.remove("sidebar-closed"); 
        btnOpenSidebar.classList.remove("visible");            
    });
}