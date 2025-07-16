export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          condition_type: string
          condition_value: Json
          created_at: string | null
          description: string
          icon: string
          id: string
          title: string
        }
        Insert: {
          condition_type: string
          condition_value?: Json
          created_at?: string | null
          description: string
          icon: string
          id?: string
          title: string
        }
        Update: {
          condition_type?: string
          condition_value?: Json
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          category: string
          created_at: string | null
          description: string
          duration_days: number
          icon: string | null
          id: string
          is_active: boolean | null
          level: string
          points: number
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          duration_days: number
          icon?: string | null
          id?: string
          is_active?: boolean | null
          level: string
          points: number
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          duration_days?: number
          icon?: string | null
          id?: string
          is_active?: boolean | null
          level?: string
          points?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_private: boolean | null
          target_id: string
          target_type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          target_id: string
          target_type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          target_id?: string
          target_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          module_id: string
          order_index: number
          title: string
          updated_at: string | null
          video_url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          module_id: string
          order_index?: number
          title: string
          updated_at?: string | null
          video_url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          module_id?: string
          order_index?: number
          title?: string
          updated_at?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          order_index: number
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          price: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          price?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          price?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dados_fisicos_usuario: {
        Row: {
          altura_cm: number
          categoria_imc: string | null
          circunferencia_abdominal_cm: number
          created_at: string
          data_nascimento: string
          id: string
          imc: number | null
          meta_peso_kg: number | null
          nome_completo: string
          nome_usuario: string | null
          peso_atual_kg: number
          risco_cardiometabolico: string | null
          sexo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          altura_cm: number
          categoria_imc?: string | null
          circunferencia_abdominal_cm: number
          created_at?: string
          data_nascimento: string
          id?: string
          imc?: number | null
          meta_peso_kg?: number | null
          nome_completo: string
          nome_usuario?: string | null
          peso_atual_kg: number
          risco_cardiometabolico?: string | null
          sexo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          altura_cm?: number
          categoria_imc?: string | null
          circunferencia_abdominal_cm?: number
          created_at?: string
          data_nascimento?: string
          id?: string
          imc?: number | null
          meta_peso_kg?: number | null
          nome_completo?: string
          nome_usuario?: string | null
          peso_atual_kg?: number
          risco_cardiometabolico?: string | null
          sexo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dados_saude_usuario: {
        Row: {
          altura_cm: number
          circunferencia_abdominal_cm: number
          created_at: string
          data_atualizacao: string
          id: string
          imc: number | null
          meta_peso_kg: number
          nome_usuario: string | null
          peso_atual_kg: number
          progresso_percentual: number | null
          user_id: string
        }
        Insert: {
          altura_cm: number
          circunferencia_abdominal_cm: number
          created_at?: string
          data_atualizacao?: string
          id?: string
          imc?: number | null
          meta_peso_kg: number
          nome_usuario?: string | null
          peso_atual_kg: number
          progresso_percentual?: number | null
          user_id: string
        }
        Update: {
          altura_cm?: number
          circunferencia_abdominal_cm?: number
          created_at?: string
          data_atualizacao?: string
          id?: string
          imc?: number | null
          meta_peso_kg?: number
          nome_usuario?: string | null
          peso_atual_kg?: number
          progresso_percentual?: number | null
          user_id?: string
        }
        Relationships: []
      }
      daily_missions: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          mission_date: string
          mission_id: string
          nome_usuario: string | null
          points_earned: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          mission_date: string
          mission_id: string
          nome_usuario?: string | null
          points_earned?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          mission_date?: string
          mission_id?: string
          nome_usuario?: string | null
          points_earned?: number | null
          user_id?: string
        }
        Relationships: []
      }
      diary_entries: {
        Row: {
          content: string
          created_at: string | null
          id: string
          mood_score: number | null
          nome_usuario: string | null
          private_comment: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          mood_score?: number | null
          nome_usuario?: string | null
          private_comment?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          mood_score?: number | null
          nome_usuario?: string | null
          private_comment?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diary_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          nome_usuario: string | null
          target_id: string
          target_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome_usuario?: string | null
          target_id: string
          target_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome_usuario?: string | null
          target_id?: string
          target_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          automatic_plan: boolean | null
          created_at: string | null
          id: string
          name: string
          nome_usuario: string | null
          notes: string | null
          other_type: string | null
          progress: number | null
          start_date: string
          target_date: string
          type: string
          updated_at: string | null
          user_id: string
          weekly_reminders: boolean | null
        }
        Insert: {
          automatic_plan?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          nome_usuario?: string | null
          notes?: string | null
          other_type?: string | null
          progress?: number | null
          start_date: string
          target_date: string
          type: string
          updated_at?: string | null
          user_id: string
          weekly_reminders?: boolean | null
        }
        Update: {
          automatic_plan?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          nome_usuario?: string | null
          notes?: string | null
          other_type?: string | null
          progress?: number | null
          start_date?: string
          target_date?: string
          type?: string
          updated_at?: string | null
          user_id?: string
          weekly_reminders?: boolean | null
        }
        Relationships: []
      }
      historico_medidas: {
        Row: {
          altura_cm: number
          circunferencia_abdominal_cm: number
          created_at: string
          data_medicao: string
          id: string
          imc: number
          nome_usuario: string | null
          peso_kg: number
          user_id: string
        }
        Insert: {
          altura_cm: number
          circunferencia_abdominal_cm: number
          created_at?: string
          data_medicao?: string
          id?: string
          imc: number
          nome_usuario?: string | null
          peso_kg: number
          user_id: string
        }
        Update: {
          altura_cm?: number
          circunferencia_abdominal_cm?: number
          created_at?: string
          data_medicao?: string
          id?: string
          imc?: number
          nome_usuario?: string | null
          peso_kg?: number
          user_id?: string
        }
        Relationships: []
      }
      informacoes_fisicas: {
        Row: {
          altura_cm: number
          circunferencia_abdominal_cm: number
          created_at: string | null
          data_nascimento: string
          id: string
          imc: number | null
          meta_peso_kg: number | null
          nome_usuario: string | null
          peso_atual_kg: number
          sexo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          altura_cm: number
          circunferencia_abdominal_cm: number
          created_at?: string | null
          data_nascimento: string
          id?: string
          imc?: number | null
          meta_peso_kg?: number | null
          nome_usuario?: string | null
          peso_atual_kg: number
          sexo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          altura_cm?: number
          circunferencia_abdominal_cm?: number
          created_at?: string | null
          data_nascimento?: string
          id?: string
          imc?: number | null
          meta_peso_kg?: number | null
          nome_usuario?: string | null
          peso_atual_kg?: number
          sexo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          metadata: Json | null
          nome_usuario: string | null
          target_id: string | null
          target_table: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          metadata?: Json | null
          nome_usuario?: string | null
          target_id?: string | null
          target_table?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_type?: Database["public"]["Enums"]["interaction_type"]
          metadata?: Json | null
          nome_usuario?: string | null
          target_id?: string | null
          target_table?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      missao_dia: {
        Row: {
          agua_litros: string | null
          atividade_fisica: boolean | null
          concluido: boolean | null
          created_at: string
          data: string
          energia_ao_acordar: number | null
          estresse_nivel: number | null
          fome_emocional: boolean | null
          gratidao: string | null
          habito_saudavel: string | null
          humor: string | null
          id: string
          inspira: string | null
          intencao_para_amanha: string | null
          liquido_ao_acordar: string | null
          mensagem_dia: string | null
          momento_feliz: string | null
          nome_usuario: string | null
          nota_dia: number | null
          pequena_vitoria: string | null
          pratica_conexao: string | null
          prioridades: Json | null
          sono_horas: number | null
          tarefa_bem_feita: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agua_litros?: string | null
          atividade_fisica?: boolean | null
          concluido?: boolean | null
          created_at?: string
          data: string
          energia_ao_acordar?: number | null
          estresse_nivel?: number | null
          fome_emocional?: boolean | null
          gratidao?: string | null
          habito_saudavel?: string | null
          humor?: string | null
          id?: string
          inspira?: string | null
          intencao_para_amanha?: string | null
          liquido_ao_acordar?: string | null
          mensagem_dia?: string | null
          momento_feliz?: string | null
          nome_usuario?: string | null
          nota_dia?: number | null
          pequena_vitoria?: string | null
          pratica_conexao?: string | null
          prioridades?: Json | null
          sono_horas?: number | null
          tarefa_bem_feita?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agua_litros?: string | null
          atividade_fisica?: boolean | null
          concluido?: boolean | null
          created_at?: string
          data?: string
          energia_ao_acordar?: number | null
          estresse_nivel?: number | null
          fome_emocional?: boolean | null
          gratidao?: string | null
          habito_saudavel?: string | null
          humor?: string | null
          id?: string
          inspira?: string | null
          intencao_para_amanha?: string | null
          liquido_ao_acordar?: string | null
          mensagem_dia?: string | null
          momento_feliz?: string | null
          nome_usuario?: string | null
          nota_dia?: number | null
          pequena_vitoria?: string | null
          pratica_conexao?: string | null
          prioridades?: Json | null
          sono_horas?: number | null
          tarefa_bem_feita?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      missoes_usuario: {
        Row: {
          autocuidado: boolean | null
          bebeu_agua: boolean | null
          created_at: string
          data: string
          dormiu_bem: boolean | null
          humor: string | null
          id: string
          nome_usuario: string | null
          user_id: string
        }
        Insert: {
          autocuidado?: boolean | null
          bebeu_agua?: boolean | null
          created_at?: string
          data: string
          dormiu_bem?: boolean | null
          humor?: string | null
          id?: string
          nome_usuario?: string | null
          user_id: string
        }
        Update: {
          autocuidado?: boolean | null
          bebeu_agua?: boolean | null
          created_at?: string
          data?: string
          dormiu_bem?: boolean | null
          humor?: string | null
          id?: string
          nome_usuario?: string | null
          user_id?: string
        }
        Relationships: []
      }
      perfil_comportamental: {
        Row: {
          apoio_familiar: string | null
          created_at: string
          gratidao_hoje: string | null
          id: string
          motivacao_principal: string | null
          motivo_desistencia: string | null
          motivo_desistencia_outro: string | null
          nivel_autocuidado: number | null
          nivel_estresse: number | null
          nome_usuario: string | null
          sentimento_hoje: string | null
          tentativa_emagrecimento: string | null
          tentativa_emagrecimento_outro: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          apoio_familiar?: string | null
          created_at?: string
          gratidao_hoje?: string | null
          id?: string
          motivacao_principal?: string | null
          motivo_desistencia?: string | null
          motivo_desistencia_outro?: string | null
          nivel_autocuidado?: number | null
          nivel_estresse?: number | null
          nome_usuario?: string | null
          sentimento_hoje?: string | null
          tentativa_emagrecimento?: string | null
          tentativa_emagrecimento_outro?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          apoio_familiar?: string | null
          created_at?: string
          gratidao_hoje?: string | null
          id?: string
          motivacao_principal?: string | null
          motivo_desistencia?: string | null
          motivo_desistencia_outro?: string | null
          nivel_autocuidado?: number | null
          nivel_estresse?: number | null
          nome_usuario?: string | null
          sentimento_hoje?: string | null
          tentativa_emagrecimento?: string | null
          tentativa_emagrecimento_outro?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pesagens: {
        Row: {
          agua_corporal_pct: number | null
          circunferencia_abdominal_cm: number | null
          created_at: string
          data_medicao: string
          gordura_corporal_pct: number | null
          gordura_visceral: number | null
          id: string
          idade_metabolica: number | null
          imc: number | null
          massa_muscular_kg: number | null
          massa_ossea_kg: number | null
          nome_usuario: string | null
          origem_medicao: string
          peso_kg: number
          taxa_metabolica_basal: number | null
          tipo_corpo: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agua_corporal_pct?: number | null
          circunferencia_abdominal_cm?: number | null
          created_at?: string
          data_medicao?: string
          gordura_corporal_pct?: number | null
          gordura_visceral?: number | null
          id?: string
          idade_metabolica?: number | null
          imc?: number | null
          massa_muscular_kg?: number | null
          massa_ossea_kg?: number | null
          nome_usuario?: string | null
          origem_medicao?: string
          peso_kg: number
          taxa_metabolica_basal?: number | null
          tipo_corpo?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agua_corporal_pct?: number | null
          circunferencia_abdominal_cm?: number | null
          created_at?: string
          data_medicao?: string
          gordura_corporal_pct?: number | null
          gordura_visceral?: number | null
          id?: string
          idade_metabolica?: number | null
          imc?: number | null
          massa_muscular_kg?: number | null
          massa_ossea_kg?: number | null
          nome_usuario?: string | null
          origem_medicao?: string
          peso_kg?: number
          taxa_metabolica_basal?: number | null
          tipo_corpo?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pontuacao_diaria: {
        Row: {
          categoria_dia: string | null
          created_at: string
          data: string
          id: string
          nome_usuario: string | null
          pontos_agua: number | null
          pontos_atividade_fisica: number | null
          pontos_avaliacao_dia: number | null
          pontos_conexao_interna: number | null
          pontos_energia_acordar: number | null
          pontos_estresse: number | null
          pontos_fome_emocional: number | null
          pontos_gratidao: number | null
          pontos_intencao_amanha: number | null
          pontos_liquido_manha: number | null
          pontos_pequena_vitoria: number | null
          pontos_sono: number | null
          total_pontos_dia: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          categoria_dia?: string | null
          created_at?: string
          data?: string
          id?: string
          nome_usuario?: string | null
          pontos_agua?: number | null
          pontos_atividade_fisica?: number | null
          pontos_avaliacao_dia?: number | null
          pontos_conexao_interna?: number | null
          pontos_energia_acordar?: number | null
          pontos_estresse?: number | null
          pontos_fome_emocional?: number | null
          pontos_gratidao?: number | null
          pontos_intencao_amanha?: number | null
          pontos_liquido_manha?: number | null
          pontos_pequena_vitoria?: number | null
          pontos_sono?: number | null
          total_pontos_dia?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          categoria_dia?: string | null
          created_at?: string
          data?: string
          id?: string
          nome_usuario?: string | null
          pontos_agua?: number | null
          pontos_atividade_fisica?: number | null
          pontos_avaliacao_dia?: number | null
          pontos_conexao_interna?: number | null
          pontos_energia_acordar?: number | null
          pontos_estresse?: number | null
          pontos_fome_emocional?: number | null
          pontos_gratidao?: number | null
          pontos_intencao_amanha?: number | null
          pontos_liquido_manha?: number | null
          pontos_pequena_vitoria?: number | null
          pontos_sono?: number | null
          total_pontos_dia?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_pontuacao_diaria_user_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          altura_cm: number | null
          avatar_url: string | null
          celular: string | null
          created_at: string | null
          data_nascimento: string | null
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          sexo: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          altura_cm?: number | null
          avatar_url?: string | null
          celular?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          sexo?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          altura_cm?: number | null
          avatar_url?: string | null
          celular?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          sexo?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          assigned_to: string | null
          category: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          estimated_time: number | null
          id: string
          is_public: boolean | null
          notification_type: string | null
          pdf_url: string | null
          prerequisites: string | null
          scheduled_date: string | null
          send_type: string | null
          title: string
          updated_at: string | null
          video_url: string | null
          wheel_tools: string[] | null
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_time?: number | null
          id?: string
          is_public?: boolean | null
          notification_type?: string | null
          pdf_url?: string | null
          prerequisites?: string | null
          scheduled_date?: string | null
          send_type?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
          wheel_tools?: string[] | null
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_time?: number | null
          id?: string
          is_public?: boolean | null
          notification_type?: string | null
          pdf_url?: string | null
          prerequisites?: string | null
          scheduled_date?: string | null
          send_type?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
          wheel_tools?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      test_responses: {
        Row: {
          completed_at: string | null
          id: string
          nome_usuario: string | null
          responses: Json
          test_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          nome_usuario?: string | null
          responses: Json
          test_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          nome_usuario?: string | null
          responses?: Json
          test_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_responses_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          questions: Json
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          questions: Json
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          questions?: Json
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          nome_usuario: string | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          nome_usuario?: string | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          nome_usuario?: string | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenges: {
        Row: {
          challenge_id: string
          completed_at: string | null
          id: string
          is_completed: boolean | null
          nome_usuario: string | null
          progress: number | null
          started_at: string | null
          target_value: number
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          nome_usuario?: string | null
          progress?: number | null
          started_at?: string | null
          target_value: number
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          nome_usuario?: string | null
          progress?: number | null
          started_at?: string | null
          target_value?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_course_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          course_id: string
          created_at: string | null
          id: string
          lesson_id: string
          nome_usuario: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          lesson_id: string
          nome_usuario?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          lesson_id?: string
          nome_usuario?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          best_streak: number | null
          completed_challenges: number | null
          created_at: string | null
          current_streak: number | null
          daily_points: number | null
          id: string
          last_activity_date: string | null
          monthly_points: number | null
          nome_usuario: string | null
          total_points: number | null
          updated_at: string | null
          user_id: string
          weekly_points: number | null
        }
        Insert: {
          best_streak?: number | null
          completed_challenges?: number | null
          created_at?: string | null
          current_streak?: number | null
          daily_points?: number | null
          id?: string
          last_activity_date?: string | null
          monthly_points?: number | null
          nome_usuario?: string | null
          total_points?: number | null
          updated_at?: string | null
          user_id: string
          weekly_points?: number | null
        }
        Update: {
          best_streak?: number | null
          completed_challenges?: number | null
          created_at?: string | null
          current_streak?: number | null
          daily_points?: number | null
          id?: string
          last_activity_date?: string | null
          monthly_points?: number | null
          nome_usuario?: string | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string
          weekly_points?: number | null
        }
        Relationships: []
      }
      weekly_evaluations: {
        Row: {
          created_at: string | null
          id: string
          learning_data: Json
          next_week_goals: string | null
          nome_usuario: string | null
          performance_ratings: Json
          updated_at: string | null
          user_id: string
          week_start_date: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          learning_data?: Json
          next_week_goals?: string | null
          nome_usuario?: string | null
          performance_ratings?: Json
          updated_at?: string | null
          user_id: string
          week_start_date: string
        }
        Update: {
          created_at?: string | null
          id?: string
          learning_data?: Json
          next_week_goals?: string | null
          nome_usuario?: string | null
          performance_ratings?: Json
          updated_at?: string | null
          user_id?: string
          week_start_date?: string
        }
        Relationships: []
      }
      weight_goals: {
        Row: {
          created_at: string
          data_inicio: string
          data_limite: string
          id: string
          nome_usuario: string | null
          observacoes: string | null
          peso_inicial: number
          peso_meta: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_inicio: string
          data_limite: string
          id?: string
          nome_usuario?: string | null
          observacoes?: string | null
          peso_inicial: number
          peso_meta: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_inicio?: string
          data_limite?: string
          id?: string
          nome_usuario?: string | null
          observacoes?: string | null
          peso_inicial?: number
          peso_meta?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wheel_responses: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          nome_usuario: string | null
          reflection_answers: Json | null
          responses: Json
          session_id: string
          updated_at: string
          user_id: string
          wheel_type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          nome_usuario?: string | null
          reflection_answers?: Json | null
          responses?: Json
          session_id: string
          updated_at?: string
          user_id: string
          wheel_type: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          nome_usuario?: string | null
          reflection_answers?: Json | null
          responses?: Json
          session_id?: string
          updated_at?: string
          user_id?: string
          wheel_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calcular_categoria_imc: {
        Args: { imc_valor: number }
        Returns: string
      }
      calcular_pontos_missao_detalhado: {
        Args: { missao_data: Database["public"]["Tables"]["missao_dia"]["Row"] }
        Returns: number
      }
      calcular_risco_cardiometabolico: {
        Args: { circunferencia: number; sexo: string }
        Returns: string
      }
      check_physical_data_complete: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      create_complete_user_profile: {
        Args: {
          p_user_id: string
          p_full_name: string
          p_celular: string
          p_data_nascimento: string
          p_sexo: string
          p_altura_cm: number
        }
        Returns: Json
      }
      create_complete_user_registration: {
        Args: {
          p_user_id: string
          p_full_name: string
          p_email: string
          p_data_nascimento: string
          p_sexo: string
          p_altura_cm: number
          p_peso_atual_kg: number
          p_circunferencia_abdominal_cm: number
          p_celular?: string
          p_meta_peso_kg?: number
        }
        Returns: Json
      }
      execute_user_health_check: {
        Args: { p_profile_id: string }
        Returns: Json
      }
      get_user_name: {
        Args: { user_uuid: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      run_data_integrity_monitor: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      track_interaction: {
        Args: {
          p_user_id: string
          p_type: Database["public"]["Enums"]["interaction_type"]
          p_target_id?: string
          p_target_table?: string
          p_metadata?: Json
        }
        Returns: string
      }
      update_user_points: {
        Args: { p_user_id: string; p_points: number; p_activity_type?: string }
        Returns: undefined
      }
    }
    Enums: {
      interaction_type: "diary" | "session" | "test" | "comment" | "favorite"
      user_role: "admin" | "client" | "visitor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      interaction_type: ["diary", "session", "test", "comment", "favorite"],
      user_role: ["admin", "client", "visitor"],
    },
  },
} as const
