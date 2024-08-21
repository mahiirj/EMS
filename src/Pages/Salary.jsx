import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import styles from "./Salary.module.css";

const Salary = () => {
  const [salaryArray, setSalaryArray] = useState([]);
  const [obtainedMonth, setObtainedMonth] = useState("");
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    const { ipcRenderer } = window.electron;

    ipcRenderer.on(
      "current_salary:result",
      (e, salary_array, obtained_month, current_year) => {
        setSalaryArray(salary_array);
        setObtainedMonth(obtained_month);
        setCurrentYear(current_year);
      }
    );
  }, []);

  const handleEditAdvance = (index) => {
    const updatedSalaryArray = [...salaryArray];
    updatedSalaryArray[index].isEditing = !updatedSalaryArray[index].isEditing;
    setSalaryArray(updatedSalaryArray);
  };

  const handleSaveAdvance = (index, value) => {
    const updatedSalaryArray = [...salaryArray];
    const originalSalary = parseFloat(updatedSalaryArray[index].monthly_salary);
    const newSalary = originalSalary - parseFloat(value || 0);

    updatedSalaryArray[index].monthly_salary = newSalary.toFixed(2);
    updatedSalaryArray[index].advancements = parseFloat(value || 0).toFixed(2);
    updatedSalaryArray[index].isEditing = false;

    setSalaryArray(updatedSalaryArray);

    const { ipcRenderer } = window.electron;
    ipcRenderer.send("update_advance:send", parseFloat(value || 0));
  };

  return (
    <div className={styles.page}>
      <div className={styles.section1}>
        <Sidebar />
      </div>
      <div className={styles.section2}>
        <h2>Employee Attendance and Payment Records</h2>

        {/* First Table */}
        <table id="salary_table" className={styles.table}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Month</th>
              <th>Salary</th>
              <th>Payment Status</th>
              <th>Advancements</th>
            </tr>
          </thead>
          <tbody>
            {salaryArray.map((record, index) => (
              <tr key={record.employee_id}>
                <td className={styles.employeeId}>{record.employee_id}</td>
                <td className={styles.employeeName}>{record.employee_name}</td>
                <td>{obtainedMonth}</td>
                <td
                  className={styles.monthlySalary}
                  data-original-salary={record.monthly_salary}
                >
                  {record.monthly_salary}
                </td>
                <td>Payment Due</td>
                <td className={styles.advancements}>
                  {record.isEditing ? (
                    <>
                      <input
                        type="text"
                        defaultValue={record.advancements || ""}
                        onBlur={(e) => handleSaveAdvance(index, e.target.value)}
                      />
                      <button
                        onClick={() =>
                          handleSaveAdvance(index, record.advancements)
                        }
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      {record.advancements || "0.00"}
                      <button onClick={() => handleEditAdvance(index)}>
                        Edit
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Search Section */}
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <label htmlFor="search_id_month">Employee ID or Name</label>
            <input
              type="text"
              id="search_id_month"
              placeholder="Enter ID or Name"
            />
          </div>

          <div className={styles.searchBox}>
            <p>Enter Year, Month, or Date</p>
            <input type="text" id="search_year" placeholder="Enter Year" />
            <input type="text" id="search_month" placeholder="Enter Month" />
            <input type="text" id="search_status" placeholder="Enter Status" />
          </div>

          <button type="button" className={styles.searchButton}>
            Search...
          </button>
        </div>
      </div>
    </div>
  );
};

export default Salary;
