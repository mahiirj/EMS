import React from "react";
import styles from "./ProfilePicture.module.css";

const ProfilePicture = ({ pictureUrl, onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.main} onClick={(e) => e.stopPropagation()}>
        <img src={pictureUrl} alt="Enlarged" className={styles.enlargedPic} />
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfilePicture;
