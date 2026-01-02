-- Add RLS policies for admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for admins to view all subscriptions
CREATE POLICY "Admins can view all subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for admins to view all service history
CREATE POLICY "Admins can view all service history" 
ON public.service_history 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for admins to view all user roles
CREATE POLICY "Admins can view all user roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for admins to update profiles
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for admins to update subscriptions
CREATE POLICY "Admins can update all subscriptions" 
ON public.subscriptions 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for admins to insert service history
CREATE POLICY "Admins can insert service history" 
ON public.service_history 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for admins to update service history
CREATE POLICY "Admins can update service history" 
ON public.service_history 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read contact submissions
CREATE POLICY "Admins can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));