function PopupWithForm({ isOpen, onClose, name, title, buttonText, children, onSubmit }) {
  return (
    <div className={`popup popup_${name}${isOpen ? " popup_opened" : ""}`}>
      <div className="popup__container">
        <button type="button" className="popup__close-button" aria-label="Закрыть" onClick={onClose} />
        <h2 className="popup__title">{title}</h2>
        <form id={name} className={`popup__form popup__form_${name}`} name={name} onSubmit={onSubmit}>
          {children}
          <button type="submit" form={name} className={`popup__submit-button popup__submit-button_${name}`}>
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;