import React, { useCallback, useMemo } from 'react';
import EmbedItemPack from '../Basic/EmbedItemPack';
import { getBookItems, addBookItems, removeBookItems, getItems } from '../../api';
import { Item } from "../../api/_dto";
import ItemCard from "../Basic/ItemCard";
import CopyableID from '../Common/CopyableID';
import { useIsMobile } from '../../hooks/useWindowSize';

import { ItemID, TypeTag, DifficultyImportance, ItemContent } from '../Basic/ItemComponents';

import "./BookItemList.less";

interface ItemListProps {
    bookId: string;
}

const BookItemList: React.FC<ItemListProps> = ({ bookId }) => {
    const isMobile = useIsMobile();

    const fetchItems = useCallback(async (page: number, limit: number = 10) => {
        const response = await getBookItems({ bookId, page, limit });
        return {
            entities: response.data.data,
            total: response.data.total,
            offset: response.data.offset,
            limit: response.data.limit,
            error: response.data.error,
        };
    }, [bookId]);

    const fetchItemsToAdd = useCallback(async (page: number, limit: number, search = "") => {
        const response = await getItems({ page, limit, search });
        return {
            entities: response.data.data,
            total: response.data.total,
            offset: response.data.offset,
            limit: response.data.limit,
        };
    }, []);

    const addItems = useCallback(async (itemIds: string[]) => {
        await addBookItems({ bookId, itemIds });
    }, [bookId]);

    const deleteItems = useCallback(async (itemIds: string[]) => {
        await removeBookItems({ bookId, itemIds });
    }, [bookId]);

    const itemsColumns = useMemo(() => [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id: string) => (<ItemID id={id}></ItemID>),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => <TypeTag color="cyan">{type}</TypeTag>,
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            render: (text: string, record: Item) => (<ItemContent id={record.id} content={text} />),
        },
        {
            title: 'Difficulty & Importance',
            key: 'difficultyImportance',
            render: (_: any, record: Item) => (
                <DifficultyImportance difficulty={record.difficulty} importance={record.importance} />
            ),
        },
        {
            title: 'Creator ID',
            dataIndex: 'creator_id',
            key: 'creator_id',
            render: (creatorId: string) => (
                <CopyableID 
                    id={creatorId} 
                    maxWidth={80}
                    showBackground={false} 
                    tooltipTitle="点击复制 Creator ID"
                />
            ),
        },
    ], []);

    const renderItem = useCallback((item: Item, selected: boolean, onSelect: () => void) => (
        <ItemCard item={item} onClick={onSelect} selected={selected} showPreview={true} showActions={false} indentHeadings={false} />
    ), [isMobile]);

    // const customTable = useCallback((props: any) => (
    //     <ItemTable
    //         {...props}
    //         items={props.dataSource}
    //         columns={itemsColumns}
    //     />
    // ), [itemsColumns]);

    return (
        <EmbedItemPack<Item>
            fetchItems={fetchItems}
            fetchItemsToAdd={fetchItemsToAdd}
            enableSearchWhenAdd={true}
            addItems={addItems}
            deleteItems={deleteItems}
            itemsColumns={isMobile ? undefined : itemsColumns}
            renderItem={renderItem}
            rowKey="id"
        />
    );
};

export default React.memo(BookItemList);