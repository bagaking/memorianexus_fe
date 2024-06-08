import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { AuthContext } from '../../context/AuthContext';

const Navbar: React.FC = () => {
    const auth = useContext(AuthContext);

    return (
        <Menu mode="horizontal">
            <Menu.Item key="home">
                <Link to="/">Home</Link>
            </Menu.Item>
            {auth?.isAuthenticated ? (
                <>
                    <Menu.Item key="books">
                        <Link to="/books">Books</Link>
                    </Menu.Item>
                    <Menu.Item key="items">
                        <Link to="/items">Items</Link>
                    </Menu.Item>
                    <Menu.Item key="dungeons">
                        <Link to="/dungeons">Dungeons</Link>
                    </Menu.Item>
                    <Menu.Item key="profile">
                        <Link to="/profile">Profile</Link>
                    </Menu.Item>
                    <Menu.Item key="logout" onClick={auth.logout}>
                        Logout
                    </Menu.Item>
                </>
            ) : (
                <>
                    <Menu.Item key="register">
                        <Link to="/register">Register</Link>
                    </Menu.Item>
                    <Menu.Item key="login">
                        <Link to="/login">Login</Link>
                    </Menu.Item>
                </>
            )}
        </Menu>
    );
};

export default Navbar;