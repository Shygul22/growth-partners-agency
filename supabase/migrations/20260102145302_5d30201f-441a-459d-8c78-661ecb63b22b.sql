-- Create staff table for virtual assistants
CREATE TABLE public.staff (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'VA',
    specialization TEXT,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline')),
    hourly_rate NUMERIC DEFAULT 25.00,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Staff RLS policies
CREATE POLICY "Admins can view all staff"
ON public.staff FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert staff"
ON public.staff FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update staff"
ON public.staff FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete staff"
ON public.staff FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create staff_assignments table to track client-staff relationships
CREATE TABLE public.staff_assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    notes TEXT,
    UNIQUE(staff_id, client_id)
);

-- Enable RLS
ALTER TABLE public.staff_assignments ENABLE ROW LEVEL SECURITY;

-- Assignments RLS policies
CREATE POLICY "Admins can view all assignments"
ON public.staff_assignments FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own assignments"
ON public.staff_assignments FOR SELECT
USING (auth.uid() = client_id);

CREATE POLICY "Admins can manage assignments"
ON public.staff_assignments FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create tasks table for client requests
CREATE TABLE public.tasks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    due_date TIMESTAMP WITH TIME ZONE,
    hours_estimated NUMERIC DEFAULT 0,
    hours_actual NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Tasks RLS policies
CREATE POLICY "Admins can view all tasks"
ON public.tasks FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view their own tasks"
ON public.tasks FOR SELECT
USING (auth.uid() = client_id);

CREATE POLICY "Clients can create their own tasks"
ON public.tasks FOR INSERT
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update their own tasks"
ON public.tasks FOR UPDATE
USING (auth.uid() = client_id);

CREATE POLICY "Admins can manage all tasks"
ON public.tasks FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON public.staff
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();