const BUILD_TAG = "rc-5307";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Layout from "./components/Layout";
import QuestionBank from "./pages/QuestionBank";
import QuestionDetail from "./pages/QuestionDetail";
import NotFound from "./pages/NotFound";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const loadQuestions = async () => {
      try {
        const res = await axios.get("/data/questions.json", {
          signal: controller.signal,
        });
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

  return (
    <div data-build={BUILD_TAG}>
      <Routes>
        <Route path="/" element={<Layout loading={loading} error={error} />}>
          <Route index element={<h2>Trang chủ</h2>} />
          <Route path="play" element={<h2>Màn hình thi</h2>} />
          <Route path="result" element={<h2>Kết quả</h2>} />
          <Route path="history" element={<h2>Lịch sử</h2>} />
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
