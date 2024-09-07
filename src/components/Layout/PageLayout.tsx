import React, { useEffect, useState, ReactNode } from 'react';
import { Layout, Button, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CDNImage from '../Common/CDNImage';
import './PageLayout.less';

const { Content } = Layout;

interface SubMenuItem {
  key: string;
  label: string;
  path: string;
}

interface SubMenu {
  selectedKey: string;
  items: SubMenuItem[];
}

interface PageLayoutProps {
  children: ReactNode;
  title: string | ReactNode; // 将 title 类型改为 ReactNode
  icon?: string;
  style?: React.CSSProperties;
  bannerUrl?: string;
  backUrl?: string;
  subMenu?: SubMenu;
  enableShrink?: boolean; // 新增控制是否启用缩小效果的 prop
  fullWidthContent?: boolean; // 新增控制内容是否全宽的 prop
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
    children, 
    title, 
    icon, 
    style, 
    bannerUrl, 
    backUrl,
    subMenu,
    enableShrink = false, // 默认启用缩小效果
    fullWidthContent = false // 默认不全宽
}) => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (!enableShrink) return; // 如果不启用缩小效果，直接返回

        const handleScroll = () => {
            const isScrolled = window.scrollY > 30; // 降低滚动触发阈值
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled, enableShrink]);

    const headerClassName = `page-layout-header ${scrolled && enableShrink ? 'scrolled' : ''}`;
    const headerContentClassName = `header-content ${scrolled && enableShrink ? 'scrolled' : ''}`;
    const contentClassName = `page-layout-content ${fullWidthContent ? 'full-width' : ''}`;

    const handleBack = () => {
        if (backUrl) {
            navigate(backUrl);
        } else {
            navigate(-1); // 默认行为：返回上一页
        }
    };

    return (
        <Layout className="page-layout-container" style={style}>
            <div className={headerClassName} style={{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined }}>
                <div className={headerContentClassName}>
                    <Button
                        className="back-button"
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBack}
                    />
                    <h1 className="page-title">
                        {icon && <CDNImage className="menu-logo-48" src={icon} />}
                        {title}
                    </h1>
                </div>
                {subMenu && (
                    <div className="sub-menu">
                        <Menu mode="horizontal" selectedKeys={[subMenu.selectedKey]}>
                            {subMenu.items.map((item: SubMenuItem) => (
                                <Menu.Item key={item.key} onClick={() => navigate(item.path)}>
                                    {item.label}
                                </Menu.Item>
                            ))}
                        </Menu>
                    </div>
                )}
            </div>
            <Content className={contentClassName}>
                {fullWidthContent ? children : (
                    <div className="page-layout-inner">
                        {children}
                    </div>
                )}
            </Content>
        </Layout>
    );
};

export default PageLayout;