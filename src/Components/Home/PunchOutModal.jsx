import React, { useState, useEffect } from "react";
import styles from "./PunchOutModal.module.css";

const PunchOutModal = ({ employeeNumber, onClose, onSubmit }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemArray, setItemData] = useState([]);

  useEffect(() => {
    window.electron.ipcRenderer.on("item_list:send", function (e, item_array) {
      setItemData(item_array);
    });

  }, []);

  const handleRowClick = (item) => {
    if (!selectedItems.some((selected) => selected.id === item.id)) {
      const initialTotal = item.subitems.reduce(
        (sum, subitem) => sum + subitem.price * 0,
        0
      );

      setSelectedItems((prevSelectedItems) => [
        ...prevSelectedItems,
        {
          ...item,
          subitems: item.subitems.map((subitem) => ({
            ...subitem,
            quantity: 0,
          })),
          total: initialTotal,
        },
      ]);
    }
  };

  const handleQuantityChange = (itemId, subitemName, change) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              subitems: item.subitems.map((subitem) =>
                subitem.name === subitemName
                  ? {
                      ...subitem,
                      quantity: Math.max(subitem.quantity + change, 0),
                    }
                  : subitem
              ),
              total: item.subitems.reduce(
                (sum, subitem) =>
                  sum +
                  (subitem.name === subitemName
                    ? Math.max(subitem.quantity + change, 0) * subitem.price
                    : subitem.quantity * subitem.price),
                0
              ),
            }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((item) => item.id !== itemId)
    );
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + item.total, 0);
  };

  const handleSubmit = () => {

    onSubmit({ employeeNumber, selectedItems });

    window.electron.ipcRenderer.send("punchout_data:save",selectedItems);


    onClose();

   

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
                  className={
                    selectedItems.some(
                      (selectedItem) => selectedItem.id === item.id
                    )
                      ? styles.selectedRow
                      : ""
                  }
                >
                  <td>{item.id}</td>
                  <td>{item.itemName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedItems.length > 0 && (
          <div className={styles.formGroup}>
            <h3>Selected Items and Parts</h3>
            <div className="table">
              <table className={styles.itemtable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Item</th>
                    <th>Subparts</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.itemName}</td>
                      <td>
                        <ul className={styles.subitemList}>
                          {item.subitems.map((subitem) => (
                            <li key={subitem.name} className={styles.subitem}>
                              <div className={styles.subitemDetails}>
                                <span>{subitem.name}</span>
                                <span>
                                  ${subitem.price} x {subitem.quantity}
                                </span>
                                <div className={styles.quantityControls}>
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        subitem.name,
                                        -1
                                      )
                                    }
                                    className={styles.quantityButton}
                                  >
                                    -
                                  </button>
                                  <span className={styles.quantity}>
                                    {subitem.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        subitem.name,
                                        1
                                      )
                                    }
                                    className={styles.quantityButton}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>${item.total}</td>
                      <td className={styles.remove}>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className={styles.removeButton}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="4" style={{ textAlign: "right" }}>
                      <strong>Grand Total:</strong>
                    </td>
                    <td>
                      <strong>${calculateTotal()}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
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
