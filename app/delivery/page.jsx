"use client"
import React, { useState } from 'react'
import useUserId from '@/hooks/userUserId'
import useUser from '@/hooks/useUser'
import Link from 'next/link'
import { CardTitle, CardDescription, CardHeader,
         CardContent, CardFooter, Card
        } 
from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

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

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast'
import useSWR from 'swr'
// Removed actions imports - using API routes instead
import { useRouter } from 'next/navigation'
const Delivery = () => {
 const {userId} = useUserId()
 const {data:user} = useUser(userId)
 const route = useRouter()




 const { register, handleSubmit, formState: { errors },reset } = useForm();
 const [open,setOpen] = useState(false)

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
    { revalidateOnFocus: false } // 添加这个选项
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
    { revalidateOnFocus: false } // 添加这个选项
);


  if(!userId) return null
  if(user?.user.role !== "rider"){
    route.push('/')
 }

  const onSubmit = async(data) => {
    // You can integrate the API call here to submit the data
    try{
      
       const {orderId} = data

       const Orderdata = {
        orderId,
        riderId:userId,
        status:"deliverying"
       }
       
       const response = await fetch(`/api/orders/${orderId}`, {
         method: 'PUT',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(Orderdata),
       });
       
       const res = await response.json();
       
       if(response.ok && res.success){
        toast.success(res.message)
        mutate()
       }else{
        toast.error(res.message || 'Failed to update order')
       }

    }catch(e){
        toast.error(e.message)
    }

  };

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
          defaultValue='delivery'
    >
       
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Delivery</h1>
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          

            <TabsList className="grid grid-cols-2 bg-transparent">
                <div>
                    <TabsTrigger value="delivery">Start Delivery</TabsTrigger>
                    <TabsTrigger value="order">Deliverying</TabsTrigger>
                    <TabsTrigger value="completedOrders">Completed Orders</TabsTrigger>
                </div>
            </TabsList>

            <div className='grid gap-6'>
                <TabsContent value="delivery" > 
                    <Card x-chunk="dashboard-04-chunk-1">
                        <CardHeader>
                            
                      
                        </CardHeader>
                        <CardContent className="flex justify-between">
                            <form className=" w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>

                             

                                <div className="w-full space-y-2">
                                    <label>
                                        Order Id
                                    </label>
                                    <Input placeholder="orderId" 
                                        {...register("orderId", { required: true })}
                                    
                                    />
                                </div>

                                <DialogFooter>
                                    <Button type="submit">Add</Button>
                                </DialogFooter>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>


                <TabsContent value="order" > 
             
                        <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                            <CardTitle>Deliverying Orders</CardTitle>
                            <CardDescription></CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-3">


                                {data?.orders?.map(order => (
                                    <div key={order.id} className="bg-white shadow-md rounded-lg p-4">
                                        <h2 className="text-lg font-semibold mb-2">Order Details</h2>
                                        <p className="mb-1"><span className="font-semibold">Order ID:</span> {order.id}</p>
                                        <p className="mb-1"><span className="font-semibold">Total Price:</span> ${order.total_price}</p>
                                        <p className="mb-1"><span className="font-semibold">Status:</span> {order.status}</p>
                                        <p className="mb-1"><span className="font-semibold">Created At:</span> {new Date(order.created_at).toLocaleString()}</p>
                                        <p className="mb-1"><span className="font-semibold">Updated At:</span> {new Date(order.updated_at).toLocaleString()}</p>
                                        <p className="mb-1"><span className="font-semibold">Delivery Address:</span> {order.delivery_address}</p>
                                        <p className="mb-1"><span className="font-semibold">Contact Phone:</span> {order.contact_phone}</p>
                                        <p className="mb-1"><span className="font-semibold">Payment Method:</span> {order.payment_method}</p>
                                        <p className="mb-1"><span className="font-semibold">Payment Status:</span> {order.payment_status}</p>
                                        <p className="mb-1"><span className="font-semibold">Special Instructions:</span> {order.special_instructions}</p>
                                        <p className="mb-1"><span className="font-semibold">Rider ID:</span> {order.rider_id}</p>
                                        
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="lg">Done</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure you have completed the delivery?</AlertDialogTitle>
                                             
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>

                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                                                    <AlertDialogAction onClick={()=>handleCompleteOrder(order.id)}>
                                                        Confirm
                                                    </AlertDialogAction>

                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                    </div>
                                ))}
                            </CardContent>

                            <CardFooter className="border-t px-6 py-4">
                                <Dialog open={open}>
                                    <DialogTrigger asChild>
                                        
                                    
                                    </DialogTrigger>

                                    <DialogContent className="sm:max-w-[425px]" setOpen={setOpen}>
                                        <DialogHeader >
                                            <DialogTitle>Upload address and phone number</DialogTitle>
                                            
                                            <DialogDescription>
                                                Make changes to your profile here. Click save when you're done.
                                            </DialogDescription>

                                        </DialogHeader>
                                   
                                    

                                    </DialogContent>
                                </Dialog>
                        
                            </CardFooter>

                            
                        </Card>
                
                </TabsContent>


                <TabsContent value="completedOrders">
                    <Table>
                        <TableCaption>A list of completed orders.</TableCaption>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead className="hidden md:table-cell">User ID</TableHead>
                            <TableHead>Total Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden md:table-cell">Created At</TableHead>
                            <TableHead className="hidden md:table-cell">Updated At</TableHead>
                            <TableHead className="hidden md:table-cell">Delivery Address</TableHead>
                            <TableHead className="hidden md:table-cell">Contact Phone</TableHead>
                            <TableHead>Payment Method</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead className="hidden md:table-cell">Special Instructions</TableHead>
                            <TableHead className="hidden md:table-cell">Rider ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {completedOrders?.completedOrders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell className="hidden md:table-cell">{order.user_id}</TableCell>
                                <TableCell>{order.total_price}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell className="hidden md:table-cell">{order.created_at.toLocaleString()}</TableCell>
                                <TableCell className="hidden md:table-cell">{order.updated_at.toLocaleString()}</TableCell>
                                <TableCell className="hidden md:table-cell">{order.delivery_address}</TableCell>
                                <TableCell className="hidden md:table-cell">{order.contact_phone}</TableCell>
                                <TableCell>{order.payment_method}</TableCell>
                                <TableCell>{order.payment_status}</TableCell>
                                <TableCell className="hidden md:table-cell">{order.special_instructions}</TableCell>
                                <TableCell className="hidden md:table-cell">{order.rider_id}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
            </div>

        

          

    </div>

</Tabs >

 
 

 
  )
}

export default Delivery