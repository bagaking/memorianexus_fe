import React from 'react';
import { Layout, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CDNImage from '../Common/CDNImage';
import './PageLayout.less';

interface PageLayoutProps {
    title: string | React.ReactNode;
    icon: string;
    style?: React.CSSProperties;
    bannerUrl?: string;
    backUrl?: string;
    children: React.ReactNode;
}

const { Header, Content } = Layout;

export const PageLayout: React.FC<PageLayoutProps> = ({ children, title, icon, style, bannerUrl, backUrl }) => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        if (backUrl) {
            navigate(backUrl);
        } else {
            navigate(-1);
        }
    };

    return (
        <Layout className="page-layout-container" style={style}>
            <Header className="page-layout-header" style={{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined }}>
                <div className="header-content">
                    <Button 
                        type="text" 
                        className="back-button" 
                        onClick={handleGoBack}
                        icon={<ArrowLeftOutlined />}
                    />
                    <h1 className="page-title">
                        {icon && <CDNImage src={icon} alt="Logo" className="menu-logo-48" />}
                        {title}
                    </h1>
                </div>
            </Header>
            <Content className="page-layout-content">
                {children}
            </Content>
        </Layout>
    );
};