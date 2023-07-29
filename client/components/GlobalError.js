import { createContext, useState } from "react";

const globalErrorContext = createContext({
  error: true,
  showError: () => {},
  hideError: () => {},
});

const GlobalErrorContext = ({ children }) => {
  const [errorShouldShow, setErrorShouldShow] = useState(false);
  const showError = () => {
    setErrorShouldShow(true);
  };
  const hideError = () => {
    setErrorShouldShow(false);
  };
  const context = {
    error: errorShouldShow,
    showError,
    hideError,
  };

  return (
    <globalErrorContext.Provider value={context}>
      {children}
    </globalErrorContext.Provider>
  );
};

export { globalErrorContext };
export default GlobalErrorContext;
