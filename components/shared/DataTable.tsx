'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { fetchItems, deleteItem } from '@/data/categoriesOrTags';
import DeleteItemButton from './DeleteItemButton';
import EditItemButton from './EditItemButton';
import { Item ,ItemType} from '@/types/types';
import { useAuth } from '@clerk/nextjs';

interface DataTableProps {
  initialItems: {
    items: Item[];
    totalPages: number;
  };
  itemType: ItemType;
}

export default function DataTable({ initialItems, itemType }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { getToken } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [itemType, currentPage],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available');
      return fetchItems(itemType, currentPage, 10, token);
    },
    initialData: initialItems,
  });

  const handleDeleteItem = async (id: number) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available');
      await deleteItem(itemType, id, token);
      refetch();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const renderTableHeaders = () => {
    switch (itemType) {
      case 'infinityColors':
      case 'boxColors':
        return (
          <>
            <TableHead>ID</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Alt Text (EN)</TableHead>
            <TableHead>Alt Text (AR)</TableHead>
            <TableHead>Actions</TableHead>
          </>
        );
      case 'usedFlowers':
      case 'categories':
      case 'tags':
      case 'productTypes':
      case 'sizes':
      default:
        return (
          <>
            <TableHead>ID</TableHead>
            <TableHead>Name (English)</TableHead>
            <TableHead>Name (Arabic)</TableHead>
            <TableHead>Actions</TableHead>
          </>
        );
    }
  };

  const renderTableRow = (item: Item) => {
    switch (itemType) {
      case 'infinityColors':
      case 'boxColors':
        return (
          <>
            <TableCell>{item.id}</TableCell>
            <TableCell>
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
            </TableCell>
            <TableCell>
              {item.image && (
                <img src={item.image.url} alt={item.image.altText_en} className="w-10 h-10 object-cover" />
              )}
            </TableCell>
            <TableCell>{item.image?.altText_en}</TableCell>
            <TableCell>{item.image?.altText_ar}</TableCell>
          </>
        );
      case 'usedFlowers':
      case 'categories':
      case 'tags':
      case 'productTypes':
      case 'sizes':
      default:
        return (
          <>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.name_en}</TableCell>
            <TableCell>{item.name_ar}</TableCell>
          </>
        );
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {renderTableHeaders()}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item: Item) => (
            <TableRow key={item.id}>
              {renderTableRow(item)}
              <TableCell>
                <div className="flex space-x-2">
                  <EditItemButton
                    item={item}
                    itemType={itemType}
                    onUpdate={() => refetch()}
                  />
                  <DeleteItemButton item={item} itemType={itemType} onDelete={handleDeleteItem} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4 space-x-2">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="py-2 px-4 bg-muted rounded">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </>
  );
}