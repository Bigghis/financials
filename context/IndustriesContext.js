import { useEffect, useState, createContext } from "react";
import axios from 'axios';

// Create a Context
export const IndustriesDataContext = createContext();

export const IndustriesContextProvider = ({ children }) => {
    //  const [loading, setLoading] = useState(true);
    const [industriesData, setIndustriesData] = useState(null);


    useEffect(() => {
        axios.get('api/industries', {})
            .then((response) => {
                console.log("responseeeeee", response)
                setIndustriesData(response.data.industries);
            });
        //  setLoading(/* false only if categories AND product are not {} */);
    }, []);


    return (
        // the Provider gives access to the context to its children
        <IndustriesDataContext.Provider value={{ industriesData, setIndustriesData }}>
            {children}
        </IndustriesDataContext.Provider>
    );
}
