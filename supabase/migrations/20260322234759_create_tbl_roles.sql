-- Create tbl_roles table
CREATE TABLE IF NOT EXISTS tbl_roles (
  id BIGSERIAL PRIMARY KEY,
  role_name TEXT NOT NULL UNIQUE,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add check constraint for status values
ALTER TABLE tbl_roles
ADD CONSTRAINT check_status_values
CHECK (status IN ('Active', 'Inactive', 'Pending'));

-- Enable Row Level Security
ALTER TABLE tbl_roles ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations (temporary for development)
CREATE POLICY "Allow all operations"
ON tbl_roles
FOR ALL
USING (true)
WITH CHECK (true);