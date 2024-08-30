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

            let ee = (error as any)
            let eeMessage = ee.message || `${error}`;
            if (ee.response) {
                // 服务器有响应但状态码非 2xx 范围
                eeMessage = `Error: ${ee.response.status}. Message: ${ee.response.data}`;
            } else if (ee.request) {
                // 请求已发送但没有收到响应
                eeMessage = `Network Error: ${ee.message}. Request details: ${ee.request}`;
            } else {
                // 在设置请求时出现了错误
                eeMessage = `Request Setup Error: ${ee.message}`;
            }

            console.error(error);
            message.error(`Login failed, err= ${eeMessage}`);
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