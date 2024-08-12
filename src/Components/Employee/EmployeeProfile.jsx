import React, { useState } from "react";
import "./EmployeeProfile.css";
import ProfilePicture from "./ProfilePicture";

const EmployeeProfile = ({ employee, onClose, onRemove }) => {
  const [isPictureOpen, setIsPictureOpen] = useState(false);
  const [currentPicture, setCurrentPicture] = useState(null);

  const handleViewPayments = () => {
    alert("View payment history for " + employee.name);
  };

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
    <div className="profileOverlay">
      <div className="profileContent">
        <button className="closeButton" onClick={onClose}>
          &times;
        </button>
        <div className="profileHeader">
          <img
            src={employee.profilePicture || "default-profile.png"}
            alt="Profile"
            className="profileImage"
          />
          <h2>{employee.name}</h2>
        </div>
        <div className="profileDetails">
          <div className="detailRow">
            <strong>ID:</strong> <span>{employee.id}</span>
          </div>
          <div className="detailRow">
            <strong>Address:</strong> <span>{employee.address}</span>
          </div>
          <div className="detailRow">
            <strong>Gender:</strong> <span>{employee.gender}</span>
          </div>
          <div className="detailRow">
            <strong>Registered Date:</strong>{" "}
            <span>{employee.registeredDate}</span>
          </div>
          <div className="detailRow">
            <strong>Date of Birth:</strong> <span>{employee.dateOfBirth}</span>
          </div>
          <div className="detailRow">
            <strong>ID Number:</strong> <span>{employee.idNumber}</span>
          </div>
          <div className="detailRow">
            <strong>Status:</strong> <span>{employee.status}</span>
          </div>
          <div className="detailRow">
            <strong>Mobile number:</strong>{" "}
            <span>{employee.mobile_number}</span>
          </div>
          <div className="detailRow">
            <strong>Contact number:</strong>{" "}
            <span>{employee.telephone_number}</span>
          </div>
          <div className="detailRow">
            <strong>NIC Picture:</strong>{" "}
            <span>
              <button onClick={(e) => handlePic(e, employee.nicPicture)}>
                Click here
              </button>
            </span>
          </div>
        </div>
        <div className="profileActions">
          <button onClick={handleViewPayments}>View Payment History</button>
          <button onClick={() => onRemove(employee.id)}>Remove Employee</button>
        </div>
      </div>

      {isPictureOpen && (
        <ProfilePicture pictureUrl={currentPicture} onClose={handleClose} />
      )}
    </div>
  );
};

export default EmployeeProfile;
