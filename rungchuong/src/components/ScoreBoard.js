const ScoreBoard = ({ score, answers, current, total }) => {
  const cells = Array.from({ length: total }, (_, i) => i);

  const getClass = (i) => {
    const a = answers[i];
    let cls = "cell";
    if (a && a.saved) cls += " life";
    else if (a && a.correct) cls += " correct";
    if (i === current) cls += " current";
    return cls;
  };

  return (
    <div>
      <p>
        <strong>{`Điểm: ${score}`}</strong>
      </p>
      <div className="scoreboard-row">
        {cells.map((i) => (
          <span key={i} className={getClass(i)}>
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ScoreBoard;
