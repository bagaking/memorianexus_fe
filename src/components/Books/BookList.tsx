import React, { useEffect, useState } from 'react';
import { Table, message, Button, Card, Modal, Pagination, InputNumber } from 'antd';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getBooks, deleteBook } from '../../api/books';
import './BookList.css';

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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalBooks, setTotalBooks] = useState(0);
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(10);

    const fetchBooks = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const response = await getBooks({ page, limit });
            const data = response.data.data;
            if (Array.isArray(data)) {
                setBooks(data);
                if (response.data.total) {
                    setTotalBooks(response.data.total);
                } else if (data.length >= response.data.limit){
                    setTotalBooks(currentPage * limit + 1);
                } else {
                    setTotalBooks((currentPage -1) * limit + data.length);
                }
            } else {
                console.log("books resp", response);
                message.error('Invalid books data format');
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch books');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks(currentPage, limit);
    }, [currentPage, limit]);

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
                fetchBooks(currentPage, limit);
            } catch (error) {
                console.error(error);
                message.error('Failed to delete book');
            } finally {
                setDeleteModalVisible(false);
                setBookToDelete(null);
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleLimitChange = (value: number | null) => {
        setLimit(value || 10);
        setCurrentPage(1); // 重置到第一页
    };

    const handleLimitKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleLimitChange(Number((event.target as HTMLInputElement).value));
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
        <Card key={record.id} className="expanded-book-card">
            <h2>{record.title}</h2>
            <ReactMarkdown className="markdown-content">{record.description}</ReactMarkdown>
        </Card>
    );

    return (
        <div className="book-list-container">
            <h2>Books</h2>
            <Link to="/books/new">
                <Button type="primary" className="create-book-button">Create New Book</Button>
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
                pagination={false}
                loading={loading}
                className="book-table"
            />
            <div className="pagination-container">
                <Pagination
                    current={currentPage}
                    total={totalBooks}
                    pageSize={limit}
                    onChange={handlePageChange}
                    className="book-pagination"
                />
                <div className="limit-input-container">
                    <span>Items per page: </span>
                    <InputNumber
                        min={1}
                        max={100}
                        value={limit}
                        // onChange={handleLimitChange}
                        onPressEnter={handleLimitKeyPress}
                        onBlur={(event) => handleLimitChange(Number((event.target as HTMLInputElement).value))}
                    />
                </div>
            </div>
            <Modal
                title="Confirm Deletion"
                visible={deleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setDeleteModalVisible(false)}
                className="delete-modal"
            >
                <p>Are you sure you want to delete this book?</p>
            </Modal>
        </div>
    );
};

export default BookList;