import React from 'react';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.less';

const { Title } = Typography;

const Login: React.FC = () => {
    const authContext = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (values: { username: string; password: string }) => {
        try {
            await authContext.login(values.username, values.password);
            message.success('登录成功，欢迎回来！');
            navigate('/'); // 登录成功后跳转到首页或其他页面
        } catch (error) {
            const err = error as any;
            let errorMessage = '登录失败';

            if (err.response) {
                // 服务器有响应但状态码非 2xx 范围
                errorMessage = `错误: ${err.response.status}. 信息: ${err.response.data}`;
            } else if (err.request) {
                // 请求已发送但没有收到响应
                errorMessage = `网络错误: ${err.message}`;
            } else {
                // 在设置请求时出现了错误
                errorMessage = `请求设置错误: ${err.message}`;
            }

            console.error('登录错误:', errorMessage);
            message.error(errorMessage);
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