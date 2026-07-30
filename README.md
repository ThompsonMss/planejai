# 💰 Planej.ai — Educador Financeiro Inteligente

Aplicação web de planejamento financeiro pessoal feita com **React + TypeScript + IA Generativa**. A pessoa usuária preenche uma simulação (renda, gastos, dívidas e uma meta) e a aplicação usa a **API do Google Gemini** para gerar um diagnóstico financeiro personalizado — com análise de viabilidade, sugestões práticas, ideias de renda extra e recomendações de investimento.

Este projeto foi desenvolvido como entrega do desafio **"Desenvolvendo Seu Educador Financeiro Inteligente com React e IA Generativa"** da [DIO](https://www.dio.me/), a partir do [repositório base](https://github.com/digitalinnovationone/planejai). Reproduzi a aplicação base e evoluí com **duas melhorias próprias** (explicadas [mais abaixo](#-as-melhorias-que-implementei)).

> Tudo roda no navegador: **sem backend e sem banco de dados**. Os dados ficam no `localStorage` e as análises são geradas em tempo real pela IA.

---

## 📑 Índice

- [O que o projeto faz](#-o-que-o-projeto-faz)
- [As melhorias que implementei](#-as-melhorias-que-implementei)
- [Tecnologias](#-tecnologias)
- [Como executar](#-como-executar)
- [Como testar o fluxo principal](#-como-testar-o-fluxo-principal)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [O que aprendi](#-o-que-aprendi)
- [Créditos](#-créditos)

---

## 🎯 O que o projeto faz

1. **Formulário em etapas** — a pessoa responde, um passo por vez, sobre renda, custos fixos, dívidas e a meta (nome, custo e prazo). Os valores em dinheiro têm máscara de moeda no padrão brasileiro.
2. **Cálculo automático** — a aplicação calcula quanto sobra por mês e quanto precisaria guardar para atingir a meta no prazo.
3. **Diagnóstico com IA** — na página de resultado, um prompt estruturado é enviado ao **Gemini**, que retorna um insight personalizado (viabilidade da meta, diagnóstico do orçamento, sugestões, renda extra, investimentos e uma mensagem motivacional).
4. **Tema claro/escuro** — com preferência salva e detecção automática do tema do sistema.

---

## 🚀 As melhorias que implementei

O desafio pedia para reproduzir a base e evoluir com pelo menos uma melhoria. Implementei **os dois desafios propostos no repositório**:

### 1. 📜 Página de histórico de simulações

- Lista todas as simulações salvas, com um card responsivo (layout em linha no desktop, empilhado no mobile) seguindo o protótipo.
- Cada card mostra a meta, a data, o custo, o prazo e a economia mensal.
- Permite **excluir** uma simulação e **abrir os detalhes** (navegando para a página de resultado).

### 2. 💬 Chat com o Educador Financeiro

- Um campo de texto dentro do card de insight permite **fazer perguntas** sobre a própria simulação.
- O prompt enviado à IA é contextualizado com **os dados da simulação + o insight já gerado + o histórico da conversa**, então as respostas são coerentes com o diagnóstico.
- O card respeita uma **altura máxima** e a conversa rola dentro dele; o **scroll vai automaticamente para o fim** a cada nova mensagem.
- Tem **feedback de carregamento** (indicador de digitação) e **de erro** (com botão "Tentar novamente").
- As perguntas são **ilimitadas** e toda a conversa é **salva no `localStorage`**, ficando disponível ao reabrir a simulação.

Durante o desenvolvimento também **corrigi um bug** (o card de insight não estava sendo renderizado na página de resultado, então a IA nunca era chamada) e **configurei o ambiente**: ESLint, Prettier (com ordenação de imports e de classes do Tailwind), alias `@/` para `src/` e o VSCode com formatação automática ao salvar.

---

## 🛠️ Tecnologias

| Ferramenta | Uso |
| --- | --- |
| **React 19** + **TypeScript** | UI e tipagem estática |
| **Vite** | Build tool e dev server |
| **Tailwind CSS v4** | Estilização (design tokens via `@theme`) |
| **React Router** | Rotas da SPA |
| **Google Gemini API** | Geração dos insights e respostas do chat |
| **lucide-react** | Ícones |
| **react-loading-skeleton** | Skeletons de carregamento |
| **ESLint + Prettier** | Padronização e formatação do código |

---

## ▶️ Como executar

### Pré-requisitos

- **Node.js 20.19+** (ou 22+)
- Uma **chave da API do Google Gemini** (gratuita) — gere em [Google AI Studio](https://aistudio.google.com/apikey)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/ThompsonMss/planejai.git
cd planejai

# 2. Instale as dependências
npm install

# 3. Configure a chave da API
#    Copie o arquivo de exemplo e cole sua chave em VITE_GEMINI_API_KEY
cp .env.example .env.local

# 4. Rode em modo de desenvolvimento
npm run dev
```

Abra o endereço que o Vite mostrar no terminal (por padrão `http://localhost:5173`).

### Scripts disponíveis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe o servidor de desenvolvimento com HMR |
| `npm run build` | Faz o typecheck e o build de produção |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Roda o ESLint |
| `npm run format` | Formata o projeto com o Prettier |

---

## 🧪 Como testar o fluxo principal

1. Na tela inicial, preencha o **formulário** passo a passo (renda, custos, dívidas e a meta) e clique em **"Gerar simulação"**.
2. Você será levado à **página de resultado**, onde o Gemini gera o **diagnóstico personalizado** (um skeleton aparece enquanto carrega).
3. No card de insight, **faça uma pergunta** no campo de texto (ex.: *"Quais investimentos seguros posso usar para atingir minha meta?"*) e envie. A resposta aparece logo abaixo e a conversa continua disponível.
4. No menu, acesse **"Histórico"** para ver todas as simulações salvas. Ali você pode **excluir** uma simulação ou clicar em **"Ver detalhes"** para reabri-la.
5. Recarregue a página de resultado: a conversa com a IA continua salva. 🎉

> 💡 Se o diagnóstico não carregar, confira se a `VITE_GEMINI_API_KEY` está corretamente configurada no `.env.local` e reinicie o `npm run dev`.

---

## 📂 Estrutura de pastas

```
src/
├── components/
│   ├── features/        # Componentes de domínio
│   │   ├── Insights/         # Exibição do insight + chat (Chat/)
│   │   ├── Simulation/       # Formulário multi-step
│   │   ├── SimulationResults/# Página de resultado
│   │   └── SimulationHistory/# Card do histórico (melhoria 1)
│   ├── layout/          # RootLayout com Header
│   └── shared/          # Componentes reutilizáveis (Button, Input, etc.)
├── context/theme/       # Contexto e provider de tema
├── data/                # Config do formulário e montagem dos prompts
├── hooks/               # useInsight, useChat, useSimulationStorage, useTheme
├── pages/               # Páginas (formulário, resultado, histórico)
├── services/            # Integração com a API do Gemini
├── styles/              # Design tokens (tema claro/escuro)
├── utils/               # Máscara de moeda e cálculos da simulação
└── router.tsx           # Definição das rotas
```

---

## 📚 O que aprendi

Este desafio me ajudou muito a entender, na prática, como um Front-End pode se apoiar em IA. Alguns pontos que ficaram claros pra mim:

- **Formulário em etapas com estado controlado** e por que a prop `key` reseta o estado ao trocar de passo.
- **Persistência no `localStorage`** encapsulada em um hook, para ler, salvar e apagar dados sem repetir código.
- **Context API** para o tema claro/escuro, com preferência salva e detecção do sistema.
- **Tailwind v4 com design tokens** (`@theme`), o que deixa o tema muito mais fácil de manter.
- **Integração com a API do Gemini** e, principalmente, a diferença entre **dois tipos de prompt**: um pedindo uma resposta em **JSON estruturado** (o insight) e outro conversacional em **texto livre** (o chat).
- **Tratamento de loading, erro e chamadas duplicadas** — inclusive entender por que o `StrictMode` executa os efeitos duas vezes no dev e como proteger a chamada à API.
- **Ler e depurar código existente**: meu primeiro passo foi caçar por que a IA não estava sendo chamada e descobrir que o componente do insight não estava montado na página.
- **Cuidar do ambiente do projeto**: ESLint, Prettier, ordenação de imports/classes e o alias `@/` fazem diferença no dia a dia.

Testei cada fluxo manualmente (formulário → resultado → chat → histórico) antes de considerar a entrega pronta.

---

## 🙌 Créditos

- Desafio e material base: **[Digital Innovation One (DIO)](https://www.dio.me/)**
- Repositório base do projeto: **[digitalinnovationone/planejai](https://github.com/digitalinnovationone/planejai)**

---

Feito com dedicação para o meu portfólio 🚀
