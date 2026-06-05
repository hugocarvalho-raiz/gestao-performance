# Sistema de Gestão de Performance Pedagógica

Sistema completo para gestão de OKRs, projetos e rotina operacional do setor de Performance Pedagógica.

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Iniciar development server
npm run dev

# Abrir no navegador
# http://localhost:3000
```

## 📋 Funcionalidades

### Dashboard Principal
- Visão geral com cards de indicadores
- OKRs em destaque com progresso
- Tarefas urgentes
- Eventos do dia
- Alertas de atenção

### 🎯 Módulo OKRs
- CRUD completo de Objetivos e Key Results
- Gráficos de progresso
- Filtros por categoria (Aprendizagem, Satisfação, Operacional)
- Status: Em Andamento, Atenção, Atingido, Cancelado

### 📁 Módulo Projetos
- Gestão de projetos com status
- Marcos (milestones) com acompanhamento
- Registro de lições aprendidas
- Associação com OKRs

### 📅 Módulo Rotina
- Calendário semanal interativo
- Lista de tarefas com prioridades
- Eventos e agenda
- Alocação de tempo por pessoa

## 🛠️ Stack Técnica

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Estado**: Zustand
- **Banco de dados**: Supabase (PostgreSQL)
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Deploy**: Vercel

## 📁 Estrutura do Projeto

```
gestao-performance/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Dashboard
│   │   ├── okrs/page.tsx     # Módulo OKRs
│   │   ├── projetos/page.tsx # Módulo Projetos
│   │   └── rotina/page.tsx   # Módulo Rotina
│   ├── components/
│   │   ├── layout/           # Layout e Sidebar
│   │   └── ui/               # Componentes UI
│   └── lib/
│       ├── types.ts          # Tipos TypeScript
│       ├── store.ts          # Estado global
│       ├── supabase.ts       # Cliente Supabase
│       └── utils.ts          # Utilitários
├── supabase-schema.sql       # Schema do banco
└── .env.example              # Variáveis de ambiente
```

## 🔧 Configuração do Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute o SQL em `supabase-schema.sql` no SQL Editor
3. Copie `.env.example` para `.env.local` e preencha:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
   ```

## 🚀 Deploy no Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy em produção
vercel --prod
```

Ou conecte o repositório GitHub ao Vercel para deploy automático.

## 📝 Dados Mockados

O sistema vem com dados mockados para demonstração. Para usar dados reais:
1. Configure o Supabase
2. Execute o schema SQL
3. Remova os dados mockados dos arquivos de página

## 🔒 Segurança

- Row Level Security (RLS) configurado no Supabase
- Políticas para controle de acesso por tabela
- Variáveis de ambiente para credenciais

## 📄 Licença

MIT