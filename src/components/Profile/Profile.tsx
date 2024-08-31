// src/components/Profile/Profile.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Button, message, Switch, Select, Layout, Modal, Divider, Card, Avatar, Row, Col, Affix, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { IProfile, ISettingsMemorization, ISettingsAdvance, getProfile, updateProfile, getMemorizationSettings, updateMemorizationSettings, getAdvanceSettings, updateAdvanceSettings } from '../../api/profile';
import { useAuth } from '../../context/AuthContext';
import { PageLayout } from '../Layout/PageLayout';
import { MarkdownField } from "../Common/FormFields";
import TOC from '../Common/TOC';
import CoolPointsDisplay from '../Common/CoolPointsDisplay';
import { useIsMobile } from '../../hooks/useWindowSize';
import { useUserPoints } from '../../context/UserPointsContext';

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
    const { points, loading: pointsLoading, error: pointsError } = useUserPoints();
    const [memorizationSettings, setMemorizationSettings] = useState<ISettingsMemorization | null>(null);
    const [advanceSettings, setAdvanceSettings] = useState<ISettingsAdvance | null>(null);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const auth = useAuth();
    const isMobile = useIsMobile();

    const sections = ['profile-section', 'memorization-section', 'advance-section', 'account-section'];
    const sectionRefs = useRef<SectionRefs>({
        'profile-section': React.createRef<HTMLDivElement>(),
        'memorization-section': React.createRef<HTMLDivElement>(),
        'advance-section': React.createRef<HTMLDivElement>(),
        'account-section': React.createRef<HTMLDivElement>(),
    });

    const fetchWithRetry = async (fetchFunc: () => Promise<any>, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                return await fetchFunc();
            } catch (err) {
                if (i === retries - 1) throw err;
                await new Promise(resolve => setTimeout(resolve, 1000)); // 等��1秒后重试
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [profileData, memSettings, advSettings] = await Promise.all([
                    fetchWithRetry(getProfile),
                    fetchWithRetry(getMemorizationSettings),
                    fetchWithRetry(getAdvanceSettings)
                ]);

                if (profileData) {
                    setProfile(profileData);
                    form.setFieldsValue(profileData);
                }
                if (memSettings) setMemorizationSettings(memSettings);
                if (advSettings) setAdvanceSettings(advSettings);
            } catch (err) {
                console.error('Error fetching data:', err);
                message.error('加载个人资料数据失败。请尝试刷新页面。');
            } finally {
                setIsLoading(false);
            }
        };

        if (auth.isAuthenticated) {
            fetchData();
        }
    }, [auth.isAuthenticated, form]);

    const handleProfileUpdate = async (values: Partial<IProfile>) => {
        try {
            await updateProfile(values);
            message.success('个人资料更新成功');
            const profileData = await getProfile();
            setProfile(profileData);
            // 更新表单字段，确保头像 URL 被正确设置
            form.setFieldsValue(profileData);
        } catch (error) {
            message.error('更新个人资料失败');
        }
    };

    const handleMemorizationSettingsUpdate = async (values: Partial<ISettingsMemorization>) => {
        try {
            await updateMemorizationSettings(values);
            message.success('记忆设置更新成功');
            const settings = await getMemorizationSettings();
            setMemorizationSettings(settings);
        } catch (error) {
            message.error('更新记忆设置失败');
        }
    };

    const handleAdvanceSettingsUpdate = async (values: Partial<ISettingsAdvance>) => {
        try {
            await updateAdvanceSettings(values);
            message.success('高级设置更新成功');
            const settings = await getAdvanceSettings();
            setAdvanceSettings(settings);
        } catch (error) {
            message.error('更新高级设置失败');
        }
    };

    const showLogoutModal = () => {
        setLogoutModalVisible(true);
    };

    const handleLogout = () => {
        auth.logout();
        setLogoutModalVisible(false);
    };

    if (isLoading || pointsLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!profile || !memorizationSettings || !advanceSettings || pointsError) {
        return <div>数据加载失败，请刷新页面重试。</div>;
    }

    const ProfileSection = () => (
        <Card title="个人资料" id="profile-section">
            <Form form={form} onFinish={handleProfileUpdate} layout={isMobile ? 'vertical' : 'horizontal'} labelCol={{ span: isMobile ? 24 : 8 }} wrapperCol={{ span: isMobile ? 24 : 16 }}>
                <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入您的昵称！' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="邮箱" rules={[{ required: false, message: '请输入您的邮箱！' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="avatar_url" label="头像" rules={[{ required: false, message: '请输入您的头像 URL！' }]}>
                    <Input />
                </Form.Item>
                <MarkdownField name="bio" label="个人简介" placeholder="输入您的个人简介" rules={[{ required: false, message: '请输入您的个人简介！' }]}/>
                <Form.Item wrapperCol={{ offset: isMobile ? 0 : 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">保存</Button>
                </Form.Item>
            </Form>
        </Card>
    );

    const MemorizationSection = () => (
        <Card title="记忆设置" id="memorization-section">
            <Form onFinish={handleMemorizationSettingsUpdate} layout={isMobile ? 'vertical' : 'horizontal'} labelCol={{ span: isMobile ? 24 : 8 }} wrapperCol={{ span: isMobile ? 24 : 16 }}>
                <Form.Item name="review_interval_setting" label="复习间隔设置">
                    <Input defaultValue={memorizationSettings.review_interval_setting} />
                </Form.Item>
                <Form.Item name="difficulty_preference" label="难度偏好">
                    <Input type="number" defaultValue={memorizationSettings.difficulty_preference} />
                </Form.Item>
                <Form.Item name="quiz_mode" label="测验模式">
                    <Input defaultValue={memorizationSettings.quiz_mode} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: isMobile ? 0 : 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">保存</Button>
                </Form.Item>
            </Form>
        </Card>
    );

    const AdvanceSection = () => (
        <Card title="高级设置" id="advance-section">
            <Form onFinish={handleAdvanceSettingsUpdate} layout={isMobile ? 'vertical' : 'horizontal'} labelCol={{ span: isMobile ? 24 : 8 }} wrapperCol={{ span: isMobile ? 24 : 16 }}>
                <Form.Item name="theme" label="主题">
                    <Select defaultValue={advanceSettings.theme}>
                        <Option value="light">浅色</Option>
                        <Option value="dark">深色</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="language" label="语言">
                    <Select defaultValue={advanceSettings.language}>
                        <Option value="en">英语</Option>
                        <Option value="zh">中文</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="email_notifications" label="邮件通知" valuePropName="checked">
                    <Switch defaultChecked={advanceSettings.email_notifications} />
                </Form.Item>
                <Form.Item name="push_notifications" label="推送通知" valuePropName="checked">
                    <Switch defaultChecked={advanceSettings.push_notifications} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: isMobile ? 0 : 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">保存</Button>
                </Form.Item>
            </Form>
        </Card>
    );

    const AccountSection = () => (
        <Card title="账号" id="account-section">
            <Button type="primary" danger onClick={showLogoutModal} style={{ marginTop: '16px' }}>
                登出
            </Button>
        </Card>
    );

    return (
        <PageLayout title="个人资料" icon={profile.avatar_url}>
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
                                <Row align="middle" gutter={[16, 16]}>
                                    <Col xs={24} sm={24} md={8}>
                                        <Row align="middle" gutter={16}>
                                            <Col>
                                                <Avatar size={64} src={profile.avatar_url || undefined} icon={!profile.avatar_url && <UserOutlined />} />
                                            </Col>
                                            <Col>
                                                <h2>{profile.nickname}</h2>
                                                <p>{profile.email}</p>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={24} sm={24} md={16}>
                                        <CoolPointsDisplay />
                                    </Col>
                                </Row>
                            </Card>
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
                title="确认登出"
                visible={logoutModalVisible}
                onOk={handleLogout}
                onCancel={() => setLogoutModalVisible(false)}
                okText="登出"
                cancelText="取消"
                okButtonProps={{danger: true}}
            >
                <p>您确定要登出吗？</p>
            </Modal>
        </PageLayout>
    );
};

export default Profile;