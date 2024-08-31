// src/components/Layout/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Layout, Drawer, Button,  } from 'antd';
import { MenuOutlined, HomeOutlined, BookOutlined, FileOutlined, UserOutlined, AppstoreOutlined, UserAddOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { getProfile, IProfile } from "../../api";
import PointsBar from "../Common/PointsBar";
import './Navbar.less';

const { Header } = Layout;

const Navbar: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [userProfile, setUserProfile] = useState<IProfile | null>(null);
    const auth = useAuth();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await getProfile();
                setUserProfile(profile);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        };

        if (auth?.isAuthenticated) {
            fetchUserProfile();
        }
    }, [auth?.isAuthenticated]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = (
        <>
            <Menu.Item key="home" icon={<HomeOutlined/>}>
                <Link to="/">首页</Link>
            </Menu.Item>
            {auth?.isAuthenticated ? (
                <>
                    <Menu.Item key="books" icon={<BookOutlined/>}>
                        <Link to="/books">书籍</Link>
                    </Menu.Item>
                    <Menu.Item key="items" icon={<FileOutlined/>}>
                        <Link to="/items">项目</Link>
                    </Menu.Item>
                    <Menu.Item key="campaigns" icon={<AppstoreOutlined/>}>
                        <Link to="/campaigns">副本</Link>
                    </Menu.Item>
                    {userProfile && (
                        <Menu.Item key="profile" className="navbar-profile-menu-item">
                            <Link to="/profile" className="navbar-profile-link">
                                {userProfile.avatar_url ? (
                                    <img src={userProfile.avatar_url} alt="" className="navbar-profile-avatar" />
                                ) : (
                                    <UserOutlined className="navbar-profile-avatar" />
                                )}
                                <span className="navbar-profile-name">{userProfile.nickname || "Profile"}</span>
                                <PointsBar showName={false} style={{marginLeft: "8px"}} />
                            </Link>
                        </Menu.Item>
                    )}
                </>
            ) : (
                <>
                    <Menu.Item key="register" icon={<UserAddOutlined/>}>
                        <Link to="/register">注册</Link>
                    </Menu.Item>
                    <Menu.Item key="login" icon={<LoginOutlined/>}>
                        <Link to="/login">登录</Link>
                    </Menu.Item>
                </>
            )}
        </>
    );

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const handleMenuClick = () => {
        setVisible(false);
    };

    return (
        <Header className="navbar-header">
            <div className="navbar-content">
                <div className="navbar-left">
                    <img src="/favicon.ico" alt="Logo" className="navbar-logo"/>
                    <Link to="/" className="navbar-title">MemNexus</Link>
                </div>
                {isMobile ? (
                    <div className="navbar-mobile-right">
                        {auth?.isAuthenticated && (
                            <PointsBar showName={false}  style={{marginRight: "16px", color: "#fff"}} />
                        )}
                        <Button className="menu-button" type="primary" icon={<MenuOutlined/>} onClick={showDrawer}/>
                    </div>
                ) : (
                    <Menu theme="dark" mode="horizontal" className="navbar-menu">
                        {menuItems}
                    </Menu>
                )}
            </div>
            <Drawer
                title="菜单"
                placement="right"
                onClose={onClose}
                open={visible}
                className="navbar-drawer"
            >
                <Menu mode="vertical" className="navbar-drawer-menu" onClick={handleMenuClick}>
                    {menuItems}
                </Menu>
            </Drawer>
        </Header>
    );
};

export default Navbar;