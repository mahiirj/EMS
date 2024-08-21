// AttendanceInfoModal.js

import React, { useState,useEffect } from "react";
import "./AttendanceInfoModal.css";

const AttendanceInfoModal = ({ onClose }) => {
  const [employeeIdOrName, setEmployeeIdOrName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {

    window.electron.ipcRenderer.on(
      "attendance_search:result",

      function (e, records) {

           
      }
    );

  }, []);

  const handleSubmit = () => {

    // Handle form submission logic
    
    window.electron.ipcRenderer.send("attendance_search:send",employeeIdOrName,year,month,day);
  };

  return (
    <div className="modal">
      <div className="modalContent">
        <h2>Attendance Information</h2>
        <div className="formGroup">
          <label htmlFor="employeeIdOrName">Employee Name or ID</label>
          <input
            type="text"
            id="employeeIdOrName"
            value={employeeIdOrName}
            onChange={(e) => setEmployeeIdOrName(e.target.value)}
            className="input employeeInput"
            placeholder="Enter employee name or ID"
          />
        </div>
        <div className="formGroup dateGroup">
          <div className="dateInput">
            <label htmlFor="day">Day</label>
            <input
              type="text"
              id="day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="input dateInputField"
              placeholder="DD"
            />
          </div>
          <div className="dateInput">
            <label htmlFor="month">Month</label>
            <input
              type="text"
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="input dateInputField"
              placeholder="MM"
            />
          </div>
          <div className="dateInput">
            <label htmlFor="year">Year</label>
            <input
              type="text"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="input dateInputField"
              placeholder="YYYY"
            />
          </div>
        </div>
        <div className="formActions">
          <button onClick={handleSubmit} className="button">
            Search
          </button>
          <button onClick={onClose} className="button">
            Close
          </button>
        </div>
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Employee Number</th>
                <th>Name</th>
                <th>Punch In Day</th>
                <th>Punch In Time</th>
                <th>Punch Out Time</th>
                <th>Sewed Items</th>
                <th>Total Earned</th>
              </tr>
            </thead>
            <tbody>{/* Render filtered data here */}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceInfoModal;