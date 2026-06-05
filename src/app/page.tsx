'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Target,
  FolderKanban,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Plus,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

// Dados mockados para demonstração
const mockStats = {
  objetivosEmAndamento: 8,
  objetivosAtencao: 3,
  projetosEmExecucao: 5,
  tarefasPendentes: 12,
  tarefasVencidas: 2,
  eventosHoje: 4,
};

const mockObjetivos = [
  {
    id: '1',
    titulo: 'Melhorar taxa de aprovação',
    categoria: 'aprendizagem',
    status: 'em_andamento',
    progresso: 65,
  },
  {
    id: '2',
    titulo: 'Aumentar NPS dos alunos',
    categoria: 'satisfacao',
    status: 'atencao',
    progresso: 35,
  },
  {
    id: '3',
    titulo: 'Otimizar processos internos',
    categoria: 'operacional',
    status: 'em_andamento',
    progresso: 80,
  },
];

const mockTarefasUrgentes = [
  { id: '1', titulo: 'Revisar material didático', prazo: '2026-06-05', prioridade: 'alta' },
  { id: '2', titulo: 'Reunião com equipe', prazo: '2026-06-05', prioridade: 'alta' },
  { id: '3', titulo: 'Enviar relatório mensal', prazo: '2026-06-06', prioridade: 'media' },
];

const mockEventos = [
  { id: '1', titulo: 'Reunião de planejamento', hora: '09:00', tipo: 'reuniao' },
  { id: '2', titulo: 'Deadline: Entrega do projeto X', hora: '14:00', tipo: 'deadline' },
  { id: '3', titulo: 'Workshop de capacitação', hora: '15:00', tipo: 'evento' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Visão geral do setor de Performance Pedagógica</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </Button>
          <Button>
            <Plus className="h-4 w-4" />
            Novo OKR
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">OKRs em Andamento</p>
              <p className="text-3xl font-bold text-gray-900">{mockStats.objetivosEmAndamento}</p>
              <p className="text-xs text-gray-400">+3 este mês</p>
            </div>
            <div className="rounded-full bg-indigo-100 p-3">
              <Target className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Projetos Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{mockStats.projetosEmExecucao}</p>
              <p className="text-xs text-gray-400">2 concluídos</p>
            </div>
            <div className="rounded-full bg-orange-100 p-3">
              <FolderKanban className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tarefas Pendentes</p>
              <p className="text-3xl font-bold text-gray-900">{mockStats.tarefasPendentes}</p>
              <div className="flex items-center gap-1">
                {mockStats.tarefasVencidas > 0 && (
                  <>
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-500">{mockStats.tarefasVencidas} vencidas</span>
                  </>
                )}
              </div>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Eventos Hoje</p>
              <p className="text-3xl font-bold text-gray-900">{mockStats.eventosHoje}</p>
              <p className="text-xs text-gray-400">Próxima: 09:00</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <CalendarCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* OKRs em Destaque */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              OKRs em Destaque
            </CardTitle>
            <Link href="/okrs" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Ver todos <ChevronRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockObjetivos.map((objetivo) => (
                <div
                  key={objetivo.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                      <Target className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{objetivo.titulo}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            objetivo.categoria === 'aprendizagem'
                              ? 'info'
                              : objetivo.categoria === 'satisfacao'
                              ? 'warning'
                              : 'default'
                          }
                        >
                          {objetivo.categoria}
                        </Badge>
                        <Badge
                          variant={objetivo.status === 'em_andamento' ? 'info' : 'warning'}
                        >
                          {objetivo.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">{objetivo.progresso}%</span>
                    <div className="mt-1 h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${
                          objetivo.progresso >= 80
                            ? 'bg-green-500'
                            : objetivo.progresso >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${objetivo.progresso}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tarefas Urgentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Tarefas Urgentes
            </CardTitle>
            <Link href="/rotina" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Ver todas <ChevronRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTarefasUrgentes.map((tarefa) => (
                <div
                  key={tarefa.id}
                  className="flex items-start gap-3 rounded-lg border border-gray-100 p-3"
                >
                  <div
                    className={`mt-0.5 h-2 w-2 rounded-full ${
                      tarefa.prioridade === 'alta' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{tarefa.titulo}</p>
                    <p className="text-xs text-gray-500">
                      Prazo: {new Date(tarefa.prazo).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Eventos do Dia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-green-600" />
            Eventos de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {mockEventos.map((evento) => (
              <div
                key={evento.id}
                className="flex items-center gap-4 rounded-lg border border-gray-100 p-4"
              >
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-indigo-50">
                  <span className="text-lg font-bold text-indigo-600">{evento.hora}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{evento.titulo}</p>
                  <Badge variant={evento.tipo === 'reuniao' ? 'info' : evento.tipo === 'deadline' ? 'danger' : 'success'}>
                    {evento.tipo}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerta de Atenção */}
      {mockStats.objetivosAtencao > 0 && (
        <div className="flex items-center gap-4 rounded-lg border border-orange-200 bg-orange-50 p-4">
          <AlertTriangle className="h-6 w-6 text-orange-600" />
          <div>
            <p className="font-medium text-orange-900">
              {mockStats.objetivosAtencao} OKRs precisam de atenção
            </p>
            <p className="text-sm text-orange-700">
              Alguns objetivos estão com progresso abaixo do esperado. Revise as metas.
            </p>
          </div>
          <Button variant="outline" className="ml-auto">
            Revisar OKRs
          </Button>
        </div>
      )}
    </div>
  );
}