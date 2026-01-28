-- Add user_id column to entries table
ALTER TABLE entries ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Enable Row Level Security
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access (necessary for gallery view)
CREATE POLICY "Public entries are viewable by everyone" 
ON entries FOR SELECT 
USING (true);

-- Policy: Allow authenticated users to insert their own entries
CREATE POLICY "Users can insert their own entries" 
ON entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow anonymous users to insert (for when Auth is disabled)
-- Note: Logic in application will handle user_id being null
CREATE POLICY "Anonymous users can insert entries" 
ON entries FOR INSERT 
WITH CHECK (auth.role() = 'anon');

-- Policy: Users can update their own entries (optional, for future use)
CREATE POLICY "Users can update their own entries" 
ON entries FOR UPDATE 
USING (auth.uid() = user_id);
