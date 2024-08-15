import React, { useState } from "react";
import "./EditItemModal.css";

const EditItemModal = ({ item, onClose, onSave }) => {
  const [editedItem, setEditedItem] = useState({ ...item });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubitemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSubitems = editedItem.subitems.map((subitem, i) =>
      i === index ? { ...subitem, [name]: value } : subitem
    );
    setEditedItem((prev) => ({
      ...prev,
      subitems: updatedSubitems,
    }));
  };

  const handleRemoveSubitem = (index) => {
    setEditedItem((prev) => ({
      ...prev,
      subitems: prev.subitems.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onSave(editedItem);
    window.electron.ipcRenderer.send("item_send_edited_info:send", editedItem);
    onClose();
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Item</h2>
        <div className="editDetails">
          <div className="editRow">
            <strong>Item ID:</strong>
            <input
              type="text"
              name="id"
              value={editedItem.id}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="editRow">
            <strong>Item Name:</strong>
            <input
              type="text"
              name="itemName"
              value={editedItem.itemName}
              onChange={handleChange}
            />
          </div>
          <h3>Subitems</h3>
          {editedItem.subitems.map((subitem, index) => (
            <div className="editSubitem" key={index}>
              <div className="editRow">
                <strong>Name:</strong>
                <input
                  type="text"
                  name="name"
                  value={subitem.name}
                  onChange={(e) => handleSubitemChange(index, e)}
                />
              </div>
              <div className="editRow">
                <strong>Price:</strong>
                <input
                  type="number"
                  name="price"
                  value={subitem.price}
                  onChange={(e) => handleSubitemChange(index, e)}
                />
              </div>
              <button
                type="button"
                className="cancelButton"
                onClick={() => handleRemoveSubitem(index)}
              >
                Remove Subitem
              </button>
            </div>
          ))}
        </div>
        <button className="saveButton" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditItemModal;
