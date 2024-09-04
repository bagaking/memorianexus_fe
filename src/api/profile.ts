import axios from './axios';
import {Points, Profile, SettingsMemorization, SettingsAdvance} from "./_dto";
 


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
