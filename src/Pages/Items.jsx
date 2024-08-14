import React, { useState,useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import styles from "./Items.module.css";
import ItemTable from "../Components/Items/ItemTable";
import AddItemModal from "../Components/Items/AddItemModal";
import ItemProfile from "../Components/Items/ItemProfile";
import EditItemModal from "../Components/Items/EditItemModal";

const Items = () => {
  const [itemData, setItemData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    
    window.electron.ipcRenderer.on(
      "item_list:send",
      function (e, item_array) {

        setItemData(item_array);

      }
    );
  
  }, []);

  const handleAddNewItem = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSaveNewItem = (newItem) => {
    setItemData((prevData) => [...prevData, newItem]);
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseProfile = () => {
    setSelectedItem(null);
  };

  const handleRemoveItem = (id) => {
    setItemData((prevData) => prevData.filter((item) => item.id !== id));
    setSelectedItem(null);
  };

  const handleEditItem = (editedItem) => {
    setItemData((prevData) =>
      prevData.map((item) => (item.id === editedItem.id ? editedItem : item))
    );
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);

  };

  const handleSearch = () => {
    
    console.log("Searching for:", searchQuery);

    window.electron.ipcRenderer.send("search_item:send",searchQuery);
  };

  const handleRefresh = () =>{

    window.electron.ipcRenderer.send("refresh_items:send");

  }

  return (
    <div className={styles.page}>
      <div className={styles.side}>
        <Sidebar />
      </div>

      <div className={styles.main}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search"
            className={styles.searchbar}
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className={styles.list}>
          <div className={styles.title}>
            <h1>Item List</h1>
            <button onClick={handleAddNewItem} className={styles.addnew}>
              ADD NEW
            </button>
            <button onClick={handleRefresh}>REFRESH</button>
          </div>

          <div className={styles.itemTable}>
            <ItemTable itemData={itemData} onRowClick={handleRowClick} />
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <AddItemModal
          onClose={handleCloseAddModal}
          onSave={handleSaveNewItem}
        />
      )}

      {selectedItem && (
        <ItemProfile
          item={selectedItem}
          onClose={handleCloseProfile}
          onRemove={handleRemoveItem}
          onEdit={handleEditItem}
        />
      )}
    </div>
  );
};

export default Items;