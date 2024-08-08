import React from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import styles from "./Salary.module.css";

const Salary = () => {
  return (
    <div className={styles.page}>
      <div className={styles.section1}>
        <Sidebar />
      </div>
      <div className={styles.section2}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="   Search"
            className={styles.searchbar}
          />
          <button>Search</button>
        </div>
      </div>
    </div>
  );
};

export default Salary;
