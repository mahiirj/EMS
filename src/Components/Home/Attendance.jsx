import React, { useState, useEffect } from "react";
import "./Attendance.css";
import PunchDataTable from "./PunchDataTable";
import PunchOutModal from "./PunchOutModal";
import AttendanceInfoModal from "./AttendanceInfoModal"; // Import the new modal

const Attendance = () => {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [actionType, setActionType] = useState("punchIn");
  const [punchData, setPunchData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showPunchOutModal, setShowPunchOutModal] = useState(false);
  const [showAttendanceInfoModal, setShowAttendanceInfoModal] = useState(false); // State for showing the attendance info modal
  const [currentEmployeeNumber, setCurrentEmployeeNumber] = useState("");
  const [currentEmployeeName, setCurrentEmployeeName] = useState(null);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      "obtained_name:send",
      function (e, employee_name) {
        setCurrentEmployeeName(employee_name);
      }
    );
  }, []);

  const handleActionClick = (type) => {
    setActionType(type);

    if (type === "punchIn") {
      window.electron.ipcRenderer.send("obtain_name:send", employeeNumber);
    }
  };

  const handleSubmit = () => {
    if (employeeNumber === "") {
      alert("Please enter the employee number.");
      return;
    }

    const currentTime = new Date().toLocaleString();

    if (actionType === "punchIn") {
      const newPunchData = [
        ...punchData,
        {
          employeeNumber,
          name: currentEmployeeName,
          punchInTime: currentTime,
          punchOutTime: "Active",
        },
      ];

      setPunchData(newPunchData);
      window.electron.ipcRenderer.send("punch_data:send", newPunchData);
    } else if (actionType === "punchOut") {
      setCurrentEmployeeNumber(employeeNumber);
      setShowPunchOutModal(true);
      window.electron.ipcRenderer.send("refresh_items:send");
    }

    setEmployeeNumber("");
    setShowTable(true);
  };

  const handlePunchOutSubmit = (details) => {
    const { employeeNumber, selectedItem, partsData } = details;
    const currentTime = new Date().toLocaleString();

    const updatedPunchData = punchData.map((entry) => {
      if (
        entry.employeeNumber === employeeNumber &&
        entry.punchOutTime === "Active"
      ) {
        return { ...entry, punchOutTime: currentTime, selectedItem, partsData };
      }
      return entry;
    });

    setPunchData(updatedPunchData);
    setShowPunchOutModal(false);
  };

  return (
    <div className="mainContainer">
      <div className="attendanceContainer">
        <h1>Employee Attendance</h1>
        <div className="formGroup">
          <label htmlFor="employeeNumber">Employee Number</label> <br />
          <input
            type="text"
            id="employeeNumber"
            value={employeeNumber}
            onChange={(e) => setEmployeeNumber(e.target.value)}
            required
            placeholder="ex: E001"
            className="input"
          />
        </div>
        <div className="formActions">
          <button
            type="button"
            onClick={() => handleActionClick("punchIn")}
            className={`button ${actionType === "punchIn" ? "active" : ""}`}
          >
            Punch In
          </button>
          <button
            type="button"
            onClick={() => handleActionClick("punchOut")}
            className={`button punchOut ${
              actionType === "punchOut" ? "active" : ""
            }`}
          >
            Punch Out
          </button>
        </div>
        <div className="submitContainer">
          <button
            type="button"
            onClick={handleSubmit}
            id="submit"
            className="button"
          >
            Submit
          </button>
        </div>
      </div>

      <button
        className="button"
        onClick={() => setShowAttendanceInfoModal(true)}
      >
        Attendance Information
      </button>

      {showTable && (
        <div className="tableContainer">
          <PunchDataTable punchData={punchData} />
        </div>
      )}

      {showPunchOutModal && (
        <PunchOutModal
          employeeNumber={currentEmployeeNumber}
          onClose={() => setShowPunchOutModal(false)}
          onSubmit={handlePunchOutSubmit}
          punchData={punchData}
        />
      )}

      {showAttendanceInfoModal && (
        <AttendanceInfoModal
          onClose={() => setShowAttendanceInfoModal(false)}
          punchData={punchData}
        />
      )}
    </div>
  );
};

export default Attendance;
