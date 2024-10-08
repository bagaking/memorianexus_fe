import React, { useEffect, useState } from "react";
import { message, Button, Card, Row, Col, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getItems, deleteItem } from "../../api/items";
import { PageLayout } from "../Layout/PageLayout";
import { DeleteModal } from "../Common/DeleteModal";
import ItemUpload from "./ItemUpload";
import { useIsMobile } from "../../hooks/useWindowSize";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import ItemCard from "../Basic/ItemCard";
import TaggedMarkdown from "../Common/TaggedMarkdown";
import { Item } from "../../api/_dto";
import { ColumnsType } from "antd/es/table";
import { Tag as AntdTag } from "antd";
import { TagOutlined } from "@ant-design/icons";
import ItemTable from "../Basic/ItemTable";
import GradientButton from "../Common/GradientButton";
import InPageControlPanel from "../Common/InPageControlPanel"; // 导入 InPageControlPanel
import PaginationComponent from "../Common/PaginationComponent"; // 导入 PaginationComponent

import "../Common/CommonStyles.less";
import "./ItemList.less";

const { Text } = Typography;

const ItemList: React.FC = () => {
  const isMobile = useIsMobile();
  const [items, setItems] = useState<Item[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>(
    []
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const [currentPage, setCurrentPage] = useState(
    Number(queryParams.get("page")) || 1
  );
  const [limit, setLimit] = useState(Number(queryParams.get("limit")) || 10);

  const fetchItems = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await getItems({ page, limit });
      const data = response.data.data;
      if (Array.isArray(data)) {
        setItems(data);
        if (response.data.total) {
          setTotalItems(response.data.total);
        }
      } else {
        console.log("items resp", response);
        message.error("Invalid items data format");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(currentPage, limit);
  }, [currentPage, limit]);

  const handleExpand = (record: Item) => {
    setExpandedRowKeys((prevKeys) =>
      prevKeys.includes(record.id)
        ? prevKeys.filter((key) => key !== record.id)
        : [record.id]
    );
  };

  const getFirstNonEmptyLine = (content: string) => {
    const lines = content.split("\n").filter((line) => line.trim() !== "");
    return lines.length > 0 ? lines[0] : "";
  };

  const showDeleteModal = (item: Item) => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteItem(itemToDelete.id);
        message.success("Item deleted successfully");
        fetchItems(currentPage, limit);
      } catch (error) {
        console.error(error);
        message.error("Failed to delete item");
      } finally {
        setDeleteModalVisible(false);
        setItemToDelete(null);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    navigate(`/items?page=${page}&limit=${limit}`);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
    navigate(`/items?page=1&limit=${newLimit}`);
  };

  const ItemCardList: React.FC = () => (
    <Row gutter={[8, 8]}>
      {items.map((item) => (
        <Col xs={24} sm={12} md={8} lg={6} xl={4} key={item.id}>
          <ItemCard
            item={item}
            showDeleteModal={showDeleteModal}
            showPreview={true}
            showActions={true}
            indentHeadings={false}
          />
        </Col>
      ))}
    </Row>
  );

  const columns: ColumnsType<Item> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 200,
      responsive: ["md"],
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      responsive: ["sm"],
      render: (text: string) => (
        <TaggedMarkdown mode="tag">{getFirstNonEmptyLine(text)}</TaggedMarkdown>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      responsive: ["md"],
    },
    {
      title: "Action",
      key: "action",
      responsive: ["sm"],
      render: (_: any, record: Item) => (
        <>
          <Button type="link" size="small">
            <Link to={`/items/${record.id}`}>Detail</Link>
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => showDeleteModal(record)}
            style={{ marginLeft: "8px" }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const expandedRowRender = (record: Item) => (
    <Card
      key={record.id}
      style={{
        margin: "-17px",
        borderRadius: "0px 0px 8px 8px",
        boxShadow: "none",
        border: "none",
        padding: "2px 8px", // 减小内边距使内容更紧凑
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {" "}
        {/* 减小间距 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "4px", // 添加一点底部边距
          }}
        >
          <Text
            type="secondary"
            style={{ fontSize: "12px", fontStyle: "italic" }}
          >
            - Content Preview -
          </Text>
          <AntdTag
            icon={<TagOutlined />}
            color="cyan"
            style={{ marginLeft: "8px" }}
          >
            {record.type}
          </AntdTag>
        </div>
        <TaggedMarkdown mode="both">{record.content}</TaggedMarkdown>
      </div>
    </Card>
  );

  const ActionButtons: React.FC = () => (
    <InPageControlPanel>
      <div className="left-items">
        <ItemUpload onUploadSuccess={() => fetchItems(currentPage, limit)}>
          <GradientButton
            icon={<UploadOutlined />}
            startColor="#88d3ce"
            endColor="#6e45e2"
            animation="shine"
            animationDuration="0.8s"
          >
            上传词条本
          </GradientButton>
        </ItemUpload>
        <Link to="/items/new">
          <GradientButton
            icon={<PlusOutlined />}
            startColor="#88d3ce"
            endColor="#6e45e2"
            animation="shine"
            animationDuration="0.8s"
          >
            创建新词条
          </GradientButton>
        </Link>
      </div>
      <div className="right-item">
        <PaginationComponent
          currentPage={currentPage}
          totalItems={totalItems}
          limit={limit}
          pageDataLength={items.length}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>
    </InPageControlPanel>
  );

  return (
    <PageLayout title="Items" icon="/layout/item_icon.png">
      <div style={{ padding: isMobile ? "8px" : "24px" }}>
        <ActionButtons />
        {isMobile ? (
          <ItemCardList />
        ) : (
          <ItemTable
            items={items}
            columns={columns}
            rowKey="id"
            loading={loading}
            expandable={{ expandedRowRender }}
            onRow={(record: Item) => ({
              onClick: () => handleExpand(record),
            })}
          />
        )}
      </div>
      <DeleteModal
        visible={deleteModalVisible}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </PageLayout>
  );
};

export default ItemList;
