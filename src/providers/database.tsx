import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { Databases } from "appwrite";
import { useAuth } from './auth';

const database_id = import.meta.env.VITE_APPWRITE_DATABASE_ID
const stations_collection_id = import.meta.env.VITE_STATION_COLLECTION_ID

const StationsContext = createContext(undefined);

export const StationsProvider = ({ children }: { children: ReactNode }) => {
    const [totalStations, setTotalStations] = useState(0);
    const [totalStationsDigitsArray, setTotalStationsDigitsArray] = useState([0, 0, 0]);
    const [onlineStations, setOnlineStations] = useState(0);
    const [onlineStationsDigitsArray, setOnlineStationsDigitsArray] = useState([0, 0, 0]);
    const [systemHealth, setSystemHealth] = useState(0);

    const { client } = useAuth();
    const databases = new Databases(client);

    useEffect(() => {
        databases.listDocuments(database_id, stations_collection_id)
            .then(response => {
                setTotalStations(response.total);
                setTotalStationsDigitsArray(String(response.total).padStart(3, '0').split('').map(Number));

                setOnlineStations(response.documents.filter((station: any) => station.online).length);
                setOnlineStationsDigitsArray(String(response.documents.filter((station: any) => station.online).length).padStart(3, '0').split('').map(Number));

                setSystemHealth((response.documents.filter((station: any) => station.online).length / response.total) * 100);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <StationsContext.Provider value={{ totalStations, totalStationsDigitsArray, onlineStations, onlineStationsDigitsArray, systemHealth }}>
            {children}
        </StationsContext.Provider>
    );
};


export const useStations = () => {
    const context = useContext(StationsContext);
    if (!context) {
        throw new Error('useStations must be used within a StationsProvider');
    }
    return context;
}