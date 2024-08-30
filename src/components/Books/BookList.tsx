// src/components/Books/BookList.tsx
import React, { useEffect, useState } from 'react';
import { Table, message, Button, Card } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getBooks, deleteBook } from '../../api/books';
import { PageLayout } from '../Layout/PageLayout';
import { DeleteModal } from '../Common/DeleteModal';
import PaginationComponent from '../Common/PaginationComponent';
import {Book, Item} from "../Basic/dto";
import BookCard from './BookCard';
import { useIsMobile } from '../../hooks/useWindowSize';
import '../Common/CommonStyles.css';

const BookList: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
    const [totalBooks, setTotalBooks] = useState(0);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const [currentPage, setCurrentPage] = useState(Number(queryParams.get('page')) || 1);
    const [limit, setLimit] = useState(Number(queryParams.get('limit')) || 10);

    const fetchBooks = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const response = await getBooks({ page, limit });
            const data = response.data;
            const booksData = data.data;
            if (Array.isArray(booksData)) {
                setBooks(booksData);
                if (!!data.total) {
                    setTotalBooks(data.total);
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
        navigate(`/books?page=${page}&limit=${limit}`);
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setCurrentPage(1); // 重置到第一页
        navigate(`/books?page=1&limit=${newLimit}`);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 200,
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
                        <Link to={`/books/${record.id}`} state={{page:currentPage, limit}}>Details</Link>
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

    const isMobile = useIsMobile();

    const renderBookList = () => {
        if (!isMobile) {
            return (
                <Table
                    columns={columns}
                    dataSource={books}
                    rowKey="id"
                    expandedRowKeys={expandedRowKeys}
                    onRow={(record) => ({
                        onClick: () => handleExpand(record),
                    })}
                    expandable={{expandedRowRender}}
                    pagination={false}
                    loading={loading}
                />
            );
        } else {
            return (
                <div>
                    {books.map(book => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onDelete={() => showDeleteModal(book)}
                            currentPage={currentPage}
                            limit={limit}
                        />
                    ))}
                </div>
            );
        }
    };

    return (
        <PageLayout title="Books" icon="/book_icon.png">
            <Link to={`/books/new`} state={{page: currentPage, limit}}>
                <Button type="primary" className="create-new-one-button">Create New Book</Button>
            </Link>

            <div className="table-container">
                {renderBookList()}
            </div>
            <PaginationComponent
                currentPage={currentPage}
                totalItems={totalBooks}
                pageDataLength={books.length}
                limit={limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />
            <DeleteModal visible={deleteModalVisible} onConfirm={handleDelete} onCancel={() => setDeleteModalVisible(false)} />
        </PageLayout>
    );
};

export default BookList;