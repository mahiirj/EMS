import React, { useState } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import "./Home.css";
import RealTimeDate from "../Components/Home/RealTimeData";
import Attendance from "../Components/Home/Attendance";

const Home = () => {
  return (
    <div className="home">
      <div className="section1">
        <div className="sidebar">
          <Sidebar />
        </div>
      </div>

      <div className="section2">
        <div className="main">
          <div className="time">
            <RealTimeDate />
          </div>

          <div className="que-cards">
            <div className="que-card left">
              <h3>Active Employees</h3>
              <p>123</p>
            </div>

            <div className="que-card right">
              <h3>Total Employees</h3>
              <p>456</p>
            </div>
          </div>
        </div>

        <br />

        <div className="attendance">
          <Attendance />
        </div>
      </div>
    </div>
  );
};

export default Home;
