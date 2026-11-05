const BUILD_TAG = "rc-5307";
/* eslint-disable import/first */
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Play from "./pages/Play";
import Result from "./pages/Result";
import History from "./pages/History";
import QuestionBank from "./pages/QuestionBank";
import QuestionDetail from "./pages/QuestionDetail";
import NotFound from "./pages/NotFound";

const HISTORY_KEY = "ltw_rcv_history";

const loadHistory = () => {
  try {
    const data = JSON.parse(localStorage.getItem(HISTORY_KEY));
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
};

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [history, setHistory] = useState(loadHistory);

  // Gọi API lấy câu hỏi
  useEffect(() => {
    const controller = new AbortController();
    const loadQuestions = async () => {
      try {
        const res = await axios.get("/data/questions.json", {
          signal: controller.signal,
        });
        // Dev server CRA trả index.html (200) khi sai tên file -> kiểm tra phải là mảng
        if (!Array.isArray(res.data)) throw new Error("Dữ liệu không hợp lệ");
        setQuestions(res.data);
        setError(false);
        setLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) return; // request bị hủy: bỏ qua
        setError(true);
        setLoading(false);
      }
    };
    loadQuestions();
    return () => controller.abort();
  }, []);

  // Lưu lịch sử vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addHistory = (record) => setHistory((prev) => [...prev, record]);
  const clearHistory = () => setHistory([]);

  return (
    <div data-build={BUILD_TAG}>
      <Routes>
        <Route path="/" element={<Layout loading={loading} error={error} />}>
          <Route
            index
            element={
              <Home
                playerName={playerName}
                setPlayerName={setPlayerName}
                history={history}
              />
            }
          />
          <Route
            path="play"
            element={
              playerName.trim() ? (
                <Play
                  questions={questions}
                  playerName={playerName}
                  onFinish={addHistory}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="result" element={<Result />} />
          <Route
            path="history"
            element={<History history={history} onClear={clearHistory} />}
          />
          <Route
            path="questions"
            element={<QuestionBank questions={questions} />}
          />
          <Route
            path="questions/:id"
            element={<QuestionDetail questions={questions} />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
