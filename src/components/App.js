import React from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import '../index.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import apiConfig from '../utils/api';
import { register, authorize, checkToken } from '../utils/auth';
import CurrentUserContext from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [shouldNavigate, setShouldNavigate] = React.useState(false);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = React.useState("");
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [infoTooltipMessage, setInfoTooltipMessage] = React.useState("");
  const [isSuccessful, setIsSuccessful] = React.useState(false);

  React.useEffect(() => {
    apiConfig.getUserInfo()
      .then((userInfo) => {
        setCurrentUser(userInfo);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    apiConfig.getInitialCards()
      .then((initialCards) => {
        setCards(initialCards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    apiConfig.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      });
  }  

  const handleCardDelete = (card) => {
    apiConfig.deleteCard(card._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== card._id);
        setCards(newCards);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateUser = (userData) => {
    apiConfig.setUserInfo(userData)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard(null);
  };

  const handleUpdateAvatar = (avatarData) => {
    apiConfig.setUserAvatar(avatarData)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddPlaceSubmit = (newCard) => {
    apiConfig.addCard(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRegister = (email, password) => {
    register(email, password)
      .then((data) => {
        if (data) {
          handleLogin(email, password);
          setIsInfoTooltipOpen(true);
          setInfoTooltipMessage("Вы успешно зарегистрировались!");
          setIsSuccessful(true);
        }
      })
      .catch((err) => {
        if (err.message === "Некорректно заполнено одно из полей") {
          console.log("Пожалуйста, проверьте введенные данные.");
          setIsInfoTooltipOpen(true);
          setInfoTooltipMessage("Что-то пошло не так! Попробуйте ещё раз.");
          setIsSuccessful(false);
        } else {
          console.log(err);
          setIsInfoTooltipOpen(true);
          setInfoTooltipMessage("Что-то пошло не так! Попробуйте ещё раз.");
          setIsSuccessful(false);
        }
      });
  };
  
  const handleLogin = (email, password) => {
    return authorize(email, password)
        .then((data) => {
            if (data.token) {
                localStorage.setItem('jwt', data.token);
                setUserEmail(email);
                setLoggedIn(true);
                console.log("Navigate вызывается");
                navigate('/');
                return data;
            }
        })
        .catch((err) => {
          if (err.message === "Не передано одно из полей") {
            console.log("Пожалуйста, убедитесь, что вы ввели email и пароль.");
          } else if (err.message === "Пользователь с email не найден") {
            console.log("Неверный email. Пожалуйста, проверьте и попробуйте еще раз.");
          } else {
            console.log(err);
          }
        });
};  

const handleCheckToken = () => {
  const token = localStorage.getItem('jwt');
  if (token) {
      return checkToken(token)
          .then((res) => {
              if (res) {
                  setLoggedIn(true);
                  setShouldNavigate(true);
                  return apiConfig.getUserInfo();
              }
          })
          .then((userInfo) => {
            setCurrentUser(userInfo);
          })
          .catch((err) => console.log(err));
  }
}


React.useEffect(() => {
  const token = localStorage.getItem('jwt');
  if (token) {
    checkToken(token)
      .then((res) => {
        if (res && !loggedIn) { 
          setLoggedIn(true);
          setUserEmail(res.email);
        }
      })
      .catch((err) => {
        if (loggedIn) {
          setLoggedIn(false);
          setUserEmail('');
        }
      });
  }
}, []);


    return (
    <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Header loggedIn={loggedIn} userEmail={userEmail} />
          <Routes>
  <Route path="/" element={<ProtectedRoute component={Main} 
    cards={cards}
    onEditProfile={handleEditProfileClick}
    onAddPlace={handleAddPlaceClick}
    onEditAvatar={handleEditAvatarClick}
    onCardClick={handleCardClick}
    onCardLike={handleCardLike}
    onCardDelete={handleCardDelete}
    isLoggedIn={loggedIn} 
  />} />
  <Route path="/sign-up" element={<Register onRegister={handleRegister} />} />
  <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />
</Routes>
          {loggedIn && <Footer />}
          <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
          <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
          <PopupWithForm title='Вы уверены?' name='delete' buttonText="Да">
          // тут надо доделать
          </PopupWithForm>
          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          <InfoTooltip 
        isOpen={isInfoTooltipOpen} 
        onClose={closeAllPopups} 
        message={infoTooltipMessage}
        isSuccessful={isSuccessful}
      />
      </div>
    </CurrentUserContext.Provider>
  );


}

export default App;
