import { categoryDays, longestStreak } from './challenges';

export const BADGE_DEFS = [
  { key: 'first_challenge', emoji: '🔥', label: 'First Challenge Completed' },
  { key: 'streak_7', emoji: '🏅', label: '7-Day Streak' },
  { key: 'streak_14', emoji: '🏅', label: '14-Day Streak' },
  { key: 'streak_30', emoji: '🏅', label: '30-Day Streak' },
  { key: 'streak_45', emoji: '🏅', label: '45-Day Streak' },
  { key: 'finisher_60', emoji: '🏁', label: '60-Day Finisher' },
  { key: 'top_10', emoji: '🏆', label: 'Top 10' },
  { key: 'spiritual_strength', emoji: '📖', label: 'Spiritual Strength' },
  { key: 'physical_strength', emoji: '💪', label: 'Physical Strength' },
  { key: 'brotherhood', emoji: '🤝', label: 'Brotherhood' },
  { key: 'mental_strength', emoji: '🧠', label: 'Mental Strength' },
];

function hasAllCategoryDays(completedDays, category) {
  const days = categoryDays(category);
  return days.length > 0 && days.every((d) => completedDays.has(d));
}

// Checks every badge condition against the member's current state and
// inserts any newly-earned ones. Safe to call repeatedly — already-earned
// badges are left untouched (upsert with ignoreDuplicates), so nothing is
// ever revoked even if the underlying condition stops being true later.
export async function checkAndAwardBadges(supabase, userId, completedDays) {
  const earned = new Set();

  if (completedDays.size >= 1) earned.add('first_challenge');

  const longest = longestStreak(completedDays);
  if (longest >= 7) earned.add('streak_7');
  if (longest >= 14) earned.add('streak_14');
  if (longest >= 30) earned.add('streak_30');
  if (longest >= 45) earned.add('streak_45');

  if (completedDays.size === 60) earned.add('finisher_60');

  if (hasAllCategoryDays(completedDays, 'faith')) earned.add('spiritual_strength');
  if (hasAllCategoryDays(completedDays, 'physical')) earned.add('physical_strength');
  if (hasAllCategoryDays(completedDays, 'character')) earned.add('brotherhood');
  if (hasAllCategoryDays(completedDays, 'mindset')) earned.add('mental_strength');

  const { data: board } = await supabase
    .from('leaderboard')
    .select('id, total_completed')
    .order('total_completed', { ascending: false });

  if (board) {
    const rank = board.findIndex((row) => row.id === userId);
    if (rank !== -1 && rank < 10) earned.add('top_10');
  }

  if (earned.size === 0) return;

  const rows = [...earned].map((badge_key) => ({ user_id: userId, badge_key }));
  await supabase.from('badges').upsert(rows, { onConflict: 'user_id,badge_key', ignoreDuplicates: true });
}
