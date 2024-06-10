import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Form, message, Button, Table } from 'antd';
import { getBookDetail, updateBook, createBook, deleteBook, getBookItems, addBookItems, removeBookItems } from '../../api/books';
import {getItems} from "../../api/items";
import { PageLayout } from '../Layout/PageLayout';
import { TitleField, MarkdownField } from '../Common/FormFields';
import { ActionButtons } from '../Common/ActionButtons';
import { DeleteModal } from '../Common/DeleteModal';
import AppendEntitiesModal from '../Common/AppendEntitiesModal';
import { EditableTagField } from '../Common/EditableTagGroup';
import '../Common/CommonStyles.css';
import './BookDetail.css';

interface Book {
    id?: string;
    title: string;
    description: string;
    tags?: string[];
}

interface Item {
    id: string;
    name: string;
    description: string;
}

const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const [book, setBook] = useState<Book | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [addEntitiesModalVisible, setAddEntitiesModalVisible] = useState(false);

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
                    setBook(data); // 仅用来 Loading
                    form.setFieldsValue(data);

                    // 获取 book items
                    const itemsResponse = await getBookItems({ bookId: id, page: 1, limit: 10 });
                    setItems(itemsResponse.data.data);
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
        values.tags = values.tags || form.getFieldValue("tags") // todo: 这块 form 的机制有点莫名其妙，列表的变更似乎不会引起 dirty

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

    const handleItemDelete = async (itemIds: string[]) => {
        try {
            await removeBookItems({ bookId: id!, itemIds });
            message.success('Items deleted successfully');
            setItems(items.filter(item => !itemIds.includes(item.id)));
        } catch (error) {
            console.error(error);
            message.error('Failed to delete items');
        }
    };

    const handleAddEntitiesSubmit = async (entityIds: string[]) => {
        try {
            await addBookItems({ bookId: id!, itemIds: entityIds });
            message.success('Items added successfully');
            const itemsResponse = await getBookItems({ bookId: id!, page: 1, limit: 10 });
            setItems(itemsResponse.data.data);
            setAddEntitiesModalVisible(false);
        } catch (error) {
            console.error(error);
            message.error('Failed to add items');
        }
    };

    const fetchCandidateEntities = async (page: number) => {
        let req = { bookId: id!, page, limit: 10 }
        console.log("try fetchEntities", req);
        // 假设我们有一个 API 可以分页获取 items
        const response = await getItems(req);
        return {
            entities: response.data.data,
            total: response.data.total,
        };
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Item) => (
                <>
                    <Button type="link" size="small" danger onClick={() => handleItemDelete([record.id])}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    if (!book) {
        return <div>Loading...</div>;
    }

    return (
        <PageLayout title={(id && id !== 'new') ? `Edit Book (id: ${id})` : 'Create Book'} backUrl={`/books?page=${currentPage}&limit=${limit}`} icon="/book_icon.png">
            <Form form={form} onFinish={handleSubmit}>
                <TitleField />
                <MarkdownField name="description" placeholder="my description" rules={[{ required: true, message: 'Please enter the description!' }]} />
                <EditableTagField name="tags" />
                <ActionButtons isEditMode={!!id && id !== 'new'} onDelete={showDeleteModal} />
            </Form>
            <DeleteModal visible={deleteModalVisible} onConfirm={handleDelete} onCancel={() => setDeleteModalVisible(false)} />
            {(id && id !== "new") &&
                <div className="book-items-container">
                    <h2>Items</h2>
                    <Button type="primary" onClick={() => setAddEntitiesModalVisible(true)}>Add Items</Button>
                    <Table
                        className="min-height-table"
                        columns={columns}
                        dataSource={items}
                        rowKey="id"
                    />
                </div>
            }
            <AppendEntitiesModal visible={addEntitiesModalVisible} onCancel={() => setAddEntitiesModalVisible(false)} onSubmit={handleAddEntitiesSubmit}
                fetchEntities={fetchCandidateEntities}
            />

        </PageLayout>
    );
};

export default BookDetail;