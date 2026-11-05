import AnswerButton from "./AnswerButton";
import { LEVELS, LETTERS } from "../data";

const QuestionCard = ({
  question,
  index,
  total,
  hidden = [],
  selected,
  status,
  onChoose,
}) => {
  const getState = (i) => {
    if (status === "locked") return i === selected ? "chosen" : "";
    if (status === "revealed") {
      if (i === question.answer) return "correct";
      if (i === selected) return "wrong";
    }
    return "";
  };

  return (
    <div className="card">
      <p className="meta">{`Câu ${index + 1}/${total} · ${question.topic} · ${LEVELS[question.level]}`}</p>
      <h3>{question.question}</h3>
      <div className="answers">
        {question.options.map((opt, i) => {
          const isHidden = hidden.includes(i);
          return (
            <AnswerButton
              key={i}
              text={isHidden ? "" : `${LETTERS[i]}. ${opt}`}
              state={getState(i)}
              hidden={isHidden}
              disabled={status !== "answering"}
              onClick={() => onChoose(i)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
