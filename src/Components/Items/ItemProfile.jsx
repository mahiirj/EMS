import React, { useState } from "react";
import "./ItemProfile.css";
import EditItemModal from "./EditItemModal";

const ItemProfile = ({ item, onClose, onRemove, onEdit }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSave = (updatedItem) => {
    onEdit(updatedItem); // Update the parent state with the edited item
    setIsEditModalOpen(false); // Close the edit modal
  };

  return (
    <div className="profileOverlay">
      <div className="profileContent">
        <button className="closeButton" onClick={onClose}>
          &times;
        </button>
        <div className="profileHeader">
          <h2>{item.itemName}</h2>
        </div>
        <div className="profileDetails">
          <div className="detailRow">
            <strong>ID:</strong> <span>{item.id}</span>
          </div>
          <div className="detailRow">
            <strong>Status:</strong> <span>{item.status}</span>
          </div>
          <div className="subItemsSection">
            <h3>Subitems:</h3>
            {item.subitems.length > 0 ? (
              item.subitems.map((subItem, index) => (
                <div key={index} className="subItemRow">
                  <strong>{subItem.name}:</strong> <span>${subItem.price}</span>
                </div>
              ))
            ) : (
              <p>No subitems available.</p>
            )}
          </div>
        </div>
        <div className="profileActions">
          <button onClick={handleOpenEditModal}>Edit</button>
          <button onClick={() => onRemove(item.id)}>Remove Item</button>
        </div>
      </div>

      {isEditModalOpen && (
        <EditItemModal
          item={item}
          onClose={handleCloseEditModal}
          onSave={handleSave} // Pass the handleSave function to EditItemModal
        />
      )}
    </div>
  );
};

export default ItemProfile;
