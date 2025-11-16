# Marketplace ERP - Plataforma de Gestão de Condomínios

Uma plataforma completa de marketplace integrada com ERP para conectar moradores, administradoras e prestadores de serviço em condomínios.

## 🎯 Visão Geral

O Marketplace ERP é uma solução all-in-one que combina:

- **Gestão de Condomínios**: Controle completo de múltiplos condomínios
- **Marketplace de Serviços**: Conecte prestadores com moradores
- **Sistema de Avaliações**: Reputação baseada em qualidade
- **Dashboard ERP**: Métricas financeiras e operacionais
- **Autenticação Segura**: OAuth integrado com Manus

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

```
Frontend: React 19 + TypeScript + Tailwind CSS 4
Backend: Express 4 + tRPC 11
Database: MySQL/TiDB + Drizzle ORM
Auth: Manus OAuth
State Management: Zustand + Context API
```

### Estrutura de Pastas

```
marketplace-erp/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx                 # Landing page
│   │   │   ├── Login.tsx                # Página de login
│   │   │   ├── SelectUserType.tsx       # Seleção de tipo de usuário
│   │   │   ├── Dashboard.tsx            # Dashboard principal
│   │   │   ├── Marketplace.tsx          # Listagem de prestadores
│   │   │   ├── PrestadorProfile.tsx     # Perfil do prestador
│   │   │   └── dashboards/
│   │   │       ├── DashboardMorador.tsx
│   │   │       ├── DashboardAdministradora.tsx
│   │   │       └── DashboardPrestador.tsx
│   │   ├── components/
│   │   │   ├── PrivateRoute.tsx         # Proteção de rotas
│   │   │   ├── RatingStars.tsx          # Componente de estrelas
│   │   │   ├── RatingSummary.tsx        # Resumo de avaliações
│   │   │   └── ReviewForm.tsx           # Formulário de avaliação
│   │   ├── App.tsx                      # Roteamento principal
│   │   └── index.css                    # Design System (cores)
│   └── public/                          # Assets estáticos
├── server/
│   ├── routers.ts                       # tRPC routers
│   ├── db.ts                            # Query helpers
│   └── _core/                           # Framework plumbing
├── drizzle/
│   ├── schema.ts                        # Definição de tabelas
│   └── migrations/                      # Histórico de migrações
└── shared/                              # Código compartilhado
```

## 👥 Tipos de Usuário

### 1. Morador
- Visualizar informações do condomínio
- Acompanhar pagamentos e taxas
- Participar de assembleias
- Contratar prestadores de serviço
- Avaliar profissionais

### 2. Administradora
- Gerenciar múltiplos condomínios
- Controlar finanças consolidadas
- Gestão de prestadores de serviço
- Relatórios detalhados
- Análise de ocupação

### 3. Prestador
- Criar perfil profissional
- Receber solicitações de serviço
- Gerenciar agenda
- Acompanhar avaliações
- Aumentar reputação e visibilidade

## 🎨 Design System

### Paleta de Cores
- **Primária**: Azul Marinho (#070A2D) - Confiança e profissionalismo
- **Accent**: Dourado (#D9B06A) - Destaque e premium
- **Background**: Branco/Cinza claro
- **Foreground**: Azul Marinho escuro

### Componentes Reutilizáveis
- `RatingStars`: Componente interativo de avaliação (1-5 estrelas)
- `RatingSummary`: Resumo estatístico com distribuição
- `ReviewForm`: Formulário completo de avaliação
- `PrivateRoute`: Proteção de rotas autenticadas

## 🚀 Funcionalidades Principais

### ✅ Implementadas

1. **Autenticação**
   - Login com Manus OAuth
   - Proteção de rotas
   - Gestão de sessões

2. **Tipos de Usuário**
   - Seleção no primeiro acesso
   - Perfis personalizados
   - Dashboards específicos

3. **Dashboards**
   - Dashboard do Morador com métricas
   - Dashboard da Administradora com gestão
   - Dashboard do Prestador com performance

4. **Sistema de Avaliações**
   - Componente de estrelas interativo
   - Formulário de avaliação completo
   - Resumo estatístico com distribuição
   - Histórico de avaliações

5. **Marketplace**
   - Listagem de prestadores
   - Busca e filtros por categoria
   - Perfil detalhado do prestador
   - Histórico de avaliações

### 🔄 Banco de Dados

Tabelas implementadas:
- `users` - Usuários do sistema
- `condominios` - Dados dos condomínios
- `moradores` - Relação usuários-condomínios
- `prestadores` - Perfis de prestadores
- `servicos` - Solicitações de serviço
- `avaliacoes` - Sistema de avaliações
- `assembleias` - Registro de assembleias
- `pagamentos` - Controle de pagamentos

## 📝 Routers tRPC

### User
- `user.profile` - Obter perfil do usuário
- `user.updateProfile` - Atualizar perfil

### Condominio
- `condominio.getById` - Obter condomínio por ID
- `condominio.getByAdministradora` - Listar condomínios da administradora

### Prestador
- `prestador.getById` - Obter prestador por ID
- `prestador.getByCategory` - Listar por categoria
- `prestador.getMyProfile` - Perfil do prestador autenticado
- `prestador.create` - Criar perfil de prestador

### Serviço
- `servico.getById` - Obter serviço por ID
- `servico.getByPrestador` - Listar serviços do prestador
- `servico.getByMorador` - Listar serviços do morador
- `servico.create` - Criar novo serviço
- `servico.updateStatus` - Atualizar status do serviço

### Avaliação
- `avaliacao.getByPrestador` - Listar avaliações do prestador
- `avaliacao.getByServico` - Obter avaliação do serviço
- `avaliacao.create` - Criar avaliação

## 🔐 Variáveis de Ambiente

Variáveis automáticas (injetadas pelo sistema):
```
VITE_APP_ID
VITE_APP_TITLE
VITE_APP_LOGO
VITE_OAUTH_PORTAL_URL
OAUTH_SERVER_URL
JWT_SECRET
DATABASE_URL
```

## 🚀 Deploy no Vercel

### Pré-requisitos
1. Conta no Vercel
2. Repositório GitHub com o código
3. Variáveis de ambiente configuradas

### Passos

1. **Conectar repositório**
   ```bash
   git push origin main
   ```

2. **Configurar no Vercel**
   - Importar projeto do GitHub
   - Configurar variáveis de ambiente
   - Selecionar branch principal

3. **Deploy automático**
   - Vercel fará build e deploy automaticamente
   - URL será: `https://seu-projeto.vercel.app`

### Build Command
```bash
pnpm build
```

### Start Command
```bash
pnpm start
```

## 📦 Instalação Local

### Pré-requisitos
- Node.js 22+
- pnpm 8+
- MySQL/TiDB

### Setup

1. **Clonar repositório**
   ```bash
   git clone <seu-repo>
   cd marketplace-erp
   ```

2. **Instalar dependências**
   ```bash
   pnpm install
   ```

3. **Configurar variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Editar .env com suas credenciais
   ```

4. **Setup do banco de dados**
   ```bash
   pnpm db:push
   ```

5. **Iniciar servidor de desenvolvimento**
   ```bash
   pnpm dev
   ```

   Acesse `http://localhost:3000`

## 🧪 Testes

```bash
# Rodar testes
pnpm test

# Testes com cobertura
pnpm test:coverage
```

## 📚 Documentação Adicional

### Fluxo de Autenticação
1. Usuário clica em "Entrar"
2. Redireciona para Manus OAuth
3. Após autenticação, retorna para `/api/oauth/callback`
4. Se primeiro acesso, redireciona para seleção de tipo de usuário
5. Após seleção, redireciona para dashboard específico

### Fluxo de Avaliação
1. Usuário acessa perfil do prestador
2. Clica em "Deixar Avaliação"
3. Preenche formulário com:
   - Rating (1-5 estrelas)
   - Comentário
   - Pontos positivos/negativos
   - Recomendação
4. Avaliação é salva no banco
5. Média é recalculada automaticamente

### Fluxo de Contratação (A implementar)
1. Morador acessa marketplace
2. Busca prestador por categoria
3. Visualiza perfil e avaliações
4. Clica em "Solicitar Serviço"
5. Preenche detalhes do serviço
6. Prestador recebe notificação
7. Prestador aceita/rejeita
8. Serviço entra em progresso

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para suporte, entre em contato através de:
- Email: support@marketplace-erp.com
- Issues: GitHub Issues

---

**Desenvolvido com ❤️ para simplificar a gestão de condomínios**
