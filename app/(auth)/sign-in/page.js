'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signIn } from '@/app/actions/auth';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const initialState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="primary-btn" type="submit" disabled={pending}>
      {pending && <Loader2 size={16} className="spin" />} Sign In
    </button>
  );
}

export default function SignInPage() {
  const [state, formAction] = useFormState(signIn, initialState);

  return (
    <div className="shell">
      <div className="auth-wrap">
        <div className="auth-title">AEC <span>STRENGTH</span> CLUB</div>
        <div className="auth-sub">60-Day Challenge — Body, Mind &amp; Faith</div>

        {state?.error && <div className="error-box">{state.error}</div>}

        <form action={formAction}>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" required autoCapitalize="none" autoCorrect="off" />
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" required />
          </div>
          <SubmitButton />
        </form>

        <div className="switch-line">
          New to the club? <Link href="/sign-up">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
