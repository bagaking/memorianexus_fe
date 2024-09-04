// src/context/UserPointsContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getPoints } from '../api/profile';
import { parseUint64, Points } from "../api";
import { useAuth } from './AuthContext';

interface UserPointsContextProps {
    points: Points | null;
    loading: boolean;
    error: Error | null;
    updatePoints: (pointsUpdate?: Partial<Points>, isIncrement?: boolean) => Promise<void>;
    initialized: boolean;
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
    const { isAuthenticated } = useAuth();
    const [points, setPoints] = useState<Points | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [initialized, setInitialized] = useState(false);

    const fetchPoints = useCallback(async () => {
        if (!isAuthenticated) {
            setPoints(null);
            setLoading(false);
            setError(null);
            setInitialized(false);
            return;
        }

        setLoading(true);
        try {
            const updatedPoints = await getPoints();
            setPoints(updatedPoints);
            setError(null);
            setInitialized(true);
        } catch (err) {
            console.error('Error fetching points:', err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const updatePoints = useCallback(async (pointsUpdate?: Partial<Points>, isIncrement: boolean = true) => {
        if (!isAuthenticated) return;

        if (!pointsUpdate) {
            await fetchPoints();
            return;
        }

        setPoints(prevPoints => {
            if (!prevPoints) return prevPoints;
            const newPoints: Points = { ...prevPoints };
            Object.keys(pointsUpdate).forEach(key => {
                const typedKey = key as keyof Points;
                if (newPoints[typedKey] !== undefined && pointsUpdate[typedKey] !== undefined) {
                    if (isIncrement) {
                        newPoints[typedKey] = `${parseUint64(newPoints[typedKey]) + parseUint64(pointsUpdate[typedKey]!)}`;
                    } else {
                        newPoints[typedKey] = `${parseUint64(pointsUpdate[typedKey]!)}`;
                    }
                }
            });
            return newPoints;
        });
    }, [isAuthenticated, fetchPoints]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchPoints();
            const intervalId = setInterval(fetchPoints, 60000);
            return () => clearInterval(intervalId);
        } else {
            setPoints(null);
            setLoading(false);
            setError(null);
            setInitialized(false);
        }
    }, [isAuthenticated, fetchPoints]);

    return (
        <UserPointsContext.Provider value={{ points, loading, error, updatePoints, initialized }}>
            {children}
        </UserPointsContext.Provider>
    );
};