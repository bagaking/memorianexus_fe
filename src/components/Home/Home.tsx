import React from 'react';
import { Typography } from 'antd';
import './Home.css';
import {Link} from "react-router-dom";
import {useAuth} from "../../context/AuthContext"; // 引入样式文件

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
    let auth = useAuth()
    return (
        <div className="home-container">
            <Title className="home-title">Welcome to the Study Management System</Title>
            <Paragraph className="home-desc">
                This is a platform where you can manage your study materials, books, and review plans.
            </Paragraph>

            {auth.isAuthenticated ?
                <Link to="/campaigns">
                    <button className="home-button">Check Campaigns</button>
                </Link> :
                <Link to="/register">
                    <button className="home-button">Get Started</button>
                </Link>
            }


        </div>
    );
};

export default Home;