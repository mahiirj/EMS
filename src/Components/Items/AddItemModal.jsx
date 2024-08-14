import React, { useState } from "react";
import "./AddItemModal.css";

const AddItemModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: "",
    itemName: "",
    subitems: [{ name: "", price: "" }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubitemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSubitems = formData.subitems.map((subitem, i) =>
      i === index ? { ...subitem, [name]: value } : subitem
    );
    setFormData((prevData) => ({
      ...prevData,
      subitems: updatedSubitems,
    }));
  };

  const handleAddSubitem = () => {
    setFormData((prevData) => ({
      ...prevData,
      subitems: [...prevData.subitems, { name: "", price: "" }],
    }));
  };

  const handleRemoveSubitem = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      subitems: prevData.subitems.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Item</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Item Name:
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              required
            />
          </label>

          <h3>Subitems</h3>
          {formData.subitems.map((subitem, index) => (
            <div key={index} className="subitem-entry">
              <label>
                Subitem Name:
                <input
                  type="text"
                  name="name"
                  value={subitem.name}
                  onChange={(e) => handleSubitemChange(index, e)}
                  required
                />
              </label>
              <label>
                Price:
                <input
                  type="number"
                  name="price"
                  value={subitem.price}
                  onChange={(e) => handleSubitemChange(index, e)}
                  required
                />
              </label>
              <button
                type="button"
                className="cancel-button"
                onClick={() => handleRemoveSubitem(index)}
              >
                Cancel
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddSubitem}>
            Add Subitem
          </button>
          <button type="submit">Save Item</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
