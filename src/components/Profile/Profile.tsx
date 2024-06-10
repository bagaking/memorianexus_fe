// src/components/Profile/Profile.tsx
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Avatar, Switch, Select, Layout, Menu, Modal, Divider, Anchor } from 'antd';
import { IProfile, IPoints, ISettingsMemorization, ISettingsAdvance, getProfile, updateProfile, getPoints, getMemorizationSettings, updateMemorizationSettings, getAdvanceSettings, updateAdvanceSettings } from '../../api/profile';
import { useAuth } from '../../context/AuthContext';
import { PageLayout } from '../Layout/PageLayout';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import './Profile.css';
import { MarkdownField } from "../Common/FormFields";
import gemIcon from '../../assets/icons/gem_icon.png';
import goldIcon from '../../assets/icons/gold_icon.png';
import vipIcon from '../../assets/icons/vip_icon.png';
import Points from "../Common/Points";

const { Option } = Select;
const { Sider, Content } = Layout;
const { Link } = Anchor;

const Profile: React.FC = () => {
    const [form] = Form.useForm();
    const [profile, setProfile] = useState<IProfile | null>(null);
    const [points, setPoints] = useState<IPoints | null>(null);
    const [memorizationSettings, setMemorizationSettings] = useState<ISettingsMemorization | null>(null);
    const [advanceSettings, setAdvanceSettings] = useState<ISettingsAdvance | null>(null);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const auth = useAuth();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profile = await getProfile();
                setProfile(profile);
                form.setFieldsValue(profile);
            } catch (error) {
                message.error('Failed to fetch profile');
            }
        };

        const fetchPointsData = async () => {
            try {
                const pointsData = await getPoints();
                setPoints(pointsData);
            } catch (error) {
                message.error('Failed to fetch points');
            }
        };

        const fetchMemorizationSettings = async () => {
            try {
                const settings = await getMemorizationSettings();
                setMemorizationSettings(settings);
            } catch (error) {
                message.error('Failed to fetch memorization settings');
            }
        };

        const fetchAdvanceSettings = async () => {
            try {
                const settings = await getAdvanceSettings();
                setAdvanceSettings(settings);
            } catch (error) {
                message.error('Failed to fetch advance settings');
            }
        };

        fetchProfileData();
        fetchPointsData();
        fetchMemorizationSettings();
        fetchAdvanceSettings();
    }, [form]);

    const handleProfileUpdate = async (values: Partial<IProfile>) => {
        try {
            await updateProfile(values);
            message.success('Profile updated successfully');
            const profileData = await getProfile();
            setProfile(profileData);
        } catch (error) {
            message.error('Failed to update profile');
        }
    };

    const handleMemorizationSettingsUpdate = async (values: Partial<ISettingsMemorization>) => {
        try {
            await updateMemorizationSettings(values);
            message.success('Memorization settings updated successfully');
            const settings = await getMemorizationSettings();
            setMemorizationSettings(settings);
        } catch (error) {
            message.error('Failed to update memorization settings');
        }
    };

    const handleAdvanceSettingsUpdate = async (values: Partial<ISettingsAdvance>) => {
        try {
            await updateAdvanceSettings(values);
            message.success('Advance settings updated successfully');
            const settings = await getAdvanceSettings();
            setAdvanceSettings(settings);
        } catch (error) {
            message.error('Failed to update advance settings');
        }
    };

    const showLogoutModal = () => {
        setLogoutModalVisible(true);
    };

    const handleLogout = () => {
        auth.logout();
        setLogoutModalVisible(false);
    };

    if (!profile || !points || !memorizationSettings || !advanceSettings) {
        return <div>Loading...</div>;
    }

    return (
        <PageLayout title="Profile" icon={profile.avatar_url}>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider width={200} style={{ height: '100%' }} className="site-layout-background fixed-sider">
                    <Anchor affix={false}>
                        <Link href="#profile-section" title="Profile" />
                        <Link href="#memorization-section" title="Memorization" />
                        <Link href="#advance-section" title="Advance" />
                        <Link href="#account-section" title="Account" />
                    </Anchor>
                </Sider>
                <Layout className="site-layout">
                    <Content className="site-layout-content">
                        <Points cash={points.cash} gem={points.gem} vipScore={points.vip_score}></Points>
                        <Divider />
                        <div id="profile-section" className="profile-section">
                            <Form form={form} onFinish={handleProfileUpdate}>
                                <Form.Item name="nickname" label="Nickname" rules={[{ required: true, message: 'Please enter your nickname!' }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="email" label="Email" rules={[{ required: false, message: 'Please enter your email!' }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="avatar" label="Avatar" rules={[{ required: false, message: 'Please enter your avatar url!' }]}>
                                    <Input />
                                </Form.Item>
                                <MarkdownField name="bio" label="Bio" placeholder="Enter your bio" rules={[{ required: false, message: 'Please enter your bio!' }]}/>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Save</Button>
                                </Form.Item>
                            </Form>
                            <Divider />
                        </div>

                        <div id="memorization-section" className="profile-section">
                            <h3>Memorization Settings</h3>
                            <Form onFinish={handleMemorizationSettingsUpdate}>
                                <Form.Item name="review_interval_setting" label="Review Interval Setting">
                                    <Input defaultValue={memorizationSettings.review_interval_setting} />
                                </Form.Item>
                                <Form.Item name="difficulty_preference" label="Difficulty Preference">
                                    <Input type="number" defaultValue={memorizationSettings.difficulty_preference} />
                                </Form.Item>
                                <Form.Item name="quiz_mode" label="Quiz Mode">
                                    <Input defaultValue={memorizationSettings.quiz_mode} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Save</Button>
                                </Form.Item>
                            </Form>
                            <Divider />
                        </div>

                        <div id="advance-section" className="profile-section">
                            <h3>Advance Settings</h3>
                            <Form onFinish={handleAdvanceSettingsUpdate}>
                                <Form.Item name="theme" label="Theme">
                                    <Select defaultValue={advanceSettings.theme}>
                                        <Option value="light">Light</Option>
                                        <Option value="dark">Dark</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="language" label="Language">
                                    <Select defaultValue={advanceSettings.language}>
                                        <Option value="en">English</Option>
                                        <Option value="zh">Chinese</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="email_notifications" label="Email Notifications" valuePropName="checked">
                                    <Switch defaultChecked={advanceSettings.email_notifications} />
                                </Form.Item>
                                <Form.Item name="push_notifications" label="Push Notifications" valuePropName="checked">
                                    <Switch defaultChecked={advanceSettings.push_notifications} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Save</Button>
                                </Form.Item>
                            </Form>
                            <Divider />
                        </div>

                        <div id="account-section" className="profile-section">
                            <h3>Account</h3>
                            <Button type="primary" danger onClick={showLogoutModal} style={{ marginTop: '16px' }}>
                                Logout
                            </Button>
                            <br />
                        </div>
                    </Content>
                </Layout>
            </Layout>

            <Modal
                title="Confirm Logout"
                visible={logoutModalVisible}
                onOk={handleLogout}
                onCancel={() => setLogoutModalVisible(false)}
                okText="Logout"
                okButtonProps={{danger: true}}
            >
                <p>Are you sure you want to logout?</p>
            </Modal>
        </PageLayout>
    );
};

export default Profile;