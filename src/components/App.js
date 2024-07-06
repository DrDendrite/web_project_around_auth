import Footer from './Footer';
import Header from './Header';
import Register from './Register';
import PopupRegister from './PopupRegister';
import Main from './Main';
import Login from './Login';
import React, { useState, useEffect } from 'react';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/api';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import InfoTooltip from './InfoTooltip';
import { Route, Routes, useNavigate } from 'react-router-dom';
import * as auth from '../utils/auth';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isInfoTooltipMessage, setIsInfoTooltipMessage] = useState('');
  const [isInfoTooltipSuccess, setIsInfoTooltipSuccess] = useState(false);
  const [selectedCard, setSelectedCard] = useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [cards, setCards] = useState([]);
  const [menu, setMenu] = useState(['']);
  const [loggedIn, setLoggedIn] = useState(false);
  const [stateRegister, setStateRegister] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate('');

  function handleCardDelete(card) {
    api
      .deleteCard(card)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Error: ${res.status}`);
      })
      .then((data) => {
        setCards(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(false);
    setImagePopupOpen(false);
    setIsRegisterPopupOpen(false);
    setIsInfoTooltipOpen(false);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setImagePopupOpen(true);
  }

  function handleUpdateUser(user) {
    api
      .setUser(user)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Error: ${res.status}`);
      })
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
        setIsInfoTooltipMessage('Perfil actualizado exitosamente');
        setIsInfoTooltipSuccess(true);
        setIsInfoTooltipOpen(true);
      })
      .catch((err) => {console.log(err);
      setIsInfoTooltipMessage('Error al actualizar el perfil');
      setIsInfoTooltipSuccess(false);
      setIsInfoTooltipOpen(true);
      });
  }

  function handleUpdateAvatar(url) {
    api
      .getAvatar(url)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(`Error: ${res}`);
      })
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
        setIsInfoTooltipMessage('Avatar actualizado exitosamente');
        setIsInfoTooltipSuccess(true);
        setIsInfoTooltipOpen(true);
      })
      .catch((err) => {console.log(err);
       setIsInfoTooltipMessage('Error al actualizar el avatar');
        setIsInfoTooltipSuccess(false);
        setIsInfoTooltipOpen(true);
  });
  }

  function handleAddPlaceSubmit(obj) {
    api
      .getCard(obj)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Error: ${res}`);
      })
      .then((data) => {
        setCards({ obj, ...cards });
        closeAllPopups();
        setIsInfoTooltipMessage('Tarjeta agregada exitosamente');
        setIsInfoTooltipSuccess(true);
        setIsInfoTooltipOpen(true);
      })
      .catch((err) => {console.log(err)
      setIsInfoTooltipMessage('Error al agregar la tarjeta');
        setIsInfoTooltipSuccess(false);
        setIsInfoTooltipOpen(true);   
  });
  }

  function tokenCheck(token) {
    auth.getUser(token).then((res) => {
      if (res) {
        setLoggedIn(true);
        navigate('/');
        setUserEmail(res.email);
      }
    });
  }

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      tokenCheck(jwt);
    }
  }, []);

  useEffect(() => {
    api
      .getInitialCards()
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
      });
  }, [cards]);

  useEffect(() => {
    api
      .setProfileInfo()
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Error: ${res.status}`);
      })
      .then((data) => setCurrentUser(data))
      .catch((err) => console.log(err));
  }, []);

  const contextValues = {
    currentUser,
    menu,
    setMenu,
    loggedIn,
    setLoggedIn,
    setIsRegisterPopupOpen,
    setStateRegister,
    userEmail,
    setUserEmail,
  };

  return (
    <div className="App">
      <CurrentUserContext.Provider value={contextValues}>
        <div className="general-container">
          <div className="page">
            <Header page="page" />
   
            <Routes element={<ProtectedRoute loggedIn={loggedIn}/>}>
              {loggedIn ? (
                <Route
                  path="/*"
                  element={                
                     <Main
                      onEditProfileClick={handleEditProfileClick}
                      onAddPlaceClick={handleAddPlaceClick}
                      onEditAvatarClick={handleEditAvatarClick}
                      onCardClick={handleCardClick}
                      selectedCard={selectedCard}
                      onClose={closeAllPopups}
                      cards={cards}
                      onCardDelete={handleCardDelete}
                    />
                  }
                />
              ) : (
                <Route
                  path="/*"
                  element={<Login handleLogin={auth.authorize} />}
                ></Route>
              )}
              <Route
                path="/signup"
                element={<Register handleRegister={auth.register} />}
              ></Route>
              <Route
                path="/signin"
                element={<Login handleLogin={auth.authorize} />}
              ></Route>
            </Routes>
            <PopupRegister
              isOpen={isRegisterPopupOpen}
              onClose={closeAllPopups}
              status={stateRegister}
            />
            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            />
            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
            />

            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
            ></EditProfilePopup>

            <ImagePopup
              popup="image-popup"
              container="image-container"
              close="image-container__close"
              title={selectedCard.name}
              onClose={closeAllPopups}
              imgPath={selectedCard.link}
              isImagePopupOpen={isImagePopupOpen}
            />
             <InfoTooltip 
              isOpen={isInfoTooltipOpen}
              onClose={closeAllPopups}
              message={isInfoTooltipMessage}
              isSuccess={isInfoTooltipSuccess}
            />
            <Footer />
          </div>
        </div>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;