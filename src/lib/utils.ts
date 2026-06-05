import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getProgressColor(progress: number): string {
  if (progress >= 80) return 'text-green-600';
  if (progress >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    em_andamento: 'bg-blue-100 text-blue-800',
    atencao: 'bg-orange-100 text-orange-800',
    atingido: 'bg-green-100 text-green-800',
    cancelado: 'bg-gray-100 text-gray-800',
    planejamento: 'bg-purple-100 text-purple-800',
    em_execucao: 'bg-blue-100 text-blue-800',
    concluido: 'bg-green-100 text-green-800',
    bloqueado: 'bg-red-100 text-red-800',
    pendente: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    em_andamento: 'Em Andamento',
    atencao: 'Atenção',
    atingido: 'Atingido',
    cancelado: 'Cancelado',
    planejamento: 'Planejamento',
    em_execucao: 'Em Execução',
    concluido: 'Concluído',
    bloqueado: 'Bloqueado',
    pendente: 'Pendente',
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa',
    urgente: 'Urgente',
  };
  return labels[status] || status;
}

export function getCategoriaColor(categoria: string): string {
  const colors: Record<string, string> = {
    aprendizagem: 'bg-indigo-100 text-indigo-800',
    satisfacao: 'bg-pink-100 text-pink-800',
    operacional: 'bg-cyan-100 text-cyan-800',
  };
  return colors[categoria] || 'bg-gray-100 text-gray-800';
}

export function getCategoriaLabel(categoria: string): string {
  const labels: Record<string, string> = {
    aprendizagem: 'Aprendizagem',
    satisfacao: 'Satisfação',
    operacional: 'Operacional',
  };
  return labels[categoria] || categoria;
}