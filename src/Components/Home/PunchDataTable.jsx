import React from "react";
import "./PunchDataTable.css";

const PunchDataTable = ({ punchData }) => {
  return (
    <div className="tableContainer">
      <table className="table">
        <thead>
          <tr>
            <th>Employee Number</th>
            <th>Name</th>
            <th>Punch In Time</th>
            <th>Punch Out Time</th>
          </tr>
        </thead>
        <tbody>
          {punchData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.employeeNumber}</td>
              <td>{entry.name}</td>
              <td>{entry.punchInTime}</td>
              <td>{entry.punchOutTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PunchDataTable;
