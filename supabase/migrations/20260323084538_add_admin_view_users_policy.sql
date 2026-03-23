-- ==================== ADD ADMIN VIEW ALL USERS POLICY ====================
-- Allow admin users to view all user records

-- Drop existing policy if it exists (optional)
DROP POLICY IF EXISTS "Admin can view all users" ON public.tbl_users;

-- Create policy for admin users to view all users
CREATE POLICY "Admin can view all users" 
ON public.tbl_users
FOR SELECT
USING (
  -- Check if current user has admin role in tbl_users
  EXISTS (
    SELECT 1 
    FROM public.tbl_users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- ==================== VERIFICATION ====================
-- Test query (uncomment to verify)
-- SELECT * FROM public.tbl_users;
-- This should return all rows for admin users, only own row for guests