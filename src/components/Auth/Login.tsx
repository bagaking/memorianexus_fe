import React, { useContext } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const handleLogin = async (values: { username: string; password: string }) => {
        try {
            await login(values);
            message.success('Welcome back!');
            auth?.login();
            navigate('/'); // 跳转到主页
        } catch (error) {
            console.error(error);
            message.error('Failed to log in');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <Form onFinish={handleLogin}>
                <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                    <Input placeholder="Username" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Login</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;