
-- Drop existing restrictive policies on organizations
DROP POLICY IF EXISTS "Admins can view all organizations" ON public.organizations;
DROP POLICY IF EXISTS "Admins can create organizations" ON public.organizations;
DROP POLICY IF EXISTS "Admins can update organizations" ON public.organizations;

-- Create permissive policies for organizations
CREATE POLICY "Temp: anyone can view organizations" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Temp: anyone can create organizations" ON public.organizations FOR INSERT WITH CHECK (true);
CREATE POLICY "Temp: anyone can update organizations" ON public.organizations FOR UPDATE USING (true);

-- Drop existing restrictive policies on profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;

-- Create permissive policies for profiles
CREATE POLICY "Temp: anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Temp: anyone can create profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Temp: anyone can update profiles" ON public.profiles FOR UPDATE USING (true);
