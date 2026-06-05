import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funções auxiliares para cada tabela
export const db = {
  // Objetivos
  objetivos: {
    list: async () => {
      const { data, error } = await supabase
        .from('objetivos')
        .select('*, key_results(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    create: async (objetivo: any) => {
      const { data, error } = await supabase
        .from('objetivos')
        .insert(objetivo)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, objetivo: any) => {
      const { data, error } = await supabase
        .from('objetivos')
        .update(objetivo)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('objetivos')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  // Key Results
  keyResults: {
    create: async (kr: any) => {
      const { data, error } = await supabase
        .from('key_results')
        .insert(kr)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, kr: any) => {
      const { data, error } = await supabase
        .from('key_results')
        .update(kr)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('key_results')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  // Projetos
  projetos: {
    list: async () => {
      const { data, error } = await supabase
        .from('projetos')
        .select('*, marcos(*), licoes_aprendidas(*), objetivos(titulo)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    create: async (projeto: any) => {
      const { data, error } = await supabase
        .from('projetos')
        .insert(projeto)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, projeto: any) => {
      const { data, error } = await supabase
        .from('projetos')
        .update(projeto)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('projetos')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  // Marcos
  marcos: {
    create: async (marco: any) => {
      const { data, error } = await supabase
        .from('marcos')
        .insert(marco)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, marco: any) => {
      const { data, error } = await supabase
        .from('marcos')
        .update(marco)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('marcos')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  // Lições Aprendidas
  licoes: {
    create: async (licao: any) => {
      const { data, error } = await supabase
        .from('licoes_aprendidas')
        .insert(licao)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('licoes_aprendidas')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  // Tarefas
  tarefas: {
    list: async () => {
      const { data, error } = await supabase
        .from('tarefas')
        .select('*, projetos(titulo)')
        .order('prazo', { ascending: true });
      if (error) throw error;
      return data;
    },
    create: async (tarefa: any) => {
      const { data, error } = await supabase
        .from('tarefas')
        .insert(tarefa)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, tarefa: any) => {
      const { data, error } = await supabase
        .from('tarefas')
        .update(tarefa)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('tarefas')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  // Eventos
  eventos: {
    list: async (startDate?: string, endDate?: string) => {
      let query = supabase
        .from('eventos')
        .select('*')
        .order('data_inicio', { ascending: true });

      if (startDate) {
        query = query.gte('data_inicio', startDate);
      }
      if (endDate) {
        query = query.lte('data_fim', endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    create: async (evento: any) => {
      const { data, error } = await supabase
        .from('eventos')
        .insert(evento)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, evento: any) => {
      const { data, error } = await supabase
        .from('eventos')
        .update(evento)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },
};