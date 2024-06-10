// src/components/Layout/PageLayout.tsx
import React from 'react';
import { Layout, Button } from 'antd';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import '../Common/CommonStyles.css';

interface PageLayoutProps {
    title: string;
    backUrl?: string;
    icon?: string;
    bannerUrl?: string; // 新增 bannerUrl 属性
    children: React.ReactNode;
}

const { Header, Content } = Layout;
export const PageLayout: React.FC<PageLayoutProps> = ({ title, backUrl, children, icon, bannerUrl }) => {
    return (
        <Layout className="page-layout-container" style={{ padding: '72px 8px 8px 8px' }}>
            <Header className="page-layout-header" style={{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined }}>
                {backUrl && (
                    <Link to={backUrl}>
                        <Button type="link" className="back-button">
                            <ArrowLeftOutlined style={{ fontSize: '16px', color: '#fff' }} />
                        </Button>
                    </Link>
                )}
                <h1 className="page-title">
                    {icon && <img src={icon} alt="Logo" className="menu-logo-48" />}
                    {title}
                </h1>
            </Header>
            <Content className="page-layout-content"> {/* 添加顶部内边距 */}
                {children}
            </Content>
        </Layout>
    );
};