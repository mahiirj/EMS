import React, { useState, useEffect } from "react";
import "./AttendanceInfoModal.css";

const AttendanceInfoModal = ({ onClose }) => {
  const [employeeIdOrName, setEmployeeIdOrName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [records, setRecords] = useState([]); // State to hold the attendance records
  const [attendance_today,setattendance_today] = useState([]);

  useEffect(() => {

    // Trigger the attendance today ipc request when the component mounts
    
    window.electron.ipcRenderer.send("attendance_today:send");


    window.electron.ipcRenderer.on(
      "attendance_search:result",
      function (e, records) {
        setRecords(records); // Update state with the received records
      }
    );

    window.electron.ipcRenderer.on("attendance_today:result",function(e,records){
      
      setattendance_today(records);

    })

    
  }, []);

  const handleSubmit = () => {

    const search_object = {

      id_name: employeeIdOrName,
      search_year: year,
      search_month: month,
      search_day: day

    }


    window.electron.ipcRenderer.send(
      "attendance_search:send",
       search_object
    );
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
            <tbody>
              {records.map((entry) => (
                <tr>
                  <td>{entry.employeeID}</td>
                  <td>{entry.name}</td>
                  <td>
                    {entry.Day},{entry.Month},{entry.Year}
                  </td>
                  <td>{entry.Punch_in_time}</td>
                  <td>{entry.Punch_out_time}</td>
                  <td></td>
                  <td>{entry.daily_payment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceInfoModal;
