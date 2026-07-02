# 🌐 J.A.R.V.I.S. - HUD Interface & AI Assistant

O **J.A.R.V.I.S.** é uma aplicação web de inteligência artificial baseada em uma interface futurista estilo HUD (Heads-Up Display). O sistema integra-se diretamente com as APIs de computação em nuvem da **Microsoft Azure**, combinando modelos de linguagem de ponta para processar comandos de texto/voz com um motor neural de síntese vocal realista, totalmente livre de bibliotecas ou SDKs pesados no Front-End.

---

## 🚀 Funcionalidades Principais

* **Identificação Biométrica Simulada**: Tela de login personalizada para comandos e inicialização do sistema através de transições e animações CSS contínuas.
* **Conexão Direta com Azure OpenAI**: Processamento inteligente das mensagens mantendo o histórico de contexto (`system`, `user` e `assistant`).
* **Azure Speech-to-Text (STT) Nativo**: Captura de comandos de voz diretamente do microfone utilizando as APIs Web nativas do navegador.
* **Azure Text-to-Speech (TTS) via REST**: Respostas faladas de forma ultra-realista com vozes neurais da Azure (como `pt-BR-FrancisNeural` ou `pt-BR-DonaldoNeural`), processadas de forma segura via requisições assíncronas `fetch` protegidas contra bloqueios de CORS (utilizando o barramento de Token JWT da Azure).
* **Gerenciamento Multi-Chat**: Criação, troca e deleção de múltiplas sessões de conversas salvando os contextos independentemente no HUD.
* **Interface Futurista Responsiva**: Layout cyberpunk com painel lateral dinâmico (Sidebar de Histórico) que se oculta inteligentemente para maximizar a área de trabalho.

---

## 🛠️ Arquitetura e Tecnologias

O ecossistema foi projetado para ser o mais leve possível, rodando de forma pura no navegador do cliente:

* **HTML5 & CSS3**: Estrutura semântica e estilização inspirada no universo de ficção científica (Efeitos Glow, Fontes Orbitron, Animações Cyber).
* **JavaScript (Vanilla JS)**: Lógica assíncrona pura para orquestração de áudio e chamadas de rede API REST.
* **Azure Cognitive Services**: Motores de IA responsáveis pela mente e pela voz do ecossistema.

---

## 📂 Estrutura do Projeto

```text
├── jarvis.html       # Estrutura do HUD e referências visuais
├── style.css         # Identidade visual cyberpunk, animações e layout Grid/Flexbox
├── jarvis.js         # Motor lógico, controle do DOM, Áudio e chamadas REST da Azure
└── keys.json         # Arquivo de configuração local (Ignorado no Git para segurança)
