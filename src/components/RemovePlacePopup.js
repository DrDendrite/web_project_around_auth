import React from "react";
import PopupWithForm from "./PopupWithForm";

function RemovePlacePopup ({card, isOpen, onClose, onCardDelete, isLoading}) {
    function handleSubmit (evt) {
        evt.preventDefault ();
        onCardDelete (card);
    }

    return (
        <PopupWithForm
        title = "are you sure?"
        name = "remove-card"
        buttonText = {isLoading ? "removing..." :"yes"}
        isOpen = {isOpen}
        onClose = {onClose}
        onSubmit = {handleSubmit}
        />
    );
}

export default RemovePlacePopup;