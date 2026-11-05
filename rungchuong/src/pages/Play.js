import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TIME_PER_QUESTION } from "../data";
import { calcScore, getRank } from "../utils";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import ScoreBoard from "../components/ScoreBoard";

const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [status, setStatus] = useState("answering"); // answering -> locked -> revealed
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const q = questions[index];
  const score = calcScore(answers);

  const finish = (finalAnswers, reason) => {
    const finalScore = calcScore(finalAnswers);
    navigate("/result", {
      replace: true,
      state: {
        name: playerName,
        score: finalScore,
        rank: getRank(finalScore),
        correctCount: finalAnswers.filter((a) => a.correct).length,
        reason,
      },
    });
  };

  const advance = () => {
    const correct = selected !== null && selected === q.answer;
    const newAnswers = [...answers, { id: q.id, level: q.level, correct }];
    setAnswers(newAnswers);

    if (!correct) {
      finish(newAnswers, selected === null ? "timeout" : "wrong");
    } else if (index === total - 1) {
      finish(newAnswers, "bell");
    } else {
      setIndex(index + 1);
      setSelected(null);
      setTimeLeft(TIME_PER_QUESTION);
      setStatus("answering");
    }
  };

  const handleChoose = (i) => {
    if (status !== "answering") return;
    setSelected(i);
    setStatus("locked");
  };

  // Đồng hồ: chỉ chạy khi đang trả lời
  useEffect(() => {
    if (status !== "answering") return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [status]);

  // Hết giờ -> lộ đáp án ngay
  useEffect(() => {
    if (status === "answering" && timeLeft <= 0) setStatus("revealed");
  }, [timeLeft, status]);

  // Các bước chờ theo status
  useEffect(() => {
    if (status === "locked") {
      const t = setTimeout(() => setStatus("revealed"), 2000);
      return () => clearTimeout(t);
    }
    if (status === "revealed") {
      const t = setTimeout(advance, 1500);
      return () => clearTimeout(t);
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="play">
      <ScoreBoard
        score={score}
        answers={answers}
        current={index}
        total={total}
      />
      <Timer timeLeft={timeLeft} />
      <QuestionCard
        question={q}
        index={index}
        total={total}
        selected={selected}
        status={status}
        onChoose={handleChoose}
      />
    </div>
  );
};

export default Play;
