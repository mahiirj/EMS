import React from "react";
import "./EmployeeTable.css";
import ProfilePicture from "./ProfilePicture";

const EmployeeTable = ({ employeeData, onRowClick }) => {
  return (
    <div className="tableContainer">
      <table className="table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Profile Picture</th>
            <th>Name</th>
            <th>NIC Number</th>
            <th>Status</th>
            <th>Contact</th>
            <th>NIC Picture</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map((entry, index) => (
            <tr key={index} onClick={() => onRowClick(entry)}>
              <td>{entry.id}</td>
              <td>
                <img src={entry.employee_pic} alt="Picture" />
              </td>
              <td>{entry.name}</td>
              <td>{entry.id_number}</td>
              <td>{entry.status}</td>

              <td>
                {entry.mobile}
                <br />
                {entry.telephone}
              </td>

              <td>
                <a href={<ProfilePicture />}> View Photo </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
