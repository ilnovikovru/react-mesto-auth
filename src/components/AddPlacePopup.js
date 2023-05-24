import React, { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  React.useEffect(() => {
    setName('');
    setLink('');
}, [props.isOpen]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onAddPlace({ name, link });
  
    setName('');
    setLink('');
  };

  return (
    <PopupWithForm
      title="Новое место"
      name="add"
      buttonText="Создать"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        placeholder="Название"
        id="input-title"
        className="popup__input-text popup__input-text_type_title"
        name="name"
        type="text"
        minLength="2"
        maxLength="30"
        required
        value={name || ''}
        onChange={handleNameChange}
      />
      <span id="input-title-error" className="popup__input-error"></span>
      <input
        placeholder="Ссылка на картинку"
        id="input-link"
        className="popup__input-text popup__input-text_type_link"
        name="link"
        type="url"
        required
        value={link || ''}
        onChange={handleLinkChange}
      />
      <span id="input-link-error" className="popup__input-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
