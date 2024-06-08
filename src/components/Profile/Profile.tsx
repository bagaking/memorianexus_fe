import React, { useEffect, useState } from 'react';
import {Card, Avatar, message} from 'antd';
import { getProfile } from '../../api/profile';

interface UserProfile {
    email: string;
    nickname: string;
    avatar_url: string;
    bio: string;
}

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                const data = response.data.data
                setProfile(data);
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch profile');
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <Card title="Profile">
            <Card.Meta
                avatar={<Avatar src={profile.avatar_url} />}
                title={profile.nickname}
                description={profile.bio}
            />
            <p>Email: {profile.email}</p>
        </Card>
    );
};

export default Profile;