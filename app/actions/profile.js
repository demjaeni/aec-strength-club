'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateName(prevState, formData) {
  const name = formData.get('name')?.toString().trim();
  if (!name) return { error: 'Enter a name.' };
  if (name.length > 60) return { error: 'Name must be 60 characters or fewer.' };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const { error } = await supabase.from('profiles').update({ name }).eq('id', user.id);
  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  revalidatePath('/leaderboard');
  return { success: true };
}
