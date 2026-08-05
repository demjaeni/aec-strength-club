'use server';

import { createClient } from '@/lib/supabase/server';
import { getDayNumber } from '@/lib/challenges';
import { checkAndAwardBadges } from '@/lib/badges';
import { revalidatePath } from 'next/cache';

// day is bound by the caller (today's tick button, or a progress-page catch-up
// button) — always re-validated here server-side, never trusted as-is.
export async function markToday(day) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const dayNum = getDayNumber();
  const targetDay = Number(day);

  if (!Number.isInteger(targetDay) || targetDay < 1 || targetDay > dayNum) {
    return { error: 'That day cannot be marked.' };
  }
  // Catch-up window: today, or either of the 2 days immediately before it.
  if (targetDay < dayNum - 2) {
    return { error: 'That day is outside the 3-day catch-up window.' };
  }

  const { error } = await supabase.from('completions').insert({ user_id: user.id, day: targetDay });

  if (error) {
    // Unique constraint violation — already ticked (from another tab/device, or already caught up).
    if (error.code === '23505') return { error: 'Already marked done for that day.' };
    return { error: error.message };
  }

  try {
    const { data: completions } = await supabase.from('completions').select('day').eq('user_id', user.id);
    const completedDays = new Set((completions || []).map((c) => c.day));
    await checkAndAwardBadges(supabase, user.id, completedDays);
  } catch {
    // Badge awarding is best-effort — never block a successful tick-in on it.
  }

  revalidatePath('/today');
  revalidatePath('/progress');
  revalidatePath('/leaderboard');
  revalidatePath('/dashboard');
  return { success: true };
}
