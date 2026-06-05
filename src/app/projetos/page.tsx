'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useState, useEffect } from 'react';
import {
  Plus,
  FolderKanban,
  Calendar,
  User,
  Edit2,
  Trash2,
  CheckCircle2,
  Lightbulb,
  Target,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';

interface Marco {
  id: string;
  titulo: string;
  prazo: string;
  status: string;
}

interface Licao {
  id: string;
  conteudo: string;
  created_at: string;
}

interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  status: string;
  prazo: string;
  objetivo_id: string;
  marcos: Marco[];
  licoes: Licao[];
}

const statusOptions = [
  { value: 'planejamento', label: 'Planejamento' },
  { value: 'em_execucao', label: 'Em Execução' },
  { value: 'concluido', label: 'Concluído' },
  { value: 'bloqueado', label: 'Bloqueado' },
];

function calcularProgressoMarcos(marcos: Marco[]) {
  if (!marcos?.length) return 0;
  const concluidos = marcos.filter(m => m.status === 'concluida').length;
  return Math.round((concluidos / marcos.length) * 100);
}

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProjetos() {
      try {
        const { data, error } = await supabase
          .from('projetos')
          .select('*, marcos(*), licoes_aprendidas(*)')
 .order('created_at', { ascending: false });

        if (error) throw error;
        setProjetos(data || []);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjetos();
  }, []);

  const stats = {
    total: projetos.length,
    emExecucao: projetos.filter(p => p.status === 'em_execucao').length,
    planejamento: projetos.filter(p => p.status === 'planejamento').length,
    concluidos: projetos.filter(p => p.status === 'concluido').length,
    bloqueados: projetos.filter(p => p.status === 'bloqueado').length,
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
          <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-500">Gestão de projetos e lições aprendidas</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Card className="text-center">
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </Card>
        <Card className="text-center border-l-4 border-l-purple-500">
          <p className="text-3xl font-bold text-purple-600">{stats.planejamento}</p>
          <p className="text-sm text-gray-500">Planejamento</p>
        </Card>
        <Card className="text-center border-l-4 border-l-blue-500">
          <p className="text-3xl font-bold text-blue-600">{stats.emExecucao}</p>
          <p className="text-sm text-gray-500">Em Execução</p>
        </Card>
        <Card className="text-center border-l-4 border-l-green-500">
          <p className="text-3xl font-bold text-green-600">{stats.concluidos}</p>
          <p className="text-sm text-gray-500">Concluídos</p>
        </Card>
        <Card className="text-center border-l-4 border-l-red-500">
          <p className="text-3xl font-bold text-red-600">{stats.bloqueados}</p>
          <p className="text-sm text-gray-500">Bloqueados</p>
        </Card>
      </div>

      {/* Lista de Projetos */}
      {projetos.length === 0 ? (
        <Card className="text-center py-12">
          <FolderKanban className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Nenhum projeto encontrado.</p>
          <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Criar primeiro projeto
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projetos.map((projeto) => {
            const progresso = calcularProgressoMarcos(projeto.marcos || []);
            return (
              <Card key={projeto.id} className="hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                        <FolderKanban className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{projeto.titulo}</h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{projeto.descricao}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      {projeto.responsavel || 'Não atribuído'}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {formatDate(projeto.prazo)}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Badge className={getStatusColor(projeto.status)}>
                      {getStatusLabel(projeto.status)}
                    </Badge>
                  </div>

                  {/* Progresso dos Marcos */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Marcos</span>
                      <span className="text-sm font-medium text-gray-900">{progresso}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${
                          progresso === 100 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${progresso}%` }}
                      />
                    </div>
                  </div>

                  {/* Marcos */}
                  {projeto.marcos?.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {projeto.marcos.map((marco) => (
                        <div key={marco.id} className="flex items-center gap-2 text-sm">
                          {marco.status === 'concluida' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className={`h-4 w-4 rounded-full border-2 ${
                              marco.status === 'em_andamento' ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
                            }`} />
                          )}
                          <span className={marco.status === 'concluida' ? 'text-gray-400 line-through' : 'text-gray-700'}>
                            {marco.titulo}
                          </span>
                          <span className="ml-auto text-xs text-gray-400">
                            {formatDate(marco.prazo)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Lições Aprendidas */}
                  {projeto.licoes?.length > 0 && (
                    <div className="mt-4 rounded-lg bg-yellow-50 p-3">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Lightbulb className="h-4 w-4" />
                        <span className="text-sm font-medium">{projeto.licoes.length} lição(ões) aprendida(s)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex border-t border-gray-100">
                  <Button variant="ghost" className="flex-1 rounded-none">
                    <Edit2 className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="ghost" className="flex-1 rounded-none border-l border-gray-100">
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Lições
                  </Button>
                  <Button variant="ghost" className="flex-1 rounded-none border-l border-gray-100 text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Novo Projeto */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Projeto"
        size="lg"
      >
        <form className="space-y-4">
          <Input label="Título do Projeto" placeholder="Ex: Desenvolvimento de material didático" />
          <Textarea label="Descrição" placeholder="Descreva o projeto..." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Responsável" placeholder="Nome do responsável" />
            <Select label="Status" options={statusOptions} />
          </div>
          <Input label="Prazo" type="date" />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button>Salvar Projeto</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}