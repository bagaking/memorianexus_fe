import React from 'react';
import { Form, Input, Button, message, Card, Typography, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUserPoints } from '../../context/UserPointsContext';
import './Login.less';

const { Title, Text } = Typography;

const Login: React.FC = () => {
    const authContext = useAuth();
    const { refreshPoints } = useUserPoints();
    const navigate = useNavigate();

    const handleSubmit = async (values: { username: string; password: string }) => {
        try {
            await authContext.login(values.username, values.password);
            await refreshPoints(); // 登录成功后立即刷新点数信息
            message.success('登录成功，欢迎回来！');
            navigate('/'); // 登录成功后跳转到首页或其他页面
        } catch (error) {
            const err = error as any;
            let errorMessage = '登录失败';

            if (err.response) {
                errorMessage = `错误: ${err.response.status}. 信息: ${err.response.data}`;
            } else if (err.request) {
                errorMessage = `网络错误: ${err.message}`;
            } else {
                errorMessage = `请求设置错误: ${err.message}`;
            }

            console.error('登录错误:', errorMessage);
            message.error(errorMessage);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <Title level={2} className="login-title">登录</Title>
                <Form onFinish={handleSubmit} layout="vertical">
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入用户名！' }]}
                    >
                        <Input placeholder="用户名" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入密码！' }]}
                    >
                        <Input.Password placeholder="密码" size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Button type="primary" htmlType="submit" className="login-button" size="large" block>
                                登录
                            </Button>
                            <Text>
                                还没有账号？ <Link to="/register">立即注册</Link>
                            </Text>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;