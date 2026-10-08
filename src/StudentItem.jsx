import React from "react";

const StudentItem = ({ student, onDelete }) => {
  const { id, name, score, class: className } = student;

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{score}</td>
      <td>{className}</td>
      <td>
        {/* ES6: Arrow function xử lý sự kiện */}
        <button className="btn-delete" onClick={() => onDelete(id)}>
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default StudentItem;
