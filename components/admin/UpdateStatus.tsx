'use client';

import { useState } from 'react';
import { updateOrderStatus } from '@/lib/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface UpdateStatusProps {
  orderId: string;
  currentStatus: string;
}

const statuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export function UpdateStatus({ orderId, currentStatus }: UpdateStatusProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleStatusChange(newStatus: string) {
    if (newStatus === currentStatus) return;
    
    setIsLoading(true);
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error(result.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Select
      disabled={isLoading}
      defaultValue={currentStatus}
      onValueChange={handleStatusChange}
    >
      <SelectTrigger className="w-[140px] h-8 text-xs">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status} value={status} className="text-xs">
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
