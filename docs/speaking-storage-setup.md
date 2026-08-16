# Speaking storage setup

Migration `007_speaking_submissions.sql` creates the private `speaking-recordings` bucket, its Storage policies, the submission table, RLS policies, and the teacher review RPC.

Apply migration 007 manually through the normal Supabase migration process. Do not make the bucket public. Teacher playback uses short-lived signed URLs; authorization to create them is enforced by the `Teacher reads enrolled speaking recording` policy.
