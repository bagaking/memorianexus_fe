// src/context/UserPointsContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getPoints } from '../api/profile';
import { ParseUint64, Points } from "../components/Basic/dto";

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

const RETRY_INTERVAL = 60000; // 60 seconds
const MAX_RETRIES = 3;

export const UserPointsProvider: React.FC<UserPointsProviderProps> = ({ children }) => {
    const [points, setPoints] = useState<Points | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [initialized, setInitialized] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const fetchPoints = useCallback(async () => {
        try {
            const updatedPoints = await getPoints();
            setPoints(updatedPoints);
            setLoading(false);
            setError(null);
            setInitialized(true);
            setRetryCount(0);
        } catch (err) {
            console.error('Error fetching points:', err);
            setError(err as Error);
            if (retryCount < MAX_RETRIES) {
                setTimeout(() => {
                    setRetryCount(prevCount => prevCount + 1);
                    fetchPoints();
                }, RETRY_INTERVAL);
            } else {
                setLoading(false);
            }
        }
    }, [retryCount]);

    const updatePoints = useCallback(async (pointsUpdate?: Partial<Points>, isIncrement: boolean = true) => {
        if (!pointsUpdate) {
            // 如果没有传入 pointsUpdate，则触发 fetchPoints
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
                        newPoints[typedKey] = `${ParseUint64(newPoints[typedKey]) + ParseUint64(pointsUpdate[typedKey]!)}`;
                    } else {
                        newPoints[typedKey] = `${ParseUint64(pointsUpdate[typedKey]!)}`;
                    }
                }
            });
            return newPoints;
        });
    }, [fetchPoints]);

    useEffect(() => {
        fetchPoints();

        const intervalId = setInterval(() => {
            if (!loading && initialized) {
                fetchPoints();
            }
        }, 60000); // 每分钟更新一次

        return () => clearInterval(intervalId);
    }, [fetchPoints, loading, initialized]);

    return (
        <UserPointsContext.Provider value={{ points, loading, error, updatePoints, initialized }}>
            {children}
        </UserPointsContext.Provider>
    );
};