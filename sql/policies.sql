-- CUSTOMERS

CREATE POLICY "Admins can select all customers" ON public.customers FOR SELECT TO authenticated USING ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);
CREATE POLICY "Admins can update all customers" ON public.customers FOR UPDATE TO authenticated USING ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);
CREATE POLICY "Admins can delete all customers" ON public.customers FOR DELETE TO authenticated USING ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);

-- VENDORS

CREATE POLICY "Admins can select all vendors" ON public.vendors FOR SELECT TO authenticated USING ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);
CREATE POLICY "Admins can insert all vendors" ON public.vendors FOR INSERT TO authenticated WITH CHECK ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);
CREATE POLICY "Admins can update all vendors" ON public.vendors FOR UPDATE TO authenticated USING ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);
CREATE POLICY "Admins can delete all vendors" ON public.vendors FOR DELETE TO authenticated USING ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);

-- PRODUCTS

CREATE POLICY "Admins can insert all products" ON public.products FOR INSERT TO authenticated WITH CHECK ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);
CREATE POLICY "Admins can update all products" ON public.products FOR UPDATE TO authenticated USING ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);
CREATE POLICY "Admins can delete all products" ON public.products FOR DELETE TO authenticated USING ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);

CREATE POLICY "Authenticated users can select all products" ON public.products FOR SELECT TO authenticated USING (true);

-- ORDERS

CREATE POLICY "Admins can select all orders" ON public.orders FOR SELECT TO authenticated USING ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);
CREATE POLICY "Admins can insert all orders" ON public.orders FOR INSERT TO authenticated WITH CHECK ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);
CREATE POLICY "Admins can update all orders" ON public.orders FOR UPDATE TO authenticated USING ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);
CREATE POLICY "Admins can delete all orders" ON public.orders FOR DELETE TO authenticated USING ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);

CREATE POLICY "Authenticated users can insert orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Customers can select their own orders" ON public.orders  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

-- ORDER DETAILS

CREATE POLICY "Admins can select all order_details" ON public.order_details FOR SELECT TO authenticated USING ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);
CREATE POLICY "Admins can insert all order_details" ON public.order_details FOR INSERT TO authenticated WITH CHECK ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);
CREATE POLICY "Admins can update all order_details" ON public.order_details FOR UPDATE TO authenticated USING ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);
CREATE POLICY "Admins can delete all order_details" ON public.order_details FOR DELETE TO authenticated USING ((SELECT auth.jwt()->'app_metadata'->>'admin')::BOOLEAN);

CREATE POLICY "Authenticated users can insert order details" ON public.order_details FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Customers can select their own order details" ON public.order_details FOR SELECT TO authenticated 
  USING ((SELECT auth.uid()) in (SELECT user_id FROM public.orders WHERE order_id = orders.order_id));


