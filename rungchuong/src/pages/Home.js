import { useNavigate } from "react-router-dom";

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();

  // Lượt có điểm cao nhất (null nếu chưa có lượt nào)
  const best = history.reduce(
    (b, h) => (!b || h.score > b.score ? h : b),
    null,
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    setPlayerName(playerName.trim());
    navigate("/play");
  };

  return (
    <div className="home">
      <h1>Rung chuông vàng</h1>
      {best && (
        <p className="record">{`Kỷ lục: ${best.score} điểm – ${best.name}`}</p>
      )}
      <ul>
        <li>15 câu hỏi về HTML, CSS, JavaScript, React; mỗi câu 20 giây.</li>
        <li>Câu dễ 10 điểm, trung bình 20 điểm, khó 30 điểm.</li>
        <li>Trả lời sai hoặc hết giờ là bị loại.</li>
        <li>Đúng cả 15 câu: rung chuông vàng với 300 điểm.</li>
        <li>
          Có 3 quyền trợ giúp: Loại 1 đáp án, Thêm 15 giây, Phao cứu sinh. Phím
          1–4 để chọn đáp án.
        </li>
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên người chơi"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button type="submit" disabled={!playerName.trim()}>
          Vào thi
        </button>
      </form>
    </div>
  );
};

export default Home;
