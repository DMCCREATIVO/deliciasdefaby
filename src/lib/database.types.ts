export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          published_at: string | null
          tags: string[] | null
          featured: boolean | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          tags?: string[] | null
          featured?: boolean | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          tags?: string[] | null
          featured?: boolean | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_orders_by_status: {
        Row: {
          count: number
          created_at: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          count?: number
          created_at?: string
          id?: string
          status: string
          updated_at?: string
        }
        Update: {
          count?: number
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_revenue: {
        Row: {
          amount: number
          created_at: string
          date: string
          id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          date: string
          id?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_stats: {
        Row: {
          created_at: string
          id: string
          total_customers: number
          total_orders: number
          total_products: number
          total_revenue: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          total_customers?: number
          total_orders?: number
          total_products?: number
          total_revenue?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          total_customers?: number
          total_orders?: number
          total_products?: number
          total_revenue?: number
          updated_at?: string
        }
        Relationships: []
      }
      delivery_schedules: {
        Row: {
          created_at: string
          day_of_week: string
          end_time: string
          id: string
          is_active: boolean | null
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: string
          end_time: string
          id?: string
          is_active?: boolean | null
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: string
          end_time?: string
          id?: string
          is_active?: boolean | null
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          contact_name: string
          contact_email: string
          contact_phone: string | null
          shipping_address: string | null
          notes: string | null
          status: 'pendiente' | 'confirmado' | 'en_preparacion' | 'listo_para_entrega' | 'entregado' | 'cancelado'
          total: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          contact_name: string
          contact_email: string
          contact_phone?: string | null
          shipping_address?: string | null
          notes?: string | null
          status?: 'pendiente' | 'confirmado' | 'en_preparacion' | 'listo_para_entrega' | 'entregado' | 'cancelado'
          total: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          contact_name?: string
          contact_email?: string
          contact_phone?: string | null
          shipping_address?: string | null
          notes?: string | null
          status?: 'pendiente' | 'confirmado' | 'en_preparacion' | 'listo_para_entrega' | 'entregado' | 'cancelado'
          total?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          gallery: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          long_description: string | null
          price: number
          short_description: string | null
          stock: number | null
          title: string
          updated_at: string
          weight: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          long_description?: string | null
          price: number
          short_description?: string | null
          stock?: number | null
          title: string
          updated_at?: string
          weight?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          long_description?: string | null
          price?: number
          short_description?: string | null
          stock?: number | null
          title?: string
          updated_at?: string
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          id: string
          name: string | null
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          id: string
          name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          business_name: string
          created_at: string
          currency: string
          delivery_schedule_text: string | null
          enable_online_payments: boolean | null
          facebook_url: string | null
          footer_text: string | null
          id: string
          instagram_url: string | null
          language: string
          logo_url: string | null
          mercadopago_access_token: string | null
          mercadopago_public_key: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          business_name: string
          created_at?: string
          currency: string
          delivery_schedule_text?: string | null
          enable_online_payments?: boolean | null
          facebook_url?: string | null
          footer_text?: string | null
          id?: string
          instagram_url?: string | null
          language: string
          logo_url?: string | null
          mercadopago_access_token?: string | null
          mercadopago_public_key?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          business_name?: string
          created_at?: string
          currency?: string
          delivery_schedule_text?: string | null
          enable_online_payments?: boolean | null
          facebook_url?: string | null
          footer_text?: string | null
          id?: string
          instagram_url?: string | null
          language?: string
          logo_url?: string | null
          mercadopago_access_token?: string | null
          mercadopago_public_key?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar: string | null
          comment: string
          created_at: string
          id: string
          name: string
          rating: number
          status: string
        }
        Insert: {
          avatar?: string | null
          comment: string
          created_at?: string
          id?: string
          name: string
          rating: number
          status?: string
        }
        Update: {
          avatar?: string | null
          comment?: string
          created_at?: string
          id?: string
          name?: string
          rating?: number
          status?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_blog_posts_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      create_categories_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      create_orders_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      create_products_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      create_settings_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_orders: number
          total_products: number
          total_customers: number
          total_revenue: number
          updated_at: string
        }[]
      }
      update_dashboard_orders_by_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_dashboard_revenue: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const 