import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = ({ loading, error }) => (
  <div className="app">
    <NavBar />
    <main className="content">
      {loading ? (
        <p>Đang tải câu hỏi...</p>
      ) : error ? (
        <p className="error">Không tải được câu hỏi</p>
      ) : (
        <Outlet />
      )}
    </main>
  </div>
);

export default Layout;
