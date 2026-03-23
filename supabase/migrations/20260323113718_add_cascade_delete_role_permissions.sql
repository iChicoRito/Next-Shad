-- Add cascade delete to role-permissions junction table
-- This ensures when a role is deleted, its permission assignments are automatically removed

-- First, check if the constraint exists and drop it
ALTER TABLE public.tbl_role_permissions 
DROP CONSTRAINT IF EXISTS tbl_role_permissions_roles_id_fkey;

-- Re-add the foreign key constraint with ON DELETE CASCADE
ALTER TABLE public.tbl_role_permissions 
ADD CONSTRAINT tbl_role_permissions_roles_id_fkey 
FOREIGN KEY (roles_id) 
REFERENCES public.tbl_roles(id) 
ON DELETE CASCADE;

-- Add comment explaining the cascade behavior
COMMENT ON CONSTRAINT tbl_role_permissions_roles_id_fkey ON public.tbl_role_permissions 
IS 'Cascade delete role-permission assignments when parent role is deleted';