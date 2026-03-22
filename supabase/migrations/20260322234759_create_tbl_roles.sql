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

-- Insert initial data
INSERT INTO tbl_roles (role_name, description, status) VALUES
  ('Administrator', 'Full system access with all permissions including user management, settings, and billing', 'Active'),
  ('Content Manager', 'Manages all content including articles, media, and page layouts', 'Active'),
  ('Moderator', 'Manages user comments, forum posts, and content moderation', 'Active'),
  ('Analyst', 'View-only access to analytics, reports, and performance metrics', 'Active'),
  ('Support Specialist', 'Handles customer support tickets and user inquiries', 'Pending'),
  ('Developer', 'Access to development tools, API keys, and technical resources', 'Active'),
  ('Billing Manager', 'Manages subscriptions, invoices, and payment processing', 'Inactive'),
  ('Viewer', 'Read-only access to public content and basic information', 'Active')
ON CONFLICT (role_name) DO NOTHING;