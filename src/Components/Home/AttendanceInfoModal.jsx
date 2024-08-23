import React, { useState, useEffect } from "react";
import styles from "./AttendanceInfoModal.module.css"; // Importing CSS module

const AttendanceInfoModal = ({ onClose }) => {
  const [employeeIdOrName, setEmployeeIdOrName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [records, setRecords] = useState([]); // State to hold the attendance records
  const [attendance_today, setAttendanceToday] = useState([]);

  useEffect(() => {
    // Trigger the attendance today IPC request when the component mounts
    window.electron.ipcRenderer.send("attendance_today:send");

    window.electron.ipcRenderer.on(
      "attendance_search:result",
      function (e, records) {
        setRecords(records); // Update state with the received records
      }
    );

    window.electron.ipcRenderer.on(
      "attendance_today:result",
      function (e, records) {
        setAttendanceToday(records);
      }
    );
  }, []);

  const handleSubmit = () => {
    const search_object = {
      id_name: employeeIdOrName,
      search_year: year,
      search_month: month,
      search_day: day,
    };

    window.electron.ipcRenderer.send("attendance_search:send", search_object);
  };

  const handleRefresh = () => {
    window.electron.ipcRenderer.send("attendance_today:send");
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Attendance Information</h2>
        <div className={styles.formGroup}>
          <label htmlFor="employeeIdOrName">Employee Name or ID</label>
          <input
            type="text"
            id="employeeIdOrName"
            value={employeeIdOrName}
            onChange={(e) => setEmployeeIdOrName(e.target.value)}
            className={`${styles.input} ${styles.employeeInput}`}
            placeholder="Enter employee name or ID"
          />
        </div>
        <div className={`${styles.formGroup} ${styles.dateGroup}`}>
          <div className={styles.dateInput}>
            <label htmlFor="day">Day</label>
            <input
              type="text"
              id="day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className={`${styles.input} ${styles.dateInputField}`}
              placeholder="DD"
            />
          </div>
          <div className={styles.dateInput}>
            <label htmlFor="month">Month</label>
            <input
              type="text"
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={`${styles.input} ${styles.dateInputField}`}
              placeholder="MM"
            />
          </div>
          <div className={styles.dateInput}>
            <label htmlFor="year">Year</label>
            <input
              type="text"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={`${styles.input} ${styles.dateInputField}`}
              placeholder="YYYY"
            />
          </div>
        </div>
        <div className={styles.formActions}>
          <button onClick={handleSubmit} className={styles.button}>
            Search
          </button>
          <button onClick={handleRefresh} className={styles.button}>
            Refresh
          </button>
          <button onClick={onClose} className={styles.button}>
            Close
          </button>
        </div>
        <div className={styles.tableContainer}>
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
                <tr key={entry.employeeID}>
                  <td>{entry.employeeID}</td>
                  <td>{entry.name}</td>
                  <td>
                    {entry.Day},{entry.Month},{entry.Year}
                  </td>
                  <td>{entry.Punch_in_time}</td>
                  <td>{entry.Punch_out_time}</td>
                  <td>
                    {entry.products_done.map((product, index) => (
                      <div key={index}>
                        {product.name} * {product.quantity}
                      </div>
                    ))}
                  </td>
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
