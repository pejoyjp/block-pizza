"use client"
import React, { useState } from 'react'
import useUserId from '@/hooks/userUserId'
import useUser from '@/hooks/useUser'
import { useRouter } from 'next/navigation';

import useSWR from 'swr';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
  } from "@/components/ui/form"

import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from 'react-hot-toast';

const ManagePizza = () => {

    const { data: allPizzas, error,mutate } = useSWR('allPizzas', async () => {
        const response = await fetch('/api/pizzas');
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch pizzas');
        }
        return result.data;
    });
    const { userId } = useUserId()

    const { data: user, isLoading } = useUser(userId)
    const route = useRouter()

    const form = useForm()
    const [addPizzaOpen,setAddPizzaOpen] = useState(false)
    const [editPizzaOpen,setEditPizzaOpen] = useState(false)
    const [currentPizza,setCurrentPizza] = useState()
    const [pizzaId,setPizzaId] = useState(0)

    const handleEditModal = async (pizzaId) => {
        try {
            const response = await fetch(`/api/pizzas/${pizzaId}`);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch pizza');
            }
            
            setCurrentPizza(result.data);
            setEditPizzaOpen(true);
            setPizzaId(pizzaId)
            mutate()
            console.log(JSON.parse(result.data?.sizeandcrust));
        } catch (e) {
            toast.error(e.message);
        }
    }

    
    const onSubmit = async (formData) => {
        try{
            console.log(formData);
            
            const response = await fetch('/api/pizzas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const res = await response.json();
            
            if(response.ok && res.success){
                toast.success(res.message)
                mutate()
            }else{
                toast.error(res.message || 'Failed to add pizza')
            }

            form.reset(); // 提交后重置表单
        }catch(e){
            toast.error(e.message)
        }
    };


 


    const onEditSubmit = async (formData) => {
        try{
            console.log(formData);
            
            const response = await fetch(`/api/pizzas/${pizzaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const res = await response.json();
            
            if(response.ok && res.success){
                toast.success(res.message)
                mutate()
            }else{
                toast.error(res.message || 'Failed to update pizza')
            }

            form.reset(); // 提交后重置表单
        }catch(e){
            toast.error(e.message)
        }
    };

    const handleDelete = async(pizzaId) =>{
        try{
            const response = await fetch(`/api/pizzas/${pizzaId}`, {
                method: 'DELETE',
            });
            
            const res = await response.json();
            
            if(response.ok && res.success){
                toast.success(res.message)
                mutate()
            }else{
                toast.error(res.message || 'Failed to delete pizza')
            }

            form.reset(); 
        }catch(e){
            toast.error(e.message)
        }
    }



    if (error) return <div>Error loading data</div>;
    if (!allPizzas) return <div>Loading...</div>;

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (user?.user?.role !== "admin") {
        route.push('/')
    }

    return (
        <div className="min-h-screen">
            <div className="text-3xl font-semibold my-4 flex justify-between px-3">
                <p>
                    Manage Pizzas
                </p>

                <Button onClick={()=>setAddPizzaOpen(true)}>
                    Add a new pizza
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableHead>
                        <p className=' hidden md:block'>
                            Pizza Id
                        </p>
                    </TableHead>

                    <TableHead>
                        <p>
                            Pizza Name
                        </p>
                    </TableHead>

                    <TableHead>
                        <p className=' hidden md:block'>
                            Pizza Image
                        </p>
                    </TableHead>

                    <TableHead>
                        <p>
                            Pizza Price
                        </p>
                    </TableHead>

                    <TableHead>
                        <p>
                            Actions
                        </p>
                    </TableHead>
                </TableHeader>

                <TableBody>
                    {allPizzas.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                <p className="hidden md:block">
                                    {row.id}
                                </p>
                            </TableCell>
                            <TableCell>
                                <p>
                                    {row.name}
                                </p>
                            </TableCell>
                            <TableCell>
                                <img src={row.img} className='w-20 hidden md:block' alt='' />
                            </TableCell>
                            <TableCell>
                                <p>
                                    {row.price}
                                </p>
                            </TableCell>
                            <TableCell>
                                <div className='flex items-center gap-3'>
                                    <Pencil size={20} className='cursor-pointer hover:text-green-400' 
                                            onClick={()=>handleEditModal(row.id)}
                                    />
                                    <Trash2 size={20} className='cursor-pointer hover:text-red-400'
                                            onClick={()=>handleDelete(row.id)}
                                    />

                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={addPizzaOpen}>
        
                <DialogContent className="sm:max-w-[425px]" setOpen={setAddPizzaOpen}>
                    <DialogHeader>
                        <DialogTitle>Add a new pizza</DialogTitle>
                        
                      
                    </DialogHeader>

                    <Form {...form}>

                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                <div className='space-y-2'>
                                    <span className='text-sm'>Pizza Name</span>
                                    <FormField
                                        name="name"
                                        control={form.control}
                                        render={({ field }) => <Input id="name" {...field} />}
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <span className='text-sm'>Is Veg</span>
                                    
                                    <div className="flex items-center space-x-2">
                                        <FormField
                                            name="veg"
                                            control={form.control}
                                            defaultValue={true} // 设置默认值
                                            render={({ field }) => (
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex gap-5"
                                                    >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                        <RadioGroupItem value={true} />
                                                        </FormControl>
                                                        <FormLabel className="font-normal bg-green-500 px-2 py-1 text-white rounded-md">
                                                            Yes
                                                        </FormLabel>
                                                    </FormItem>

                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                        <RadioGroupItem value={false} />
                                                        </FormControl>
                                                        <FormLabel className="font-normal bg-red-500 px-2 py-1 text-white rounded-md">
                                                            No
                                                        </FormLabel>
                                                    </FormItem>
                                                
                                                    </RadioGroup>
                                                </FormControl>
                                            )}
                                        />
                                    </div>
                                </div>


                            

                                <div className='space-y-2'>
                                    <span className='text-sm'>Price(6 inch)</span>
                                    <FormField
                                        name="price"
                                        control={form.control}
                                        defaultValue=""
                                        render={({ field }) => <Input id="price" {...field} />}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <span className='text-sm'>Description</span>
                                    <FormField
                                        name="description"
                                        control={form.control}
                                        defaultValue=""
                                        render={({ field }) => <Input id="description" {...field} />}
                                    />
                                </div>

                          

                                <div className='space-y-2'>
                                    <span className='text-sm'>Image</span>
                                    <FormField
                                        name="img"
                                        control={form.control}
                                        defaultValue=""
                                        render={({ field }) => <Input id="img" {...field} />}
                                    />
                                </div>

                        

                                <div className='space-y-2'>
                                    <span className='text-sm'>Is Popular</span>
                                    
                                    <div className="flex items-center space-x-2">
                                        <FormField
                                            name="popular"
                                            control={form.control}
                                            defaultValue={true} // 设置默认值
                                            render={({ field }) => (
                                                <FormControl >
                                                    <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex gap-5"
                                                    >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                        <RadioGroupItem value={true} />
                                                        </FormControl>
                                                        <FormLabel className="font-normal bg-green-500 px-2 py-1 text-white rounded-md">
                                                            Yes
                                                        </FormLabel>
                                                    </FormItem>

                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                        <RadioGroupItem value={false} />
                                                        </FormControl>
                                                        <FormLabel className="font-normal bg-red-500 px-2 py-1 text-white rounded-md">
                                                            No
                                                        </FormLabel>
                                                    </FormItem>
                                                
                                                    </RadioGroup>
                                                </FormControl>
                                            )}
                                        />
                                    </div>
                                </div>


                                
                                <div className='flex gap-12'>
                                    <div>
                                        <span className='text-sm'>9 inch</span>
                                        <FormField
                                            name="inch9"
                                            control={form.control}
                                            defaultValue=""
                                            render={({ field }) => <Input id="9inch" {...field} />}
                                        />
                                    </div>

                                    <div>
                                        <span className='text-sm'>12 inch</span>
                                        <FormField
                                            name="inch12"
                                            control={form.control}
                                            defaultValue=""
                                            render={({ field }) => <Input id="12inch" {...field} />}
                                        />
                                    </div>
                                 
                                </div>


    
                            </div>
  
                            <DialogFooter className='mt-2'>
                                <Button type="submit">Subnmit</Button>
                            </DialogFooter>


                        </form>

                      

                    </Form>


                </DialogContent>
            </Dialog>



            <Dialog open={editPizzaOpen}>
        
                <DialogContent className="sm:max-w-[425px]" setOpen={setEditPizzaOpen}>
                    <DialogHeader>
                        <DialogTitle>Edit a pizza</DialogTitle>
                        
                    </DialogHeader>

                    <Form {...form}>

                        <form onSubmit={form.handleSubmit(onEditSubmit)}>
                            <div className="space-y-4">
                                <div className='space-y-2'>
                                    <span className='text-sm'>Pizza Name</span>
                                    <FormField
                                        name="name"
                                        control={form.control}
                                        defaultValue={currentPizza?.name}
                                        render={({ field }) => <Input id="name" {...field} />}
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <span className='text-sm'>Is Veg</span>
                                    
                                    <div className="flex items-center space-x-2">
                                        <FormField
                                            name="veg"
                                            control={form.control}
                                            defaultValue={currentPizza?.veg === 0 ? false : true} 
                                            render={({ field }) => (
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex gap-5"
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value={true} />
                                                            </FormControl>
                                                            <FormLabel className="font-normal bg-green-500 px-2 py-1 text-white rounded-md">
                                                                Yes
                                                            </FormLabel>
                                                        </FormItem>

                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value={false} />
                                                            </FormControl>
                                                            <FormLabel className="font-normal bg-red-500 px-2 py-1 text-white rounded-md">
                                                                No
                                                            </FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                            )}
                                        />
                                    </div>
                                </div>


                            

                                <div className='space-y-2'>
                                    <span className='text-sm'>Price(6 inch)</span>
                                    <FormField
                                        name="price"
                                        control={form.control}
                                        defaultValue={currentPizza?.price}
                                        render={({ field }) => <Input id="price" {...field} />}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <span className='text-sm'>Description</span>
                                    <FormField
                                        name="description"
                                        control={form.control}
                                        defaultValue={currentPizza?.description}
                                        render={({ field }) => <Input id="description" {...field} />}
                                    />
                                </div>

                        

                                <div className='space-y-2'>
                                    <span className='text-sm'>Image</span>
                                    <FormField
                                        name="img"
                                        control={form.control}
                                        defaultValue={currentPizza?.img}
                                        render={({ field }) => <Input id="img" {...field} />}
                                    />
                                </div>

                        

                                <div className='space-y-2'>
                                    <span className='text-sm'>Is Popular</span>
                                    
                                    <div className="flex items-center space-x-2">
                                        <FormField
                                            name="popular"
                                            control={form.control}
                                            defaultValue={currentPizza?.is_popular === 0 ? false : true} 
                                            render={({ field }) => (
                                                <FormControl >
                                                    <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex gap-5"
                                                    >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                        <RadioGroupItem value={true} />
                                                        </FormControl>
                                                        <FormLabel className="font-normal bg-green-500 px-2 py-1 text-white rounded-md">
                                                            Yes
                                                        </FormLabel>
                                                    </FormItem>

                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                        <RadioGroupItem value={false} />
                                                        </FormControl>
                                                        <FormLabel className="font-normal bg-red-500 px-2 py-1 text-white rounded-md">
                                                            No
                                                        </FormLabel>
                                                    </FormItem>
                                                
                                                    </RadioGroup>
                                                </FormControl>
                                            )}
                                        />
                                    </div>
                                </div>


                                
                                <div className='flex gap-12'>
                                    <div>
                                        <span className='text-sm'>9 inch</span>
                                        <FormField
                                            name="inch9"
                                            control={form.control}
                                            defaultValue={currentPizza && currentPizza.sizeandcrust ? JSON.parse(currentPizza.sizeandcrust).L.price : ''}
                                            render={({ field }) => <Input id="9inch" {...field} />}
                                        />
                                    </div>

                                    <div>
                                        <span className='text-sm'>12 inch</span>
                                        <FormField
                                            name="inch12"
                                            control={form.control}
                                            defaultValue={currentPizza && currentPizza.sizeandcrust ? JSON.parse(currentPizza.sizeandcrust).XL.price : ''}
                                            render={({ field }) => <Input id="12inch" {...field} />}
                                        />
                                    </div>
                                
                                </div>



                            </div>

                            <DialogFooter className='mt-2'>
                                <Button type="submit">Subnmit</Button>
                            </DialogFooter>


                        </form>

                    

                    </Form>


                </DialogContent>
            </Dialog>







        </div>
    )
}

export default ManagePizza
