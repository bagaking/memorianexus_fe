import React from 'react';
import { Card, Button } from 'antd';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Book } from "../../api/_dto";

interface BookCardProps {
    book: Book;
    onDelete: () => void;
    currentPage: number;
    limit: number;
}

const BookCard: React.FC<BookCardProps> = ({ book, onDelete, currentPage, limit }) => {
    return (
        <Card
            title={<ReactMarkdown className="markdown-content">{book.title}</ReactMarkdown>}
            extra={
                <>
                    <Button type="link" size="small">
                        <Link to={`/books/${book.id}`} state={{page: currentPage, limit}}>详情</Link>
                    </Button>
                    <Button type="link" size="small" danger onClick={onDelete}>
                        删除
                    </Button>
                </>
            }
            style={{ marginBottom: 16 }}
        >
            <ReactMarkdown className="markdown-content">{book.description}</ReactMarkdown>
            <p>标签: {(book.tags || []).join(', ')}</p>
        </Card>
    );
};

export default BookCard;