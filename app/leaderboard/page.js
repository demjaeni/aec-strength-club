import { createClient } from '@/lib/supabase/server';
import { getDayNumber } from '@/lib/challenges';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export default async function LeaderboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const dayNum = getDayNumber();

  const { data: rows } = await supabase
    .from('leaderboard')
    .select('id, name, total_completed, rank')
    .order('rank', { ascending: true });

  return (
    <div className="shell">
      <Header dayNum={dayNum} />
      <div className="main">
        <div className="lb-list">
          {(!rows || rows.length === 0) && <div className="empty-msg">No members yet.</div>}
          {rows && rows.map((row) => {
            const medal = row.rank === 1 ? 'gold' : row.rank === 2 ? 'silver' : row.rank === 3 ? 'bronze' : null;
            return (
              <div className={`lb-row ${row.id === user.id ? 'me' : ''}`} key={row.id}>
                {medal ? (
                  <span className={`lb-medal lb-medal-${medal}`}>{row.rank}</span>
                ) : (
                  <span className="lb-rank">{row.rank}</span>
                )}
                <span className="lb-name">{row.name}{row.id === user.id ? ' (you)' : ''}</span>
                <span className="lb-score">{row.total_completed}/60</span>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
