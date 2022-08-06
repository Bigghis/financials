import { useState, createContext } from "react";

// Create a Context
export const DataContext = createContext()

export const DataContextProvider = ({ children }) => {
  const [commonData, setCommonData] = useState(null);

  return (
    // the Provider gives access to the context to its children
    <DataContext.Provider value={{commonData, setCommonData}}>
      {children}
    </DataContext.Provider>
  );
}
