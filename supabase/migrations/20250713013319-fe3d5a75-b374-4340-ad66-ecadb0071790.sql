-- Reset all user points to zero
UPDATE public.user_points 
SET 
  total_points = 0,
  daily_points = 0,
  weekly_points = 0,
  monthly_points = 0,
  current_streak = 0,
  best_streak = 0,
  completed_challenges = 0,
  last_activity_date = NULL,
  updated_at = now();