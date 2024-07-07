// src/components/Layout/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Layout, Drawer, Button,  } from 'antd';
import { MenuOutlined, HomeOutlined, BookOutlined, FileOutlined, UserOutlined, AppstoreOutlined, UserAddOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useUserPoints } from '../../context/UserPointsContext';
import { getProfile } from "../../api";
import PointsBar from "../Common/PointsBar";
import './Navbar.css';

const { Header } = Layout;

interface UserProfile {
    avatar_url: string;
    nickname: string;
}

const Navbar: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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
            <div className="navbar-left">
                <img src="/favicon.ico" alt="Logo" className="navbar-logo"/>
                <Link to="/" className="navbar-title">MemoriaNexus</Link>
            </div>
            <Button className="menu-button" type="primary" icon={<MenuOutlined/>} onClick={showDrawer}/>
            <Menu theme="dark" mode="horizontal" className="navbar-menu">
                <Menu.Item key="home" icon={<HomeOutlined/>}>
                    <Link to="/">Home</Link>
                </Menu.Item>
                {auth?.isAuthenticated ? (
                    <>
                        <Menu.Item key="books" icon={<BookOutlined/>}>
                            <Link to="/books">Books</Link>
                        </Menu.Item>
                        <Menu.Item key="items" icon={<FileOutlined/>}>
                            <Link to="/items">Items</Link>
                        </Menu.Item>
                        <Menu.Item key="campaigns" icon={<AppstoreOutlined/>}>
                            <Link to="/campaigns">Campaigns</Link>
                        </Menu.Item>
                        {userProfile ? (
                            <Menu.Item key="profile" style={{width: '300px' }}>
                                <Link to="/profile" style={{display: 'flex'}}>
                                    {userProfile.avatar_url ? <img src={userProfile.avatar_url} alt="" /> : <UserOutlined/>}
                                    <span>{userProfile.nickname || "Profile"}</span>
                                    <PointsBar showName={false} style={{width: "100px", height: "48px", color: "#fff"}}></PointsBar>
                                </Link>
                            </Menu.Item>
                        ) : (
                            <Menu.Item key="profile" icon={<UserOutlined/>}>
                                <Link to="/profile">Profile</Link>
                            </Menu.Item>
                        )}
                    </>
                ) : (
                    <>
                        <Menu.Item key="register" icon={<UserAddOutlined/>}>
                            <Link to="/register">Register</Link>
                        </Menu.Item>
                        <Menu.Item key="login" icon={<LoginOutlined/>}>
                            <Link to="/login">Login</Link>
                        </Menu.Item>
                    </>
                )}
            </Menu>
            <Drawer
                title="Menu"
                placement="right"
                onClose={onClose}
                visible={visible}
                className="navbar-drawer"
            >
                <Menu mode="vertical" className="navbar-drawer-menu" onClick={handleMenuClick}>
                    <Menu.Item key="home" icon={<HomeOutlined/>}>
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    {auth?.isAuthenticated ? (
                        <>
                            <Menu.Item key="books" icon={<BookOutlined/>}>
                                <Link to="/books">Books</Link>
                            </Menu.Item>
                            <Menu.Item key="items" icon={<FileOutlined/>}>
                                <Link to="/items">Items</Link>
                            </Menu.Item>
                            <Menu.Item key="campaigns" icon={<AppstoreOutlined/>}>
                                <Link to="/campaigns">Campaigns</Link>
                            </Menu.Item>
                            <Menu.Item key="profile" icon={<UserOutlined/>}>
                                <Link to="/profile">Profile</Link>
                            </Menu.Item>
                        </>
                    ) : (
                        <>
                            <Menu.Item key="register" icon={<UserAddOutlined/>}>
                                <Link to="/register">Register</Link>
                            </Menu.Item>
                            <Menu.Item key="login" icon={<LoginOutlined/>}>
                                <Link to="/login">Login</Link>
                            </Menu.Item>
                        </>
                    )}
                </Menu>
            </Drawer>
        </Header>
    );
};

export default Navbar;