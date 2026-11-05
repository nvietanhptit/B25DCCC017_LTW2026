import { useLocation, useNavigate, Navigate } from "react-router-dom";

const MESSAGES = {
  bell: "Chúc mừng! Bạn đã rung chuông vàng (đúng cả 15 câu)",
  wrong: "Bạn đã bị loại (trả lời sai)",
  timeout: "Hết giờ!",
  complete: "Bạn đã hoàn thành 15 câu",
};

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <Navigate to="/" replace />;

  return (
    <div className="result">
      <h2>{MESSAGES[state.reason]}</h2>
      <p>{`Người chơi: ${state.name}`}</p>
      <p>{`Số câu trả lời đúng: ${state.correctCount}`}</p>
      <p>{`Điểm: ${state.score}`}</p>
      <p>{`Danh hiệu: ${state.rank}`}</p>
      <div className="actions">
        <button onClick={() => navigate("/play")}>Chơi lại</button>
        <button onClick={() => navigate("/")}>Về trang chủ</button>
      </div>
    </div>
  );
};

export default Result;
