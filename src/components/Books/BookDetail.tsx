import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Modal } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getBookDetail, updateBook, createBook, deleteBook } from '../../api/books';

interface Book {
    id?: string;
    title: string;
    description: string;
    tags?: string[];
}

const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [book, setBook] = useState<Book | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                if (id && id !== "new") {
                    const response = await getBookDetail(id);
                    const data = response.data.data;
                    setBook(data);
                    form.setFieldsValue(data);
                } else {
                    setBook({ title: '', description: '' });
                }
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch book details');
            }
        };

        fetchBook();
    }, [id, form]);

    const handleSubmit = async (values: Book) => {
        try {
            if (id && id !== "new") {
                await updateBook(id, values);
                message.success('Book updated successfully');
            } else {
                await createBook(values);
                message.success('Book created successfully');
            }
            navigate('/books');
        } catch (error) {
            console.error(error);
            message.error(`Failed to ${id && id !== "new" ? 'update' : 'create'} book`);
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
                navigate('/books');
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
        <div>
            <Button type="link" onClick={() => navigate('/books')} style={{ marginBottom: '16px' }}>
                <ArrowLeftOutlined /> Back
            </Button>
            <h2>{(id && id !== 'new') ? (`Edit Book (id: ${id})` ) : 'Create Book'}</h2>
            <Form form={form} onFinish={handleSubmit}>
                <Form.Item name="title" rules={[{ required: true, message: 'Please enter the title!' }]}>
                    <Input placeholder="Title" />
                </Form.Item>
                <Form.Item name="description" rules={[{ required: true, message: 'Please enter the description!' }]}>
                    <Input.TextArea placeholder="Description" rows={4} />
                </Form.Item>
                <Form.Item name="tags">
                    <Input placeholder="Tags (comma separated)" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Save</Button>
                    {id && id !== 'new' && (
                        <Button type="primary" danger onClick={showDeleteModal} style={{ marginLeft: '8px' }}>
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
    );
};

export default BookDetail;