import React, { useState } from "react";
import "./PunchOutModal.css";

const clothingItems = {
  shirt: [
    "Collar",
    "Sleeve",
    "Cuff",
    "Button",
    "Pocket",
    "Hem",
    "Yoke",
    "Back",
    "Front",
    "Placket",
  ],
  pants: [
    "Waistband",
    "Pocket",
    "Fly",
    "Inseam",
    "Outseam",
    "Hem",
    "Belt Loop",
    "Zipper",
    "Cuff",
    "Button",
  ],
  gloves: [
    "Palm",
    "Thumb",
    "Fingers",
    "Cuff",
    "Lining",
    "Back",
    "Stitching",
    "Label",
    "Strap",
    "Fastener",
  ],
  caps: [
    "Visor",
    "Crown",
    "Button",
    "Sweatband",
    "Back Closure",
    "Eyelets",
    "Stitching",
    "Label",
    "Inner Band",
    "Bill",
  ],
};

const PunchOutModal = ({ employeeNumber, onClose, onSubmit }) => {
  const [selectedItem, setSelectedItem] = useState("");
  const [partsData, setPartsData] = useState({});

  const handlePartChange = (part, value) => {
    setPartsData((prev) => ({ ...prev, [part]: value }));
  };

  const handleSubmit = () => {
    onSubmit({ employeeNumber, selectedItem, partsData });
    onClose();
    alert(JSON.stringify(partsData));
  };

  return (
    <div className="modal">
      <div className="modalContent">
        <h2>Punch Out Details</h2>
        <div className="formGroup">
          <label htmlFor="clothingItem">Clothing Item</label>
          <select
            id="clothingItem"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="input"
          >
            <option value="">Select Item</option>
            {Object.keys(clothingItems).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        {selectedItem && (
          <div className="formGroup">
            <h3>Parts Sewed</h3>
            {clothingItems[selectedItem].map((part) => (
              <div key={part} className="partInput">
                <label htmlFor={part}>{part}</label>
                <input
                  type="number"
                  id={part}
                  value={partsData[part] || ""}
                  onChange={(e) => handlePartChange(part, e.target.value)}
                  min="0"
                  className="input"
                />
              </div>
            ))}
          </div>
        )}
        <div className="formActions">
          <button onClick={handleSubmit} className="button">
            Submit
          </button>
          <button onClick={onClose} className="button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PunchOutModal;
