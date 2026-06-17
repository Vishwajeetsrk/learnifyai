-- Table: coaching_slots
CREATE TABLE IF NOT EXISTS public.coaching_slots (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    coach_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    is_booked boolean NOT NULL DEFAULT false,
    price_inr numeric(10,2) NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT coaching_slots_pkey PRIMARY KEY (id)
);

-- Table: coaching_bookings
CREATE TABLE IF NOT EXISTS public.coaching_bookings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    slot_id uuid NOT NULL REFERENCES public.coaching_slots(id) ON DELETE CASCADE,
    learner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    coach_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'upcoming', -- 'upcoming', 'completed', 'cancelled'
    notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT coaching_bookings_pkey PRIMARY KEY (id),
    CONSTRAINT coaching_bookings_slot_unique UNIQUE (slot_id)
);

-- Table: messages
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    read_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT messages_pkey PRIMARY KEY (id)
);

-- RLS Policies
ALTER TABLE public.coaching_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaching slots are viewable by everyone" ON public.coaching_slots FOR SELECT USING (true);
CREATE POLICY "Coaches can insert their own slots" ON public.coaching_slots FOR INSERT TO authenticated WITH CHECK (auth.uid() = coach_id);
CREATE POLICY "Coaches can update their own slots" ON public.coaching_slots FOR UPDATE TO authenticated USING (auth.uid() = coach_id);
CREATE POLICY "Coaches can delete their own slots" ON public.coaching_slots FOR DELETE TO authenticated USING (auth.uid() = coach_id);
-- Learners can book slots (update is_booked)
CREATE POLICY "Learners can book slots" ON public.coaching_slots FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Bookings viewable by coach and learner" ON public.coaching_bookings FOR SELECT USING (auth.uid() = coach_id OR auth.uid() = learner_id);
CREATE POLICY "Learners can insert bookings" ON public.coaching_bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = learner_id);
CREATE POLICY "Coach and learner can update bookings" ON public.coaching_bookings FOR UPDATE TO authenticated USING (auth.uid() = coach_id OR auth.uid() = learner_id);

CREATE POLICY "Messages viewable by sender and receiver" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Sender can insert messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Receiver can update messages (read receipt)" ON public.messages FOR UPDATE TO authenticated USING (auth.uid() = receiver_id);
