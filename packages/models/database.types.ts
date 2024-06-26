export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      days: {
        Row: {
          created_at: string
          date: string
          id: string
          name: string | null
          periods: Json | null
          worksheetId: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          name?: string | null
          periods?: Json | null
          worksheetId: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          name?: string | null
          periods?: Json | null
          worksheetId?: string
        }
        Relationships: [
          {
            foreignKeyName: "days_worksheetid_fkey"
            columns: ["worksheetId"]
            isOneToOne: false
            referencedRelation: "worksheet_weeks"
            referencedColumns: ["id"]
          }
        ]
      }
      movement_results: {
        Row: {
          created_at: string
          date: string
          fb_old_user_id: string | null
          id: string
          isPrivate: boolean
          movementId: string
          resultType: string
          resultValue: number
          userId: string | null
        }
        Insert: {
          created_at?: string
          date: string
          fb_old_user_id?: string | null
          id?: string
          isPrivate: boolean
          movementId: string
          resultType: string
          resultValue: number
          userId?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          fb_old_user_id?: string | null
          id?: string
          isPrivate?: boolean
          movementId?: string
          resultType?: string
          resultValue?: number
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movement_results_movementid_fkey"
            columns: ["movementId"]
            isOneToOne: false
            referencedRelation: "movements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movement_results_userid_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      movements: {
        Row: {
          countResults: number
          created_at: string
          id: string
          movement: string
          resultType: string
          text: string | null
          video: string | null
        }
        Insert: {
          countResults?: number
          created_at?: string
          id?: string
          movement: string
          resultType: string
          text?: string | null
          video?: string | null
        }
        Update: {
          countResults?: number
          created_at?: string
          id?: string
          movement?: string
          resultType?: string
          text?: string | null
          video?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          displayName: string | null
          id: string
          photoUrl: string | null
        }
        Insert: {
          displayName?: string | null
          id: string
          photoUrl?: string | null
        }
        Update: {
          displayName?: string | null
          id?: string
          photoUrl?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      program_groups: {
        Row: {
          created_at: string
          id: string
          jsontext: string | null
          name: string | null
          order: number
          session_id: string
          text: string | null
          video: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          jsontext?: string | null
          name?: string | null
          order?: number
          session_id: string
          text?: string | null
          video?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          jsontext?: string | null
          name?: string | null
          order?: number
          session_id?: string
          text?: string | null
          video?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_groups_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "program_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      program_interests: {
        Row: {
          created_at: string
          email: string
          id: number
          name: string
          phone: string
          program_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          name: string
          phone: string
          program_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          name?: string
          phone?: string
          program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_program_interests_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          }
        ]
      }
      program_movements: {
        Row: {
          group_id: string
          id: string
          movement_id: string
          order: number
        }
        Insert: {
          group_id: string
          id?: string
          movement_id: string
          order?: number
        }
        Update: {
          group_id?: string
          id?: string
          movement_id?: string
          order?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_movements_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "program_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_movements_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "program_groups_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_movements_movement_id_fkey"
            columns: ["movement_id"]
            isOneToOne: false
            referencedRelation: "movements"
            referencedColumns: ["id"]
          }
        ]
      }
      program_segments: {
        Row: {
          created_at: string
          id: string
          name: string | null
          order: number
          program_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          order?: number
          program_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          order?: number
          program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_segments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          }
        ]
      }
      program_sessions: {
        Row: {
          created_at: string
          id: string
          name: string
          order: number
          segment_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          order?: number
          segment_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          order?: number
          segment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_sessions_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "program_segments"
            referencedColumns: ["id"]
          }
        ]
      }
      programs: {
        Row: {
          amount: number
          block_segments: string | null
          created_at: string
          expiration: number
          id: string
          image: string
          name: string
          payment_link_id: string | null
          payment_link_url: string | null
        }
        Insert: {
          amount: number
          block_segments?: string | null
          created_at?: string
          expiration?: number
          id?: string
          image: string
          name: string
          payment_link_id?: string | null
          payment_link_url?: string | null
        }
        Update: {
          amount?: number
          block_segments?: string | null
          created_at?: string
          expiration?: number
          id?: string
          image?: string
          name?: string
          payment_link_id?: string | null
          payment_link_url?: string | null
        }
        Relationships: []
      }
      user_groups_details: {
        Row: {
          group_id: string
          id: string
          user_id: string
          watched_at: string | null
        }
        Insert: {
          group_id: string
          id?: string
          user_id: string
          watched_at?: string | null
        }
        Update: {
          group_id?: string
          id?: string
          user_id?: string
          watched_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_groups_details_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "program_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_groups_details_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "program_groups_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_groups_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_groups_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_programs: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          method: string | null
          paid_amount: number
          program_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          method?: string | null
          paid_amount: number
          program_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          method?: string | null
          paid_amount?: number
          program_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_programs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_programs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_programs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_worksheets: {
        Row: {
          created_at: string
          entitlements: string[]
          expires_at: string
          id: string
          method: string | null
          paid_amount: number
          user_id: string
          worksheet_id: string | null
        }
        Insert: {
          created_at?: string
          entitlements: string[]
          expires_at: string
          id?: string
          method?: string | null
          paid_amount: number
          user_id: string
          worksheet_id?: string | null
        }
        Update: {
          created_at?: string
          entitlements?: string[]
          expires_at?: string
          id?: string
          method?: string | null
          paid_amount?: number
          user_id?: string
          worksheet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_worksheets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_worksheets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_worksheets_worksheet_id_fkey"
            columns: ["worksheet_id"]
            isOneToOne: false
            referencedRelation: "worksheets"
            referencedColumns: ["id"]
          }
        ]
      }
      workout_results: {
        Row: {
          created_at: string
          date: string
          fb_old_user_id: string | null
          id: string
          isPrivate: boolean
          resultType: string
          resultValue: number
          userId: string | null
          workout: Json
          workoutSignature: string
        }
        Insert: {
          created_at?: string
          date: string
          fb_old_user_id?: string | null
          id?: string
          isPrivate: boolean
          resultType: string
          resultValue: number
          userId?: string | null
          workout: Json
          workoutSignature: string
        }
        Update: {
          created_at?: string
          date?: string
          fb_old_user_id?: string | null
          id?: string
          isPrivate?: boolean
          resultType?: string
          resultValue?: number
          userId?: string | null
          workout?: Json
          workoutSignature?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_results_userid_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      worksheet_weeks: {
        Row: {
          created_at: string
          endDate: string
          id: string
          info: string | null
          name: string
          published: boolean
          startDate: string
          version: string | null
          worksheet_id: string | null
        }
        Insert: {
          created_at?: string
          endDate: string
          id?: string
          info?: string | null
          name: string
          published?: boolean
          startDate: string
          version?: string | null
          worksheet_id?: string | null
        }
        Update: {
          created_at?: string
          endDate?: string
          id?: string
          info?: string | null
          name?: string
          published?: boolean
          startDate?: string
          version?: string | null
          worksheet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "worksheet_weeks_worksheet_id_fkey"
            columns: ["worksheet_id"]
            isOneToOne: false
            referencedRelation: "worksheets"
            referencedColumns: ["id"]
          }
        ]
      }
      worksheets: {
        Row: {
          amount: number
          community_url: string | null
          created_at: string
          description: string | null
          id: string
          image: string | null
          name: string
          published: boolean
          stripe_payment_link_id: string | null
          stripe_product_id: string | null
        }
        Insert: {
          amount: number
          community_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name: string
          published?: boolean
          stripe_payment_link_id?: string | null
          stripe_product_id?: string | null
        }
        Update: {
          amount?: number
          community_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          published?: boolean
          stripe_payment_link_id?: string | null
          stripe_product_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      highest_movement_results: {
        Row: {
          date: string | null
          movementId: string | null
          resultType: string | null
          resultValue: number | null
          userId: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movement_results_movementid_fkey"
            columns: ["movementId"]
            isOneToOne: false
            referencedRelation: "movements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movement_results_userid_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      program_groups_details: {
        Row: {
          created_at: string | null
          id: string | null
          jsontext: string | null
          name: string | null
          order: number | null
          session_id: string | null
          text: string | null
          video: string | null
          watched_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_groups_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "program_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          admin: boolean | null
          disabled: boolean | null
          displayName: string | null
          email: string | null
          emailVerified: boolean | null
          id: string | null
          phone: string | null
          photoUrl: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: string
      }
      get_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: Json
      }
      get_claims: {
        Args: {
          uid: string
        }
        Returns: Json
      }
      get_my_claim: {
        Args: {
          claim: string
        }
        Returns: Json
      }
      get_my_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_claims_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_claim: {
        Args: {
          uid: string
          claim: string
          value: Json
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

