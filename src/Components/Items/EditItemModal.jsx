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

  const handleSave = () => {
    onSave(editedItem);
    item = editedItem;

    window.electron.ipcRenderer.send('item_send_edited_info:send',editedItem);

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
          {editedItem.subitems.map((subitem, index) => (
            <div className="editSubitem" key={index}>
              <h4>Subitem {index + 1}</h4>
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
