-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy for users to select their own bookmarks
CREATE POLICY "Users can select their own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Create policy for users to update their own bookmarks
CREATE POLICY "Users can update their own bookmarks" ON bookmarks
  FOR UPDATE USING (auth.uid() = user_id);

-- Enable realtime for bookmarks table
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
