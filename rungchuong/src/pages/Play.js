import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TIME_PER_QUESTION, EXTRA_TIME } from "../data";
import { calcScore, getRank } from "../utils";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import ScoreBoard from "../components/ScoreBoard";
import Helpers from "../components/Helpers";

const Play = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [status, setStatus] = useState("answering");
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [hidden, setHidden] = useState([]);
  const [used, setUsed] = useState({ fifty: false, extra: false, life: false });
  const [lifeIndex, setLifeIndex] = useState(null); // câu đang bật phao

  const q = questions[index];
  const score = calcScore(answers);
  const lifeActive = lifeIndex === index;
  const canUse = status === "answering";

  const finish = (finalAnswers, reason) => {
    const finalScore = calcScore(finalAnswers);
    const rank = getRank(finalScore);
    const correctCount = finalAnswers.filter((a) => a.correct).length;
    onFinish({
      id: Date.now(),
      name: playerName,
      score: finalScore,
      rank,
      correctCount,
      playedAt: new Date().toLocaleString("vi-VN"),
    });
    navigate("/result", {
      replace: true,
      state: {
        name: playerName,
        score: finalScore,
        rank,
        correctCount,
        reason,
      },
    });
  };

  const advance = () => {
    const correct = selected !== null && selected === q.answer;
    const saved = !correct && lifeActive; // phao cứu sinh có tác dụng
    const newAnswers = [
      ...answers,
      { id: q.id, level: q.level, correct, saved },
    ];
    setAnswers(newAnswers);

    const isLast = index === total - 1;
    if (!correct && !saved) {
      finish(newAnswers, selected === null ? "timeout" : "wrong");
    } else if (isLast) {
      const allCorrect = newAnswers.every((a) => a.correct);
      finish(newAnswers, allCorrect ? "bell" : "complete");
    } else {
      setIndex(index + 1);
      setSelected(null);
      setHidden([]);
      setTimeLeft(TIME_PER_QUESTION);
      setStatus("answering");
    }
  };

  const handleChoose = (i) => {
    if (status !== "answering") return;
    setSelected(i);
    setStatus("locked");
  };

  // --- Quyền trợ giúp ---
  const handleFifty = () => {
    if (!canUse || used.fifty) return;
    const wrongs = [0, 1, 2, 3].filter((i) => i !== q.answer);
    const pick = wrongs[Math.floor(Math.random() * wrongs.length)];
    setHidden([pick]);
    setUsed((u) => ({ ...u, fifty: true }));
  };
  const handleExtra = () => {
    if (!canUse || used.extra) return;
    setTimeLeft((t) => t + EXTRA_TIME);
    setUsed((u) => ({ ...u, extra: true }));
  };
  const handleLife = () => {
    if (!canUse || used.life) return;
    setLifeIndex(index);
    setUsed((u) => ({ ...u, life: true }));
  };

  useEffect(() => {
    if (status !== "answering") return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status === "answering" && timeLeft <= 0) setStatus("revealed");
  }, [timeLeft, status]);

  // Các bước chờ
  useEffect(() => {
    if (status === "locked") {
      const t = setTimeout(() => setStatus("revealed"), 2000);
      return () => clearTimeout(t);
    }
    if (status === "revealed") {
      const t = setTimeout(advance, 1500);
      return () => clearTimeout(t);
    }
  }, [status]);

  // Phím tắt 1-4
  useEffect(() => {
    const handleKey = (e) => {
      if (status !== "answering") return;
      const i = ["1", "2", "3", "4"].indexOf(e.key);
      if (i === -1 || hidden.includes(i)) return;
      handleChoose(i);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [status, hidden]);

  useEffect(() => {
    document.title = `Câu ${index + 1}/${total} – ${score} điểm`;
    return () => {
      document.title = "Rung chuông vàng";
    };
  }, [index, score, total]);

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
        hidden={hidden}
        selected={selected}
        status={status}
        onChoose={handleChoose}
      />
      <Helpers
        used={used}
        lifeActive={lifeActive}
        canUse={canUse}
        onFifty={handleFifty}
        onExtra={handleExtra}
        onLife={handleLife}
      />
    </div>
  );
};

export default Play;
