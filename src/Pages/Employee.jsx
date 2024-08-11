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
    window.electron.ipcRenderer.on(
      "employee_list:send",
      function (e, employee_array) {
        setEmployeeData(employee_array);
      }
    );
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

  const handleRefresh = (e) => {
    window.electron.ipcRenderer.send("employee_refresh");
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
