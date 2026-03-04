-- ============================================
-- KAELO WEB DASHBOARD: RLS POLICIES
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- ============================================
-- PROFILES
-- ============================================

-- Everyone can read profiles (needed for displaying creator names, etc.)
CREATE POLICY "profiles_public_read"
ON public.profiles FOR SELECT
TO authenticated, anon
USING (true);

-- Users can update only their own profile
CREATE POLICY "profiles_self_update"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for signup)
CREATE POLICY "profiles_self_insert"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ============================================
-- ROUTES
-- ============================================

-- Anyone can read published routes
CREATE POLICY "routes_public_read"
ON public.routes FOR SELECT
TO authenticated, anon
USING (status = 'publicado' OR creator_id = auth.uid());

-- Creators can insert their own routes
CREATE POLICY "routes_creator_insert"
ON public.routes FOR INSERT
TO authenticated
WITH CHECK (creator_id = auth.uid());

-- Creators can update their own routes
CREATE POLICY "routes_creator_update"
ON public.routes FOR UPDATE
TO authenticated
USING (creator_id = auth.uid())
WITH CHECK (creator_id = auth.uid());

-- ============================================
-- ROUTE WAYPOINTS
-- ============================================

-- Anyone can read waypoints of published routes
CREATE POLICY "waypoints_public_read"
ON public.route_waypoints FOR SELECT
TO authenticated, anon
USING (true);

-- Route creators can manage waypoints
CREATE POLICY "waypoints_creator_insert"
ON public.route_waypoints FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM routes WHERE id = route_id AND creator_id = auth.uid())
);

CREATE POLICY "waypoints_creator_update"
ON public.route_waypoints FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM routes WHERE id = route_id AND creator_id = auth.uid())
);

-- ============================================
-- BUSINESSES
-- ============================================

-- Anyone can read active businesses
CREATE POLICY "businesses_public_read"
ON public.businesses FOR SELECT
TO authenticated, anon
USING (status = 'activo' OR owner_id = auth.uid());

-- Owners can insert their business
CREATE POLICY "businesses_owner_insert"
ON public.businesses FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

-- Owners can update their business
CREATE POLICY "businesses_owner_update"
ON public.businesses FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- ============================================
-- ROUTE_BUSINESSES
-- ============================================

CREATE POLICY "route_businesses_public_read"
ON public.route_businesses FOR SELECT
TO authenticated, anon
USING (true);

-- ============================================
-- PRODUCTS
-- ============================================

-- Anyone can read available products
CREATE POLICY "products_public_read"
ON public.products FOR SELECT
TO authenticated, anon
USING (true);

-- Business owners can manage their products
CREATE POLICY "products_owner_insert"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
);

CREATE POLICY "products_owner_update"
ON public.products FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
);

CREATE POLICY "products_owner_delete"
ON public.products FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
);

-- ============================================
-- ORDERS
-- ============================================

-- Customers can see their own orders
CREATE POLICY "orders_customer_read"
ON public.orders FOR SELECT
TO authenticated
USING (
  customer_id = auth.uid() OR
  EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
);

-- Customers can create orders
CREATE POLICY "orders_customer_insert"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (customer_id = auth.uid());

-- Business owners can update order status
CREATE POLICY "orders_business_update"
ON public.orders FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
);

-- ============================================
-- ORDER ITEMS
-- ============================================

CREATE POLICY "order_items_read"
ON public.order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_id
    AND (orders.customer_id = auth.uid() OR
         EXISTS (SELECT 1 FROM businesses WHERE id = orders.business_id AND owner_id = auth.uid()))
  )
);

CREATE POLICY "order_items_insert"
ON public.order_items FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND customer_id = auth.uid())
);

-- ============================================
-- ROUTE PURCHASES
-- ============================================

CREATE POLICY "purchases_read"
ON public.route_purchases FOR SELECT
TO authenticated
USING (buyer_id = auth.uid());

CREATE POLICY "purchases_insert"
ON public.route_purchases FOR INSERT
TO authenticated
WITH CHECK (buyer_id = auth.uid());

-- ============================================
-- REVIEWS
-- ============================================

-- Anyone can read approved reviews
CREATE POLICY "reviews_public_read"
ON public.reviews FOR SELECT
TO authenticated, anon
USING (status = 'aprobado' OR user_id = auth.uid());

-- Authenticated users can write reviews
CREATE POLICY "reviews_user_insert"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "reviews_user_update"
ON public.reviews FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- ============================================
-- SAVED ROUTES
-- ============================================

CREATE POLICY "saved_routes_self"
ON public.saved_routes FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================
-- ROUTE COMPLETIONS
-- ============================================

CREATE POLICY "completions_self_read"
ON public.route_completions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "completions_self_insert"
ON public.route_completions FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE POLICY "notifications_self"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "notifications_update"
ON public.notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- ============================================
-- GAMIFICATION (read-only for now)
-- ============================================

CREATE POLICY "coupons_public_read"
ON public.business_coupons FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "unlocked_coupons_self"
ON public.unlocked_coupons FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "sponsored_segments_read"
ON public.sponsored_segments FOR SELECT
TO authenticated, anon
USING (is_active = true);

-- ============================================
-- DONE! All policies created.
-- ============================================
