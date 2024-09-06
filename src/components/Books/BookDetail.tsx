import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Form, message, Tooltip } from 'antd';
import { getBookDetail, updateBook, createBook, deleteBook } from '../../api/books';
import { PageLayout } from '../Layout/PageLayout';
import { TitleField, MarkdownField } from '../Common/FormFields';
import { ActionButtons } from '../Common/ActionButtons';
import { DeleteModal } from '../Common/DeleteModal';
import { EditableTagField } from '../Common/EditableTagGroup';
import CopyableID from '../Common/CopyableID';
import { Book, DEFAULT_BOOK } from "../../api";
import BookItemList from "./BookItemList";

import '../Common/CommonStyles.css';
import './BookDetail.less';

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
                    if (data) {
                        if (typeof data.tags === 'string') {
                            data.tags = (data.tags as string).split(',').map((tag: string) => tag.trim());
                        } else if (!Array.isArray(data.tags)) {
                            data.tags = [];
                        }
                        setBook(data);
                        form.setFieldsValue(data);
                    } else {
                        const emptyBook: Book = DEFAULT_BOOK;
                        setBook(emptyBook);
                        form.setFieldsValue(emptyBook);
                    }
                } else {
                    const emptyBook: Book = DEFAULT_BOOK;
                    setBook(emptyBook);
                    form.resetFields();
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
        <PageLayout title='Book Detail' 
            // backUrl={`/books?page=${currentPage}&limit=${limit}`} 
            icon="/layout/book_icon.png">
            <div className="book-detail-container">
                {(id && id !== 'new') && (
                    <div className="title-container">
                        <h1>{(id && id !== 'new') ? 'Edit Book' : 'Create Book'} </h1>
                        <div className="id-container">
                            <CopyableID id={id} tooltipTitle="Copy Book ID" showBackground={false}/>
                        </div>
                    </div>
                )}
                <Form form={form} onFinish={handleSubmit} initialValues={book}>
                    <Tooltip title="Enter a captivating title for your book!">
                        <div className="pulse-animation">
                            <TitleField />
                        </div>
                    </Tooltip>
                    <Tooltip title="Describe your book in rich markdown format">
                        <div>
                            <MarkdownField 
                                name="description" 
                                placeholder="Embark on a journey through your book's pages..." 
                                rules={[{ required: true, message: 'Please enter the description!' }]} 
                            />
                        </div>
                    </Tooltip>
                    <div className="bottom-container">
                        <div className="tag-container">
                            <Tooltip title="Add tags to categorize your book">
                                <EditableTagField name="tags" />
                            </Tooltip>
                        </div>
                        <div className="action-buttons-container">
                            <ActionButtons isEditMode={!!id && id !== 'new'} onDelete={showDeleteModal} />
                        </div>
                    </div>
                </Form>
            </div>
            <DeleteModal 
                visible={deleteModalVisible} 
                onConfirm={handleDelete} 
                onCancel={() => setDeleteModalVisible(false)} 
            />
            {(id && id !== "new") && (
                <div className="book-items-container">
                    <h2>Book Items</h2>
                    <BookItemList bookId={id} />
                </div>
            )}
        </PageLayout>
    );
};

export default BookDetail;