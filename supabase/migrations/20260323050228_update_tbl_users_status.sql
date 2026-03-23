-- Create tbl_users table in public schema
CREATE TABLE IF NOT EXISTS public.tbl_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  given_name TEXT NOT NULL,
  surname TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'guest',
  status TEXT NOT NULL DEFAULT 'pending', -- pending until email confirmed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraint for status values
ALTER TABLE public.tbl_users 
  ADD CONSTRAINT tbl_users_status_check 
  CHECK (status IN ('pending', 'active', 'inactive', 'suspended'));

-- Enable Row Level Security
ALTER TABLE public.tbl_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy: Users can view own profile
CREATE POLICY "Users can view own profile" ON public.tbl_users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update own profile
CREATE POLICY "Users can update own profile" ON public.tbl_users
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Service role can insert
CREATE POLICY "Service role can insert" ON public.tbl_users
  FOR INSERT WITH CHECK (true);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at
CREATE TRIGGER update_tbl_users_updated_at
  BEFORE UPDATE ON public.tbl_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_tbl_users_role ON public.tbl_users(role);
CREATE INDEX idx_tbl_users_status ON public.tbl_users(status);
CREATE INDEX idx_tbl_users_email_lookup ON public.tbl_users(id);