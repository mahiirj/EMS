import React, { useState } from "react";
import styles from "./PunchOutModal.module.css";

// Initializing the array with the format provided
const itemArray = [
  {
    _id: "66bd2807f213aa3943c2124d",
    name: "Shirt",
    subparts: [{ name: "Collar", price: 60, _id: "66bf0727ef07043b89931539" }],
    itemStatus: "active",
    itemID: "I1",
  },
  {
    _id: "66bd2847f213aa3943c2125f",
    name: "Trouser",
    subparts: [
      { name: "Hem", price: 1000, _id: "66bf0741ef07043b89931544" },
      { name: "Side", price: 200, _id: "66bf0741ef07043b89931545" },
    ],
    itemStatus: "active",
    itemID: "I2",
  },
  {
    _id: "66bd3300a138b76613327749",
    name: "Tom",
    subparts: [{ name: "Wee", price: 300, _id: "66bd3300a138b7661332774a" }],
    itemStatus: "active",
    itemID: "I3",
  },
  {
    _id: "66bd3480bbdb4d2fc144cbd4",
    name: "WW",
    subparts: [{ name: "WW", price: 23, _id: "66bd3480bbdb4d2fc144cbd5" }],
    itemStatus: "active",
    itemID: "I4",
  },
];

const PunchOutModal = ({ employeeNumber, onClose, onSubmit }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedParts, setSelectedParts] = useState([]);
  const [showParts, setShowParts] = useState(false);

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
                  <td>{item.itemID}</td>
                  <td>{item.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showParts && selectedItem && (
          <div className={styles.formGroup}>
            <h3>Parts Sewed for {selectedItem.name}</h3>
            <div className={styles.partsContainer}>
              {selectedItem.subparts.map((subitem) => (
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
