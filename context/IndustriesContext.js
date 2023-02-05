import { useState, createContext } from "react";

// Create a Context
export const IndustriesDataContext = createContext()

export const IndustriesContextProvider = ({ children }) => {
    const [industriesData, setIndustriesData] = useState(null);

    return (
        // the Provider gives access to the context to its children
        <IndustriesDataContext.Provider value={{ industriesData, setIndustriesData }}>
            {children}
        </IndustriesDataContext.Provider>
    );
}
