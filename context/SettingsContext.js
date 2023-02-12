import { useState, createContext } from "react";

// Create a Context
export const SettingsContext = createContext()

export const SettingsContextProvider = ({ children }) => {
  const [unit, setUnit] = useState('k');
  const [compareWithIndustry, setCompareWithIndustry] = useState(true)

  return (
    // the Provider gives access to the context to its children
    <SettingsContext.Provider value={{unit, setUnit, compareWithIndustry, setCompareWithIndustry}}>
      {children}
    </SettingsContext.Provider>
  );
}
