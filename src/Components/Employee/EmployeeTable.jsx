import React, { useState } from "react";
import "./EmployeeTable.css";
import ProfilePicture from "./ProfilePicture";

const EmployeeTable = ({ employeeData, onRowClick }) => {
  const [isPictureOpen, setIsPictureOpen] = useState(false);
  const [currentPicture, setCurrentPicture] = useState(null);

  const handlePic = (e, picUrl) => {
    e.stopPropagation(); // Prevents the row click event
    setCurrentPicture(picUrl);
    setIsPictureOpen(true);
  };

  const handleClose = () => {
    setIsPictureOpen(false);
    setCurrentPicture(null);
  };


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
                <button onClick={(e) => handlePic(e, entry.nicPicture)}>
                  view pic
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isPictureOpen && (
        <ProfilePicture pictureUrl={currentPicture} onClose={handleClose} />
      )}
    </div>
  );
};

export default EmployeeTable;
