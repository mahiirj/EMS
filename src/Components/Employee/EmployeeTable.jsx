import React from "react";
import "./EmployeeTable.css";

const EmployeeTable = ({ employeeData, onRowClick }) => {
  return (
    <div className="tableContainer">
      <table className="table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Profile Picture</th>
            <th>Address</th>
            <th>Gender</th>
            <th>Registered Date</th>
            <th>ID Number</th>

            <th>Status</th>
            <th>Contact</th>
            <th>NIC Picture</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map((entry, index) => (
            <tr key={index} onClick={() => onRowClick(entry)}>
              <td>{entry.id}</td>
              <td>{entry.name}</td>
              <td>
                <img src={entry.profilePicture} alt="Picture" />
              </td>
              <td>{entry.address}</td>
              <td>{entry.gender}</td>
              <td>{entry.registeredDate}</td>
              <td>{entry.idNumber}</td>

              <td>{entry.status}</td>
              <td>{entry.contact}</td>
              <td>
                <img src={entry.nicPicture} alt="NIC" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
