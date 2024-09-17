import React, { useEffect, useState } from "react";
import { message, Row, Col } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getBooks, deleteBook } from "../../api/books";
import { PageLayout } from "../Layout/PageLayout";
import { DeleteModal } from "../Common/DeleteModal";
import PaginationComponent from "../Common/PaginationComponent";
import { Book } from "../../api";
import InPageControlPanel from "../Common/InPageControlPanel"; // 导入 InPageControlPanel
import GradientButton from "../Common/GradientButton"; // 导入 GradientButton
import "../Common/CommonStyles.less";
import "./BookList.less";
import { PlusCircleFilled } from "@ant-design/icons";

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [flippedBooks, setFlippedBooks] = useState<Set<string>>(new Set());
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const [currentPage, setCurrentPage] = useState(
    Number(queryParams.get("page")) || 1
  );
  const [limit, setLimit] = useState(Number(queryParams.get("limit")) || 10);

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
        message.error("Invalid books data format");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage, limit);
  }, [currentPage, limit]);

  const handleBookClick = (bookId: string) => {
    setFlippedBooks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  const showDeleteModal = (book: Book, event: React.MouseEvent) => {
    event.stopPropagation();
    setBookToDelete(book);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (bookToDelete) {
      try {
        await deleteBook(bookToDelete.id);
        message.success("Book deleted successfully");
        fetchBooks(currentPage, limit);
      } catch (error) {
        console.error(error);
        message.error("Failed to delete book");
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

  const renderBookshelf = () => {
    return (
      <div className="bookshelf">
        {books.map((book) => (
          <div key={book.id} className="book-container">
            <div
              className={`book ${flippedBooks.has(book.id) ? "flipped" : ""}`}
              onClick={() => handleBookClick(book.id)}
            >
              <div className="book-front">
                <div className="book-spine">
                  <h3>{book.title}</h3>
                </div>
                <div className="book-cover">
                  <h2>{book.title}</h2>
                </div>
              </div>
              <div className="book-back">
                <ReactMarkdown className="markdown-content">
                  {book.description}
                </ReactMarkdown>
                <div className="book-tags">
                  {book.tags?.map((tag) => (
                    <span key={tag} className="book-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="book-actions">
                  <Link
                    to={`/books/${book.id}`}
                    state={{ page: currentPage, limit }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GradientButton
                      type="primary"
                      size="middle"
                      className="details-button"
                    >
                      详情
                    </GradientButton>
                  </Link>
                  <GradientButton
                    type="primary"
                    danger
                    size="small"
                    onClick={(e) => showDeleteModal(book, e)}
                  >
                    删除
                  </GradientButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <PageLayout title="我的书架" icon="/layout/book_icon.png">
      <div className="bookshelf-page">
        <div className="bookshelf-container">
          <InPageControlPanel>
            <Link to={`/books/new`} state={{ page: currentPage, limit }}>
              <GradientButton
                icon={<PlusCircleFilled />}
                startColor="#88d3ce"
                endColor="#6e45e2"
                animation="shine"
                animationDuration="0.8s"
                type="primary"
              >
                添加新书
              </GradientButton>
            </Link>
            <PaginationComponent
              currentPage={currentPage}
              totalItems={totalBooks}
              pageDataLength={books.length}
              limit={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </InPageControlPanel>
          {renderBookshelf()}
        </div>
        <DeleteModal
          visible={deleteModalVisible}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModalVisible(false)}
        />
      </div>
    </PageLayout>
  );
};

export default BookList;
