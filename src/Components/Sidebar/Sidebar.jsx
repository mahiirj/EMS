import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import Home from "../../Pages/Home";
import Employee from "../../Pages/Employee";

const Sidebar = () => {
  const load_employees = (e) => {
    window.electron.ipcRenderer.send("employee_refresh");
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>
          <Link to="/">GS APPAREL</Link>
        </h1>
      </div>

      <div className="dashboard">
        <h2>Dashboard</h2>
        <ul className="menu-list">
          <li>
            <Link to="/"> Home </Link>
          </li>
          <li onClick={load_employees}>
            <Link to="/Employee">Employees </Link>
          </li>
          <li>
            <Link to="/Salary">Salary</Link>
          </li>
          <li>
            <Link to="/Items">Items</Link>
          </li>
        </ul>
        <br />
        <p>settings</p>
      </div>
    </div>
  );
};

export default Sidebar;
