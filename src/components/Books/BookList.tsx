import React, { useEffect, useState } from 'react';
import { Table, message, Button, Card, Modal } from 'antd';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getBooks, deleteBook } from '../../api/books';

interface Book {
    id: string;
    title: string;
    description: string;
    tags?: string[];
}

const BookList: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

    const fetchBooks = async () => {
        try {
            const response = await getBooks();
            const data = response.data.data;
            if (Array.isArray(data)) {
                setBooks(data);
            } else {
                console.log("books resp", response);
                message.error('Invalid books data format');
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch books');
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleExpand = (record: Book) => {
        setExpandedRowKeys(prevKeys =>
            prevKeys.includes(record.id) ? prevKeys.filter(key => key !== record.id) : [record.id]
        );
    };

    const showDeleteModal = (book: Book) => {
        setBookToDelete(book);
        setDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        if (bookToDelete) {
            try {
                await deleteBook(bookToDelete.id);
                message.success('Book deleted successfully');
                fetchBooks();
            } catch (error) {
                console.error(error);
                message.error('Failed to delete book');
            } finally {
                setDeleteModalVisible(false);
                setBookToDelete(null);
            }
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 200,
            render: (text: string) => <ReactMarkdown className="markdown-content">{text}</ReactMarkdown>,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <ReactMarkdown className="markdown-content">{text}</ReactMarkdown>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => <ReactMarkdown className="markdown-content">{text}</ReactMarkdown>,
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: (tags: string[]) => (tags || []).join(', '),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Book) => (
                <>
                    <Button type="link" size="small">
                        <Link to={`/books/${record.id}`}>Details</Link>
                    </Button>
                    <Button type="link" size="small" danger onClick={() => showDeleteModal(record)} style={{ marginLeft: '8px' }}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    const expandedRowRender = (record: Book) => (
        <Card key={record.id} style={{ margin: '-17px', borderRadius: '0px 0px 8px 8px ' }}>
            <h2>{record.title}</h2>
            <ReactMarkdown className="markdown-content">{record.description}</ReactMarkdown>
        </Card>
    );

    return (
        <div>

            <h2>Items</h2>

                <Link to="/books/new">
                    <Button type="primary" style={{marginBottom: '16px', width: "100%"}}>Create New Book</Button>
                </Link>

            <Table
                columns={columns}
                dataSource={books}
                rowKey="id"
                expandedRowKeys={expandedRowKeys}
                onRow={(record) => ({
                    onClick: () => handleExpand(record),
                })}
                expandable={{ expandedRowRender }}
            />
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

export default BookList;