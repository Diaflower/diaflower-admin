'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';
import { Item, ItemType, Coupon } from "@/types/types";
import { toast } from "@/components/ui/use-toast";

interface DeleteItemButtonProps {
  item: Item | Coupon;
  itemType: ItemType;
  onDelete: (id: number | string) => void;
}

export default function DeleteItemButton({ item, itemType, onDelete }: DeleteItemButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available');

      await onDelete(item.id);
      setIsOpen(false);
      toast({
        title: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Deleted`,
        description: `The ${itemType} has been successfully deleted.`,
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: `Failed to delete ${itemType}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the {itemType}
            {itemType === 'coupons' 
              ? ` with code "${(item as Coupon).code}".`
              : ` "${(item as Item).name_en || (item as Coupon).name}".`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}