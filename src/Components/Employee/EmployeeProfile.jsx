import React, { useState } from "react";
import "./EmployeeProfile.css";
import ProfilePicture from "./ProfilePicture";
import EditEmployeeModal from "./EditEmployeeModal";

const EmployeeProfile = ({ employee, onClose, onRemove }) => {
  const [isPictureOpen, setIsPictureOpen] = useState(false);
  const [currentPicture, setCurrentPicture] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState(employee);

  const handleViewPayments = () => {
    alert("View payment history for " + employeeData.name);
  };

  const handlePic = (e, picUrl) => {
    e.stopPropagation(); // Prevents the row click event
    setCurrentPicture(picUrl);
    setIsPictureOpen(true);
  };

  const handleClosePicture = () => {
    setIsPictureOpen(false);
    setCurrentPicture(null);
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSave = (updatedEmployee) => {
    setEmployeeData(updatedEmployee);
  };

  return (
    <div className="profileOverlay">
      <div className="profileContent">
        <button className="closeButton" onClick={onClose}>
          &times;
        </button>
        <div className="profileHeader">
          <img
            src={employeeData.profilePicture || "default-profile.png"}
            alt="Profile"
            className="profileImage"
          />
          <h2>{employeeData.name}</h2>
        </div>
        <div className="profileDetails">
          <div className="detailRow">
            <strong>ID:</strong> <span>{employeeData.id}</span>
          </div>
          <div className="detailRow">
            <strong>Address:</strong> <span>{employeeData.address}</span>
          </div>
          <div className="detailRow">
            <strong>Gender:</strong> <span>{employeeData.gender}</span>
          </div>
          <div className="detailRow">
            <strong>Registered Date:</strong>{" "}
            <span>{employeeData.registeredDate}</span>
          </div>
          <div className="detailRow">
            <strong>Date of Birth:</strong> <span>{employeeData.birthday}</span>
          </div>
          <div className="detailRow">
            <strong>ID Number:</strong> <span>{employeeData.idNumber}</span>
          </div>
          <div className="detailRow">
            <strong>Status:</strong> <span>{employeeData.status}</span>
          </div>
          <div className="detailRow">
            <strong>Mobile number:</strong>{" "}
            <span>{employeeData.mobile_number}</span>
          </div>
          <div className="detailRow">
            <strong>Contact number:</strong>{" "}
            <span>{employeeData.telephone_number}</span>
          </div>
          <div className="detailRow">
            <strong>NIC Picture:</strong>{" "}
            <span>
              <button onClick={(e) => handlePic(e, employeeData.nicPicture)}>
                Click here
              </button>
            </span>
          </div>
        </div>
        <div className="profileActions">
          <button onClick={handleViewPayments}>View Payment History</button>
          <button onClick={handleOpenEditModal}>Edit</button>
        </div>
      </div>

      {isPictureOpen && (
        <ProfilePicture
          pictureUrl={currentPicture}
          onClose={handleClosePicture}
        />
      )}

      {isEditModalOpen && (
        <EditEmployeeModal
          employee={employeeData}
          onClose={handleCloseEditModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default EmployeeProfile;
