import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaTruck,
  FaStore,
  FaPalette,
  FaCog,
  FaTimes,
  FaChartBar,
  FaPercentage,
  FaUsers,
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { path: "/", icon: FaHome, text: "Dashboard" },
    { path: "/orders", icon: FaBox, text: "Orders" },
    { path: "/delivery", icon: FaTruck, text: "Delivery PA" },
    { path: "/products", icon: FaStore, text: "Products" },
    { path: "/analytics", icon: FaChartBar, text: "Analytics" },
    { path: "/audience", icon: FaUsers, text: "Audience" },
    { path: "/appearance/themes", icon: FaPalette, text: "Appearance" },
    { path: "/settings", icon: FaCog, text: "Settings" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay d-lg-none"
          onClick={toggleSidebar}
        ></div>
      )}

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h4 className="m-0">Dashboard</h4>
          <button className="btn close-btn d-lg-none" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              end={item.path === "/"}
            >
              <item.icon className="me-2" />
              <span>{item.text}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
