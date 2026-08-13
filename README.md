# Gerenciador de Eventos - Frontend

Sistema web para gerenciamento de eventos e administradores, desenvolvido com React e Vite.

## Funcionalidades

- **Autenticação**: Login/logout com JWT, opção de gravar senha no navegador
- **Dashboard**: Visão geral com indicadores de eventos (total, próximos, hoje, meus eventos)
- **Eventos**: CRUD completo com busca por nome/ID, paginação e modal de cadastro rápido
- **Administradores**: CRUD completo com busca, paginação e gerenciamento de perfis
- **Solicitações de Senha**: Sistema de recuperação de senha com atendimento por administradores
- **Rotas Protegidas**: Áreas restritas autenticadas via contexto React

## Tecnologias

- **React 19** - Biblioteca de UI
- **Vite 8** - Bundler e servidor de desenvolvimento
- **React Router 7** - Roteamento
- **Axios** - Requisições HTTP
- **Oxlint** - Linter

## Pré-requisitos

- Node.js >= 18
- npm ou yarn

## Instalação

```bash
# Clonar o repositório
git clone < https://github.com/LeonamNgr/gerenciador_eventos_FrontEnd.git >

# Entrar na pasta do projeto
cd gerenciador_eventos_FrontEnd

# Instalar dependências
npm install

# Criar arquivo .env (copiar do .env.example)
cp .env.example .env
```

## Configuração

Edite o arquivo `.env` para configurar a URL da API backend:

```env
VITE_API_URL=http://localhost:8080
```

## Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build

# Visualizar build de produção
npm run preview

# Executar linter
npm run lint
```

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis (Layout, CampoSenha)
├── context/             # Contextos React (AuthContext)
├── pages/               # Páginas da aplicação
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Eventos.jsx
│   ├── EventoDetalhes.jsx
│   ├── NovoEvento.jsx
│   ├── EditarEvento.jsx
│   ├── Administradores.jsx
│   ├── AdministradorDetalhes.jsx
│   ├── NovoAdministrador.jsx
│   ├── EditarAdministrador.jsx
│   ├── SolicitacoesSenha.jsx
│   └── EsqueciSenha.jsx
├── services/            # Serviços de API
│   ├── api.js           # Configuração do Axios
│   ├── authService.js   # Autenticação
│   ├── eventoService.js # Operações de eventos
│   ├── administradorService.js
│   └── solicitacaoSenhaService.js
├── styles/              # Estilos CSS
├── utils/               # Utilitários (formatadores)
├── App.jsx              # Rotas da aplicação
├── main.jsx             # Ponto de entrada
└── index.css            # Estilos globais
```

## Rotas Públicas

| Rota | Descrição |
|------|-----------|
| `/` | Listagem de eventos |
| `/eventos` | Listagem de eventos |
| `/eventos/:id` | Detalhes de um evento |
| `/login` | Página de login |
| `/esqueci-senha` | Solicitação de recuperação de senha |
| `/administradores/novo` | Cadastro de novo administrador |

## Rotas Protegidas (Requer Autenticação)

| Rota | Descrição |
|------|-----------|
| `/dashboard` | Painel de controle |
| `/eventos/novo` | Cadastrar novo evento |
| `/eventos/:id/editar` | Editar evento |
| `/administradores` | Listagem de administradores |
| `/administradores/:id` | Detalhes de administrador |
| `/administradores/:id/editar` | Editar administrador |
| `/solicitacoes-senha` | Gerenciar solicitações de senha |

## Backend

 < https://github.com/LeonamNgr/gerenciador_eventos-BACKEND.git >

Este projeto consome uma API REST backend. Certifique-se de que o serviço backend esteja rodando na URL configurada no arquivo `.env`.


