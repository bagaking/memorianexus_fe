import axios from './axios';
import {Points} from "../components/Basic/dto";

export interface IProfile {
    id: string;
    nickname: string;
    email: string;
    avatar_url: string | null | undefined;
    bio: string;
    created_at: string;
}

export interface ISettingsMemorization {
    review_interval_setting: string; // Adjust the type according to your actual settings
    difficulty_preference: number;
    quiz_mode: string;
}

export interface ISettingsAdvance {
    theme: string;
    language: string;
    email_notifications: boolean;
    push_notifications: boolean;
}


export const getProfile = async (): Promise<IProfile> => {
    const response = await axios.get('/profile/me');
    return response.data.data;
};

export const updateProfile = async (profile: Partial<IProfile>): Promise<void> => {
    await axios.put('/profile/me', profile);
};

export const getPoints = async (): Promise<Points> => {
    const response = await axios.get('/profile/points');
    return response.data.data;
};

export const getMemorizationSettings = async (): Promise<ISettingsMemorization> => {
    const response = await axios.get('/profile/settings/memorization');
    return response.data.data;
};

export const updateMemorizationSettings = async (settings: Partial<ISettingsMemorization>): Promise<void> => {
    await axios.put('/profile/settings/memorization', settings);
};

export const getAdvanceSettings = async (): Promise<ISettingsAdvance> => {
    const response = await axios.get('/profile/settings/advance');
    return response.data.data;
};

export const updateAdvanceSettings = async (settings: Partial<ISettingsAdvance>): Promise<void> => {
    await axios.put('/profile/settings/advance', settings);
};
