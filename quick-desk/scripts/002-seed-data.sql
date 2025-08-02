-- Seed initial data

-- Insert default categories
INSERT INTO categories (name, description, color) VALUES
('Technical Support', 'Technical issues and troubleshooting', '#EF4444'),
('Billing', 'Billing and payment related queries', '#10B981'),
('Feature Request', 'New feature suggestions', '#8B5CF6'),
('Bug Report', 'Software bugs and issues', '#F59E0B'),
('General Inquiry', 'General questions and information', '#6B7280')
ON CONFLICT DO NOTHING;

-- Insert admin user (password: admin123)
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@quickdesk.com', '$2b$10$rQZ8kHWfQxwjQxwjQxwjQOK8kHWfQxwjQxwjQxwjQxwjQxwjQxwjQu', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert agent user (password: agent123)
INSERT INTO users (email, password_hash, name, role) VALUES
('agent@quickdesk.com', '$2b$10$rQZ8kHWfQxwjQxwjQxwjQOK8kHWfQxwjQxwjQxwjQxwjQxwjQxwjQu', 'Support Agent', 'agent')
ON CONFLICT (email) DO NOTHING;

-- Insert sample user (password: user123)
INSERT INTO users (email, password_hash, name, role) VALUES
('user@quickdesk.com', '$2b$10$rQZ8kHWfQxwjQxwjQxwjQOK8kHWfQxwjQxwjQxwjQxwjQxwjQxwjQu', 'End User', 'end-user')
ON CONFLICT (email) DO NOTHING;
