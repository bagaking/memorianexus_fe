// src/components/Books/BookDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Form, message } from 'antd';
import { getBookDetail, updateBook, createBook, deleteBook } from '../../api/books';
import { PageLayout } from '../Layout/PageLayout';
import {TitleField, MarkdownField} from '../Common/FormFields';
import { ActionButtons } from '../Common/ActionButtons';
import { DeleteModal } from '../Common/DeleteModal';
import EmbedItemList from './EmbedItemList';
import { EditableTagField } from '../Common/EditableTagGroup';
import '../Common/CommonStyles.css';
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
                    console.log("fetch book", data)
                    setBook(data); // 仅用来 Loading
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
        console.log("values", values)
        console.log("values.tags", values.tags)
        values.tags =  values.tags || form.getFieldValue("tags")// todo: 这块 form 的机制有点莫名其妙，列表的变更似乎不会引起 dirty

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
        <PageLayout title={(id && id !== 'new') ? `Edit Book (id: ${id})` : 'Create Book'} backUrl={`/books?page=${currentPage}&limit=${limit}`} icon="/book_icon.png">
            <Form form={form} onFinish={handleSubmit}>
                <TitleField />
                <MarkdownField name="description" required={true} message="Please enter the description!" placeholder="description" form={form} />
                <EditableTagField name="tags" form={form} />
                <ActionButtons isEditMode={!!id && id !== 'new'} onDelete={showDeleteModal} />
            </Form>
            <DeleteModal visible={deleteModalVisible} onConfirm={handleDelete} onCancel={() => setDeleteModalVisible(false)} />
            <div className="book-items-container">
                <h2>Items</h2>
                {id && <EmbedItemList bookId={id} />}
            </div>
        </PageLayout>
    );
};

export default BookDetail;