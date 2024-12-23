-- Create managers table first (since it's referenced by users)
CREATE TABLE IF NOT EXISTS managers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    manager_id INTEGER REFERENCES managers(id),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create esd_tests table
CREATE TABLE esd_tests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    test_date DATE NOT NULL,
    test_time TIME NOT NULL,
    test_period VARCHAR(20) NOT NULL CHECK (test_period IN ('morning', 'evening')),
    passed BOOLEAN NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create settings table
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    morning_deadline TIME NOT NULL DEFAULT '10:00',
    evening_deadline TIME NOT NULL DEFAULT '14:00',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (morning_deadline, evening_deadline)
VALUES ('10:00', '14:00')
ON CONFLICT DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX idx_esd_tests_user_id ON esd_tests(user_id);
CREATE INDEX idx_esd_tests_date ON esd_tests(test_date);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);