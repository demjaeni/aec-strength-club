'use server';

import { createClient } from '@/lib/supabase/server';
import { getDayNumber } from '@/lib/challenges';
import { checkAndAwardBadges } from '@/lib/badges';
import { revalidatePath } from 'next/cache';

export async function markToday() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const dayNum = getDayNumber();
  if (dayNum < 1 || dayNum > 60) return { error: 'No challenge is active today.' };

  const { error } = await supabase.from('completions').insert({ user_id: user.id, day: dayNum });

  if (error) {
    // Unique constraint violation — already ticked today from another tab/device.
    if (error.code === '23505') return { error: 'Already marked done for today.' };
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
