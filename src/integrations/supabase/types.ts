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
      materials: {
        Row: {
          color_options: string[] | null
          complexity_multiplier: number
          cost_per_gram: number
          created_at: string | null
          density: number
          id: string
          is_active: boolean | null
          name: string
          properties: Json | null
          setup_cost: number
          type: string
          updated_at: string | null
        }
        Insert: {
          color_options?: string[] | null
          complexity_multiplier?: number
          cost_per_gram: number
          created_at?: string | null
          density: number
          id?: string
          is_active?: boolean | null
          name: string
          properties?: Json | null
          setup_cost: number
          type: string
          updated_at?: string | null
        }
        Update: {
          color_options?: string[] | null
          complexity_multiplier?: number
          cost_per_gram?: number
          created_at?: string | null
          density?: number
          id?: string
          is_active?: boolean | null
          name?: string
          properties?: Json | null
          setup_cost?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          related_id: string | null
          related_type: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      order_feedback: {
        Row: {
          created_at: string | null
          feedback_text: string | null
          id: string
          is_public: boolean | null
          order_id: string
          rating: number | null
        }
        Insert: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          is_public?: boolean | null
          order_id: string
          rating?: number | null
        }
        Update: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          is_public?: boolean | null
          order_id?: string
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_feedback_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_feedback_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_files: {
        Row: {
          created_at: string | null
          file_category: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          order_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_category?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          order_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_category?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          order_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_files_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_files_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          item_name: string
          material_id: string
          order_id: string
          quantity: number
          specifications: Json | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_name: string
          material_id: string
          order_id: string
          quantity?: number
          specifications?: Json | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          item_name?: string
          material_id?: string
          order_id?: string
          quantity?: number
          specifications?: Json | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          change_reason: string | null
          changed_by: string | null
          created_at: string | null
          id: string
          new_status: string
          old_status: string | null
          order_id: string
        }
        Insert: {
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status: string
          old_status?: string | null
          order_id: string
        }
        Update: {
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: string
          old_status?: string | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          assigned_to: string | null
          billing_address: Json | null
          cancelled_at: string | null
          cancelled_reason: string | null
          color: string | null
          created_at: string | null
          delivered_at: string | null
          estimated_delivery: string | null
          estimated_print_time: number | null
          estimated_volume: number | null
          estimated_weight: number | null
          file_name: string
          id: string
          infill_percentage: number | null
          layer_height: number | null
          material: string
          material_id: string | null
          notes: string | null
          order_number: string | null
          post_processing: string[] | null
          price: number | null
          priority: Database["public"]["Enums"]["order_priority"] | null
          production_notes: string | null
          quantity: number
          shipped_at: string | null
          shipping_address: Json | null
          status: Database["public"]["Enums"]["order_status"] | null
          support_required: boolean | null
          tracking_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          billing_address?: Json | null
          cancelled_at?: string | null
          cancelled_reason?: string | null
          color?: string | null
          created_at?: string | null
          delivered_at?: string | null
          estimated_delivery?: string | null
          estimated_print_time?: number | null
          estimated_volume?: number | null
          estimated_weight?: number | null
          file_name: string
          id?: string
          infill_percentage?: number | null
          layer_height?: number | null
          material: string
          material_id?: string | null
          notes?: string | null
          order_number?: string | null
          post_processing?: string[] | null
          price?: number | null
          priority?: Database["public"]["Enums"]["order_priority"] | null
          production_notes?: string | null
          quantity?: number
          shipped_at?: string | null
          shipping_address?: Json | null
          status?: Database["public"]["Enums"]["order_status"] | null
          support_required?: boolean | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          billing_address?: Json | null
          cancelled_at?: string | null
          cancelled_reason?: string | null
          color?: string | null
          created_at?: string | null
          delivered_at?: string | null
          estimated_delivery?: string | null
          estimated_print_time?: number | null
          estimated_volume?: number | null
          estimated_weight?: number | null
          file_name?: string
          id?: string
          infill_percentage?: number | null
          layer_height?: number | null
          material?: string
          material_id?: string | null
          notes?: string | null
          order_number?: string | null
          post_processing?: string[] | null
          price?: number | null
          priority?: Database["public"]["Enums"]["order_priority"] | null
          production_notes?: string | null
          quantity?: number
          shipped_at?: string | null
          shipping_address?: Json | null
          status?: Database["public"]["Enums"]["order_status"] | null
          support_required?: boolean | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_templates: {
        Row: {
          base_cost: number
          complexity_multiplier: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          material_id: string | null
          name: string
          quantity_discounts: Json | null
          updated_at: string | null
        }
        Insert: {
          base_cost: number
          complexity_multiplier?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          material_id?: string | null
          name: string
          quantity_discounts?: Json | null
          updated_at?: string | null
        }
        Update: {
          base_cost?: number
          complexity_multiplier?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          material_id?: string | null
          name?: string
          quantity_discounts?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_templates_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      production_queue: {
        Row: {
          assigned_machine: string | null
          assigned_operator: string | null
          created_at: string | null
          estimated_completion: string | null
          estimated_start: string | null
          id: string
          notes: string | null
          order_id: string
          priority: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_machine?: string | null
          assigned_operator?: string | null
          created_at?: string | null
          estimated_completion?: string | null
          estimated_start?: string | null
          id?: string
          notes?: string | null
          order_id: string
          priority?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_machine?: string | null
          assigned_operator?: string | null
          created_at?: string | null
          estimated_completion?: string | null
          estimated_start?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          priority?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_queue_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_queue_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      vendor_applications: {
        Row: {
          business_type: string
          capabilities: string[] | null
          certifications: string[] | null
          company_name: string
          contact_person: string
          created_at: string | null
          description: string | null
          email: string
          experience_years: number | null
          id: string
          location: string | null
          phone: string | null
          production_capacity: string | null
          review_notes: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          business_type: string
          capabilities?: string[] | null
          certifications?: string[] | null
          company_name: string
          contact_person: string
          created_at?: string | null
          description?: string | null
          email: string
          experience_years?: number | null
          id?: string
          location?: string | null
          phone?: string | null
          production_capacity?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          business_type?: string
          capabilities?: string[] | null
          certifications?: string[] | null
          company_name?: string
          contact_person?: string
          created_at?: string | null
          description?: string | null
          email?: string
          experience_years?: number | null
          id?: string
          location?: string | null
          phone?: string | null
          production_capacity?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      vendor_documents: {
        Row: {
          application_id: string
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          uploaded_at: string | null
        }
        Insert: {
          application_id: string
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          uploaded_at?: string | null
        }
        Update: {
          application_id?: string
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vendor_applications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      order_summary: {
        Row: {
          calculated_total: number | null
          created_at: string | null
          customer_company: string | null
          customer_email: string | null
          customer_name: string | null
          estimated_delivery: string | null
          file_name: string | null
          id: string | null
          item_count: number | null
          material: string | null
          material_name: string | null
          material_type: string | null
          order_number: string | null
          price: number | null
          priority: Database["public"]["Enums"]["order_priority"] | null
          quantity: number | null
          status: Database["public"]["Enums"]["order_status"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_order_total: { Args: { order_id: string }; Returns: number }
      generate_order_number: { Args: never; Returns: string }
      get_user_role: { Args: { user_uuid: string }; Returns: string }
      is_admin: { Args: { user_uuid: string }; Returns: boolean }
      update_order_status: {
        Args: {
          change_reason?: string
          changed_by?: string
          new_status: string
          order_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      order_priority: "low" | "normal" | "high" | "urgent"
      order_status:
        | "pending"
        | "confirmed"
        | "in_production"
        | "quality_check"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "on_hold"
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
      order_priority: ["low", "normal", "high", "urgent"],
      order_status: [
        "pending",
        "confirmed",
        "in_production",
        "quality_check",
        "shipped",
        "delivered",
        "cancelled",
        "on_hold",
      ],
    },
  },
} as const
