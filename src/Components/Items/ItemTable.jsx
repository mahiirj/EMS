import React from "react";
import "./ItemTable.css";

const ItemTable = ({ itemData, onRowClick }) => {
  return (
    <div className="tableContainer">
      <table className="table">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Status</th>
            <th>Number of Subitems</th>
          </tr>
        </thead>
        <tbody>
          {itemData.map((item) => (
            <tr key={item.id} onClick={() => onRowClick(item)}>
              <td>{item.id}</td>
              <td>{item.itemName}</td>
              <td>{item.status}</td>
              <td>{item.subitems.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
