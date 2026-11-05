import { useParams, useNavigate } from "react-router-dom";
import { LEVELS, POINTS, LETTERS } from "../data";

const QuestionDetail = ({ questions }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const q = questions.find((item) => item.id === Number(id));

  const backButton = <button onClick={() => navigate(-1)}>Quay lại</button>;

  if (!q) {
    return (
      <div>
        <p>Không tìm thấy câu hỏi</p>
        {backButton}
      </div>
    );
  }

  return (
    <div>
      <h2>{`Câu hỏi số ${q.id} – ${q.topic} (${LEVELS[q.level]}, ${POINTS[q.level]} điểm)`}</h2>
      <p className="question-text">{q.question}</p>
      <ul className="options">
        {q.options.map((option, i) => (
          <li key={i} className={i === q.answer ? "option correct" : "option"}>
            {LETTERS[i]}. {option}
            {i === q.answer && " (Đáp án đúng)"}
          </li>
        ))}
      </ul>
      {backButton}
    </div>
  );
};

export default QuestionDetail;
