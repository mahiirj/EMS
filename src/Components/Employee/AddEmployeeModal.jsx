import React, { useState, useEffect } from "react";
import "./AddEmployeeModal.css";

const AddEmployeeModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    address: "",
    gender: "",
    registeredDate: "",
    idNumber: "",
    profilePicture: "",
    status: "",
    contact: "",
    nicPicture: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const open_profile_pic = (e) => {
    e.preventDefault();

    window.electron.ipcRenderer.send("open-file-dialog");
  };

  const open_nic_pic = (e) => {
    e.preventDefault();

    window.electron.ipcRenderer.send("open-file-dialog");
  };

  const onSubmit = (e) => {
    e.preventDefault();

    window.electron.ipcRenderer.send("employee:add", formData);
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>Add New Employee</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Gender:
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Registered Date:
            <input
              type="date"
              name="registeredDate"
              value={formData.registeredDate}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            ID Number:
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Mobile number:
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Telephone:
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />
          </label>

          <div className="pic-button">
            <button
              className="propic"
              onClick={open_profile_pic}
              value={formData.profilePicture}
            >
              Profile Picture
            </button>
            <button
              className="nic"
              onClick={open_nic_pic}
              value={formData.nicPicture}
            >
              nic
            </button>
          </div>

          <button type="submit" onClick={onSubmit}>
            Save
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
