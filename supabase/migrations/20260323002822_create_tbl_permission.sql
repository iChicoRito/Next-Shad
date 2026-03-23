-- Create tbl_permission table with foreign key to tbl_roles
CREATE TABLE IF NOT EXISTS tbl_permission (
  id BIGSERIAL PRIMARY KEY,
  role_id BIGINT NOT NULL REFERENCES tbl_roles(id) ON DELETE CASCADE,
  permission_name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add check constraint for status values
ALTER TABLE tbl_permission
ADD CONSTRAINT check_permission_status_values
CHECK (status IN ('Active', 'Inactive', 'Pending'));

-- Add check constraint for permission_name uniqueness per role
ALTER TABLE tbl_permission
ADD CONSTRAINT unique_permission_per_role
UNIQUE (role_id, permission_name);

-- Enable Row Level Security
ALTER TABLE tbl_permission ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations (temporary for development)
-- This matches the policy pattern from tbl_roles
CREATE POLICY "Allow all operations"
ON tbl_permission
FOR ALL
USING (true)
WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX idx_permission_role_id ON tbl_permission(role_id);
CREATE INDEX idx_permission_status ON tbl_permission(status);
CREATE INDEX idx_permission_permission_name ON tbl_permission(permission_name);