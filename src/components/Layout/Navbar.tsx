import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Layout, Drawer, Button } from 'antd';
import { MenuOutlined, HomeOutlined, BookOutlined, FileOutlined, UserOutlined, LogoutOutlined, LoginOutlined, UserAddOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const { Header } = Layout;

const Navbar: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const auth = useAuth();

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
                        <Menu.Item key="profile" icon={<UserOutlined/>}>
                            <Link to="/profile">Profile</Link>
                        </Menu.Item>
                        <Menu.Item key="logout" icon={<LogoutOutlined/>} onClick={() => {
                            auth.logout();
                            handleMenuClick();
                        }}>
                            Logout
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
                            <Menu.Item key="logout" icon={<LogoutOutlined/>} onClick={() => {
                                auth.logout();
                                handleMenuClick();
                            }}>
                                Logout
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