'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateName } from '@/app/actions/profile';
import { Loader2 } from 'lucide-react';

const initialState = { error: null, success: false };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button className="primary-btn name-save-btn" type="submit" disabled={pending}>
      {pending && <Loader2 size={16} className="spin" />} Save
    </button>
  );
}

export default function NameEditor({ initialName }) {
  const [state, formAction] = useFormState(updateName, initialState);

  return (
    <div>
      {state?.error && <div className="error-box">{state.error}</div>}
      {state?.success && <div className="info-box">Name updated.</div>}
      <form action={formAction} className="name-editor">
        <div className="field">
          <input name="name" defaultValue={initialName} required maxLength={60} />
        </div>
        <SaveButton />
      </form>
    </div>
  );
}
