import React from 'react';
import { Form, Input, Button, message, Card, Typography, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import './Login.less';

const { Title, Text } = Typography;

const Register: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleRegister = async (values: { username: string; email: string; password: string; confirmPassword: string }) => {
        try {
            const response = await register(values);
            console.log(response.data);
            message.success('注册成功');
            // 注册成功后跳转到登录页面
            navigate('/login');
        } catch (error) {
            console.error(error);
            message.error(`注册失败，错误：${error}`);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <Title level={2} className="login-title">注册</Title>
                <Form form={form} onFinish={handleRegister}>
                    <Form.Item name="username" rules={[{ required: true, message: '请输入用户名！' }]}>
                        <Input placeholder="用户名" />
                    </Form.Item>
                    <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱！' }]}>
                        <Input placeholder="邮箱" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
                        <Input.Password placeholder="密码" />
                    </Form.Item>
                    <Form.Item name="confirmPassword" rules={[{ required: true, message: '请确认密码！' }]}>
                        <Input.Password placeholder="确认密码" />
                    </Form.Item>
                    <Form.Item>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Button type="primary" htmlType="submit" block>注册</Button>
                            <Text>
                                已有账号？ <Link to="/login">立即登录</Link>
                            </Text>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Register;