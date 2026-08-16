# Multi-teacher setup

Migration is intentionally not executed automatically.

1. Open the Supabase SQL editor for the project.
2. Review and run `supabase/migrations/002_multi_teacher.sql` after `001_initial_schema.sql`.
3. Open `/teacher/register`, enter the teacher name, email, and password, and submit the form.
4. If email confirmation is enabled in Supabase Auth, confirm the teacher email before logging in.
5. Open `/teacher/login` and sign in. Teacher access is granted only when the authenticated user has a matching `teacher_profiles` row.
6. Open **Классы**, create a class, and copy its automatically generated seven-character code.
7. The student enters the code either on `/start` or through **Присоединиться к классу** on the student dashboard.
8. Open the class in Teacher Workspace. The enrolled student and all existing attempts and skill statistics for that same student ID become visible.
9. Submitted Writing work appears under **Writing**. Open it, enter score, maximum score, and a comment, then save the review.

Class codes use uppercase characters without `O`, `0`, `I`, or `1`. Students cannot query a directory of codes; joining is performed only through `join_class_by_code`.

For a development smoke test, register a normal test teacher through the UI, create a 9A class, then use a separate private browser session to create an anonymous student and join with the displayed code. Do not add test teachers or students to the migration.
