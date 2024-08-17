import React, { useState } from "react";
import "./Attendance.css";
import PunchDataTable from "./PunchDataTable";
import PunchOutModal from "./PunchOutModal";

const Attendance = () => {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [actionType, setActionType] = useState("punchIn");
  const [punchData, setPunchData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showPunchOutModal, setShowPunchOutModal] = useState(false);
  const [currentEmployeeNumber, setCurrentEmployeeNumber] = useState("");

  const handleActionClick = (type) => {
    setActionType(type);
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
          name: "",
          punchInTime: currentTime,
          punchOutTime: "Active",
        },
      ];
      setPunchData(newPunchData);
    } else if (actionType === "punchOut") {
      // Send request to fetch item list before showing the modal
      window.electron.ipcRenderer.send("refresh_items:send");
      // Set the current employee number and show the modal
      setCurrentEmployeeNumber(employeeNumber);
      setShowPunchOutModal(true);
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

    // Send request to refresh items
    window.electron.ipcRenderer.send("refresh_items:send");
  };

  return (
    <div className="mainContainer">
      <div className="attendanceContainer">
        <h1>Employee Attendance</h1>
        <br />
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

      {/* Punch Data Table */}
      {showTable && (
        <div className="tableContainer">
          <PunchDataTable punchData={punchData} />
        </div>
      )}

      {/* Punch Out Modal */}
      {showPunchOutModal && (
        <PunchOutModal
          employeeNumber={currentEmployeeNumber}
          onClose={() => setShowPunchOutModal(false)}
          onSubmit={handlePunchOutSubmit}
        />
      )}
    </div>
  );
};

export default Attendance;
