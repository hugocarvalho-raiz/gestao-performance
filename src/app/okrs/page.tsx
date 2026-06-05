'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';
import {
  Plus,
  Target,
  TrendingUp,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { formatDate, getStatusColor, getStatusLabel, getCategoriaColor, getCategoriaLabel } from '@/lib/utils';

// Dados mockados
const mockObjetivos = [
  {
    id: '1',
    titulo: 'Melhorar taxa de aprovação geral',
    descricao: 'Aumentar a taxa de aprovação dos alunos em 15% até o final do semestre',
    categoria: 'aprendizagem',
    status: 'em_andamento',
    prazo: '2026-07-31',
    keyResults: [
      { id: 'kr1', titulo: 'KR1: Aumentar frequência para 85%', valor_atual: 72, valor_meta: 85, peso: 1 },
      { id: 'kr2', titulo: 'KR2: Reduzir evasão para menos de 5%', valor_atual: 8, valor_meta: 5, peso: 1 },
      { id: 'kr3', titulo: 'KR3: Melhorar avaliações em 20%', valor_atual: 65, valor_meta: 80, peso: 2 },
    ],
  },
  {
    id: '2',
    titulo: 'Aumentar satisfação dos alunos (NPS)',
    descricao: 'Elevar o NPS de 45 para 70 pontos',
    categoria: 'satisfacao',
    status: 'atencao',
    prazo: '2026-06-30',
    keyResults: [
      { id: 'kr4', titulo: 'KR1: NPS acima de 60', valor_atual: 45, valor_meta: 70, peso: 2 },
      { id: 'kr5', titulo: 'KR2: Taxa de resposta 80%', valor_atual: 60, valor_meta: 80, peso: 1 },
    ],
  },
  {
    id: '3',
    titulo: 'Otimizar processos internos do setor',
    descricao: 'Reduzir tempo de resposta e melhorar eficiência operacional',
    categoria: 'operacional',
    status: 'atingido',
    prazo: '2026-05-31',
    keyResults: [
      { id: 'kr6', titulo: 'KR1: Reduzir tempo de entrega em 30%', valor_atual: 100, valor_meta: 100, peso: 1 },
      { id: 'kr7', titulo: 'KR2: Automatizar 50% dos processos', valor_atual: 100, valor_meta: 100, peso: 2 },
    ],
  },
];

const statusOptions = [
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'atencao', label: 'Atenção' },
  { value: 'atingido', label: 'Atingido' },
  { value: 'cancelado', label: 'Cancelado' },
];

const categoriaOptions = [
  { value: 'aprendizagem', label: 'Aprendizagem' },
  { value: 'satisfacao', label: 'Satisfação' },
  { value: 'operacional', label: 'Operacional' },
];

function calcularProgresso(krs: any[]) {
  if (!krs.length) return 0;
  const totalPeso = krs.reduce((acc, kr) => acc + kr.peso, 0);
  const progressoPonderado = krs.reduce((acc, kr) => {
    const progressoKR = Math.min((kr.valor_atual / kr.valor_meta) * 100, 100);
    return acc + progressoKR * kr.peso;
  }, 0);
  return Math.round(progressoPonderado / totalPeso);
}

export default function OKRsPage() {
  const [objetivos, setObjetivos] = useState(mockObjetivos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtro, setFiltro] = useState('todos');

  const objetivosFiltrados = filtro === 'todos'
    ? objetivos
    : objetivos.filter(o => o.categoria === filtro);

  const stats = {
    total: objetivos.length,
    emAndamento: objetivos.filter(o => o.status === 'em_andamento').length,
    atencao: objetivos.filter(o => o.status === 'atencao').length,
    atingidos: objetivos.filter(o => o.status === 'atingido').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">OKRs</h1>
          <p className="text-gray-500">Gestão de Objetivos e Key Results</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo Objetivo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total de OKRs</p>
        </Card>
        <Card className="text-center border-l-4 border-l-blue-500">
          <p className="text-3xl font-bold text-blue-600">{stats.emAndamento}</p>
          <p className="text-sm text-gray-500">Em Andamento</p>
        </Card>
        <Card className="text-center border-l-4 border-l-orange-500">
          <p className="text-3xl font-bold text-orange-600">{stats.atencao}</p>
          <p className="text-sm text-gray-500">Atenção</p>
        </Card>
        <Card className="text-center border-l-4 border-l-green-500">
          <p className="text-3xl font-bold text-green-600">{stats.atingidos}</p>
          <p className="text-sm text-gray-500">Atingidos</p>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <Button
          variant={filtro === 'todos' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFiltro('todos')}
        >
          Todos
        </Button>
        <Button
          variant={filtro === 'aprendizagem' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFiltro('aprendizagem')}
        >
          Aprendizagem
        </Button>
        <Button
          variant={filtro === 'satisfacao' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFiltro('satisfacao')}
        >
          Satisfação
        </Button>
        <Button
          variant={filtro === 'operacional' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFiltro('operacional')}
        >
          Operacional
        </Button>
      </div>

      {/* Lista de Objetivos */}
      <div className="space-y-4">
        {objetivosFiltrados.map((objetivo) => {
          const progresso = calcularProgresso(objetivo.keyResults);
          return (
            <Card key={objetivo.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                      <Target className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{objetivo.titulo}</h3>
                      <p className="mt-1 text-sm text-gray-500">{objetivo.descricao}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge className={getCategoriaColor(objetivo.categoria)}>
                          {getCategoriaLabel(objetivo.categoria)}
                        </Badge>
                        <Badge className={getStatusColor(objetivo.status)}>
                          {getStatusLabel(objetivo.status)}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          Prazo: {formatDate(objetivo.prazo)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progresso</span>
                    <span className="text-lg font-bold text-gray-900">{progresso}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all ${
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

              {/* Key Results */}
              <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Key Results</h4>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar KR
                  </Button>
                </div>
                <div className="space-y-2">
                  {objetivo.keyResults.map((kr) => {
                    const progressoKR = Math.min((kr.valor_atual / kr.valor_meta) * 100, 100);
                    return (
                      <div
                        key={kr.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                      >
                        <span className="text-sm text-gray-700">{kr.titulo}</span>
                        <div className="flex items-center gap-4">
                          <div className="w-32">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full bg-indigo-500"
                                style={{ width: `${progressoKR}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {kr.valor_atual}/{kr.valor_meta}
                          </span>
                          {progressoKR >= 100 && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal de Novo Objetivo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Objetivo"
        size="lg"
      >
        <form className="space-y-4">
          <Input label="Título do Objetivo" placeholder="Ex: Melhorar taxa de aprovação" />
          <Textarea label="Descrição" placeholder="Descreva o objetivo..." />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Categoria" options={categoriaOptions} />
            <Select label="Status" options={statusOptions} />
          </div>
          <Input label="Prazo" type="date" />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button>Salvar Objetivo</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}