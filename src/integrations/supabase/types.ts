export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      _supabase_migrations: {
        Row: {
          applied_at: string;
          hash: string;
          name: string;
          statement_timeout: string;
          version: string;
        };
        Insert: {
          applied_at?: string;
          hash?: string;
          name: string;
          statement_timeout?: string;
          version: string;
        };
        Update: {
          applied_at?: string;
          hash?: string;
          name?: string;
          statement_timeout?: string;
          version?: string;
        };
        Relationships: [];
      };
      ai_credits: {
        Row: {
          credits_remaining: number;
          credits_used: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          credits_remaining?: number;
          credits_used?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          credits_remaining?: number;
          credits_used?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      ai_evaluations: {
        Row: {
          ai_feedback: string | null;
          ai_score: number | null;
          content: string;
          course_id: string | null;
          id: string;
          lesson_id: string | null;
          rubric_evaluation: Json | null;
          submitted_at: string | null;
          user_id: string;
        };
        Insert: {
          ai_feedback?: string | null;
          ai_score?: number | null;
          content: string;
          course_id?: string | null;
          id?: string;
          lesson_id?: string | null;
          rubric_evaluation?: Json | null;
          submitted_at?: string | null;
          user_id: string;
        };
        Update: {
          ai_feedback?: string | null;
          ai_score?: number | null;
          content?: string;
          course_id?: string | null;
          id?: string;
          lesson_id?: string | null;
          rubric_evaluation?: Json | null;
          submitted_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_evaluations_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ai_evaluations_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_outputs: {
        Row: {
          course_id: string | null;
          created_at: string;
          id: string;
          payload: Json;
          title: string;
          tool: string;
          user_id: string;
        };
        Insert: {
          course_id?: string | null;
          created_at?: string;
          id?: string;
          payload?: Json;
          title: string;
          tool: string;
          user_id: string;
        };
        Update: {
          course_id?: string | null;
          created_at?: string;
          id?: string;
          payload?: Json;
          title?: string;
          tool?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      ai_usage: {
        Row: {
          completion_tokens: number;
          conversation_id: string | null;
          cost_inr: number;
          cost_usd: number;
          created_at: string;
          credits_charged: number;
          id: string;
          model: string;
          prompt_tokens: number;
          total_tokens: number;
          user_id: string;
        };
        Insert: {
          completion_tokens?: number;
          conversation_id?: string | null;
          cost_inr?: number;
          cost_usd?: number;
          created_at?: string;
          credits_charged?: number;
          id?: string;
          model: string;
          prompt_tokens?: number;
          total_tokens?: number;
          user_id: string;
        };
        Update: {
          completion_tokens?: number;
          conversation_id?: string | null;
          cost_inr?: number;
          cost_usd?: number;
          created_at?: string;
          credits_charged?: number;
          id?: string;
          model?: string;
          prompt_tokens?: number;
          total_tokens?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_usage_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "chat_conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      assignment_submissions: {
        Row: {
          assignment_id: string;
          attachment_url: string | null;
          content: string | null;
          course_id: string;
          feedback: string | null;
          id: string;
          link_url: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          status: string;
          submitted_at: string;
          user_id: string;
        };
        Insert: {
          assignment_id: string;
          attachment_url?: string | null;
          content?: string | null;
          course_id: string;
          feedback?: string | null;
          id?: string;
          link_url?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string;
          submitted_at?: string;
          user_id: string;
        };
        Update: {
          assignment_id?: string;
          attachment_url?: string | null;
          content?: string | null;
          course_id?: string;
          feedback?: string | null;
          id?: string;
          link_url?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string;
          submitted_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey";
            columns: ["assignment_id"];
            isOneToOne: false;
            referencedRelation: "course_assignments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assignment_submissions_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assignment_submissions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      badges: {
        Row: {
          category: string;
          challenge_required: number | null;
          course_id: string | null;
          course_required: number | null;
          created_at: string;
          description: string;
          icon_url: string;
          id: string;
          name: string;
          streak_required: number | null;
          test_required: number | null;
          xp_required: number | null;
        };
        Insert: {
          category?: string;
          challenge_required?: number | null;
          course_id?: string | null;
          course_required?: number | null;
          created_at?: string;
          description: string;
          icon_url: string;
          id?: string;
          name: string;
          streak_required?: number | null;
          test_required?: number | null;
          xp_required?: number | null;
        };
        Update: {
          category?: string;
          challenge_required?: number | null;
          course_id?: string | null;
          course_required?: number | null;
          created_at?: string;
          description?: string;
          icon_url?: string;
          id?: string;
          name?: string;
          streak_required?: number | null;
          test_required?: number | null;
          xp_required?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "badges_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_comments: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          post_id: string;
          user_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          post_id: string;
          user_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          post_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "blog_comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "blog_posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_likes: {
        Row: {
          created_at: string;
          id: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_likes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "blog_posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_posts: {
        Row: {
          author_id: string | null;
          content: string;
          created_at: string;
          excerpt: string | null;
          featured_image: string | null;
          id: string;
          published: boolean | null;
          published_at: string | null;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id?: string | null;
          content?: string;
          created_at?: string;
          excerpt?: string | null;
          featured_image?: string | null;
          id?: string;
          published?: boolean | null;
          published_at?: string | null;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string | null;
          content?: string;
          created_at?: string;
          excerpt?: string | null;
          featured_image?: string | null;
          id?: string;
          published?: boolean | null;
          published_at?: string | null;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      cart_items: {
        Row: {
          added_at: string;
          course_id: string;
          id: string;
          user_id: string;
        };
        Insert: {
          added_at?: string;
          course_id: string;
          id?: string;
          user_id: string;
        };
        Update: {
          added_at?: string;
          course_id?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      certificate_audit_log: {
        Row: {
          action: string;
          certificate_id: string;
          code: string | null;
          course_id: string | null;
          course_title: string | null;
          created_at: string;
          id: string;
          issued_by: string | null;
          metadata: Json;
          recipient_email: string | null;
          recipient_name: string | null;
          recipient_user_id: string;
          score: number;
          template_id: string | null;
          template_name: string | null;
          total: number;
        };
        Insert: {
          action?: string;
          certificate_id: string;
          code?: string | null;
          course_id?: string | null;
          course_title?: string | null;
          created_at?: string;
          id?: string;
          issued_by?: string | null;
          metadata?: Json;
          recipient_email?: string | null;
          recipient_name?: string | null;
          recipient_user_id: string;
          score?: number;
          template_id?: string | null;
          template_name?: string | null;
          total?: number;
        };
        Update: {
          action?: string;
          certificate_id?: string;
          code?: string | null;
          course_id?: string | null;
          course_title?: string | null;
          created_at?: string;
          id?: string;
          issued_by?: string | null;
          metadata?: Json;
          recipient_email?: string | null;
          recipient_name?: string | null;
          recipient_user_id?: string;
          score?: number;
          template_id?: string | null;
          template_name?: string | null;
          total?: number;
        };
        Relationships: [];
      };
      certificate_email_log: {
        Row: {
          attempt: number;
          certificate_id: string;
          created_at: string;
          error: string | null;
          id: string;
          idempotency_key: string | null;
          max_attempts: number;
          next_retry_at: string | null;
          provider_message_id: string | null;
          recipient_email: string;
          sent_by: string | null;
          status: string;
        };
        Insert: {
          attempt?: number;
          certificate_id: string;
          created_at?: string;
          error?: string | null;
          id?: string;
          idempotency_key?: string | null;
          max_attempts?: number;
          next_retry_at?: string | null;
          provider_message_id?: string | null;
          recipient_email: string;
          sent_by?: string | null;
          status?: string;
        };
        Update: {
          attempt?: number;
          certificate_id?: string;
          created_at?: string;
          error?: string | null;
          id?: string;
          idempotency_key?: string | null;
          max_attempts?: number;
          next_retry_at?: string | null;
          provider_message_id?: string | null;
          recipient_email?: string;
          sent_by?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      certificate_templates: {
        Row: {
          accent_color: string;
          accent_color_2: string | null;
          background_pattern: string;
          bg_color: string;
          body_font: string | null;
          body_size: number;
          body_template: string;
          border_style: string;
          border_width: number;
          corner_style: string;
          created_at: string;
          created_by: string | null;
          font_family: string;
          id: string;
          is_default: boolean;
          layout: string;
          logo_url: string | null;
          name: string;
          name_size: number;
          signatory_name: string;
          signatory_title: string;
          signature_url: string | null;
          stamp_url: string | null;
          subtitle: string;
          text_color: string;
          title_font: string | null;
          title_size: number;
          title_text: string;
          updated_at: string;
        };
        Insert: {
          accent_color?: string;
          accent_color_2?: string | null;
          background_pattern?: string;
          bg_color?: string;
          body_font?: string | null;
          body_size?: number;
          body_template?: string;
          border_style?: string;
          border_width?: number;
          corner_style?: string;
          created_at?: string;
          created_by?: string | null;
          font_family?: string;
          id?: string;
          is_default?: boolean;
          layout?: string;
          logo_url?: string | null;
          name: string;
          name_size?: number;
          signatory_name?: string;
          signatory_title?: string;
          signature_url?: string | null;
          stamp_url?: string | null;
          subtitle?: string;
          text_color?: string;
          title_font?: string | null;
          title_size?: number;
          title_text?: string;
          updated_at?: string;
        };
        Update: {
          accent_color?: string;
          accent_color_2?: string | null;
          background_pattern?: string;
          bg_color?: string;
          body_font?: string | null;
          body_size?: number;
          body_template?: string;
          border_style?: string;
          border_width?: number;
          corner_style?: string;
          created_at?: string;
          created_by?: string | null;
          font_family?: string;
          id?: string;
          is_default?: boolean;
          layout?: string;
          logo_url?: string | null;
          name?: string;
          name_size?: number;
          signatory_name?: string;
          signatory_title?: string;
          signature_url?: string | null;
          stamp_url?: string | null;
          subtitle?: string;
          text_color?: string;
          title_font?: string | null;
          title_size?: number;
          title_text?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          code: string;
          course_id: string;
          date_from: string | null;
          date_to: string | null;
          design_snapshot: Json | null;
          dynamic_data: Json | null;
          id: string;
          issued_at: string;
          issued_by: string | null;
          notes: string | null;
          recipient_name: string | null;
          role_title: string | null;
          score: number;
          template_id: string | null;
          total: number;
          user_id: string;
          verification_url: string | null;
        };
        Insert: {
          code: string;
          course_id: string;
          date_from?: string | null;
          date_to?: string | null;
          design_snapshot?: Json | null;
          dynamic_data?: Json | null;
          id?: string;
          issued_at?: string;
          issued_by?: string | null;
          notes?: string | null;
          recipient_name?: string | null;
          role_title?: string | null;
          score?: number;
          template_id?: string | null;
          total?: number;
          user_id: string;
          verification_url?: string | null;
        };
        Update: {
          code?: string;
          course_id?: string;
          date_from?: string | null;
          date_to?: string | null;
          design_snapshot?: Json | null;
          dynamic_data?: Json | null;
          id?: string;
          issued_at?: string;
          issued_by?: string | null;
          notes?: string | null;
          recipient_name?: string | null;
          role_title?: string | null;
          score?: number;
          template_id?: string | null;
          total?: number;
          user_id?: string;
          verification_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_conversations: {
        Row: {
          created_at: string;
          id: string;
          model: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          model?: string;
          title?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          model?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          content: string;
          conversation_id: string;
          created_at: string;
          id: string;
          model: string | null;
          role: string;
          token_count: number | null;
          user_id: string;
        };
        Insert: {
          content: string;
          conversation_id: string;
          created_at?: string;
          id?: string;
          model?: string | null;
          role: string;
          token_count?: number | null;
          user_id: string;
        };
        Update: {
          content?: string;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          model?: string | null;
          role?: string;
          token_count?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "chat_conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      coaching_bookings: {
        Row: {
          coach_id: string;
          created_at: string;
          id: string;
          learner_id: string;
          notes: string | null;
          slot_id: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          coach_id: string;
          created_at?: string;
          id?: string;
          learner_id: string;
          notes?: string | null;
          slot_id: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          coach_id?: string;
          created_at?: string;
          id?: string;
          learner_id?: string;
          notes?: string | null;
          slot_id?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "coaching_bookings_coach_id_fkey";
            columns: ["coach_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "coaching_bookings_learner_id_fkey";
            columns: ["learner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "coaching_bookings_slot_id_fkey";
            columns: ["slot_id"];
            isOneToOne: true;
            referencedRelation: "coaching_slots";
            referencedColumns: ["id"];
          },
        ];
      };
      coaching_roadmaps: {
        Row: {
          ai_prompt: string | null;
          created_at: string;
          creator_id: string;
          description: string | null;
          estimated_hours: number | null;
          id: string;
          is_template: boolean;
          learner_id: string | null;
          phases: Json;
          published_at: string | null;
          skill_level: string | null;
          source: string;
          status: string;
          tags: string[] | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          ai_prompt?: string | null;
          created_at?: string;
          creator_id: string;
          description?: string | null;
          estimated_hours?: number | null;
          id?: string;
          is_template?: boolean;
          learner_id?: string | null;
          phases?: Json;
          published_at?: string | null;
          skill_level?: string | null;
          source?: string;
          status?: string;
          tags?: string[] | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          ai_prompt?: string | null;
          created_at?: string;
          creator_id?: string;
          description?: string | null;
          estimated_hours?: number | null;
          id?: string;
          is_template?: boolean;
          learner_id?: string | null;
          phases?: Json;
          published_at?: string | null;
          skill_level?: string | null;
          source?: string;
          status?: string;
          tags?: string[] | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "coaching_roadmaps_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "coaching_roadmaps_learner_id_fkey";
            columns: ["learner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      coaching_slots: {
        Row: {
          coach_id: string;
          created_at: string;
          end_time: string;
          id: string;
          is_booked: boolean;
          meeting_url: string | null;
          price_inr: number;
          start_time: string;
        };
        Insert: {
          coach_id: string;
          created_at?: string;
          end_time: string;
          id?: string;
          is_booked?: boolean;
          meeting_url?: string | null;
          price_inr?: number;
          start_time: string;
        };
        Update: {
          coach_id?: string;
          created_at?: string;
          end_time?: string;
          id?: string;
          is_booked?: boolean;
          meeting_url?: string | null;
          price_inr?: number;
          start_time?: string;
        };
        Relationships: [
          {
            foreignKeyName: "coaching_slots_coach_id_fkey";
            columns: ["coach_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      cohort_members: {
        Row: {
          cohort_id: string;
          id: string;
          joined_at: string;
          role: string;
          user_id: string;
        };
        Insert: {
          cohort_id: string;
          id?: string;
          joined_at?: string;
          role?: string;
          user_id: string;
        };
        Update: {
          cohort_id?: string;
          id?: string;
          joined_at?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cohort_members_cohort_id_fkey";
            columns: ["cohort_id"];
            isOneToOne: false;
            referencedRelation: "cohorts";
            referencedColumns: ["id"];
          },
        ];
      };
      cohorts: {
        Row: {
          capacity: number;
          course_id: string | null;
          created_at: string;
          creator_id: string;
          description: string | null;
          ends_at: string | null;
          group_link: string | null;
          id: string;
          kind: string;
          meeting_url: string | null;
          starts_at: string;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          capacity?: number;
          course_id?: string | null;
          created_at?: string;
          creator_id: string;
          description?: string | null;
          ends_at?: string | null;
          group_link?: string | null;
          id?: string;
          kind?: string;
          meeting_url?: string | null;
          starts_at: string;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          capacity?: number;
          course_id?: string | null;
          created_at?: string;
          creator_id?: string;
          description?: string | null;
          ends_at?: string | null;
          group_link?: string | null;
          id?: string;
          kind?: string;
          meeting_url?: string | null;
          starts_at?: string;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      community_messages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_messages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      coupon_codes: {
        Row: {
          active: boolean;
          applicable_plan_ids: string[] | null;
          code: string;
          created_at: string;
          description: string | null;
          discount_amount_inr: number | null;
          discount_percent: number | null;
          id: string;
          max_uses: number | null;
          used_count: number;
          valid_from: string;
          valid_until: string | null;
        };
        Insert: {
          active?: boolean;
          applicable_plan_ids?: string[] | null;
          code: string;
          created_at?: string;
          description?: string | null;
          discount_amount_inr?: number | null;
          discount_percent?: number | null;
          id?: string;
          max_uses?: number | null;
          used_count?: number;
          valid_from?: string;
          valid_until?: string | null;
        };
        Update: {
          active?: boolean;
          applicable_plan_ids?: string[] | null;
          code?: string;
          created_at?: string;
          description?: string | null;
          discount_amount_inr?: number | null;
          discount_percent?: number | null;
          id?: string;
          max_uses?: number | null;
          used_count?: number;
          valid_from?: string;
          valid_until?: string | null;
        };
        Relationships: [];
      };
      course_assignments: {
        Row: {
          course_id: string;
          created_at: string;
          id: string;
          lesson_id: string | null;
          order_index: number;
          prompt: string;
          starter_code: string | null;
          title: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          id?: string;
          lesson_id?: string | null;
          order_index?: number;
          prompt: string;
          starter_code?: string | null;
          title: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          id?: string;
          lesson_id?: string | null;
          order_index?: number;
          prompt?: string;
          starter_code?: string | null;
          title?: string;
        };
        Relationships: [];
      };
      course_materials: {
        Row: {
          course_id: string | null;
          created_at: string | null;
          file_url: string | null;
          id: string;
          material_type: string;
          title: string;
        };
        Insert: {
          course_id?: string | null;
          created_at?: string | null;
          file_url?: string | null;
          id?: string;
          material_type: string;
          title: string;
        };
        Update: {
          course_id?: string | null;
          created_at?: string | null;
          file_url?: string | null;
          id?: string;
          material_type?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_materials_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      course_modules: {
        Row: {
          course_id: string;
          created_at: string;
          description: string | null;
          id: string;
          order_index: number;
          title: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          order_index?: number;
          title: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          order_index?: number;
          title?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          category: string;
          certificate_template_id: string | null;
          cover_url: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          duration_minutes: number;
          id: string;
          instructor: string;
          level: string;
          price_inr: number;
          published: boolean;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          category?: string;
          certificate_template_id?: string | null;
          cover_url?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          duration_minutes?: number;
          id?: string;
          instructor?: string;
          level?: string;
          price_inr?: number;
          published?: boolean;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          category?: string;
          certificate_template_id?: string | null;
          cover_url?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          duration_minutes?: number;
          id?: string;
          instructor?: string;
          level?: string;
          price_inr?: number;
          published?: boolean;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "courses_certificate_template_id_fkey";
            columns: ["certificate_template_id"];
            isOneToOne: false;
            referencedRelation: "certificate_templates";
            referencedColumns: ["id"];
          },
        ];
      };
      creator_applications: {
        Row: {
          admin_notes: string | null;
          created_at: string;
          expertise: string | null;
          id: string;
          motivation: string;
          portfolio_url: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          admin_notes?: string | null;
          created_at?: string;
          expertise?: string | null;
          id?: string;
          motivation: string;
          portfolio_url?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          admin_notes?: string | null;
          created_at?: string;
          expertise?: string | null;
          id?: string;
          motivation?: string;
          portfolio_url?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      creator_subscriptions: {
        Row: {
          created_at: string;
          creator_id: string;
          id: string;
          subscriber_id: string;
        };
        Insert: {
          created_at?: string;
          creator_id: string;
          id?: string;
          subscriber_id: string;
        };
        Update: {
          created_at?: string;
          creator_id?: string;
          id?: string;
          subscriber_id?: string;
        };
        Relationships: [];
      };
      creator_withdrawals: {
        Row: {
          admin_notes: string | null;
          amount_inr: number;
          created_at: string;
          destination: Json;
          id: string;
          method: string;
          processed_at: string | null;
          processed_by: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          admin_notes?: string | null;
          amount_inr: number;
          created_at?: string;
          destination?: Json;
          id?: string;
          method?: string;
          processed_at?: string | null;
          processed_by?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          admin_notes?: string | null;
          amount_inr?: number;
          created_at?: string;
          destination?: Json;
          id?: string;
          method?: string;
          processed_at?: string | null;
          processed_by?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      crm_deals: {
        Row: {
          amount_inr: number | null;
          closed_at: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          lead_id: string | null;
          pipeline_stage: string | null;
          title: string;
          workspace_id: string | null;
        };
        Insert: {
          amount_inr?: number | null;
          closed_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          lead_id?: string | null;
          pipeline_stage?: string | null;
          title: string;
          workspace_id?: string | null;
        };
        Update: {
          amount_inr?: number | null;
          closed_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          lead_id?: string | null;
          pipeline_stage?: string | null;
          title?: string;
          workspace_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "crm_deals_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "crm_leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "crm_deals_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      crm_leads: {
        Row: {
          created_at: string;
          created_by: string | null;
          email: string | null;
          id: string;
          name: string;
          notes: string | null;
          phone: string | null;
          source: string | null;
          status: string | null;
          value_inr: number | null;
          workspace_id: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          email?: string | null;
          id?: string;
          name: string;
          notes?: string | null;
          phone?: string | null;
          source?: string | null;
          status?: string | null;
          value_inr?: number | null;
          workspace_id?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          email?: string | null;
          id?: string;
          name?: string;
          notes?: string | null;
          phone?: string | null;
          source?: string | null;
          status?: string | null;
          value_inr?: number | null;
          workspace_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "crm_leads_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      email_templates: {
        Row: {
          description: string | null;
          html_body: string;
          id: string;
          name: string;
          subject: string;
          updated_at: string | null;
          updated_by: string | null;
          variables: string[] | null;
        };
        Insert: {
          description?: string | null;
          html_body: string;
          id: string;
          name: string;
          subject: string;
          updated_at?: string | null;
          updated_by?: string | null;
          variables?: string[] | null;
        };
        Update: {
          description?: string | null;
          html_body?: string;
          id?: string;
          name?: string;
          subject?: string;
          updated_at?: string | null;
          updated_by?: string | null;
          variables?: string[] | null;
        };
        Relationships: [];
      };
      enrichment_progress: {
        Row: {
          from_cache: boolean;
          id: string;
          lesson_id: string;
          lesson_title: string;
          message: string | null;
          order_index: number;
          run_id: string;
          state: string;
          updated_at: string;
        };
        Insert: {
          from_cache?: boolean;
          id?: string;
          lesson_id: string;
          lesson_title: string;
          message?: string | null;
          order_index?: number;
          run_id: string;
          state?: string;
          updated_at?: string;
        };
        Update: {
          from_cache?: boolean;
          id?: string;
          lesson_id?: string;
          lesson_title?: string;
          message?: string | null;
          order_index?: number;
          run_id?: string;
          state?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "enrichment_progress_run_id_fkey";
            columns: ["run_id"];
            isOneToOne: false;
            referencedRelation: "enrichment_runs";
            referencedColumns: ["id"];
          },
        ];
      };
      enrichment_runs: {
        Row: {
          cancel_requested: boolean;
          course_id: string;
          failures: Json;
          finished_at: string | null;
          id: string;
          started_at: string;
          started_by: string;
          status: string;
          total: number;
          updated_transcripts: number;
          updated_videos: number;
          warnings: Json;
          with_transcript: boolean;
          youtube_key_status: string;
        };
        Insert: {
          cancel_requested?: boolean;
          course_id: string;
          failures?: Json;
          finished_at?: string | null;
          id?: string;
          started_at?: string;
          started_by: string;
          status?: string;
          total?: number;
          updated_transcripts?: number;
          updated_videos?: number;
          warnings?: Json;
          with_transcript?: boolean;
          youtube_key_status?: string;
        };
        Update: {
          cancel_requested?: boolean;
          course_id?: string;
          failures?: Json;
          finished_at?: string | null;
          id?: string;
          started_at?: string;
          started_by?: string;
          status?: string;
          total?: number;
          updated_transcripts?: number;
          updated_videos?: number;
          warnings?: Json;
          with_transcript?: boolean;
          youtube_key_status?: string;
        };
        Relationships: [];
      };
      enrollments: {
        Row: {
          completed_at: string | null;
          course_id: string;
          enrolled_at: string;
          id: string;
          last_activity_at: string;
          progress_pct: number;
          status: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          course_id: string;
          enrolled_at?: string;
          id?: string;
          last_activity_at?: string;
          progress_pct?: number;
          status?: string;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          course_id?: string;
          enrolled_at?: string;
          id?: string;
          last_activity_at?: string;
          progress_pct?: number;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          image_url: string | null;
          location: string | null;
          rsvp_url: string | null;
          starts_at: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          location?: string | null;
          rsvp_url?: string | null;
          starts_at: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          location?: string | null;
          rsvp_url?: string | null;
          starts_at?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      faqs: {
        Row: {
          answer: string;
          category: string;
          created_at: string;
          created_by: string | null;
          id: string;
          order_index: number;
          published: boolean;
          question: string;
          updated_at: string;
        };
        Insert: {
          answer: string;
          category?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          order_index?: number;
          published?: boolean;
          question: string;
          updated_at?: string;
        };
        Update: {
          answer?: string;
          category?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          order_index?: number;
          published?: boolean;
          question?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      feature_flags: {
        Row: {
          created_at: string | null;
          description: string | null;
          enabled: boolean | null;
          id: string;
          key: string;
          maintenance_mode: boolean | null;
          name: string;
          roles: string[] | null;
          subscription_tiers: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          enabled?: boolean | null;
          id?: string;
          key: string;
          maintenance_mode?: boolean | null;
          name: string;
          roles?: string[] | null;
          subscription_tiers?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          enabled?: boolean | null;
          id?: string;
          key?: string;
          maintenance_mode?: boolean | null;
          name?: string;
          roles?: string[] | null;
          subscription_tiers?: string[] | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      flashcards: {
        Row: {
          back_text: string;
          course_id: string | null;
          created_at: string | null;
          ease_factor: number | null;
          front_text: string;
          id: string;
          interval_days: number | null;
          lesson_id: string | null;
          next_review_date: string | null;
          user_id: string;
        };
        Insert: {
          back_text: string;
          course_id?: string | null;
          created_at?: string | null;
          ease_factor?: number | null;
          front_text: string;
          id?: string;
          interval_days?: number | null;
          lesson_id?: string | null;
          next_review_date?: string | null;
          user_id: string;
        };
        Update: {
          back_text?: string;
          course_id?: string | null;
          created_at?: string | null;
          ease_factor?: number | null;
          front_text?: string;
          id?: string;
          interval_days?: number | null;
          lesson_id?: string | null;
          next_review_date?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flashcards_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "flashcards_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      group_messages: {
        Row: {
          cohort_id: string;
          content: string;
          created_at: string;
          id: string;
          sender_id: string;
        };
        Insert: {
          cohort_id: string;
          content: string;
          created_at?: string;
          id?: string;
          sender_id: string;
        };
        Update: {
          cohort_id?: string;
          content?: string;
          created_at?: string;
          id?: string;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "group_messages_cohort_id_fkey";
            columns: ["cohort_id"];
            isOneToOne: false;
            referencedRelation: "cohorts";
            referencedColumns: ["id"];
          },
        ];
      };
      invoices: {
        Row: {
          amount_inr: number;
          cashfree_order_id: string | null;
          created_at: string;
          id: string;
          invoice_number: string;
          line_items: Json | null;
          paid_at: string | null;
          payment_method: string | null;
          pdf_url: string | null;
          period_end: string | null;
          period_start: string | null;
          status: string;
          subscription_id: string | null;
          tax_inr: number | null;
          total_inr: number;
          user_id: string;
        };
        Insert: {
          amount_inr: number;
          cashfree_order_id?: string | null;
          created_at?: string;
          id?: string;
          invoice_number: string;
          line_items?: Json | null;
          paid_at?: string | null;
          payment_method?: string | null;
          pdf_url?: string | null;
          period_end?: string | null;
          period_start?: string | null;
          status?: string;
          subscription_id?: string | null;
          tax_inr?: number | null;
          total_inr: number;
          user_id: string;
        };
        Update: {
          amount_inr?: number;
          cashfree_order_id?: string | null;
          created_at?: string;
          id?: string;
          invoice_number?: string;
          line_items?: Json | null;
          paid_at?: string | null;
          payment_method?: string | null;
          pdf_url?: string | null;
          period_end?: string | null;
          period_start?: string | null;
          status?: string;
          subscription_id?: string | null;
          tax_inr?: number | null;
          total_inr?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "user_subscriptions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      job_postings: {
        Row: {
          active: boolean;
          apply_url: string | null;
          closes_at: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          location: string;
          team: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          apply_url?: string | null;
          closes_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          location: string;
          team: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          apply_url?: string | null;
          closes_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          location?: string;
          team?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lesson_comments: {
        Row: {
          body: string;
          created_at: string;
          id: string;
          lesson_id: string;
          parent_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          id?: string;
          lesson_id: string;
          parent_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          lesson_id?: string;
          parent_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "lesson_comments";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_likes: {
        Row: {
          created_at: string;
          id: string;
          lesson_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          lesson_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          lesson_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          completed: boolean;
          course_id: string;
          id: string;
          lesson_id: string;
          updated_at: string;
          user_id: string;
          watched_seconds: number;
        };
        Insert: {
          completed?: boolean;
          course_id: string;
          id?: string;
          lesson_id: string;
          updated_at?: string;
          user_id: string;
          watched_seconds?: number;
        };
        Update: {
          completed?: boolean;
          course_id?: string;
          id?: string;
          lesson_id?: string;
          updated_at?: string;
          user_id?: string;
          watched_seconds?: number;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_progress_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_views: {
        Row: {
          created_at: string;
          id: string;
          lesson_id: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          lesson_id: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          lesson_id?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          content_md: string | null;
          course_id: string;
          created_at: string;
          description: string | null;
          duration_minutes: number;
          id: string;
          is_preview: boolean;
          module_id: string | null;
          order_index: number;
          title: string;
          video_channel_id: string | null;
          video_url: string | null;
        };
        Insert: {
          content_md?: string | null;
          course_id: string;
          created_at?: string;
          description?: string | null;
          duration_minutes?: number;
          id?: string;
          is_preview?: boolean;
          module_id?: string | null;
          order_index?: number;
          title: string;
          video_channel_id?: string | null;
          video_url?: string | null;
        };
        Update: {
          content_md?: string | null;
          course_id?: string;
          created_at?: string;
          description?: string | null;
          duration_minutes?: number;
          id?: string;
          is_preview?: boolean;
          module_id?: string | null;
          order_index?: number;
          title?: string;
          video_channel_id?: string | null;
          video_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      material_chunks: {
        Row: {
          content: string;
          course_id: string | null;
          created_at: string | null;
          embedding: string | null;
          id: string;
          material_id: string | null;
        };
        Insert: {
          content: string;
          course_id?: string | null;
          created_at?: string | null;
          embedding?: string | null;
          id?: string;
          material_id?: string | null;
        };
        Update: {
          content?: string;
          course_id?: string | null;
          created_at?: string | null;
          embedding?: string | null;
          id?: string;
          material_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "material_chunks_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "material_chunks_material_id_fkey";
            columns: ["material_id"];
            isOneToOne: false;
            referencedRelation: "course_materials";
            referencedColumns: ["id"];
          },
        ];
      };
      mcq_attempts: {
        Row: {
          answers: Json;
          course_id: string;
          created_at: string;
          id: string;
          passed: boolean;
          score: number;
          total: number;
          user_id: string;
        };
        Insert: {
          answers?: Json;
          course_id: string;
          created_at?: string;
          id?: string;
          passed?: boolean;
          score?: number;
          total?: number;
          user_id: string;
        };
        Update: {
          answers?: Json;
          course_id?: string;
          created_at?: string;
          id?: string;
          passed?: boolean;
          score?: number;
          total?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "mcq_attempts_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      mcq_questions: {
        Row: {
          answer: number;
          course_id: string;
          created_at: string;
          explanation: string | null;
          id: string;
          options: Json;
          order_index: number;
          question: string;
        };
        Insert: {
          answer: number;
          course_id: string;
          created_at?: string;
          explanation?: string | null;
          id?: string;
          options: Json;
          order_index?: number;
          question: string;
        };
        Update: {
          answer?: number;
          course_id?: string;
          created_at?: string;
          explanation?: string | null;
          id?: string;
          options?: Json;
          order_index?: number;
          question?: string;
        };
        Relationships: [];
      };
      media_library: {
        Row: {
          alt_text: string | null;
          created_at: string;
          filename: string;
          folder: string | null;
          id: string;
          mime_type: string;
          original_name: string;
          size_bytes: number;
          tags: string[] | null;
          uploaded_by: string | null;
          url: string;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string;
          filename: string;
          folder?: string | null;
          id?: string;
          mime_type: string;
          original_name: string;
          size_bytes: number;
          tags?: string[] | null;
          uploaded_by?: string | null;
          url: string;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string;
          filename?: string;
          folder?: string | null;
          id?: string;
          mime_type?: string;
          original_name?: string;
          size_bytes?: number;
          tags?: string[] | null;
          uploaded_by?: string | null;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "media_library_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          read_at: string | null;
          receiver_id: string;
          sender_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          read_at?: string | null;
          receiver_id: string;
          sender_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          read_at?: string | null;
          receiver_id?: string;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey";
            columns: ["receiver_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          read: boolean;
          title: string;
          type: string;
          user_id: string | null;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          read?: boolean;
          title: string;
          type?: string;
          user_id?: string | null;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          id?: string;
          read?: boolean;
          title?: string;
          type?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      onboarding_coaching: {
        Row: {
          ai_suggestions: Json | null;
          created_at: string;
          id: string;
          message: string;
          response: string | null;
          step: string;
          user_id: string;
        };
        Insert: {
          ai_suggestions?: Json | null;
          created_at?: string;
          id?: string;
          message: string;
          response?: string | null;
          step: string;
          user_id: string;
        };
        Update: {
          ai_suggestions?: Json | null;
          created_at?: string;
          id?: string;
          message?: string;
          response?: string | null;
          step?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "onboarding_coaching_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      onboarding_daily_usage: {
        Row: {
          actions_count: number | null;
          created_at: string;
          features_used: string[] | null;
          id: string;
          notes: string | null;
          usage_date: string;
          user_id: string;
          xp_earned: number | null;
        };
        Insert: {
          actions_count?: number | null;
          created_at?: string;
          features_used?: string[] | null;
          id?: string;
          notes?: string | null;
          usage_date?: string;
          user_id: string;
          xp_earned?: number | null;
        };
        Update: {
          actions_count?: number | null;
          created_at?: string;
          features_used?: string[] | null;
          id?: string;
          notes?: string | null;
          usage_date?: string;
          user_id?: string;
          xp_earned?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "onboarding_daily_usage_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      onboarding_progress: {
        Row: {
          ai_profile: Json | null;
          coaching_session_count: number | null;
          completed_steps: string[] | null;
          created_at: string;
          current_step: string;
          daily_streak: number | null;
          first_project_id: string | null;
          id: string;
          last_active_date: string | null;
          onboarding_completed: boolean | null;
          onboarding_completed_at: string | null;
          product_tour_completed: boolean | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          ai_profile?: Json | null;
          coaching_session_count?: number | null;
          completed_steps?: string[] | null;
          created_at?: string;
          current_step?: string;
          daily_streak?: number | null;
          first_project_id?: string | null;
          id?: string;
          last_active_date?: string | null;
          onboarding_completed?: boolean | null;
          onboarding_completed_at?: string | null;
          product_tour_completed?: boolean | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          ai_profile?: Json | null;
          coaching_session_count?: number | null;
          completed_steps?: string[] | null;
          created_at?: string;
          current_step?: string;
          daily_streak?: number | null;
          first_project_id?: string | null;
          id?: string;
          last_active_date?: string | null;
          onboarding_completed?: boolean | null;
          onboarding_completed_at?: string | null;
          product_tour_completed?: boolean | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "onboarding_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      payment_logs: {
        Row: {
          cashfree_event_id: string | null;
          created_at: string;
          error_message: string | null;
          event_type: string;
          id: string;
          idempotency_key: string | null;
          request_payload: Json | null;
          response_payload: Json | null;
          status: string | null;
          subscription_id: string | null;
          user_id: string | null;
        };
        Insert: {
          cashfree_event_id?: string | null;
          created_at?: string;
          error_message?: string | null;
          event_type: string;
          id?: string;
          idempotency_key?: string | null;
          request_payload?: Json | null;
          response_payload?: Json | null;
          status?: string | null;
          subscription_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          cashfree_event_id?: string | null;
          created_at?: string;
          error_message?: string | null;
          event_type?: string;
          id?: string;
          idempotency_key?: string | null;
          request_payload?: Json | null;
          response_payload?: Json | null;
          status?: string | null;
          subscription_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payment_logs_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "user_subscriptions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payment_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      playground_files: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          language: string | null;
          name: string;
          path: string;
          project_id: string;
          updated_at: string;
        };
        Insert: {
          content?: string;
          created_at?: string;
          id?: string;
          language?: string | null;
          name?: string;
          path?: string;
          project_id: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          language?: string | null;
          name?: string;
          path?: string;
          project_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "playground_files_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "playground_projects";
            referencedColumns: ["id"];
          },
        ];
      };
      playground_projects: {
        Row: {
          created_at: string;
          description: string | null;
          github: string | null;
          id: string;
          image_url: string | null;
          is_public: boolean;
          language: string;
          screenshot_url: string | null;
          tags: string[] | null;
          template: string | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          github?: string | null;
          id?: string;
          image_url?: string | null;
          is_public?: boolean;
          language?: string;
          screenshot_url?: string | null;
          tags?: string[] | null;
          template?: string | null;
          title?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          github?: string | null;
          id?: string;
          image_url?: string | null;
          is_public?: boolean;
          language?: string;
          screenshot_url?: string | null;
          tags?: string[] | null;
          template?: string | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      playground_runs: {
        Row: {
          code: string;
          created_at: string;
          execution_time_ms: number | null;
          exit_code: number | null;
          id: string;
          language: string;
          memory_kb: number | null;
          project_id: string | null;
          status: string;
          stderr: string | null;
          stdin: string | null;
          stdout: string | null;
          user_id: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          execution_time_ms?: number | null;
          exit_code?: number | null;
          id?: string;
          language: string;
          memory_kb?: number | null;
          project_id?: string | null;
          status?: string;
          stderr?: string | null;
          stdin?: string | null;
          stdout?: string | null;
          user_id: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          execution_time_ms?: number | null;
          exit_code?: number | null;
          id?: string;
          language?: string;
          memory_kb?: number | null;
          project_id?: string | null;
          status?: string;
          stderr?: string | null;
          stdin?: string | null;
          stdout?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "playground_runs_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "playground_projects";
            referencedColumns: ["id"];
          },
        ];
      };
      post_comments: {
        Row: {
          author_id: string;
          content: string;
          created_at: string;
          id: string;
          post_id: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          content: string;
          created_at?: string;
          id?: string;
          post_id: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          content?: string;
          created_at?: string;
          id?: string;
          post_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_comments_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      post_likes: {
        Row: {
          created_at: string;
          id: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      post_poll_votes: {
        Row: {
          created_at: string;
          id: string;
          option_index: number;
          post_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          option_index: number;
          post_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          option_index?: number;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_poll_votes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      post_saves: {
        Row: {
          created_at: string;
          id: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_saves_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_saves_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      posts: {
        Row: {
          author_id: string;
          content: string;
          created_at: string;
          id: string;
          is_pinned: boolean;
          media_type: string | null;
          media_url: string | null;
          post_type: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          content: string;
          created_at?: string;
          id?: string;
          is_pinned?: boolean;
          media_type?: string | null;
          media_url?: string | null;
          post_type?: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          content?: string;
          created_at?: string;
          id?: string;
          is_pinned?: boolean;
          media_type?: string | null;
          media_url?: string | null;
          post_type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      pricing_plans: {
        Row: {
          active: boolean;
          ai_credits_monthly: number | null;
          badge: string | null;
          cashfree_plan_id: string | null;
          color: string | null;
          created_at: string;
          cta_label: string;
          cta_to: string;
          description: string | null;
          features: Json;
          grace_period_days: number | null;
          highlighted: boolean;
          id: string;
          interval: string | null;
          max_courses: number | null;
          name: string;
          order_index: number;
          price_inr: number | null;
          price_label: string;
          trial_days: number | null;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          ai_credits_monthly?: number | null;
          badge?: string | null;
          cashfree_plan_id?: string | null;
          color?: string | null;
          created_at?: string;
          cta_label?: string;
          cta_to?: string;
          description?: string | null;
          features?: Json;
          grace_period_days?: number | null;
          highlighted?: boolean;
          id?: string;
          interval?: string | null;
          max_courses?: number | null;
          name: string;
          order_index?: number;
          price_inr?: number | null;
          price_label: string;
          trial_days?: number | null;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          ai_credits_monthly?: number | null;
          badge?: string | null;
          cashfree_plan_id?: string | null;
          color?: string | null;
          created_at?: string;
          cta_label?: string;
          cta_to?: string;
          description?: string | null;
          features?: Json;
          grace_period_days?: number | null;
          highlighted?: boolean;
          id?: string;
          interval?: string | null;
          max_courses?: number | null;
          name?: string;
          order_index?: number;
          price_inr?: number | null;
          price_label?: string;
          trial_days?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          banner_url: string | null;
          bio: string | null;
          brand_color: string | null;
          created_at: string;
          current_streak: number;
          default_course_settings: Json;
          education: string | null;
          email: string | null;
          full_name: string | null;
          highest_streak: number;
          id: string;
          invoice_company_name: string | null;
          invoice_contact: string | null;
          invoice_footer: string | null;
          invoice_gstin: string | null;
          invoice_legal_name: string | null;
          invoice_logo_url: string | null;
          invoice_prefix: string | null;
          last_active_at: string | null;
          last_active_date: string | null;
          location: string | null;
          mouse_cursor: boolean;
          name_color: string | null;
          notif_prefs: Json;
          org_logo_url: string | null;
          org_name: string | null;
          payout_destination: Json;
          show_banner: boolean;
          skills: string[] | null;
          social_links: Json;
          ui_prefs: Json;
          updated_at: string;
          username: string | null;
          website: string | null;
          work: string | null;
          xp: number;
        };
        Insert: {
          avatar_url?: string | null;
          banner_url?: string | null;
          bio?: string | null;
          brand_color?: string | null;
          created_at?: string;
          current_streak?: number;
          default_course_settings?: Json;
          education?: string | null;
          email?: string | null;
          full_name?: string | null;
          highest_streak?: number;
          id: string;
          invoice_company_name?: string | null;
          invoice_contact?: string | null;
          invoice_footer?: string | null;
          invoice_gstin?: string | null;
          invoice_legal_name?: string | null;
          invoice_logo_url?: string | null;
          invoice_prefix?: string | null;
          last_active_at?: string | null;
          last_active_date?: string | null;
          location?: string | null;
          mouse_cursor?: boolean;
          name_color?: string | null;
          notif_prefs?: Json;
          org_logo_url?: string | null;
          org_name?: string | null;
          payout_destination?: Json;
          show_banner?: boolean;
          skills?: string[] | null;
          social_links?: Json;
          ui_prefs?: Json;
          updated_at?: string;
          username?: string | null;
          website?: string | null;
          work?: string | null;
          xp?: number;
        };
        Update: {
          avatar_url?: string | null;
          banner_url?: string | null;
          bio?: string | null;
          brand_color?: string | null;
          created_at?: string;
          current_streak?: number;
          default_course_settings?: Json;
          education?: string | null;
          email?: string | null;
          full_name?: string | null;
          highest_streak?: number;
          id?: string;
          invoice_company_name?: string | null;
          invoice_contact?: string | null;
          invoice_footer?: string | null;
          invoice_gstin?: string | null;
          invoice_legal_name?: string | null;
          invoice_logo_url?: string | null;
          invoice_prefix?: string | null;
          last_active_at?: string | null;
          last_active_date?: string | null;
          location?: string | null;
          mouse_cursor?: boolean;
          name_color?: string | null;
          notif_prefs?: Json;
          org_logo_url?: string | null;
          org_name?: string | null;
          payout_destination?: Json;
          show_banner?: boolean;
          skills?: string[] | null;
          social_links?: Json;
          ui_prefs?: Json;
          updated_at?: string;
          username?: string | null;
          website?: string | null;
          work?: string | null;
          xp?: number;
        };
        Relationships: [];
      };
      project_comments: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          project_id: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          project_id: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          project_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_comments_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "playground_projects";
            referencedColumns: ["id"];
          },
        ];
      };
      project_likes: {
        Row: {
          created_at: string;
          id: string;
          project_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          project_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          project_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_likes_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "playground_projects";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          name: string;
          status: string | null;
          workspace_id: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          status?: string | null;
          workspace_id?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          status?: string | null;
          workspace_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "projects_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      roadmap_milestones: {
        Row: {
          description: string | null;
          id: string;
          order_index: number;
          resource_links: Json | null;
          roadmap_id: string | null;
          status: string | null;
          title: string;
        };
        Insert: {
          description?: string | null;
          id?: string;
          order_index: number;
          resource_links?: Json | null;
          roadmap_id?: string | null;
          status?: string | null;
          title: string;
        };
        Update: {
          description?: string | null;
          id?: string;
          order_index?: number;
          resource_links?: Json | null;
          roadmap_id?: string | null;
          status?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "roadmap_milestones_roadmap_id_fkey";
            columns: ["roadmap_id"];
            isOneToOne: false;
            referencedRelation: "roadmaps";
            referencedColumns: ["id"];
          },
        ];
      };
      roadmaps: {
        Row: {
          generated_at: string | null;
          goal: string;
          id: string;
          user_id: string;
        };
        Insert: {
          generated_at?: string | null;
          goal: string;
          id?: string;
          user_id: string;
        };
        Update: {
          generated_at?: string | null;
          goal?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      scheduled_reminders: {
        Row: {
          active: boolean;
          body: string | null;
          course_id: string | null;
          created_at: string;
          frequency: string;
          id: string;
          last_sent_at: string | null;
          next_run_at: string;
          title: string;
          user_id: string;
        };
        Insert: {
          active?: boolean;
          body?: string | null;
          course_id?: string | null;
          created_at?: string;
          frequency?: string;
          id?: string;
          last_sent_at?: string | null;
          next_run_at: string;
          title: string;
          user_id: string;
        };
        Update: {
          active?: boolean;
          body?: string | null;
          course_id?: string | null;
          created_at?: string;
          frequency?: string;
          id?: string;
          last_sent_at?: string | null;
          next_run_at?: string;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          updated_at: string;
          value: string | null;
        };
        Insert: {
          key: string;
          updated_at?: string;
          value?: string | null;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: string | null;
        };
        Relationships: [];
      };
      subscription_events: {
        Row: {
          created_at: string;
          event_type: string;
          id: string;
          payload: Json | null;
          subscription_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          event_type: string;
          id?: string;
          payload?: Json | null;
          subscription_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          event_type?: string;
          id?: string;
          payload?: Json | null;
          subscription_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "subscription_events_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "user_subscriptions";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          assigned_to: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          due_date: string | null;
          id: string;
          position: number | null;
          project_id: string | null;
          status: string | null;
          title: string;
        };
        Insert: {
          assigned_to?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          position?: number | null;
          project_id?: string | null;
          status?: string | null;
          title: string;
        };
        Update: {
          assigned_to?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          position?: number | null;
          project_id?: string | null;
          status?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      user_badges: {
        Row: {
          badge_id: string;
          earned_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          badge_id: string;
          earned_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          badge_id?: string;
          earned_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey";
            columns: ["badge_id"];
            isOneToOne: false;
            referencedRelation: "badges";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_badges_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_stats: {
        Row: {
          current_streak: number;
          last_activity_date: string | null;
          longest_streak: number;
          user_id: string;
          xp: number;
        };
        Insert: {
          current_streak?: number;
          last_activity_date?: string | null;
          longest_streak?: number;
          user_id: string;
          xp?: number;
        };
        Update: {
          current_streak?: number;
          last_activity_date?: string | null;
          longest_streak?: number;
          user_id?: string;
          xp?: number;
        };
        Relationships: [];
      };
      user_subscriptions: {
        Row: {
          ai_credits_reset_at: string;
          ai_credits_used_this_month: number;
          cancelled_at: string | null;
          cashfree_order_id: string | null;
          cashfree_subscription_id: string | null;
          created_at: string;
          current_period_end: string | null;
          current_period_start: string;
          id: string;
          plan_id: string;
          status: string;
          updated_at: string;
          user_id: string;
          will_renew: boolean;
        };
        Insert: {
          ai_credits_reset_at?: string;
          ai_credits_used_this_month?: number;
          cancelled_at?: string | null;
          cashfree_order_id?: string | null;
          cashfree_subscription_id?: string | null;
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string;
          id?: string;
          plan_id: string;
          status?: string;
          updated_at?: string;
          user_id: string;
          will_renew?: boolean;
        };
        Update: {
          ai_credits_reset_at?: string;
          ai_credits_used_this_month?: number;
          cancelled_at?: string | null;
          cashfree_order_id?: string | null;
          cashfree_subscription_id?: string | null;
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string;
          id?: string;
          plan_id?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
          will_renew?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "pricing_plans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "subscription_analytics";
            referencedColumns: ["plan_id"];
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      wallet_topup_requests: {
        Row: {
          admin_notes: string | null;
          amount_inr: number;
          approved_at: string | null;
          approved_by: string | null;
          created_at: string;
          id: string;
          method: string;
          reference: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          admin_notes?: string | null;
          amount_inr: number;
          approved_at?: string | null;
          approved_by?: string | null;
          created_at?: string;
          id?: string;
          method?: string;
          reference?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          admin_notes?: string | null;
          amount_inr?: number;
          approved_at?: string | null;
          approved_by?: string | null;
          created_at?: string;
          id?: string;
          method?: string;
          reference?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      wallet_transactions: {
        Row: {
          amount_inr: number;
          created_at: string;
          description: string | null;
          id: string;
          status: string;
          type: string;
          user_id: string;
        };
        Insert: {
          amount_inr: number;
          created_at?: string;
          description?: string | null;
          id?: string;
          status?: string;
          type: string;
          user_id: string;
        };
        Update: {
          amount_inr?: number;
          created_at?: string;
          description?: string | null;
          id?: string;
          status?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      wcms_blocks: {
        Row: {
          block_type: string;
          content: Json;
          created_at: string;
          id: string;
          label: string | null;
          page_id: string;
          sort_order: number;
          updated_at: string;
          visible: boolean;
        };
        Insert: {
          block_type: string;
          content?: Json;
          created_at?: string;
          id?: string;
          label?: string | null;
          page_id: string;
          sort_order?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Update: {
          block_type?: string;
          content?: Json;
          created_at?: string;
          id?: string;
          label?: string | null;
          page_id?: string;
          sort_order?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "wcms_blocks_page_id_fkey";
            columns: ["page_id"];
            isOneToOne: false;
            referencedRelation: "wcms_pages";
            referencedColumns: ["id"];
          },
        ];
      };
      wcms_features: {
        Row: {
          badge: string | null;
          category: string | null;
          color: string | null;
          created_at: string;
          description: string | null;
          enabled: boolean;
          icon: string | null;
          id: string;
          key: string;
          name: string;
          sort_order: number;
          updated_at: string;
          url: string | null;
        };
        Insert: {
          badge?: string | null;
          category?: string | null;
          color?: string | null;
          created_at?: string;
          description?: string | null;
          enabled?: boolean;
          icon?: string | null;
          id?: string;
          key: string;
          name: string;
          sort_order?: number;
          updated_at?: string;
          url?: string | null;
        };
        Update: {
          badge?: string | null;
          category?: string | null;
          color?: string | null;
          created_at?: string;
          description?: string | null;
          enabled?: boolean;
          icon?: string | null;
          id?: string;
          key?: string;
          name?: string;
          sort_order?: number;
          updated_at?: string;
          url?: string | null;
        };
        Relationships: [];
      };
      wcms_menus: {
        Row: {
          created_at: string;
          icon: string | null;
          id: string;
          label: string;
          menu_key: string;
          open_new_tab: boolean;
          parent_id: string | null;
          sort_order: number;
          url: string | null;
          visible: boolean;
        };
        Insert: {
          created_at?: string;
          icon?: string | null;
          id?: string;
          label: string;
          menu_key?: string;
          open_new_tab?: boolean;
          parent_id?: string | null;
          sort_order?: number;
          url?: string | null;
          visible?: boolean;
        };
        Update: {
          created_at?: string;
          icon?: string | null;
          id?: string;
          label?: string;
          menu_key?: string;
          open_new_tab?: boolean;
          parent_id?: string | null;
          sort_order?: number;
          url?: string | null;
          visible?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "wcms_menus_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "wcms_menus";
            referencedColumns: ["id"];
          },
        ];
      };
      wcms_pages: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          meta_description: string | null;
          meta_title: string | null;
          og_image_url: string | null;
          published: boolean;
          slug: string;
          sort_order: number;
          template: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
          published?: boolean;
          slug: string;
          sort_order?: number;
          template?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          og_image_url?: string | null;
          published?: boolean;
          slug?: string;
          sort_order?: number;
          template?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wcms_pages_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      wcms_sections: {
        Row: {
          block_type: string;
          content: Json;
          created_at: string;
          description: string | null;
          id: string;
          key: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          block_type: string;
          content?: Json;
          created_at?: string;
          description?: string | null;
          id?: string;
          key: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          block_type?: string;
          content?: Json;
          created_at?: string;
          description?: string | null;
          id?: string;
          key?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workspace_members: {
        Row: {
          created_at: string;
          id: string;
          role: string;
          user_id: string | null;
          workspace_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role?: string;
          user_id?: string | null;
          workspace_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: string;
          user_id?: string | null;
          workspace_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      workspaces: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      youtube_transcripts: {
        Row: {
          chars: number;
          fetched_at: string;
          lang: string;
          summary_md: string | null;
          transcript: string | null;
          video_id: string;
        };
        Insert: {
          chars?: number;
          fetched_at?: string;
          lang?: string;
          summary_md?: string | null;
          transcript?: string | null;
          video_id: string;
        };
        Update: {
          chars?: number;
          fetched_at?: string;
          lang?: string;
          summary_md?: string | null;
          transcript?: string | null;
          video_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      subscription_analytics: {
        Row: {
          active_subscribers: number | null;
          arr: number | null;
          cancelled_count: number | null;
          expired_count: number | null;
          mrr: number | null;
          plan_id: string | null;
          plan_name: string | null;
          price_inr: number | null;
          total_subscriptions: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      check_expired_subscriptions: { Args: never; Returns: undefined };
      cleanup_expired_events: { Args: never; Returns: undefined };
      generate_invoice_number: { Args: never; Returns: string };
      get_certificate_by_code: {
        Args: { _code: string };
        Returns: {
          code: string;
          course_category: string;
          course_id: string;
          course_instructor: string;
          course_title: string;
          date_from: string;
          date_to: string;
          design_snapshot: Json;
          id: string;
          issued_at: string;
          learner_email: string;
          learner_name: string;
          notes: string;
          recipient_name: string;
          role_title: string;
          score: number;
          total: number;
          user_id: string;
        }[];
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      match_material_chunks: {
        Args: {
          filter_course_id: string;
          match_count: number;
          match_threshold: number;
          query_embedding: string;
        };
        Returns: {
          content: string;
          id: string;
          material_id: string;
          similarity: number;
        }[];
      };
      submit_final_test: {
        Args: { _answers: Json; _course_id: string };
        Returns: {
          certificate_code: string;
          passed: boolean;
          score: number;
          total: number;
        }[];
      };
    };
    Enums: {
      app_role: "super_admin" | "admin" | "creator" | "student";
      user_role: "student" | "creator" | "coach" | "admin" | "super_admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "creator", "student"],
      user_role: ["student", "creator", "coach", "admin", "super_admin"],
    },
  },
} as const;
