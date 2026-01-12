"use client"
import React, { useState } from 'react'
import useUserId from '@/hooks/userUserId'
import useUser from '@/hooks/useUser'
import Link from 'next/link'
import { CardTitle, CardDescription, CardHeader,
         CardContent, CardFooter, Card
        } 
from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns'
import { Clock, MapPin, Phone, DollarSign, Package } from "lucide-react"
import { toast } from 'react-hot-toast'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
const Delivery = () => {
 const {userId} = useUserId()
  const {data:user} = useUser(userId)
  const route = useRouter()

  const { data: pendingOrders, mutate: mutatePendingOrders } = useSWR(
    `pending-orders`,
    async () => {
        const response = await fetch('/api/orders/pending');
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch pending orders');
        }
        return result;
    },
    { 
      revalidateOnFocus: true, 
      refreshInterval: 10000,
      dedupingInterval: 5000 
    }
);

 const { data, mutate } = useSWR(
    `${userId}-deliverying-orders`,
    async () => {
        const response = await fetch(`/api/orders/rider/${userId}?status=deliverying`);
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch delivering orders');
        }
        return result;
    },
    { 
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      refreshInterval: 15000
    }
);

const { data:completedOrders, mutate:mutateCompletedOrders } = useSWR(
    `${userId}-completed-orders`,
    async () => {
        const response = await fetch(`/api/orders/rider/${userId}?status=completed`);
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch completed orders');
        }
        return result;
    },
    { 
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      refreshInterval: 30000
    }
);


  if(!userId) return null
  if(user?.user && user.user.role !== "rider"){
    route.push('/')
 }

  const handleTakeOrder = async(orderId)=>{
    try{
        const response = await fetch(`/api/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            riderId:userId,
            status:"deliverying"
          })
        });
        
        const res = await response.json();
        
        if(response.ok && res.success){
            toast.success("Order taken successfully!")
            mutatePendingOrders()
            mutate()
        }else{
            toast.error(res.message || 'Failed to take order')
        }

    }catch(e){
        toast.error(e.message)
    }
  }

  const handleCompleteOrder = async(orderId)=>{
    try{
        
        const response = await fetch(`/api/orders/${orderId}/complete`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const res = await response.json();
        
        if(response.ok && res.success){
            toast.success(res.message)
            mutate()
            mutateCompletedOrders()
        }else{
            toast.error(res.message || 'Failed to complete order')
        }

    }catch(e){
        toast.error(e.message)
    }

  }




  return (
 
    <Tabs className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10"
          defaultValue='pending'
    >
       
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Delivery</h1>
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          

            <TabsList className="grid grid-cols-3 bg-transparent">
                <div>
                    <TabsTrigger value="pending">Pending Orders</TabsTrigger>
                    <TabsTrigger value="order">Deliverying</TabsTrigger>
                    <TabsTrigger value="completedOrders">Completed Orders</TabsTrigger>
                </div>
            </TabsList>

            <div className='grid gap-6'>
                <TabsContent value="pending">
                    <Card x-chunk="dashboard-04-chunk-1">
                        <CardHeader>
                            <CardTitle>Pending Orders</CardTitle>
                            <CardDescription>Available orders waiting for riders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pendingOrders?.orders?.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                    <p>No pending orders available</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingOrders?.orders?.map(order => (
                                        <Card key={order._id || order.id} className="border hover:shadow-md transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-1">Order #{(order.id || order._id || '').slice(-8)}</h3>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Clock className="h-4 w-4" />
                                                            {order.createdAt ? format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm') : 'N/A'}
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                                        Pending
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-500">Delivery Address</p>
                                                            <p className="text-sm font-medium">{order.delivery_address || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-500">Contact Phone</p>
                                                            <p className="text-sm font-medium">{order.contact_phone || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-5 w-5 text-green-600" />
                                                        <span className="text-2xl font-bold text-green-600">
                                                            ${order.total_price || '0'}
                                                        </span>
                                                    </div>
                                                    <Button 
                                                        onClick={() => handleTakeOrder(order._id || order.id)}
                                                        className="bg-green-500 hover:bg-green-600 text-white"
                                                        size="lg"
                                                    >
                                                        Take Order
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>


                <TabsContent value="order" > 
             
                        <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                            <CardTitle>Deliverying Orders</CardTitle>
                            <CardDescription>Orders you are currently delivering</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {data?.orders?.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <p>No deliverying orders</p>
                                    </div>
                                ) : (
                data?.orders?.map(order => (
                    <Card key={order._id || order.id} className="border">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Order #{(order.id || order._id || '').slice(-8)}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="h-4 w-4" />
                                        {order.createdAt ? format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm') : 'N/A'}
                                    </div>
                                </div>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    Deliverying
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500">Delivery Address</p>
                                        <p className="text-sm font-medium">{order.delivery_address || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500">Contact Phone</p>
                                        <p className="text-sm font-medium">{order.contact_phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                    <span className="text-2xl font-bold text-green-600">
                                        ${order.total_price || '0'}
                                    </span>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                                            Complete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure you have completed delivery?</AlertDialogTitle>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={()=>handleCompleteOrder(order._id || order.id)}>
                                                Confirm
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                ))
                                )}
                            </CardContent>
                        </Card>
                
                </TabsContent>


                <TabsContent value="completedOrders">
                    <Card x-chunk="dashboard-04-chunk-1">
                        <CardHeader>
                            <CardTitle>Completed Orders</CardTitle>
                            <CardDescription>Your delivery history</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {completedOrders?.completedOrders?.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                    <p>No completed orders yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {completedOrders?.completedOrders?.map(order => (
                                        <Card key={order._id || order.id} className="border">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-1">Order #{(order.id || order._id || '').slice(-8)}</h3>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Clock className="h-4 w-4" />
                                                            {order.createdAt ? format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm') : 'N/A'}
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                        Completed
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-500">Delivery Address</p>
                                                            <p className="text-sm font-medium">{order.delivery_address || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-500">Contact Phone</p>
                                                            <p className="text-sm font-medium">{order.contact_phone || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-5 w-5 text-green-600" />
                                                        <span className="text-2xl font-bold text-green-600">
                                                            ${order.total_price || '0'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </div>

        

          

    </div>

</Tabs >

 
 

 
  )
}

export default Delivery