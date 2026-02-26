import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Header from "../components/header.jsx";
import Sidebar from "../components/sidebar.jsx";
import Loader from "../components/Loader.jsx";
import Footer from "../components/footer.jsx";

const AppLayout = () => {
  const { isLoading } = useAuth();

  return (
    <div className="app-shell">
      <Header />
      <div className="app-main">
        <Sidebar />
        <main className="content-area page-fade">
          <div className="content-container">{isLoading ? <Loader /> : <Outlet />}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;

