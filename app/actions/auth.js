'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signUp(prevState, formData) {
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString() || '';
  const confirm = formData.get('confirm')?.toString() || '';

  if (!name) return { error: 'Enter your name.' };
  if (!email) return { error: 'Enter your email.' };
  if (password.length < 6) return { error: 'Password must be at least 6 characters.' };
  if (password !== confirm) return { error: 'Passwords do not match.' };

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) return { error: error.message };

  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: data.user.id, name });
    if (profileError) return { error: profileError.message };
  }

  if (!data.session) {
    return { error: null, message: 'Check your email to confirm your account, then sign in.' };
  }

  redirect('/today');
}

export async function signIn(prevState, formData) {
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString() || '';

  if (!email || !password) return { error: 'Enter your email and password.' };

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: 'Incorrect email or password.' };

  redirect('/today');
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/sign-in');
}
