import React, { useState, useEffect } from "react";
import "./Attendance.css";
import PunchDataTable from "./PunchDataTable";
import PunchOutModal from "./PunchOutModal";
import AttendanceInfoModal from "./AttendanceInfoModal";

const Attendance = () => {

  const [employeeNumber, setEmployeeNumber] = useState("");
  const [actionType, setActionType] = useState("punchIn");
  const [showTable, setShowTable] = useState(true);
  const [showPunchOutModal, setShowPunchOutModal] = useState(false);
  const [showAttendanceInfoModal, setShowAttendanceInfoModal] = useState(false);
  const [currentEmployeeNumber, setCurrentEmployeeNumber] = useState("");
  const [currentEmployeeName, setCurrentEmployeeName] = useState(null);
  const [recorddata, setRecorddata] = useState([]);

  useEffect(() => {

    window.electron.ipcRenderer.on("obtained_name:send", (e, employee_name) => {
      setCurrentEmployeeName(employee_name);
    });

    window.electron.ipcRenderer.on("attendance_today:result", (e, records) => {
      setRecorddata(records);
    });

    window.electron.ipcRenderer.on("get:punchin_records",function(e,records){
      
      //punched in  data recieved here
        
    })

    // Request the initial records
    window.electron.ipcRenderer.send("attendance_today:send");

    //request the punchin data for today

    window.electron.ipcRenderer.send("get:punchin_records");

    
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

      const newPunchData = {
        employeeID: employeeNumber,
        name: currentEmployeeName,
        Punch_in_time: currentTime,
        Punch_out_time: "Active",
      };
      
      window.electron.ipcRenderer.send("punch_in:send",newPunchData);

      const updatedRecords = [...recorddata, newPunchData];
      setRecorddata(updatedRecords);
      window.electron.ipcRenderer.send("punch_data:send", updatedRecords);
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

    const updatedPunchData = recorddata.map((entry) => {
      if (
        entry.employeeID === employeeNumber &&
        entry.Punch_out_time === "Active"
      ) {
        return {
          ...entry,
          Punch_out_time: currentTime,
          selectedItem,
          partsData,
        };
      }
      return entry;
    });

    setRecorddata(updatedPunchData);
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
          <PunchDataTable punchData={recorddata} />
        </div>
      )}

      {showPunchOutModal && (
        <PunchOutModal
          employeeNumber={currentEmployeeNumber}
          onClose={() => setShowPunchOutModal(false)}
          onSubmit={handlePunchOutSubmit}
          punchData={recorddata}
        />
      )}

      {showAttendanceInfoModal && (
        <AttendanceInfoModal
          onClose={() => setShowAttendanceInfoModal(false)}
        />
      )}
    </div>
  );
};

export default Attendance;
