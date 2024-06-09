import React from 'react';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const { Title } = Typography;

const Login: React.FC = () => {
    const authContext = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (values: { username: string; password: string }) => {
        try {
            await authContext.login(values.username, values.password);
            message.success('Welcome back ' + localStorage.getItem('ACCESS_TOKEN')+ ' ' + authContext.isAuthenticated);
            navigate('/'); // 登录成功后跳转到首页或其他页面
        } catch (error) {
            message.error('Failed to login, ' + error);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <Title level={2} className="login-title">Login</Title>
                <Form onFinish={handleSubmit} layout="vertical">
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please enter your username!' }]}
                    >
                        <Input placeholder="Username" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password placeholder="Password" size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-button" size="large" block>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;