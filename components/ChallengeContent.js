export default function ChallengeContent({ challenge }) {
  if (challenge.blocks) {
    return (
      <div className="challenge-body">
        {challenge.blocks.map((b, i) => (
          <div className="challenge-block" key={i}>
            <div className="block-intro">{b.intro}</div>
            <ul className="block-list">
              {b.items.map((it, j) => <li key={j}>{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
    );
  }
  if (challenge.items) {
    return (
      <div className="challenge-body">
        <div className="block-intro">{challenge.intro}</div>
        <ul className="block-list">
          {challenge.items.map((it, j) => <li key={j}>{it}</li>)}
        </ul>
        {challenge.after && <div className="block-after">{challenge.after}</div>}
      </div>
    );
  }
  return <div className="challenge-text">{challenge.text}</div>;
}
