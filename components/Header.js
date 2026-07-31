import { signOut } from '@/app/actions/auth';
import { LogOut } from 'lucide-react';
import { START_DATE } from '@/lib/challenges';

export default function Header({ dayNum }) {
  return (
    <div className="header">
      <div className="header-row">
        <div>
          <div className="brand">AEC <span>STRENGTH</span></div>
          <div className="brand-sub">
            {dayNum < 1 && `Starts ${START_DATE}`}
            {dayNum >= 1 && dayNum <= 60 && `DAY ${dayNum} OF 60`}
            {dayNum > 60 && 'CHALLENGE COMPLETE'}
          </div>
        </div>
        <form action={signOut}>
          <button className="signout-btn" type="submit"><LogOut size={13} /> Sign out</button>
        </form>
      </div>
    </div>
  );
}
