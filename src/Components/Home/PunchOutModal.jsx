import React, { useState,useEffect } from "react";
import styles from "./PunchOutModal.module.css";


const PunchOutModal = ({ employeeNumber, onClose, onSubmit }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedParts, setSelectedParts] = useState([]);
  const [showParts, setShowParts] = useState(false);
  const [itemArray, setItemData] = useState([]);

  useEffect(() => {

    window.electron.ipcRenderer.on("item_list:send", function (e, item_array) {
      setItemData(item_array);
    });
  
   
  }, []);

  const handleCheckboxChange = (part) => {
    setSelectedParts((prevSelectedParts) =>
      prevSelectedParts.includes(part)
        ? prevSelectedParts.filter((item) => item !== part)
        : [...prevSelectedParts, part]
    );
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setShowParts(true);
  };

  const handleSubmit = () => {
    onSubmit({ employeeNumber, selectedItem, partsData: selectedParts });
    onClose();
    alert(JSON.stringify(selectedParts));
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Punch Out Details</h2>
        <div className={styles.formGroup}>
          <h3>Clothing Items</h3>
          <table className={styles.clothingTable}>
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Item Name</th>
              </tr>
            </thead>
            <tbody>
              {itemArray.map((item) => (
                <tr
                  key={item._id}
                  onClick={() => handleRowClick(item)}
                  className={selectedItem === item ? styles.selectedRow : ""}
                >
                  <td>{item.id}</td>
                  <td>{item.itemName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showParts && selectedItem && (
          <div className={styles.formGroup}>
            <h3>Parts Sewed for {selectedItem.name}</h3>
            <div className={styles.partsContainer}>
              {selectedItem.subitems.map((subitem) => (
                <div key={subitem._id} className={styles.partItem}>
                  <input
                    type="checkbox"
                    id={subitem.name}
                    checked={selectedParts.includes(subitem.name)}
                    onChange={() => handleCheckboxChange(subitem.name)}
                    className={styles.checkbox}
                  />
                  <label
                    htmlFor={subitem.name}
                    className={styles.checkboxLabel}
                  >
                    {subitem.name} - ${subitem.price}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={styles.formActions}>
          <button onClick={handleSubmit} className={styles.button}>
            Submit
          </button>
          <button onClick={onClose} className={styles.button}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PunchOutModal;
