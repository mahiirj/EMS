import React from "react";
import "./EmployeeProfile.css";

const EmployeeProfile = ({ employee, onClose, onRemove }) => {
  const handleViewPayments = () => {
    alert("View payment history for " + employee.name);
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
            <strong>Contact:</strong> <span>{employee.mobile}</span>
          </div>
        </div>
        <div className="profileActions">
          <button onClick={handleViewPayments}>View Payment History</button>
          <button onClick={() => onRemove(employee.id)}>Remove Employee</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
