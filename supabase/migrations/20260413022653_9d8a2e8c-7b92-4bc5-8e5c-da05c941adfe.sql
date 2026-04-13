
CREATE POLICY "Temp: anyone can delete profiles" ON public.profiles FOR DELETE USING (true);
CREATE POLICY "Temp: anyone can delete user_roles" ON public.user_roles FOR DELETE USING (true);
