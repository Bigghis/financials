import { useState, createContext } from "react";

// Create a Context
export const SettingsContext = createContext()

export const SettingsContextProvider = ({ children }) => {
  const [unit, setUnit] = useState(null);

  return (
    // the Provider gives access to the context to its children
    <SettingsContext.Provider value={{unit, setUnit}}>
      {children}
    </SettingsContext.Provider>
  );
}
