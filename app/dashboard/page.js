import { createClient } from '@/lib/supabase/server';
import { CATEGORY_LABEL, getDayNumber, currentStreak, longestStreak, categoryStats } from '@/lib/challenges';
import { checkAndAwardBadges } from '@/lib/badges';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import NameEditor from '@/components/NameEditor';
import BadgeGrid from '@/components/BadgeGrid';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const dayNum = getDayNumber();

  const [{ data: profile }, { data: completions }] = await Promise.all([
    supabase.from('profiles').select('name').eq('id', user.id).single(),
    supabase.from('completions').select('day').eq('user_id', user.id),
  ]);

  const completedDays = new Set((completions || []).map((c) => c.day));

  try {
    await checkAndAwardBadges(supabase, user.id, completedDays);
  } catch {
    // Badge awarding is best-effort — never block the dashboard from rendering.
  }

  const { data: badgeRows } = await supabase.from('badges').select('badge_key, earned_at').eq('user_id', user.id);
  const earnedMap = new Map((badgeRows || []).map((b) => [b.badge_key, b.earned_at]));

  const current = currentStreak(completedDays, dayNum);
  const longest = longestStreak(completedDays);
  const categories = categoryStats(completedDays);

  return (
    <div className="shell">
      <Header dayNum={dayNum} />
      <div className="main">
        <div className="dash-section">
          <div className="dash-label">Name</div>
          <NameEditor initialName={profile?.name || ''} />
        </div>

        <div className="dash-section">
          <div className="dash-label">Stats</div>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-value">{completedDays.size}/60</div>
              <div className="stat-caption">Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{current}</div>
              <div className="stat-caption">Current streak</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{longest}</div>
              <div className="stat-caption">Longest streak</div>
            </div>
          </div>
          <div className="cat-bars">
            {categories.map((c) => (
              <div className="cat-bar-row" key={c.category}>
                <span className="cat-bar-label">{CATEGORY_LABEL[c.category]}</span>
                <div className="cat-bar-track">
                  <div className="cat-bar-fill" style={{ width: `${c.percent}%` }} />
                </div>
                <span className="cat-bar-pct">{c.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-section">
          <div className="dash-label">Badges</div>
          <BadgeGrid earnedMap={earnedMap} />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
