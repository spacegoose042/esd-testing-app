-- First, create the managers table
CREATE TABLE managers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Then modify the users table
ALTER TABLE users DROP COLUMN IF EXISTS manager_email;
ALTER TABLE users ADD COLUMN manager_id INTEGER REFERENCES managers(id);

-- Add some initial data for testing
INSERT INTO managers (first_name, last_name, email) VALUES
    ('John', 'Smith', 'john.smith@example.com'),
    ('Sarah', 'Johnson', 'sarah.johnson@example.com');

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'managers') THEN
        -- Your existing managers table creation SQL here
    END IF;
END $$;