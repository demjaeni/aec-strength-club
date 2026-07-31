import { createClient } from '@/lib/supabase/server';
import { CHALLENGES, CATEGORY_LABEL, getDayNumber, START_DATE } from '@/lib/challenges';
import { markToday } from '@/app/actions/challenge';
import BeadLedger from '@/components/BeadLedger';
import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';
import ChallengeContent from '@/components/ChallengeContent';
import { Check, Lock } from 'lucide-react';

export default async function TodayPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const dayNum = getDayNumber();
  const challenge = dayNum >= 1 && dayNum <= 60 ? CHALLENGES[dayNum - 1] : null;

  const { data: completions } = await supabase
    .from('completions')
    .select('day')
    .eq('user_id', user.id);

  const completedDays = new Set((completions || []).map((c) => c.day));
  const isDone = challenge ? completedDays.has(challenge.day) : false;

  return (
    <div className="shell">
      <Header dayNum={dayNum} />
      <div className="main">
        <BeadLedger completedDays={completedDays} todayNum={dayNum} />

        {dayNum < 1 && (
          <div className="today-status">
            <div className="big">The challenge hasn&apos;t started yet.</div>
            Come back on {START_DATE}.
          </div>
        )}

        {dayNum > 60 && (
          <div className="today-status">
            <div className="big">You made it through all 60 days.</div>
            {completedDays.size} of 60 completed. Well done, brother.
          </div>
        )}

        {challenge && (
          <div className={`challenge-card ${isDone ? 'done' : ''}`}>
            <div className="card-top">
              <span className="day-tag">DAY {challenge.day}</span>
              <span className={`cat-pill cat-${challenge.category}`}>{CATEGORY_LABEL[challenge.category]}</span>
            </div>
            <div className="icon-row">{challenge.icon}</div>
            {challenge.title && <div className="challenge-title">{challenge.title}</div>}
            <ChallengeContent challenge={challenge} />

            {isDone ? (
              <button className="tick-btn locked-done" disabled>
                <Lock size={16} /> Completed — locked in
              </button>
            ) : (
              <form action={markToday}>
                <button className="tick-btn" type="submit">
                  <Check size={16} /> Mark today as done
                </button>
              </form>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
