
-- =============================================
-- FIX 1: PAYROLL - restrict to admin/finance only
-- =============================================
DROP POLICY "Public read access for payroll" ON public.payroll;
DROP POLICY "Public insert access for payroll" ON public.payroll;
DROP POLICY "Public update access for payroll" ON public.payroll;
DROP POLICY "Public delete access for payroll" ON public.payroll;

CREATE POLICY "Admin and finance can view payroll"
  ON public.payroll FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'finance'));

CREATE POLICY "Admin and finance can insert payroll"
  ON public.payroll FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'finance'));

CREATE POLICY "Admin and finance can update payroll"
  ON public.payroll FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'finance'));

CREATE POLICY "Admin and finance can delete payroll"
  ON public.payroll FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'finance'));

-- =============================================
-- FIX 2: EMPLOYEES - restrict to authenticated users, write to admin only
-- =============================================
DROP POLICY "Public read access for employees" ON public.employees;
DROP POLICY "Public insert access for employees" ON public.employees;
DROP POLICY "Public update access for employees" ON public.employees;
DROP POLICY "Public delete access for employees" ON public.employees;

CREATE POLICY "Authenticated users can view employees"
  ON public.employees FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin can insert employees"
  ON public.employees FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update employees"
  ON public.employees FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete employees"
  ON public.employees FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- FIX 3: PROGRESS_REPORTS - authenticated read, write restricted
-- =============================================
DROP POLICY "Public read access for progress_reports" ON public.progress_reports;
DROP POLICY "Public insert access for progress_reports" ON public.progress_reports;
DROP POLICY "Public update access for progress_reports" ON public.progress_reports;
DROP POLICY "Public delete access for progress_reports" ON public.progress_reports;

CREATE POLICY "Authenticated users can view progress reports"
  ON public.progress_reports FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert progress reports"
  ON public.progress_reports FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update progress reports"
  ON public.progress_reports FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete progress reports"
  ON public.progress_reports FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
