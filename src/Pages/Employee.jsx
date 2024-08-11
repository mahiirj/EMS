import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import styles from "./Employee.module.css";
import EmployeeTable from "../Components/Employee/EmployeeTable";
import AddEmployeeModal from "../Components/Employee/AddEmployeeModal";
import EmployeeProfile from "../Components/Employee/EmployeeProfile";

const Employee = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const emdata = [
      {
        id: "E001",
        name: "Menidu",
        address: "198/2 kanatta road",
        details: ["m", "e", "n", "i", "d", "u", "j"],
        gender: "Male",
        dateOfBirth: "2023-01-01",
        registeredDate: "2023-01-01",
        idNumber: "123456789V",
        profilePicture: "srcassetsprofilepic.jpg",
        status: "Active",
        mobile: "123-456-7890",
        telephone: "123-456-7890",
        nicPicture: "",
      },
    ];
    setEmployeeData(emdata);
  }, []);

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveEmployee = (newEmployee) => {
    setEmployeeData((prevData) => [...prevData, newEmployee]);
  };

  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseProfile = () => {
    setSelectedEmployee(null);
  };

  const handleRemoveEmployee = (id) => {
    setEmployeeData((prevData) =>
      prevData.filter((employee) => employee.id !== id)
    );
    setSelectedEmployee(null);
  };

  const handleRefresh = () => {
    window.electron.ipcRenderer.send("employee-refresh");
  };

  return (
    <div className={styles.page}>
      <div className={styles.side}>
        <Sidebar />
      </div>

      <div className={styles.main}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="   Search"
            className={styles.searchbar}
          />
          <button>Search</button>
        </div>

        <div className={styles.list}>
          <div className={styles.title}>
            <h1>Employee List</h1>
            <button onClick={handleAddNew} className={styles.addnew}>
              ADD NEW
            </button>
            <button onClick={handleRefresh} className={styles.refresh}>
              REFRESH
            </button>
          </div>

          <div className={styles.etable}>
            <EmployeeTable
              employeeData={employeeData}
              onRowClick={handleRowClick}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AddEmployeeModal
          onClose={handleCloseModal}
          onSave={handleSaveEmployee}
        />
      )}

      {selectedEmployee && (
        <EmployeeProfile
          employee={selectedEmployee}
          onClose={handleCloseProfile}
          onRemove={handleRemoveEmployee}
        />
      )}
    </div>
  );
};

export default Employee;
