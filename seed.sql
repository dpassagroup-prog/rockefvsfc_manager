-- Seed script for admin user
-- This script can be run directly against the PostgreSQL database

-- Check if admin already exists
DO $$
DECLARE
    admin_exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM users WHERE role = 'admin') INTO admin_exists;
    
    IF admin_exists THEN
        RAISE NOTICE 'Admin user already exists';
    ELSE
        -- Insert admin user (replace KINDE_ADMIN_ID with actual Kinde user ID)
        INSERT INTO users (kinde_id, email, full_name, phone, role)
        VALUES (
            COALESCE(current_setting('app.kinde_admin_id', true), 'admin-kinde-id'),
            COALESCE(current_setting('app.admin_email', true), 'admin@rockefvsfc.com'),
            COALESCE(current_setting('app.admin_name', true), 'Admin User'),
            COALESCE(current_setting('app.admin_phone', true), ''),
            'admin'
        )
        RETURNING id INTO admin_exists;
        
        RAISE NOTICE 'Admin user created successfully';
        
        -- Create welcome notification
        INSERT INTO notifications (user_id, title, message, read)
        SELECT id, 'Welcome to ROCKEFVSFC Manager 2.0', 
               'Your admin account has been successfully created. You now have access to all management features including player management, invoicing, and payment tracking.',
               false
        FROM users WHERE role = 'admin' AND email = COALESCE(current_setting('app.admin_email', true), 'admin@rockefvsfc.com');
        
        RAISE NOTICE 'Welcome notification created for admin';
    END IF;
END $$;