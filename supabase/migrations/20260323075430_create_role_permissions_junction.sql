-- ==================== CREATE JUNCTION TABLE ====================
-- Create many-to-many relationship between roles and permissions

-- Create junction table for role-permission assignments
CREATE TABLE IF NOT EXISTS tbl_role_permissions (
  id BIGSERIAL PRIMARY KEY,
  roles_id BIGINT NOT NULL REFERENCES tbl_roles(id) ON DELETE CASCADE,
  permission_id BIGINT NOT NULL REFERENCES tbl_permission(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- prevent duplicate role-permission assignments
  CONSTRAINT unique_role_permission UNIQUE(roles_id, permission_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_role_permissions_roles_id ON tbl_role_permissions(roles_id);
CREATE INDEX idx_role_permissions_permission_id ON tbl_role_permissions(permission_id);

-- ==================== MIGRATE EXISTING DATA ====================
-- Move existing role_id data from tbl_permission to junction table

-- Insert existing role-permission relationships
INSERT INTO tbl_role_permissions (roles_id, permission_id, created_at)
SELECT 
  role_id,
  id,
  created_at
FROM tbl_permission
WHERE role_id IS NOT NULL
ON CONFLICT (roles_id, permission_id) DO NOTHING;

-- ==================== UPDATE PERMISSIONS TABLE ====================
-- Remove role_id column from tbl_permission (data now in junction table)

-- First, drop any foreign key constraint if it exists
ALTER TABLE tbl_permission 
  DROP CONSTRAINT IF EXISTS tbl_permission_role_id_fkey;

-- Then drop the role_id column
ALTER TABLE tbl_permission 
  DROP COLUMN IF EXISTS role_id;

-- ==================== VERIFICATION QUERIES ====================
-- Verify data migration (uncomment to run manually)
-- SELECT 
--   COUNT(*) as total_assignments,
--   COUNT(DISTINCT roles_id) as unique_roles,
--   COUNT(DISTINCT permission_id) as unique_permissions
-- FROM tbl_role_permissions;