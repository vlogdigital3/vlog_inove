# Vlog INove Plus - CRM Imobiliário

Sistema de CRM Imobiliário moderno e inteligente, desenvolvido com Next.js, React e TailwindCSS.

## 🚀 Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização
- **Lucide React** - Ícones
- **@dnd-kit** - Drag and Drop para o Kanban

## 📦 Instalação

```bash
npm install
```

## 🏃 Executar

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 📱 Funcionalidades (Fase 1 - Front-End)

### ✅ Autenticação
- Login
- Cadastro de usuário
- Proteção de rotas

### ✅ Dashboard
- Cards com KPIs
- Atividades recentes
- Ações rápidas

### ✅ Gestão de Leads
- Listagem de leads
- Cadastro e edição
- Busca e filtros
- Status personalizados

### ✅ Gestão de Imóveis
- Catálogo de propriedades
- Cadastro completo
- Filtros por tipo e preço
- Placeholder para imagens

### ✅ Funil de Vendas
- Kanban interativo
- Drag & Drop entre etapas
- 6 estágios de vendas
- Resumo de valores

### ✅ Configurações
- Dados do usuário
- Tema claro/escuro
- Alteração de senha
- Dados da empresa

### ✅ Perfil
- Informações pessoais
- Avatar (placeholder)
- Estatísticas do usuário

## 🎨 Design

Interface moderna inspirada em SaaS modernos, com:
- Paleta azul e amarelo
- Modo claro e escuro
- Cards com sombras suaves
- Animações e transições
- 100% responsivo

## 📂 Estrutura do Projeto

```
d:/Vlog_INove/
├── app/
│   ├── (dashboard)/        # Rotas protegidas
│   │   ├── dashboard/
│   │   ├── leads/
│   │   ├── imoveis/
│   │   ├── funil/
│   │   ├── configuracoes/
│   │   └── perfil/
│   ├── login/
│   ├── cadastro/
│   └── layout.tsx
├── components/
│   ├── ui/                 # Componentes base
│   └── layout/             # Sidebar, Header
├── contexts/               # React Context (Auth, Theme)
├── services/               # Mock API
├── types/                  # TypeScript types
└── lib/                    # Utilities
```

## 🔄 Próximos Passos (Fase 2)

- [ ] Integração com back-end (API REST/GraphQL)
- [ ] Autenticação JWT real
- [ ] Banco de dados PostgreSQL
- [ ] Upload de imagens
- [ ] Integração com IA
- [ ] WhatsApp API
- [ ] Automações

## 📝 Notas

Este é o front-end completo da Fase 1. Todos os dados são mockados e armazenados localmente (localStorage). A arquitetura está preparada para integração futura com back-end sem necessidade de reescrever componentes.

## 👨‍💻 Desenvolvimento

Desenvolvido seguindo as melhores práticas de:
- Clean Code
- Componentização
- Responsividade
- Acessibilidade
- Performance

---

**Versão:** 1.0.0 (Fase 1 - Front-End)
