import { createClient } from '@/lib/supabase/server';
import { CHALLENGES, getDayNumber } from '@/lib/challenges';
import { markToday } from '@/app/actions/challenge';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Lock } from 'lucide-react';

export default async function ProgressPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const dayNum = getDayNumber();

  const { data: completions } = await supabase
    .from('completions')
    .select('day')
    .eq('user_id', user.id);
  const completedDays = new Set((completions || []).map((c) => c.day));

  return (
    <div className="shell">
      <Header dayNum={dayNum} />
      <div className="main">
        <div className="progress-list">
          {CHALLENGES.map((ch) => {
            const done = completedDays.has(ch.day);
            let status = 'locked';
            if (done) status = 'done';
            else if (ch.day === dayNum) status = 'today';
            else if (ch.day < dayNum) status = 'missed';
            else if (ch.day <= dayNum + 2 && ch.day !== 60) status = 'preview';

            const revealed = status !== 'locked';
            const label = revealed ? (ch.text || ch.title || ch.intro) : 'Revealed 2 days before it\u2019s due.';
            const catchable = status === 'missed' && ch.day >= dayNum - 2;

            return (
              <div className="progress-row" key={ch.day}>
                <span className="pnum">D{ch.day}</span>
                <span className="picon">{revealed ? ch.icon : <Lock size={14} />}</span>
                <span className={`ptext ${revealed ? '' : 'ptext-hidden'}`}>{label}</span>
                {catchable ? (
                  <form action={markToday.bind(null, ch.day)}>
                    <button type="submit" className="catchup-btn">Mark done</button>
                  </form>
                ) : (
                  <span className={`pstatus pstatus-${status}`}>
                    {status === 'done' && 'Done'}
                    {status === 'missed' && 'Missed'}
                    {status === 'today' && 'Today'}
                    {status === 'preview' && 'Preview'}
                    {status === 'locked' && 'Locked'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
