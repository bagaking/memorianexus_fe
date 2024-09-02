import React from 'react';
import { Layout, Button } from 'antd';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CDNImage from '../Common/CDNImage';
import './PageLayout.less';

interface PageLayoutProps {
    title: string | React.ReactNode;
    icon: string;
    style?: React.CSSProperties;
    bannerUrl?: string;
    backUrl?: string; // 添加 backUrl 属性
    children: React.ReactNode;
}

const { Header, Content } = Layout;
export const PageLayout: React.FC<PageLayoutProps> = ({ children, title, icon, style, bannerUrl, backUrl }) => {
    return (
        <Layout className="page-layout-container" style={style}>
            <Header className="page-layout-header" style={{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined }}>
                {backUrl && (
                    <Link to={backUrl}>
                        <Button type="text" className="back-button">
                            <ArrowLeftOutlined />
                        </Button>
                    </Link>
                )}
                <h1 className="page-title">
                    {icon && <CDNImage src={icon} alt="Logo" className="menu-logo-48" />}
                    {title}
                </h1>
            </Header>
            <Content className="page-layout-content">
                {children}
            </Content>
        </Layout>
    );
};