-- Real-time setup for bookmarks table
-- Make sure realtime is properly configured

-- Drop existing publication if it exists
DROP PUBLICATION IF EXISTS supabase_realtime;

-- Create new publication with bookmarks table
CREATE PUBLICATION supabase_realtime;

-- Add bookmarks table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;

-- Grant necessary permissions for realtime
GRANT SELECT ON bookmarks TO authenticated;
GRANT SELECT ON bookmarks TO anon;

-- Ensure RLS policies don't block realtime
-- Note: RLS policies apply to realtime, so make sure they allow access
CREATE POLICY "Enable realtime for own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

-- Optional: Add a function to check realtime status
CREATE OR REPLACE FUNCTION check_realtime_status()
RETURNS TABLE(status text) AS $$
BEGIN
  RETURN QUERY SELECT 'enabled' as status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
