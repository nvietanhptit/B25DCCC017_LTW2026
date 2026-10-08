import React, { useState } from "react";
import StudentList from "./StudentList";
import "./App.css";

const initialStudents = [
  { id: 1, name: "Nguyễn Văn A", score: 9, class: "D21CQCN01-B" },
  { id: 2, name: "Trần Thị B", score: 4, class: "D21CQCN02-B" },
  { id: 3, name: "Lê Văn C", score: 7, class: "D21CQCN01-B" },
];

const App = () => {
  const [students, setStudents] = useState(initialStudents);
  const [formData, setFormData] = useState({ name: "", score: "", class: "" });
  const [filterType, setFilterType] = useState("ALL");
  const [error, setError] = useState("");

  // ES6: Destructuring state formData
  const { name, score, class: className } = formData;

  const handleInputChange = (e) => {
    const { name: fieldName, value } = e.target;
    setFormData({ ...formData, [fieldName]: value });
  };

  const handleAddStudent = (e) => {
    e.preventDefault();

    if (!name || !score || !className) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const numScore = parseFloat(score);
    if (numScore < 0 || numScore > 10) {
      setError("Điểm số không hợp lệ (phải từ 0 đến 10)!");
      return;
    }

    const newId =
      students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;

    const newStudent = {
      id: newId,
      name,
      score: numScore,
      class: className,
    };

    setStudents([...students, newStudent]);
    setFormData({ name: "", score: "", class: "" });
    setError("");
  };

  const handleDelete = (id) => {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
  };

  const filteredStudents = students.filter((student) => {
    if (filterType === "GOOD") return student.score >= 8;
    if (filterType === "FAILED") return student.score < 5;
    return true;
  });

  const totalStudents = filteredStudents.length;
  const averageScore =
    totalStudents === 0
      ? 0
      : (
          filteredStudents.reduce((sum, student) => sum + student.score, 0) /
          totalStudents
        ).toFixed(2);

  return (
    <div className="app-container">
      <h2>Quản lý Điểm Sinh viên</h2>

      {}
      <div className="stats-box">
        <p>{`Tổng số lượng: ${totalStudents} sinh viên`}</p>
        <p>{`Điểm trung bình toàn lớp: ${averageScore}`}</p>
      </div>

      {}
      <form onSubmit={handleAddStudent} className="form-container">
        {error && <p className="error-msg">{error}</p>}
        <div className="input-group">
          <input
            type="text"
            name="name"
            placeholder="Họ tên"
            value={name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="score"
            placeholder="Điểm số (0-10)"
            value={score}
            onChange={handleInputChange}
            step="0.1"
          />
          <input
            type="text"
            name="class"
            placeholder="Lớp"
            value={className}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn-add">
            Thêm sinh viên
          </button>
        </div>
      </form>

      {}
      <div className="filter-container">
        <button
          onClick={() => setFilterType("ALL")}
          className={filterType === "ALL" ? "active" : ""}
        >
          Tất cả
        </button>
        <button
          onClick={() => setFilterType("GOOD")}
          className={filterType === "GOOD" ? "active" : ""}
        >
          Sinh viên Giỏi (&gt;=8)
        </button>
        <button
          onClick={() => setFilterType("FAILED")}
          className={filterType === "FAILED" ? "active" : ""}
        >
          Sinh viên Trượt (&lt;5)
        </button>
      </div>

      {}
      <StudentList students={filteredStudents} onDelete={handleDelete} />
    </div>
  );
};

export default App;
