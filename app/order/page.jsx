"use client"
import React from 'react';
import useSWR from 'swr';
import useUserId from '@/hooks/userUserId';

import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Order = () => {
  const { userId } = useUserId();
  const route = useRouter();
  const { data, isLoading } = useSWR(`Order${userId}`, async () => {
    const response = await fetch(`/api/orders/user/${userId}`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch orders');
    }
    return result;
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  // 按照最新时间排序订单
  const sortedOrders = data?.orders?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <div className='min-h-screen'>
      <Table>
        <TableHeader>
          <TableHead>Status</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Delivery Method</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Total Price</TableHead>
          <TableHead>Time</TableHead>
        </TableHeader>
        <TableBody>
          {sortedOrders?.map((order) => (
            <TableRow
              key={order.id}
              onClick={() => route.push(`/order/${order.id}`)}
              className="cursor-pointer"
            >
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.payment_method}</TableCell>
              <TableCell>{order.delivery_method}</TableCell>
              <TableCell>{order.delivery_address}</TableCell>
              <TableCell>${order.total_price}</TableCell>
              <TableCell>{format(new Date(order.updatedAt), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Order;
