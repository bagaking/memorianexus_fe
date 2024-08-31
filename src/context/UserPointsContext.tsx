// src/context/UserPointsContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getPoints } from '../api/profile';
import {ParseUint64, Points} from "../components/Basic/dto";

interface UserPointsContextProps {
    points: Points | null;
    loading: boolean;
    error: Error | null;
    refreshPoints: (newPoints?: Partial<Points>) => Promise<void>;
    initialized: boolean;  // 新增
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

export const UserPointsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [points, setPoints] = useState<Points | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [initialized, setInitialized] = useState(false);  // 新增

    const refreshPoints = useCallback(async (newPoints?: Partial<Points>) => {
        if (newPoints) {
            setPoints({ 
                ...points,
                ... (newPoints as Points),
            });
        } else {
            // 从 API 获取最新数据的逻辑
            const updatedPoints = await getPoints();
            setPoints(updatedPoints);
        }
    }, []);

    useEffect(() => {
        refreshPoints();
    }, [refreshPoints]);

    return (
        <UserPointsContext.Provider value={{ points, loading, error, refreshPoints, initialized }}>
            {children}
        </UserPointsContext.Provider>
    );
};