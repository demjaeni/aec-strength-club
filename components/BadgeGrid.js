import { BADGE_DEFS } from '@/lib/badges';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BadgeGrid({ earnedMap }) {
  return (
    <div className="badge-grid">
      {BADGE_DEFS.map((b) => {
        const earnedAt = earnedMap.get(b.key);
        const unlocked = Boolean(earnedAt);
        return (
          <div className={`badge-tile ${unlocked ? 'unlocked' : 'locked'}`} key={b.key}>
            <div className="badge-icon">{unlocked ? b.emoji : '🔒'}</div>
            <div className="badge-label">{b.label}</div>
            <div className="badge-date">{unlocked ? formatDate(earnedAt) : 'Locked'}</div>
          </div>
        );
      })}
    </div>
  );
}
