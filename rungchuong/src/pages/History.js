const History = ({ history, onClear }) => {
  const sorted = [...history].sort((a, b) => b.score - a.score);
  const totalScore = history.reduce((sum, h) => sum + h.score, 0);
  const maxScore = history.reduce((max, h) => Math.max(max, h.score), 0);
  const avg = history.length ? Math.round(totalScore / history.length) : 0;

  return (
    <div>
      <h2>Lịch sử</h2>
      <p>{`Số lượt chơi: ${history.length}`}</p>
      <p>{`Điểm cao nhất: ${maxScore}`}</p>
      <p>{`Điểm trung bình: ${avg}`}</p>
      {history.length === 0 ? (
        <p>Chưa có lượt chơi nào.</p>
      ) : (
        <>
          <button onClick={onClear}>Xóa lịch sử</button>
          <table>
            <thead>
              <tr>
                <th>Người chơi</th>
                <th>Số câu đúng</th>
                <th>Điểm</th>
                <th>Danh hiệu</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((h) => (
                <tr key={h.id}>
                  <td>{h.name}</td>
                  <td>{h.correctCount}</td>
                  <td>{h.score}</td>
                  <td>{h.rank}</td>
                  <td>{h.playedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default History;
