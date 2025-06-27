export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          active: boolean | null
          address: string | null
          contact_person: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          rut: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          rut: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          rut?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cranes: {
        Row: {
          active: boolean | null
          brand: string
          capacity: number | null
          created_at: string | null
          id: string
          license_plate: string
          model: string
          name: string
          operator_id: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          active?: boolean | null
          brand: string
          capacity?: number | null
          created_at?: string | null
          id?: string
          license_plate: string
          model: string
          name: string
          operator_id?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          active?: boolean | null
          brand?: string
          capacity?: number | null
          created_at?: string | null
          id?: string
          license_plate?: string
          model?: string
          name?: string
          operator_id?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cranes_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      operators: {
        Row: {
          active: boolean | null
          created_at: string | null
          email: string
          id: string
          license_expiry: string | null
          license_number: string | null
          name: string
          phone: string | null
          pin: string
          rut: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          license_expiry?: string | null
          license_number?: string | null
          name: string
          phone?: string | null
          pin: string
          rut: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          license_expiry?: string | null
          license_number?: string | null
          name?: string
          phone?: string | null
          pin?: string
          rut?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      service_types: {
        Row: {
          active: boolean | null
          base_price: number | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          active?: boolean | null
          base_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          active?: boolean | null
          base_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          client_id: string
          client_name: string
          crane_id: string | null
          crane_name: string | null
          created_at: string | null
          delivery_location: string
          folio: string
          id: string
          license_plate: string | null
          observations: string | null
          operator_commission: number | null
          operator_id: string | null
          operator_name: string | null
          pickup_location: string
          request_date: string
          service_date: string
          service_type_id: string
          service_type_name: string
          service_value: number | null
          status: string | null
          updated_at: string | null
          vehicle_brand: string | null
          vehicle_model: string | null
        }
        Insert: {
          client_id: string
          client_name: string
          crane_id?: string | null
          crane_name?: string | null
          created_at?: string | null
          delivery_location: string
          folio: string
          id?: string
          license_plate?: string | null
          observations?: string | null
          operator_commission?: number | null
          operator_id?: string | null
          operator_name?: string | null
          pickup_location: string
          request_date: string
          service_date: string
          service_type_id: string
          service_type_name: string
          service_value?: number | null
          status?: string | null
          updated_at?: string | null
          vehicle_brand?: string | null
          vehicle_model?: string | null
        }
        Update: {
          client_id?: string
          client_name?: string
          crane_id?: string | null
          crane_name?: string | null
          created_at?: string | null
          delivery_location?: string
          folio?: string
          id?: string
          license_plate?: string | null
          observations?: string | null
          operator_commission?: number | null
          operator_id?: string | null
          operator_name?: string | null
          pickup_location?: string
          request_date?: string
          service_date?: string
          service_type_id?: string
          service_type_name?: string
          service_value?: number | null
          status?: string | null
          updated_at?: string | null
          vehicle_brand?: string | null
          vehicle_model?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_crane_id_fkey"
            columns: ["crane_id"]
            isOneToOne: false
            referencedRelation: "cranes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          active: boolean
          address: string | null
          company_name: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          pin: string | null
          role: Database["public"]["Enums"]["app_role"]
          rut: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean
          address?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          pin?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          rut?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean
          address?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          pin?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          rut?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client" | "operator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "client", "operator"],
    },
  },
} as const
