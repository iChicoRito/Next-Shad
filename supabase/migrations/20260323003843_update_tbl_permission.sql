-- Update tbl_permission table with proper RLS policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to view permissions" ON tbl_permission;
DROP POLICY IF EXISTS "Allow authenticated users to insert permissions" ON tbl_permission;
DROP POLICY IF EXISTS "Allow authenticated users to update permissions" ON tbl_permission;
DROP POLICY IF EXISTS "Allow authenticated users to delete permissions" ON tbl_permission;

-- Create simple allow-all policy (temporary for development)
CREATE POLICY "Allow all operations"
ON tbl_permission
FOR ALL
USING (true)
WITH CHECK (true);