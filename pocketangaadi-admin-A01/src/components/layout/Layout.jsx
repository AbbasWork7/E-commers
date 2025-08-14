import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-grow-1 ${
          sidebarOpen ? "content-with-sidebar" : "content-full"
        }`}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-4">
          <Outlet /> {/* This is crucial for rendering nested routes */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
