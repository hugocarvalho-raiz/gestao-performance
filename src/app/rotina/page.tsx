'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';
import {
  Plus,
  Calendar,
  CheckSquare,
  Clock,
  User,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';

// Dados mockados
const mockTarefas = [
  { id: '1', titulo: 'Revisar material didático de matemática', descricao: '', prioridade: 'alta', assignee: 'Maria Silva', prazo: '2026-06-05', status: 'pendente', projeto_id: '1' },
  { id: '2', titulo: 'Preparar apresentação para reunião', descricao: '', prioridade: 'alta', assignee: 'João Santos', prazo: '2026-06-05', status: 'em_andamento', projeto_id: null },
  { id: '3', titulo: 'Enviar relatório mensal', descricao: '', prioridade: 'media', assignee: 'Ana Costa', prazo: '2026-06-06', status: 'pendente', projeto_id: null },
  { id: '4', titulo: 'Revisar conteúdo do curso', descricao: '', prioridade: 'media', assignee: 'Maria Silva', prazo: '2026-06-07', status: 'pendente', projeto_id: '1' },
  { id: '5', titulo: 'Atualizar planilha de métricas', descricao: '', prioridade: 'baixa', assignee: 'João Santos', prazo: '2026-06-10', status: 'pendente', projeto_id: null },
];

const mockEventos = [
  { id: '1', titulo: 'Reunião de planejamento semanal', descricao: '', data_inicio: '2026-06-05T09:00:00', data_fim: '2026-06-05T10:00:00', tipo: 'reuniao' },
  { id: '2', titulo: 'Deadline: Entrega do projeto X', descricao: '', data_inicio: '2026-06-05T14:00:00', data_fim: '2026-06-05T14:00:00', tipo: 'deadline' },
  { id: '3', titulo: 'Workshop de capacitação', descricao: '', data_inicio: '2026-06-05T15:00:00', data_fim: '2026-06-05T17:00:00', tipo: 'evento' },
  { id: '4', titulo: 'Revisão de entrega', descricao: '', data_inicio: '2026-06-06T10:00:00', data_fim: '2026-06-06T11:00:00', tipo: 'reuniao' },
  { id: '5', titulo: 'Sessão de brainstorming', descricao: '', data_inicio: '2026-06-07T14:00:00', data_fim: '2026-06-07T16:00:00', tipo: 'evento' },
];

const mockEquipe = ['Maria Silva', 'João Santos', 'Ana Costa', 'Pedro Oliveira'];

const prioridadeOptions = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
  { value: 'urgente', label: 'Urgente' },
];

const statusTarefaOptions = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'concluida', label: 'Concluída' },
  { value: 'cancelada', label: 'Cancelada' },
];

function getDiasSemana() {
  const hoje = new Date();
  const segunda = new Date(hoje);
  segunda.setDate(hoje.getDate() - hoje.getDay() + 1);

  return Array.from({ length: 7 }, (_, i) => {
    const dia = new Date(segunda);
    dia.setDate(segunda.getDate() + i);
    return dia;
  });
}

export default function RotinaPage() {
  const [tarefas, setTarefas] = useState(mockTarefas);
  const [eventos, setEventos] = useState(mockEventos);
  const [isTarefaModalOpen, setIsTarefaModalOpen] = useState(false);
  const [isEventoModalOpen, setIsEventoModalOpen] = useState(false);
  const [filtro, setFiltro] = useState('todas');
  const [semanaAtual, setSemanaAtual] = useState(new Date());

  const tarefasPendentes = tarefas.filter(t => t.status !== 'concluida' && t.status !== 'cancelada');
  const tarefasUrgentes = tarefasPendentes.filter(t => t.prioridade === 'alta' || t.prioridade === 'urgente');
  const tarefasVencidas = tarefasPendentes.filter(t => new Date(t.prazo) < new Date() && t.status !== 'concluida');

  const tarefasFiltradas = filtro === 'todas'
    ? tarefas
    : filtro === 'pendentes'
    ? tarefasPendentes
    : filtro === 'urgentes'
    ? tarefasUrgentes
    : tarefas.filter(t => t.prioridade === filtro);

  const diasSemana = getDiasSemana();

  const formatarHora = (data: string) => {
    return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rotina</h1>
          <p className="text-gray-500">Agenda, tarefas e alocação de tempo</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEventoModalOpen(true)}>
            <Calendar className="h-4 w-4" />
            Novo Evento
          </Button>
          <Button onClick={() => setIsTarefaModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Stats Rápidas */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-gray-900">{tarefas.length}</p>
          <p className="text-sm text-gray-500">Total de Tarefas</p>
        </Card>
        <Card className="text-center border-l-4 border-l-blue-500">
          <p className="text-3xl font-bold text-blue-600">{tarefasPendentes.length}</p>
          <p className="text-sm text-gray-500">Pendentes</p>
        </Card>
        <Card className="text-center border-l-4 border-l-orange-500">
          <p className="text-3xl font-bold text-orange-600">{tarefasVencidas.length}</p>
          <p className="text-sm text-gray-500">Vencidas</p>
        </Card>
        <Card className="text-center border-l-4 border-l-red-500">
          <p className="text-3xl font-bold text-red-600">{tarefasUrgentes.length}</p>
          <p className="text-sm text-gray-500">Urgentes</p>
        </Card>
      </div>

      {/* Calendário Semanal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Calendário Semanal
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => {
              const novaData = new Date(semanaAtual);
              novaData.setDate(novaData.getDate() - 7);
              setSemanaAtual(novaData);
            }}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {diasSemana[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - {diasSemana[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <Button variant="ghost" size="icon" onClick={() => {
              const novaData = new Date(semanaAtual);
              novaData.setDate(novaData.getDate() + 7);
              setSemanaAtual(novaData);
            }}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {diasSemana.map((dia, index) => {
              const eventosDoDia = mockEventos.filter(e =>
                new Date(e.data_inicio).toDateString() === dia.toDateString()
              );
              const tarefasDoDia = tarefasPendentes.filter(t =>
                new Date(t.prazo).toDateString() === dia.toDateString()
              );
              const isHoje = dia.toDateString() === new Date().toDateString();

              return (
                <div
                  key={index}
                  className={`min-h-[150px] rounded-lg border p-2 ${
                    isHoje ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-200'
                  }`}
                >
                  <div className={`text-center mb-2 ${isHoje ? 'text-indigo-600' : ''}`}>
                    <p className="text-xs text-gray-400">
                      {dia.toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </p>
                    <p className={`text-lg font-bold ${isHoje ? 'text-indigo-600' : 'text-gray-900'}`}>
                      {dia.getDate()}
                    </p>
                  </div>

                  {/* Eventos */}
                  <div className="space-y-1">
                    {eventosDoDia.slice(0, 2).map((evento) => (
                      <div
                        key={evento.id}
                        className={`rounded px-1 py-0.5 text-xs ${
                          evento.tipo === 'reuniao'
                            ? 'bg-blue-100 text-blue-700'
                            : evento.tipo === 'deadline'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {formatarHora(evento.data_inicio)} {evento.titulo}
                      </div>
                    ))}
                    {eventosDoDia.length > 2 && (
                      <p className="text-xs text-gray-400">+{eventosDoDia.length - 2} mais</p>
                    )}
                  </div>

                  {/* Tarefas */}
                  <div className="mt-2 space-y-1">
                    {tarefasDoDia.slice(0, 2).map((tarefa) => (
                      <div
                        key={tarefa.id}
                        className="rounded bg-gray-100 px-1 py-0.5 text-xs"
                      >
                        {tarefa.titulo.substring(0, 20)}...
                      </div>
                    ))}
                    {tarefasDoDia.length > 2 && (
                      <p className="text-xs text-gray-400">+{tarefasDoDia.length - 2} mais</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tarefas e Eventos em Duas Colunas */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lista de Tarefas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-blue-600" />
              Tarefas
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={filtro === 'todas' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFiltro('todas')}
              >
                Todas
              </Button>
              <Button
                variant={filtro === 'pendentes' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFiltro('pendentes')}
              >
                Pendentes
              </Button>
              <Button
                variant={filtro === 'alta' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFiltro('alta')}
              >
                Urgentes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tarefasFiltradas.map((tarefa) => {
                const isVencida = new Date(tarefa.prazo) < new Date() && tarefa.status !== 'concluida';
                return (
                  <div
                    key={tarefa.id}
                    className={`flex items-start gap-3 rounded-lg border p-3 ${
                      isVencida ? 'border-red-200 bg-red-50/50' : 'border-gray-200'
                    }`}
                  >
                    <button
                      className="mt-0.5"
                      onClick={() => {
                        setTarefas(tarefas.map(t =>
                          t.id === tarefa.id
                            ? { ...t, status: t.status === 'concluida' ? 'pendente' : 'concluida' }
                            : t
                        ));
                      }}
                    >
                      {tarefa.status === 'concluida' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium ${tarefa.status === 'concluida' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {tarefa.titulo}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge
                          variant={
                            tarefa.prioridade === 'alta' || tarefa.prioridade === 'urgente'
                              ? 'danger'
                              : tarefa.prioridade === 'media'
                              ? 'warning'
                              : 'default'
                          }
                        >
                          {tarefa.prioridade}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(tarefa.prazo)}
                        </span>
                        <span className="text-xs text-gray-400">• {tarefa.assignee}</span>
                        {isVencida && (
                          <Badge variant="danger" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Vencida
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Eventos do Dia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockEventos.map((evento) => (
                <div
                  key={evento.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-indigo-50">
                    <span className="text-sm font-bold text-indigo-600">
                      {formatarHora(evento.data_inicio)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{evento.titulo}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant={
                          evento.tipo === 'reuniao' ? 'info' : evento.tipo === 'deadline' ? 'danger' : 'success'
                        }
                      >
                        {evento.tipo}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {formatarHora(evento.data_inicio)} - {formatarHora(evento.data_fim)}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Nova Tarefa */}
      <Modal
        isOpen={isTarefaModalOpen}
        onClose={() => setIsTarefaModalOpen(false)}
        title="Nova Tarefa"
        size="md"
      >
        <form className="space-y-4">
          <Input label="Título" placeholder="Ex: Revisar material didático" />
          <Textarea label="Descrição" placeholder="Detalhes da tarefa..." />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Prioridade" options={prioridadeOptions} />
            <Select label="Responsável" options={mockEquipe.map(e => ({ value: e, label: e }))} />
          </div>
          <Input label="Prazo" type="date" />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsTarefaModalOpen(false)}>
              Cancelar
            </Button>
            <Button>Salvar Tarefa</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Novo Evento */}
      <Modal
        isOpen={isEventoModalOpen}
        onClose={() => setIsEventoModalOpen(false)}
        title="Novo Evento"
        size="md"
      >
        <form className="space-y-4">
          <Input label="Título" placeholder="Ex: Reunião de planejamento" />
          <Textarea label="Descrição" placeholder="Detalhes do evento..." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Data e Hora de Início" type="datetime-local" />
            <Input label="Data e Hora de Término" type="datetime-local" />
          </div>
          <Select
            label="Tipo"
            options={[
              { value: 'reuniao', label: 'Reunião' },
              { value: 'evento', label: 'Evento' },
              { value: 'deadline', label: 'Deadline' },
            ]}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEventoModalOpen(false)}>
              Cancelar
            </Button>
            <Button>Salvar Evento</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}