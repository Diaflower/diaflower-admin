'use client'
import { Suspense } from 'react';
import { fetchItems } from '@/data/categoriesOrTags';
import DataTable from './DataTable';
import AddItemButton from './AddItemButton';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { ItemType } from '@/types/types';
interface ItemsPageProps {
  itemType: ItemType
}

export default function ItemsPage({ itemType }: ItemsPageProps) {
  const { isLoaded, userId, getToken } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: [itemType, userId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      return fetchItems(itemType, 1, 10, token);
    },
    refetchOnWindowFocus: false,
    enabled: isLoaded && !!userId,
  });

  if (!isLoaded || !userId) {
    return <div>Loading authentication...</div>;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{itemType.charAt(0).toUpperCase() + itemType.slice(1)}</h1>
        <AddItemButton itemType={itemType} />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {isLoading ? (
          <div>Loading...</div>
        ) : data && data.items?.length > 0 ? (
          <DataTable initialItems={data} itemType={itemType} />
        ) : (
          <div className="text-center py-10">
            <p className="text-lg">No {itemType} available. Please create one.</p>
          </div>
        )}
      </Suspense>
    </div>
  );
}