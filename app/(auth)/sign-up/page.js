'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signUp } from '@/app/actions/auth';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const initialState = { error: null, message: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="primary-btn" type="submit" disabled={pending}>
      {pending && <Loader2 size={16} className="spin" />} Create Account
    </button>
  );
}

export default function SignUpPage() {
  const [state, formAction] = useFormState(signUp, initialState);

  return (
    <div className="shell">
      <div className="auth-wrap">
        <div className="auth-title">AEC <span>STRENGTH</span> CLUB</div>
        <div className="auth-sub">60-Day Challenge — Body, Mind &amp; Faith</div>

        {state?.error && <div className="error-box">{state.error}</div>}
        {state?.message && <div className="info-box">{state.message}</div>}

        <form action={formAction}>
          <div className="field">
            <label>Full name</label>
            <input name="name" required />
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" required autoCapitalize="none" autoCorrect="off" />
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" required minLength={6} />
          </div>
          <div className="field">
            <label>Confirm password</label>
            <input name="confirm" type="password" required minLength={6} />
          </div>
          <SubmitButton />
        </form>

        <div className="switch-line">
          Already a member? <Link href="/sign-in">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
