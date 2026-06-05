import { create } from 'zustand';
import type { Objetivo, Projeto, Tarefa, Evento, DashboardStats } from './types';

// Store principal da aplicação
interface AppState {
  // Dados
  objetivos: Objetivo[];
  projetos: Projeto[];
  tarefas: Tarefa[];
  eventos: Evento[];

  // UI State
  isLoading: boolean;
  error: string | null;
  sidebarOpen: boolean;

  // Actions
  setObjetivos: (objetivos: Objetivo[]) => void;
  setProjetos: (projetos: Projeto[]) => void;
  setTarefas: (tarefas: Tarefa[]) => void;
  setEventos: (eventos: Evento[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleSidebar: () => void;

  // Computed
  getStats: () => DashboardStats;
}

export const useStore = create<AppState>((set, get) => ({
  // Estado inicial
  objetivos: [],
  projetos: [],
  tarefas: [],
  eventos: [],
  isLoading: false,
  error: null,
  sidebarOpen: true,

  // Actions
  setObjetivos: (objetivos) => set({ objetivos }),
  setProjetos: (projetos) => set({ projetos }),
  setTarefas: (tarefas) => set({ tarefas }),
  setEventos: (eventos) => set({ eventos }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Computed
  getStats: () => {
    const state = get();
    const hoje = new Date().toISOString().split('T')[0];

    return {
      totalObjetivos: state.objetivos.length,
      objetivosEmAndamento: state.objetivos.filter(o => o.status === 'em_andamento').length,
      objetivosAtencao: state.objetivos.filter(o => o.status === 'atencao').length,
      totalProjetos: state.projetos.length,
      projetosEmExecucao: state.projetos.filter(p => p.status === 'em_execucao').length,
      tarefasPendentes: state.tarefas.filter(t => t.status !== 'concluida').length,
      tarefasVencidas: state.tarefas.filter(t => t.prazo < hoje && t.status !== 'concluida').length,
      eventosHoje: state.eventos.filter(e => e.data_inicio.startsWith(hoje)).length,
    };
  },
}));

// Store para modal de criação/edição
interface ModalState {
  isOpen: boolean;
  type: 'objetivo' | 'projeto' | 'tarefa' | 'evento' | null;
  data: any;
  openModal: (type: ModalState['type'], data?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  type: null,
  data: null,
  openModal: (type, data = null) => set({ isOpen: true, type, data }),
  closeModal: () => set({ isOpen: false, type: null, data: null }),
}));