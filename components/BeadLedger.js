import { Check } from 'lucide-react';

export default function BeadLedger({ completedDays, todayNum }) {
  const groups = [];
  for (let g = 0; g < 6; g++) {
    const beads = [];
    for (let i = 1; i <= 10; i++) {
      const day = g * 10 + i;
      let state = 'upcoming';
      if (completedDays.has(day)) state = 'done';
      else if (day === todayNum) state = 'today';
      else if (day < todayNum) state = 'missed';
      beads.push(
        <span className={`bead bead-${state}`} key={day} title={`Day ${day}`}>
          {state === 'done' ? <Check size={10} /> : day}
        </span>
      );
    }
    groups.push(<div className="bead-row" key={g}>{beads}</div>);
  }
  return <div className="bead-ledger">{groups}</div>;
}
