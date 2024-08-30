import React, { useState } from 'react';
import {Form, Input, Button, message, Card, Typography} from 'antd';
import { register } from '../../api/auth';
import './Login.css';

const { Title } = Typography;

const Register: React.FC = () => {
    const [form] = Form.useForm();

    const handleRegister = async (values: { username: string; email: string; password: string; confirmPassword: string }) => {
        try {
            const response = await register(values);
            console.log(response.data);
            message.success('Registration successful');
            // 处理注册成功逻辑，比如跳转到登录页面
        } catch (error) {
            console.error(error);
            message.error(`Registration failed, err= ${error}`);
            // 处理注册失败逻辑，比如显示错误信息
        }
    };

    return (

        <div className="login-container">
            <Card className="login-card">
                <Title level={2} className="login-title">Register</Title>
                <Form form={form} onFinish={handleRegister}>
                    <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                        <Input placeholder="Username" />
                    </Form.Item>
                    <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item name="confirmPassword" rules={[{ required: true, message: 'Please confirm your password!' }]}>
                        <Input.Password placeholder="Confirm Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Register</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Register;