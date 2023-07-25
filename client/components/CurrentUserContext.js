import { useState, createContext } from "react";

const CurrUserContext = createContext({
  currentUser: null,
  setCurrentUser: () => {},
});

const CurrentUserContext = (props) => {
  const [currentUser, setCurrentUser] = useState(null);

  const setUser = (user) => {
    setCurrentUser(user);
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  return (
    <CurrUserContext.Provider value={{ currentUser, setUser, logoutUser }}>
      {props.children}
    </CurrUserContext.Provider>
  );
};

export default CurrentUserContext;
