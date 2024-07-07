// src/context/UserPointsContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getPoints } from '../api/profile';
import {ParseUint64, Points} from "../components/Basic/dto";

interface UserPointsContextProps {
    points: Points | null;
    loading: boolean;
    error: string | null;
    refreshPoints: (updater: Points | null) => void;
}

const UserPointsContext = createContext<UserPointsContextProps | undefined>(undefined);

export const useUserPoints = () => {
    const context = useContext(UserPointsContext);
    if (!context) {
        throw new Error('useUserPoints must be used within a UserPointsProvider');
    }
    return context;
};

interface UserPointsProviderProps {
    children: ReactNode;
}

export const UserPointsProvider: React.FC<UserPointsProviderProps> = ({ children }) => {
    const [points, setPoints] = useState<Points | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPoints = async () => {
        try {
            const pointsData = await getPoints();
            setPoints(pointsData);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch user points');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPoints();
    }, []);

    const refreshPoints = (updater: Points | null) => {
        setLoading(true);
        if(!! updater) {
            let p: Points = {
                cash: ParseUint64(points?.cash) + ParseUint64(updater?.cash),
                gem: ParseUint64(points?.gem) + ParseUint64(updater?.gem),
                vip_score: ParseUint64(points?.vip_score) + ParseUint64(updater?.vip_score),
            }
            console.log("refreshPoints", p, updater)
            setPoints(p);
            return
        }
        fetchPoints();
    };

    return (
        <UserPointsContext.Provider value={{ points, loading, error, refreshPoints }}>
            {children}
        </UserPointsContext.Provider>
    );
};