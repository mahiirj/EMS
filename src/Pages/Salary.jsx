import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import styles from "./Salary.module.css";

const Salary = () => {
  const [salaryArray, setSalaryArray] = useState([]);
  const [obtainedMonth, setObtainedMonth] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [employeeIdOrName, setEmployeeIdOrName] = useState("");
  const [salary_year, setsalary_year] = useState("");
  const [salary_month, setsalary_month] = useState("");
  const [salary_status, setsalary_status] = useState("");
  const [salarysearch_results, setsalarysearch_results] = useState([]);

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

    window.electron.ipcRenderer.on(
      "salary_search:result",
      function (e, records) {
        setsalarysearch_results(records);
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

  const handleSearch = (e) => {
    // Get values from input fields

    const employeeIdOrName = document.getElementById("search_id_month").value;

    const salary_year = document.getElementById("search_year").value;

    const salary_month = document.getElementById("search_month").value;

    const salary_status = document.getElementById("search_status").value;

    // Update state variables

    setEmployeeIdOrName(employeeIdOrName);

    setsalary_year(salary_year);

    setsalary_month(salary_month);

    setsalary_status(salary_status);

    //making an object to hold the salary search data

    const search_object = {

      id_name: employeeIdOrName,
      search_year: salary_year,
      search_month: salary_month,
      search_status: salary_status,

    }

    //send the data to the backend

    window.electron.ipcRenderer.send(
      "salary_search:send",
       search_object
    );
  };

  const getMonthNumber = (monthName) => {

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthIndex = monthNames.indexOf(monthName);
    return monthIndex + 1; // Months are 1-based (January = 1)
  };



  const Salary_payment = (employeeID, recordMonth) => {

    // Convert the month name to a month number
    const monthNumber = getMonthNumber(recordMonth);

    const payment_object = {

      id: employeeID,
      month: monthNumber

    }
  
    // Send the data to ipcMain

    window.electron.ipcRenderer.send("salary_payment:send", payment_object);
      
    
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

          <button
            onClick={handleSearch}
            type="button"
            className={styles.searchButton}
          >
            Search...
          </button>
        </div>

        <table id="salary_table" className={styles.table}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Month</th>
              <th>Salary</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {salarysearch_results.map((record, index) => (
              <tr key={record.employee}>
                <td className={styles.employee_id}>{record.employeeID}</td>
                <td className={styles.employeeName}>{record.employee_name}</td>
                <td>{obtainedMonth}</td>
                <td
                  className={styles.monthlySalary}
                  data-original-salary={record.Salary}
                >
                  {record.Salary}
                </td>
                <td>
                  {record.Status === "Due" ? (
                    <button
                      onClick={() => Salary_payment(record.employeeID, obtainedMonth)}
                    >
                      Payment Due
                    </button>
                  ) : (
                    "Paid"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Salary;
