import { useEffect, useState, createContext } from "react";
import axios from 'axios';

// Create a Context
export const IndustriesDataContext = createContext();

export const IndustriesContextProvider = ({ children }) => {
    //  const [loading, setLoading] = useState(true);
    const [industriesData, setIndustriesData] = useState(null);
    const [industryMatched, setIndustryMatched] = useState(null);


    useEffect(() => {
        axios.get('api/industries', {
            headers: {
                'Cache-Control': 'no-cache'
            }
        })
            .then((response) => {
                setIndustriesData(response.data.industries);
            });
    }, []);

    return (
        // the Provider gives access to the context to its children
        <IndustriesDataContext.Provider value={{ industriesData, setIndustriesData, industryMatched, setIndustryMatched }}>
            {children}
        </IndustriesDataContext.Provider>
    );
}
