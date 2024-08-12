import React, { useState } from "react";
import "./EditEmployeeModal.css";

const EditEmployeeModal = ({ employee, onClose, onSave }) => {
  const [editedEmployee, setEditedEmployee] = useState({ ...employee });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedEmployee);
    onClose();
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Employee</h2>
        <div className="editDetails">
          <div className="editRow">
            <strong>ID:</strong>
            <input
              type="text"
              name="id"
              value={editedEmployee.id}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="editRow">
            <strong>Name:</strong>
            <input
              type="text"
              name="name"
              value={editedEmployee.name}
              onChange={handleChange}
            />
          </div>
          <div className="editRow">
            <strong>Address:</strong>
            <input
              type="text"
              name="address"
              value={editedEmployee.address}
              onChange={handleChange}
            />
          </div>
          <div className="editRow">
            <strong>Gender:</strong>
            <input
              type="text"
              name="gender"
              value={editedEmployee.gender}
              onChange={handleChange}
            />
          </div>
          <div className="editRow">
            <strong>Registered Date:</strong>
            <input
              type="text"
              name="registeredDate"
              value={editedEmployee.registeredDate}
              onChange={handleChange}
            />
          </div>
          <div className="editRow">
            <strong>Date of Birth:</strong>
            <input
              type="text"
              name="dateOfBirth"
              value={editedEmployee.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          <div className="editRow">
            <strong>ID Number:</strong>
            <input
              type="text"
              name="idNumber"
              value={editedEmployee.idNumber}
              onChange={handleChange}
            />
          </div>
          <div className="editRow">
            <strong>Status:</strong>
            <input
              type="text"
              name="status"
              value={editedEmployee.status}
              onChange={handleChange}
            />
          </div>
          <div className="editRow">
            <strong>Mobile number:</strong>
            <input
              type="text"
              name="mobile_number"
              value={editedEmployee.mobile_number}
              onChange={handleChange}
            />
          </div>
          <div className="editRow">
            <strong>Contact number:</strong>
            <input
              type="text"
              name="telephone_number"
              value={editedEmployee.telephone_number}
              onChange={handleChange}
            />
          </div>
          <div className="editRow">
            <strong>NIC Picture:</strong>
            <input
              type="text"
              name="nicPicture"
              value={editedEmployee.nicPicture}
              onChange={handleChange}
            />
          </div>
        </div>
        <button className="saveButton" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
