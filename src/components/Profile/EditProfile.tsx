import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Row, Col, Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getProfile, Profile as IProfile, updateProfile } from '../../api';
import { useIsMobile } from '../../hooks/useWindowSize';

interface UserProfile {
    // ... (保持不变)
}

const EditProfile: React.FC = () => {
    const [form] = Form.useForm();
    const [profile, setProfile] = useState<IProfile>({
        id: '',
        email: '',
        nickname: '',
        avatar_url: '',
        bio: '',
        created_at: '',
    });
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getProfile();
                setProfile(profile);
                form.setFieldsValue(profile);
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch profile');
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
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col xs={24} sm={20} md={16} lg={12} xl={8}>
                <Card 
                    title={<h2 style={{ textAlign: 'center' }}>Edit Profile</h2>}
                    extra={
                        <Avatar 
                            size={64} 
                            src={profile.avatar_url} 
                            icon={<UserOutlined />}
                        />
                    }
                >
                    <Form 
                        form={form} 
                        onFinish={handleSubmit}
                        layout={isMobile ? 'vertical' : 'horizontal'}
                        labelCol={{ span: isMobile ? 24 : 8 }}
                        wrapperCol={{ span: isMobile ? 24 : 16 }}
                    >
                        <Form.Item 
                            name="nickname" 
                            label="Nickname"
                            rules={[{ required: true, message: 'Please input your nickname!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item 
                            name="avatar_url" 
                            label="Avatar URL"
                            rules={[{ required: true, message: 'Please input your avatar URL!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item 
                            name="bio" 
                            label="Bio"
                            rules={[{ required: true, message: 'Please input your bio!' }]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: isMobile ? 0 : 8, span: 16 }}>
                            <Button type="primary" htmlType="submit" block={isMobile}>
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default EditProfile;