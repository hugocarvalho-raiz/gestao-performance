# Database SQL para Supabase
# Execute este SQL no SQL Editor do Supabase para criar as tabelas

-- =============================================
-- SCHEMA: Performance Pedagógica
-- =============================================

-- Objetivos (OKRs)
CREATE TABLE IF NOT EXISTS objetivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT CHECK (categoria IN ('aprendizagem', 'satisfacao', 'operacional')) DEFAULT 'aprendizagem',
  status TEXT CHECK (status IN ('em_andamento', 'atencao', 'atingido', 'cancelado')) DEFAULT 'em_andamento',
  prazo DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Key Results
CREATE TABLE IF NOT EXISTS key_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  objetivo_id UUID REFERENCES objetivos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  metrica TEXT,
  valor_atual NUMERIC DEFAULT 0,
  valor_meta NUMERIC NOT NULL,
  peso INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Projetos
CREATE TABLE IF NOT EXISTS projetos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  responsavel TEXT,
  status TEXT CHECK (status IN ('planejamento', 'em_execucao', 'concluido', 'bloqueado')) DEFAULT 'planejamento',
  prazo DATE,
  objetivo_id UUID REFERENCES objetivos(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Marcos dos Projetos
CREATE TABLE IF NOT EXISTS marcos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  prazo DATE,
  status TEXT CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'cancelada')) DEFAULT 'pendente',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lições Aprendidas
CREATE TABLE IF NOT EXISTS licoes_aprendidas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tarefas
CREATE TABLE IF NOT EXISTS tarefas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  prioridade TEXT CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')) DEFAULT 'media',
  assignee TEXT,
  prazo DATE,
  status TEXT CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'cancelada')) DEFAULT 'pendente',
  projeto_id UUID REFERENCES projetos(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Eventos (Agenda)
CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_inicio TIMESTAMPTZ NOT NULL,
  data_fim TIMESTAMPTZ NOT NULL,
  tipo TEXT CHECK (tipo IN ('reuniao', 'evento', 'deadline')) DEFAULT 'evento',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE objetivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcos ENABLE ROW LEVEL SECURITY;
ALTER TABLE licoes_aprendidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

-- Políticas para允许匿名 acesso (modo demo)
-- Em produção, substitua por políticas de autenticação real

CREATE POLICY "Allow all for objetivos" ON objetivos FOR ALL USING (true);
CREATE POLICY "Allow all for key_results" ON key_results FOR ALL USING (true);
CREATE POLICY "Allow all for projetos" ON projetos FOR ALL USING (true);
CREATE POLICY "Allow all for marcos" ON marcos FOR ALL USING (true);
CREATE POLICY "Allow all for licoes_aprendidas" ON licoes_aprendidas FOR ALL USING (true);
CREATE POLICY "Allow all for tarefas" ON tarefas FOR ALL USING (true);
CREATE POLICY "Allow all for eventos" ON eventos FOR ALL USING (true);

-- =============================================
-- INDICES
-- =============================================

CREATE INDEX idx_objetivos_categoria ON objetivos(categoria);
CREATE INDEX idx_objetivos_status ON objetivos(status);
CREATE INDEX idx_projetos_status ON projetos(status);
CREATE INDEX idx_tarefas_status ON tarefas(status);
CREATE INDEX idx_tarefas_prazo ON tarefas(prazo);
CREATE INDEX idx_eventos_data_inicio ON eventos(data_inicio);

-- =============================================
-- FUNÇÕES
-- =============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_objetivos_updated_at
  BEFORE UPDATE ON objetivos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projetos_updated_at
  BEFORE UPDATE ON projetos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tarefas_updated_at
  BEFORE UPDATE ON tarefas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();