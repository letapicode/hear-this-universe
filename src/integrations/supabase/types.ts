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
      ai_recommendations: {
        Row: {
          clicked: boolean | null
          confidence_score: number | null
          context_data: Json | null
          created_at: string
          dismissed: boolean | null
          id: string
          reasoning: string | null
          recommendation_type: string
          series_id: string | null
          user_id: string
        }
        Insert: {
          clicked?: boolean | null
          confidence_score?: number | null
          context_data?: Json | null
          created_at?: string
          dismissed?: boolean | null
          id?: string
          reasoning?: string | null
          recommendation_type: string
          series_id?: string | null
          user_id: string
        }
        Update: {
          clicked?: boolean | null
          confidence_score?: number | null
          context_data?: Json | null
          created_at?: string
          dismissed?: boolean | null
          id?: string
          reasoning?: string | null
          recommendation_type?: string
          series_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string
          episode_id: string | null
          id: string
          note: string | null
          timestamp_seconds: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          episode_id?: string | null
          id?: string
          note?: string | null
          timestamp_seconds: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          episode_id?: string | null
          id?: string
          note?: string | null
          timestamp_seconds?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      chapters: {
        Row: {
          chapter_number: number
          created_at: string
          end_time: number
          episode_id: string | null
          id: string
          start_time: number
          title: string
        }
        Insert: {
          chapter_number: number
          created_at?: string
          end_time: number
          episode_id?: string | null
          id?: string
          start_time: number
          title: string
        }
        Update: {
          chapter_number?: number
          created_at?: string
          end_time?: number
          episode_id?: string | null
          id?: string
          start_time?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
        ]
      }
      downloads: {
        Row: {
          download_url: string | null
          downloaded_at: string
          episode_id: string | null
          expires_at: string | null
          file_size: number | null
          id: string
          series_id: string | null
          user_id: string | null
        }
        Insert: {
          download_url?: string | null
          downloaded_at?: string
          episode_id?: string | null
          expires_at?: string | null
          file_size?: number | null
          id?: string
          series_id?: string | null
          user_id?: string | null
        }
        Update: {
          download_url?: string | null
          downloaded_at?: string
          episode_id?: string | null
          expires_at?: string | null
          file_size?: number | null
          id?: string
          series_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      episodes: {
        Row: {
          audio_url: string
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          episode_number: number
          id: string
          is_premium: boolean | null
          series_id: string | null
          title: string
        }
        Insert: {
          audio_url: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          episode_number: number
          id?: string
          is_premium?: boolean | null
          series_id?: string | null
          title: string
        }
        Update: {
          audio_url?: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          episode_number?: number
          id?: string
          is_premium?: boolean | null
          series_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "episodes_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      listening_progress: {
        Row: {
          completed: boolean | null
          completion_percentage: number | null
          episode_id: string | null
          id: string
          last_listened_at: string | null
          progress_seconds: number | null
          session_duration: number | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completion_percentage?: number | null
          episode_id?: string | null
          id?: string
          last_listened_at?: string | null
          progress_seconds?: number | null
          session_duration?: number | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completion_percentage?: number | null
          episode_id?: string | null
          id?: string
          last_listened_at?: string | null
          progress_seconds?: number | null
          session_duration?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listening_progress_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_sessions: {
        Row: {
          activity: string | null
          content_consumed: string[] | null
          created_at: string
          id: string
          mood: string
          satisfaction_rating: number | null
          session_duration: number | null
          time_of_day: string | null
          user_id: string
          weather: string | null
        }
        Insert: {
          activity?: string | null
          content_consumed?: string[] | null
          created_at?: string
          id?: string
          mood: string
          satisfaction_rating?: number | null
          session_duration?: number | null
          time_of_day?: string | null
          user_id: string
          weather?: string | null
        }
        Update: {
          activity?: string | null
          content_consumed?: string[] | null
          created_at?: string
          id?: string
          mood?: string
          satisfaction_rating?: number | null
          session_duration?: number | null
          time_of_day?: string | null
          user_id?: string
          weather?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          subscription_tier: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          subscription_tier?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          subscription_tier?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          helpful_count: number | null
          id: string
          is_verified_purchase: boolean | null
          rating: number | null
          review_text: string | null
          series_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          rating?: number | null
          review_text?: string | null
          series_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          rating?: number | null
          review_text?: string | null
          series_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      series: {
        Row: {
          author: string
          category_id: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          is_premium: boolean | null
          title: string
          total_episodes: number | null
          updated_at: string | null
        }
        Insert: {
          author: string
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_premium?: boolean | null
          title: string
          total_episodes?: number | null
          updated_at?: string | null
        }
        Update: {
          author?: string
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_premium?: boolean | null
          title?: string
          total_episodes?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "series_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_playlists: {
        Row: {
          ai_criteria: Json
          auto_update: boolean | null
          content_ids: string[] | null
          created_at: string
          description: string | null
          id: string
          last_updated: string | null
          name: string
          user_id: string
        }
        Insert: {
          ai_criteria: Json
          auto_update?: boolean | null
          content_ids?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          last_updated?: string | null
          name: string
          user_id: string
        }
        Update: {
          ai_criteria?: Json
          auto_update?: boolean | null
          content_ids?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          last_updated?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_plan_id: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_plan_id?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_plan_id?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscribers_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          features: string[]
          id: string
          is_popular: boolean | null
          name: string
          price_monthly: number
          price_yearly: number | null
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: string[]
          id?: string
          is_popular?: boolean | null
          name: string
          price_monthly: number
          price_yearly?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: string[]
          id?: string
          is_popular?: boolean | null
          name?: string
          price_monthly?: number
          price_yearly?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          ai_recommendation_settings: Json | null
          created_at: string
          id: string
          listening_goals: string | null
          mood_preferences: Json | null
          preferred_authors: string[] | null
          preferred_genres: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_recommendation_settings?: Json | null
          created_at?: string
          id?: string
          listening_goals?: string | null
          mood_preferences?: Json | null
          preferred_authors?: string[] | null
          preferred_genres?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_recommendation_settings?: Json | null
          created_at?: string
          id?: string
          listening_goals?: string | null
          mood_preferences?: Json | null
          preferred_authors?: string[] | null
          preferred_genres?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          books_completed: number | null
          created_at: string
          current_streak: number | null
          display_name: string | null
          favorite_genre: string | null
          id: string
          longest_streak: number | null
          total_listening_time: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          books_completed?: number | null
          created_at?: string
          current_streak?: number | null
          display_name?: string | null
          favorite_genre?: string | null
          id?: string
          longest_streak?: number | null
          total_listening_time?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          books_completed?: number | null
          created_at?: string
          current_streak?: number | null
          display_name?: string | null
          favorite_genre?: string | null
          id?: string
          longest_streak?: number | null
          total_listening_time?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          series_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          series_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          series_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
