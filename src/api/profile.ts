// src/api/profile.ts
import axios from 'axios';

interface Profile {
    id: number;
    nickname: string;
    email: string;
    avatar_url: string;
    bio: string;
    created_at: string;
}

interface Points {
    cash: number;
    gem: number;
    vip_score: number;
}

interface SettingsMemorization {
    review_interval_setting: string; // Adjust the type according to your actual settings
    difficulty_preference: number;
    quiz_mode: string;
}

interface SettingsAdvance {
    theme: string;
    language: string;
    email_notifications: boolean;
    push_notifications: boolean;
}


export const getProfile = async (): Promise<Profile> => {
    const response = await axios.get('/profile/me');
    return response.data.data;
};

export const updateProfile = async (profile: Partial<Profile>): Promise<void> => {
    await axios.put('/profile/me', profile);
};

export const getPoints = async (): Promise<Points> => {
    const response = await axios.get('/profile/points');
    return response.data.data;
};

export const getMemorizationSettings = async (): Promise<SettingsMemorization> => {
    const response = await axios.get('/profile/settings/memorization');
    return response.data.data;
};

export const updateMemorizationSettings = async (settings: Partial<SettingsMemorization>): Promise<void> => {
    await axios.put('/profile/settings/memorization', settings);
};

export const getAdvanceSettings = async (): Promise<SettingsAdvance> => {
    const response = await axios.get('/profile/settings/advance');
    return response.data.data;
};

export const updateAdvanceSettings = async (settings: Partial<SettingsAdvance>): Promise<void> => {
    await axios.put('/profile/settings/advance', settings);
};
