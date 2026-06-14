export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
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
        };
        Insert: {
          code: string;
          course_id: string;
          date_from?: string | null;
          date_to?: string | null;
          design_snapshot?: Json | null;
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
        };
        Update: {
          code?: string;
          course_id?: string;
          date_from?: string | null;
          date_to?: string | null;
          design_snapshot?: Json | null;
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
        Relationships: [];
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
          video_url: string | null;
          video_channel_id: string | null;
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
          video_url?: string | null;
          video_channel_id?: string | null;
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
          video_url?: string | null;
          video_channel_id?: string | null;
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
      pricing_plans: {
        Row: {
          active: boolean;
          created_at: string;
          cta_label: string;
          cta_to: string;
          description: string | null;
          features: Json;
          highlighted: boolean;
          id: string;
          name: string;
          order_index: number;
          price_label: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          cta_label?: string;
          cta_to?: string;
          description?: string | null;
          features?: Json;
          highlighted?: boolean;
          id?: string;
          name: string;
          order_index?: number;
          price_label: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          cta_label?: string;
          cta_to?: string;
          description?: string | null;
          features?: Json;
          highlighted?: boolean;
          id?: string;
          name?: string;
          order_index?: number;
          price_label?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          default_course_settings: Json;
          email: string | null;
          full_name: string | null;
          id: string;
          notif_prefs: Json;
          payout_destination: Json;
          social_links: Json;
          ui_prefs: Json;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          default_course_settings?: Json;
          email?: string | null;
          full_name?: string | null;
          id: string;
          notif_prefs?: Json;
          payout_destination?: Json;
          social_links?: Json;
          ui_prefs?: Json;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          default_course_settings?: Json;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          notif_prefs?: Json;
          payout_destination?: Json;
          social_links?: Json;
          ui_prefs?: Json;
          updated_at?: string;
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
        Relationships: [];
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
      [_ in never]: never;
    };
    Functions: {
      cleanup_expired_events: { Args: never; Returns: undefined };
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
      submit_final_test: {
        Args: { _answers: Json; _course_id: string };
        Returns: {
          cert_code: string;
          passed: boolean;
          score: number;
          total: number;
        }[];
      };
    };
    Enums: {
      app_role: "super_admin" | "admin" | "creator" | "student";
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
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "creator", "student"],
    },
  },
} as const;
