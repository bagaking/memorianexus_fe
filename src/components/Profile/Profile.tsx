// src/components/Profile/Profile.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Button, message, Switch, Select, Layout, Modal, Divider, Card, Avatar, Row, Col, Affix } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { IProfile, ISettingsMemorization, ISettingsAdvance, getProfile, updateProfile, getPoints, getMemorizationSettings, updateMemorizationSettings, getAdvanceSettings, updateAdvanceSettings } from '../../api/profile';
import { useAuth } from '../../context/AuthContext';
import { PageLayout } from '../Layout/PageLayout';
import { MarkdownField } from "../Common/FormFields";
import { Points } from "../Basic/dto";
import TOC from '../Common/TOC';
import PointsBar from '../Common/PointsBar';
import { useIsMobile } from '../../hooks/useWindowSize';

import './Profile.less';

type SectionKey = 'profile-section' | 'memorization-section' | 'advance-section' | 'account-section';

type SectionRefs = {
    [key in SectionKey]: React.RefObject<HTMLDivElement>;
};

const { Option } = Select;
const { Content } = Layout;

const Profile: React.FC = () => {
    const [form] = Form.useForm();
    const [profile, setProfile] = useState<IProfile | null>(null);
    const [points, setPoints] = useState<Points | null>(null);
    const [memorizationSettings, setMemorizationSettings] = useState<ISettingsMemorization | null>(null);
    const [advanceSettings, setAdvanceSettings] = useState<ISettingsAdvance | null>(null);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const auth = useAuth();
    const isMobile = useIsMobile();

    const sections = ['profile-section', 'memorization-section', 'advance-section', 'account-section'];
    const sectionRefs = useRef<SectionRefs>({
        'profile-section': React.createRef<HTMLDivElement>(),
        'memorization-section': React.createRef<HTMLDivElement>(),
        'advance-section': React.createRef<HTMLDivElement>(),
        'account-section': React.createRef<HTMLDivElement>(),
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            const prof = await getProfile();
            if (!prof) {
                throw new Error('fetch prof failed');
            }
            setProfile(prof);
            form.setFieldsValue(prof);
            return profile
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

        fetchProfileData().then((data) => {
            fetchPointsData();
            fetchMemorizationSettings();
            fetchAdvanceSettings();
        }).catch(err => {
            message.error(`Failed to fetch profile, err=${err}` );
        });

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

    const ProfileSection = () => (
        <Card title="Profile" id="profile-section">
            <Form form={form} onFinish={handleProfileUpdate} layout={isMobile ? 'vertical' : 'horizontal'} labelCol={{ span: isMobile ? 24 : 8 }} wrapperCol={{ span: isMobile ? 24 : 16 }}>
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
                <Form.Item wrapperCol={{ offset: isMobile ? 0 : 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        </Card>
    );

    const MemorizationSection = () => (
        <Card title="Memorization Settings" id="memorization-section">
            <Form onFinish={handleMemorizationSettingsUpdate} layout={isMobile ? 'vertical' : 'horizontal'} labelCol={{ span: isMobile ? 24 : 8 }} wrapperCol={{ span: isMobile ? 24 : 16 }}>
                <Form.Item name="review_interval_setting" label="Review Interval Setting">
                    <Input defaultValue={memorizationSettings.review_interval_setting} />
                </Form.Item>
                <Form.Item name="difficulty_preference" label="Difficulty Preference">
                    <Input type="number" defaultValue={memorizationSettings.difficulty_preference} />
                </Form.Item>
                <Form.Item name="quiz_mode" label="Quiz Mode">
                    <Input defaultValue={memorizationSettings.quiz_mode} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: isMobile ? 0 : 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        </Card>
    );

    const AdvanceSection = () => (
        <Card title="Advance Settings" id="advance-section">
            <Form onFinish={handleAdvanceSettingsUpdate} layout={isMobile ? 'vertical' : 'horizontal'} labelCol={{ span: isMobile ? 24 : 8 }} wrapperCol={{ span: isMobile ? 24 : 16 }}>
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
                <Form.Item wrapperCol={{ offset: isMobile ? 0 : 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        </Card>
    );

    const AccountSection = () => (
        <Card title="Account" id="account-section">
            <Button type="primary" danger onClick={showLogoutModal} style={{ marginTop: '16px' }}>
                Logout
            </Button>
        </Card>
    );

    return (
        <PageLayout title="Profile" icon={profile.avatar_url}>
            <Layout>
                <Content>
                    <Row gutter={24}>
                        {!isMobile && (
                            <Col xs={0} sm={0} md={6} lg={5} xl={4}>
                                <Affix offsetTop={64}>
                                    <TOC sections={sections} />
                                </Affix>
                            </Col>
                        )}
                        <Col xs={24} sm={24} md={18} lg={19} xl={20}>
                            <Card>
                                <Row align="middle" gutter={16}>
                                    <Col>
                                        <Avatar size={64} src={profile.avatar_url} icon={<UserOutlined />} />
                                    </Col>
                                    <Col>
                                        <h2>{profile.nickname}</h2>
                                        <p>{profile.email}</p>
                                    </Col>
                                </Row>
                            </Card>
                            <Divider />
                            <PointsBar />
                            <Divider />
                            <div ref={sectionRefs.current['profile-section']}>
                                <ProfileSection />
                            </div>
                            <Divider />
                            <div ref={sectionRefs.current['memorization-section']}>
                                <MemorizationSection />
                            </div>
                            <Divider />
                            <div ref={sectionRefs.current['advance-section']}>
                                <AdvanceSection />
                            </div>
                            <Divider />
                            <div ref={sectionRefs.current['account-section']}>
                                <AccountSection />
                            </div>
                        </Col>
                    </Row>
                </Content>
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