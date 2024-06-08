import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { getProfile, updateProfile } from '../../api/profile';

interface UserProfile {
    email: string;
    nickname: string;
    avatar_url: string;
    bio: string;
}

const EditProfile: React.FC = () => {
    const [form] = Form.useForm();
    const [profile, setProfile] = useState<UserProfile>({
        email: '',
        nickname: '',
        avatar_url: '',
        bio: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                const data = response.data.data
                setProfile(data);
                form.setFieldsValue(data);
            } catch (error) {
                console.error(error);
                message.error('Failed to edit profile');
            }
        };

        fetchProfile();
    }, [form]);

    const handleSubmit = async (values: UserProfile) => {
        try {
            await updateProfile(values);
            message.success('Profile updated successfully');
        } catch (error) {
            console.error(error);
            message.error('Failed to update profile');
        }
    };

    return (
        <div>
            <h2>Edit Profile</h2>
            <Form form={form} onFinish={handleSubmit}>
                <Form.Item name="nickname" rules={[{ required: true, message: 'Please input your nickname!' }]}>
                    <Input placeholder="Nickname" />
                </Form.Item>
                <Form.Item name="avatar_url" rules={[{ required: true, message: 'Please input your avatar URL!' }]}>
                    <Input placeholder="Avatar URL" />
                </Form.Item>
                <Form.Item name="bio" rules={[{ required: true, message: 'Please input your bio!' }]}>
                    <Input placeholder="Bio" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditProfile;