import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, message, Modal } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getBookDetail, updateBook, createBook, deleteBook } from '../../api/books';
import './BookDetail.css';

interface Book {
    id?: string;
    title: string;
    description: string;
    tags?: string[];
}

const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const [book, setBook] = useState<Book | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const state = location.state as { page?: number; limit?: number } | undefined;
    const currentPage = state?.page || 1;
    const limit = state?.limit || 10;

    useEffect(() => {
        const fetchBook = async () => {
            try {
                if (id && id !== 'new') {
                    const response = await getBookDetail(id);
                    const data = response.data.data;
                    // 确保 tags 是一个数组
                    if (typeof data.tags === 'string') {
                        data.tags = data.tags.split(',').map((tag: string) => tag.trim());
                    } else if (!Array.isArray(data.tags)) {
                        data.tags = [];
                    }
                    setBook(data);
                    form.setFieldsValue(data);
                } else {
                    setBook({ title: '', description: '', tags: [] });
                }
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch book details');
            }
        };

        fetchBook();
    }, [id, form]);

    const handleSubmit = async (values: Book) => {
        // 确保 tags 是一个数组
        if (typeof values.tags === 'string') {
            values.tags = (values.tags as string).split(',').map(tag => tag.trim());
        } else if (!Array.isArray(values.tags)) {
            values.tags = [];
        }

        try {
            if (id && id !== 'new') {
                await updateBook(id, values);
                message.success('Book updated successfully');
            } else {
                await createBook(values);
                message.success('Book created successfully');
            }
            navigate(`/books?page=${currentPage}&limit=${limit}`);
        } catch (error) {
            console.error(error);
            message.error(`Failed to ${id && id !== 'new' ? 'update' : 'create'} book`);
        }
    };

    const showDeleteModal = () => {
        setDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            if (id) {
                await deleteBook(id);
                message.success('Book deleted successfully');
                navigate(`/books?page=${currentPage}&limit=${limit}`);
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to delete book');
        } finally {
            setDeleteModalVisible(false);
        }
    };

    if (!book) {
        return <div>Loading...</div>;
    }

    return (
        <div className="book-detail-container">

            <Button type="link" onClick={() => navigate(`/books?page=${currentPage}&limit=${limit}`)} style={{ marginBottom: '16px' }}>
                <ArrowLeftOutlined /> Back
            </Button>
            <div className="book-detail-content">
                <h2>
                    <img src="/book_icon.png" alt="Logo" className="menu-logo-48"/>
                    {(id && id !== 'new') ? (`Edit Book (id: ${id})`) : 'Create Book'}
                </h2>
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item name="title" rules={[{required: true, message: 'Please enter the title!'}]}>
                        <Input placeholder="Title"/>
                    </Form.Item>
                    <Form.Item name="description" rules={[{required: true, message: 'Please enter the description!'}]}>
                        <Input.TextArea placeholder="Description" rows={4}/>
                    </Form.Item>
                    <Form.Item name="tags">
                        <Input placeholder="Tags (comma separated)"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Save</Button>
                        {id && id !== 'new' && (
                            <Button type="primary" danger onClick={showDeleteModal} style={{marginLeft: '8px'}}>
                                Delete
                            </Button>
                        )}
                    </Form.Item>
                </Form>
                <Modal
                    title="Confirm Deletion"
                    visible={deleteModalVisible}
                    onOk={handleDelete}
                    onCancel={() => setDeleteModalVisible(false)}
                >
                    <p>Are you sure you want to delete this book?</p>
                </Modal>
            </div>
        </div>
    );
};

export default BookDetail;