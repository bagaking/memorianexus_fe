import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
    return (
        <div>
            <Title>Welcome to the Study Management System</Title>
            <Paragraph>
                This is a platform where you can manage your study materials, books, and review plans.
            </Paragraph>
        </div>
    );
};

export default Home;