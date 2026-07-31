'use server';

import { createClient } from '@/lib/supabase/server';
import { getDayNumber } from '@/lib/challenges';
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

  revalidatePath('/today');
  revalidatePath('/progress');
  revalidatePath('/leaderboard');
  return { success: true };
}
