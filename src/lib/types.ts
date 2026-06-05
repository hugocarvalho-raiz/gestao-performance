// Tipos para o sistema de Gestão de Performance Pedagógica

export type CategoriaOKR = 'aprendizagem' | 'satisfacao' | 'operacional';
export type StatusOKR = 'em_andamento' | 'atencao' | 'atingido' | 'cancelado';
export type StatusProjeto = 'planejamento' | 'em_execucao' | 'concluido' | 'bloqueado';
export type PrioridadeTarefa = 'baixa' | 'media' | 'alta' | 'urgente';
export type StatusTarefa = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
export type TipoEvento = 'reuniao' | 'evento' | 'deadline';

export interface Objetivo {
  id: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaOKR;
  status: StatusOKR;
  prazo: string;
  created_at: string;
  keyResults: KeyResult[];
}

export interface KeyResult {
  id: string;
  objetivo_id: string;
  titulo: string;
  metrica: string;
  valor_atual: number;
  valor_meta: number;
  peso: number;
}

export interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  status: StatusProjeto;
  prazo: string;
  objetivo_id: string | null;
  created_at: string;
  marcos: Marco[];
  licoes: LicaoAprendida[];
}

export interface Marco {
  id: string;
  projeto_id: string;
  titulo: string;
  prazo: string;
  status: StatusTarefa;
}

export interface LicaoAprendida {
  id: string;
  projeto_id: string;
  conteudo: string;
  created_at: string;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: PrioridadeTarefa;
  assignee: string;
  prazo: string;
  status: StatusTarefa;
  projeto_id: string | null;
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  tipo: TipoEvento;
}

// Resumo para dashboard
export interface DashboardStats {
  totalObjetivos: number;
  objetivosEmAndamento: number;
  objetivosAtencao: number;
  totalProjetos: number;
  projetosEmExecucao: number;
  tarefasPendentes: number;
  tarefasVencidas: number;
  eventosHoje: number;
}