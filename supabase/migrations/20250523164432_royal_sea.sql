/*
  # Add employees and corrective actions

  1. New Tables
    - `employees`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `email` (text, unique)
      - `created_at` (timestamp)
    
    - `environment_employees`
      - `environment_id` (uuid, foreign key)
      - `employee_id` (uuid, foreign key)
      - Primary key is combination of both IDs
    
    - `corrective_actions`
      - `id` (uuid, primary key)
      - `description` (text)
      - `deadline_type` (enum: short, medium, long)
      - `status` (enum: pending, in_progress, completed, overdue)
      - `proof_image_url` (text, nullable)
      - `observation` (text, nullable)
      - `deadline_date` (date)
      - `environment_id` (uuid, foreign key)
      - `employee_id` (uuid, foreign key)
      - `evaluation_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create enum types
CREATE TYPE deadline_type AS ENUM ('short', 'medium', 'long');
CREATE TYPE action_status AS ENUM ('pending', 'in_progress', 'completed', 'overdue');

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create environment_employees table
CREATE TABLE IF NOT EXISTS environment_employees (
  environment_id uuid REFERENCES environments(id) ON DELETE CASCADE,
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  PRIMARY KEY (environment_id, employee_id)
);

-- Create corrective_actions table
CREATE TABLE IF NOT EXISTS corrective_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  deadline_type deadline_type NOT NULL,
  status action_status NOT NULL DEFAULT 'pending',
  proof_image_url text,
  observation text,
  deadline_date date NOT NULL,
  environment_id uuid REFERENCES environments(id) ON DELETE CASCADE,
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  evaluation_id uuid REFERENCES evaluations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE environment_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE corrective_actions ENABLE ROW LEVEL SECURITY;

-- Policies for employees
CREATE POLICY "Employees are viewable by authenticated users" 
  ON employees FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Employees can be created by managers" 
  ON employees FOR INSERT 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'manager');

CREATE POLICY "Employees can be updated by managers" 
  ON employees FOR UPDATE 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'manager');

-- Policies for environment_employees
CREATE POLICY "Environment employees are viewable by authenticated users" 
  ON environment_employees FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Environment employees can be managed by managers" 
  ON environment_employees FOR ALL 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'manager');

-- Policies for corrective_actions
CREATE POLICY "Corrective actions are viewable by authenticated users" 
  ON corrective_actions FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Corrective actions can be created by inspectors and managers" 
  ON corrective_actions FOR INSERT 
  TO authenticated 
  USING (
    auth.jwt() ->> 'role' IN ('inspector', 'manager')
  );

CREATE POLICY "Corrective actions can be updated by responsible employees" 
  ON corrective_actions FOR UPDATE 
  TO authenticated 
  USING (
    auth.jwt() ->> 'role' IN ('inspector', 'manager') OR
    employee_id = auth.uid()
  );

-- Add updated_at trigger for corrective_actions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_corrective_actions_updated_at
  BEFORE UPDATE ON corrective_actions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();