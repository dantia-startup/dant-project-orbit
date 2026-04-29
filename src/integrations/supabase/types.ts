export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      clientes: {
        Row: {
          cidade: string | null
          id: number
          moeda_principal: string | null
          nome: string
          segmento: string | null
        }
        Insert: {
          cidade?: string | null
          id?: number
          moeda_principal?: string | null
          nome: string
          segmento?: string | null
        }
        Update: {
          cidade?: string | null
          id?: number
          moeda_principal?: string | null
          nome?: string
          segmento?: string | null
        }
        Relationships: []
      }
      cotacoes: {
        Row: {
          capturado_em: string | null
          data_cotacao: string
          id: number
          moeda_base: string
          moeda_destino: string
          taxa: number
        }
        Insert: {
          capturado_em?: string | null
          data_cotacao: string
          id?: number
          moeda_base: string
          moeda_destino: string
          taxa: number
        }
        Update: {
          capturado_em?: string | null
          data_cotacao?: string
          id?: number
          moeda_base?: string
          moeda_destino?: string
          taxa?: number
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      fretes_convertidos: {
        Row: {
          calculado_em: string | null
          cliente_nome: string | null
          data_cotacao: string | null
          id: number
          moeda_cliente: string | null
          rota_codigo: string
          taxa_aplicada: number | null
          valor_frete_local: number | null
          valor_frete_usd: number | null
        }
        Insert: {
          calculado_em?: string | null
          cliente_nome?: string | null
          data_cotacao?: string | null
          id?: number
          moeda_cliente?: string | null
          rota_codigo: string
          taxa_aplicada?: number | null
          valor_frete_local?: number | null
          valor_frete_usd?: number | null
        }
        Update: {
          calculado_em?: string | null
          cliente_nome?: string | null
          data_cotacao?: string | null
          id?: number
          moeda_cliente?: string | null
          rota_codigo?: string
          taxa_aplicada?: number | null
          valor_frete_local?: number | null
          valor_frete_usd?: number | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          answers: Json
          created_at: string
          email: string
          faturamento: string | null
          id: string
          nome: string
          profile: string
          whatsapp: string
        }
        Insert: {
          answers: Json
          created_at?: string
          email: string
          faturamento?: string | null
          id?: string
          nome: string
          profile: string
          whatsapp: string
        }
        Update: {
          answers?: Json
          created_at?: string
          email?: string
          faturamento?: string | null
          id?: string
          nome?: string
          profile?: string
          whatsapp?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          organization_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          organization_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          organization_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      project_months: {
        Row: {
          created_at: string
          highlights: Json
          id: string
          items: Json
          label: string
          month_number: number
          project_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          highlights?: Json
          id?: string
          items?: Json
          label: string
          month_number: number
          project_id: string
          status?: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          highlights?: Json
          id?: string
          items?: Json
          label?: string
          month_number?: number
          project_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_months_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phases: {
        Row: {
          color: string
          created_at: string
          description: string
          end_month: number
          id: string
          name: string
          phase_order: number
          project_id: string
          start_month: number
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string
          end_month: number
          id?: string
          name: string
          phase_order?: number
          project_id: string
          start_month: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string
          end_month?: number
          id?: string
          name?: string
          phase_order?: number
          project_id?: string
          start_month?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_name: string
          created_at: string
          id: string
          organization_id: string
          total_months: number
          updated_at: string
        }
        Insert: {
          client_name: string
          created_at?: string
          id?: string
          organization_id: string
          total_months?: number
          updated_at?: string
        }
        Update: {
          client_name?: string
          created_at?: string
          id?: string
          organization_id?: string
          total_months?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      rotas: {
        Row: {
          cliente_id: number | null
          codigo: string
          destino: string
          distancia_km: number | null
          id: number
          origem: string
          valor_frete_usd: number | null
        }
        Insert: {
          cliente_id?: number | null
          codigo: string
          destino: string
          distancia_km?: number | null
          id?: number
          origem: string
          valor_frete_usd?: number | null
        }
        Update: {
          cliente_id?: number | null
          codigo?: string
          destino?: string
          distancia_km?: number | null
          id?: number
          origem?: string
          valor_frete_usd?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rotas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee: string
          created_at: string
          description: string
          due_date: string | null
          id: string
          position: number
          priority: string
          project_id: string
          status: string
          tags: Json
          title: string
          updated_at: string
        }
        Insert: {
          assignee?: string
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          position?: number
          priority?: string
          project_id: string
          status?: string
          tags?: Json
          title: string
          updated_at?: string
        }
        Update: {
          assignee?: string
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          position?: number
          priority?: string
          project_id?: string
          status?: string
          tags?: Json
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          revenue_range: Database["public"]["Enums"]["revenue_range"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          revenue_range: Database["public"]["Enums"]["revenue_range"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          revenue_range?: Database["public"]["Enums"]["revenue_range"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      revenue_range: "pre_revenue" | "0_50k" | "50k_100k" | "100k_plus"
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
      app_role: ["admin", "user"],
      revenue_range: ["pre_revenue", "0_50k", "50k_100k", "100k_plus"],
    },
  },
} as const
