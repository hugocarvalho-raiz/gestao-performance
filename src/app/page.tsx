'use client';

import { useEffect, useState } from 'react';
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
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Objetivo {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  status: string;
  prazo: string;
  key_results?: any[];
}

interface Tarefa {
  id: string;
  titulo: string;
  prazo: string;
  prioridade: string;
}

interface Evento {
  id: string;
  titulo: string;
  data_inicio: string;
  tipo: string;
}

interface Stats {
  objetivosEmAndamento: number;
  objetivosAtencao: number;
  projetosEmExecucao: number;
  tarefasPendentes: number;
  tarefasVencidas: number;
  eventosHoje: number;
}

export default function DashboardPage() {
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [stats, setStats] = useState<Stats>({
    objetivosEmAndamento: 0,
    objetivosAtencao: 0,
    projetosEmExecucao: 0,
    tarefasPendentes: 0,
    tarefasVencidas: 0,
    eventosHoje: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const hoje = new Date().toISOString().split('T')[0];

        // Buscar objetivos
        const { data: objetivosData } = await supabase
          .from('objetivos')
          .select('*, key_results(*)')
          .limit(3);

        // Buscar tarefas
        const { data: tarefasData } = await supabase
          .from('tarefas')
          .select('*')
          .in('status', ['pendente', 'em_andamento'])
          .order('prazo', { ascending: true })
          .limit(5);

        // Buscar eventos
        const { data: eventosData } = await supabase
          .from('eventos')
          .select('*')
          .gte('data_inicio', `${hoje}T00:00:00`)
          .lte('data_inicio', `${hoje}T23:59:59`)
          .order('data_inicio', { ascending: true });

        // Buscar stats
        const [objsCount, tarefasCount, projetosCount] = await Promise.all([
          supabase.from('objetivos').select('id', { count: 'exact', head: true }),
          supabase.from('tarefas').select('id', { count: 'exact', head: true }).in('status', ['pendente', 'em_andamento']),
          supabase.from('projetos').select('id', { count: 'exact', head: true }).eq('status', 'em_execucao'),
        ]);

        setObjetivos(objetivosData || []);
        setTarefas(tarefasData || []);
        setEventos(eventosData || []);

        setStats({
          objetivosEmAndamento: objsCount.count || 0,
          objetivosAtencao: (objetivosData || []).filter((o: any) => o.status === 'atencao').length,
          projetosEmExecucao: projetosCount.count || 0,
          tarefasPendentes: tarefasCount.count || 0,
          tarefasVencidas: (tarefasData || []).filter((t: any) => t.prazo < hoje).length,
          eventosHoje: eventosData?.length || 0,
        });
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const calcularProgresso = (objetivo: Objetivo) => {
    if (!objetivo.key_results?.length) return 0;
    const totalPeso = objetivo.key_results.reduce((acc: number, kr: any) => acc + (kr.peso || 1), 0);
    const progressoPonderado = objetivo.key_results.reduce((acc: number, kr: any) => {
      const progressoKR = Math.min(((kr.valor_atual || 0) / (kr.valor_meta || 1)) * 100, 100);
      return acc + progressoKR * (kr.peso || 1);
    }, 0);
    return Math.round(progressoPonderado / totalPeso);
  };

  const formatarHora = (data: string) => {
    return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

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
              <p className="text-3xl font-bold text-gray-900">{stats.objetivosEmAndamento}</p>
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
              <p className="text-3xl font-bold text-gray-900">{stats.projetosEmExecucao}</p>
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
              <p className="text-3xl font-bold text-gray-900">{stats.tarefasPendentes}</p>
              <div className="flex items-center gap-1">
                {stats.tarefasVencidas > 0 && (
                  <>
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-500">{stats.tarefasVencidas} vencidas</span>
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
              <p className="text-3xl font-bold text-gray-900">{stats.eventosHoje}</p>
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
            {objetivos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum OKR cadastrado ainda.</p>
            ) : (
              <div className="space-y-4">
                {objetivos.map((objetivo) => {
                  const progresso = calcularProgresso(objetivo);
                  return (
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
                              variant={objetivo.status === 'em_andamento' ? 'info' : objetivo.status === 'atencao' ? 'warning' : 'success'}
                            >
                              {objetivo.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">{progresso}%</span>
                        <div className="mt-1 h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full ${
                              progresso >= 80
                                ? 'bg-green-500'
                                : progresso >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${progresso}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
            {tarefas.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhuma tarefa pendente.</p>
            ) : (
              <div className="space-y-3">
                {tarefas.map((tarefa) => (
                  <div
                    key={tarefa.id}
                    className="flex items-start gap-3 rounded-lg border border-gray-100 p-3"
                  >
                    <div
                      className={`mt-0.5 h-2 w-2 rounded-full ${
                        tarefa.prioridade === 'alta' || tarefa.prioridade === 'urgente' ? 'bg-red-500' : 'bg-yellow-500'
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
            )}
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
          {eventos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhum evento hoje.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {eventos.map((evento) => (
                <div
                  key={evento.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-100 p-4"
                >
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-indigo-50">
                    <span className="text-lg font-bold text-indigo-600">{formatarHora(evento.data_inicio)}</span>
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
          )}
        </CardContent>
      </Card>

      {/* Alerta de Atenção */}
      {stats.objetivosAtencao > 0 && (
        <div className="flex items-center gap-4 rounded-lg border border-orange-200 bg-orange-50 p-4">
          <AlertTriangle className="h-6 w-6 text-orange-600" />
          <div>
            <p className="font-medium text-orange-900">
              {stats.objetivosAtencao} OKRs precisam de atenção
            </p>
            <p className="text-sm text-orange-700">
              Alguns objetivos estão com progresso abaixo do esperado. Revise as metas.
            </p>
          </div>
          <Link href="/okrs">
            <Button variant="outline" className="ml-auto">
              Revisar OKRs
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}