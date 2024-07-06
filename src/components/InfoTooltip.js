import React from 'react';

const InfoTooltip = ({ isOpen, onClose, message, isSuccess }) => {
  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <button type="button" className="popup__close" onClick={onClose}></button>
        <div className={`popup__status ${isSuccess ? 'popup__status_success' : 'popup__status_error'}`}></div>
        <h2 className="popup__title">{message}</h2>
      </div>
    </div>
  );
};

export default InfoTooltip;