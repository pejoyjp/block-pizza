"use client"
import React, { useState } from 'react'
import useUserId from '@/hooks/userUserId'
import useUser from '@/hooks/useUser'
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
import { Label } from "@/components/ui/label"
import { useForm } from 'react-hook-form';
// Removed actions imports - using API routes instead
import { toast } from 'react-hot-toast'
import useSWR from 'swr'

const Profile = () => {
 const {userId} = useUserId()


 const {data} = useUser(userId)
 const { register, handleSubmit, formState: { errors },reset } = useForm();
 const [open,setOpen] = useState(false)
 const { data: contacts, mutate } = useSWR(
    userId ? `${userId}contact` : null,
    async () => {
        if (!userId) return null;
        const response = await fetch(`/api/users/${userId}/contacts`);
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch contacts');
        }
        return result;
    },
    { revalidateOnFocus: false } // 添加这个选项
);

  if(!userId) return null

  const onSubmit = async(data) => {
    // You can integrate the API call here to submit the data
    try{
        console.log(data);
        const response = await fetch(`/api/users/${userId}/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to upload contact');
        }
        toast.success("Uploaded successfully")
        setOpen(false)
        mutate()
        reset()

    }catch(e){
        toast.error(e.message)
    }

  };

  const handleDelete = async(userId,contactId)=>{
    try{
        console.log(userId,contactId);
        
        const response = await fetch(`/api/users/${userId}/contacts/${contactId}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to delete contact');
        }
        toast.success("Deleted successfully")
     
        mutate()

    }catch(e){
        toast.error(e.message)
    }

  }




  return (
 
    <Tabs className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10"
          defaultValue='user'
    >
       
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Profile</h1>
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          

            <TabsList className="grid grid-cols-2 bg-transparent">
                <div>
                    <TabsTrigger value="user">User</TabsTrigger>
                    <TabsTrigger value="address">Contact</TabsTrigger>
                </div>
            </TabsList>

            <div className='grid gap-6'>
                <TabsContent value="user" > 
                    <Card x-chunk="dashboard-04-chunk-1">
                        <CardHeader>
                            
                      
                        </CardHeader>
                        <CardContent className="flex justify-between">
                            <div>
                                <img src={data?.user.avatar_url} alt=''
                                        className='h-52 w-52'
                                />
                                <p className=' text-2xl font-bold text-center'>
                                    {data?.user.username}
                                </p>
                            </div>
                          
                            <div className=' space-y-3'>
                               <div>
                                     Create at: 
                                    <p className=' font-bold'>
                                        {data?.user.createdAt ? new Date(data.user.createdAt).toLocaleString() : 'N/A'}
                                    </p>

                               </div>
                               <div>
                                Email: 
                                    <p className=' font-bold'>
                                        {data?.user.email}
                                    </p>
                               </div>
                               
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>


                <TabsContent value="address" > 
             
                        <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                            <CardTitle>Contact</CardTitle>
                            <CardDescription>Used to identify your store in the marketplace.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                    
                                {
                                    contacts?.data.map((contact)=>(
                                        <div    key={contact.id}
                                                className='border p-4 space-y-3 rounded-md'>
                                            <p>
                                               address: {contact.address}
                                            </p>

                                            <p>
                                               phone number: {contact.phone_number}
                                            </p>

                                            <Button variant="destructive"
                                                    onClick={()=>handleDelete(userId,contact.id)}

                                            
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    ))
                                }
                              
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Dialog open={open}>
                                    <DialogTrigger asChild>
                                        
                                        <Button onClick={()=>setOpen(true)}
                                                variant="outline">
                                            Add a new address
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="sm:max-w-[425px]" setOpen={setOpen}>
                                        <DialogHeader >
                                            <DialogTitle>Upload address and phone number</DialogTitle>
                                            
                                            <DialogDescription>
                                                Make changes to your profile here. Click save when you're done.
                                            </DialogDescription>

                                        </DialogHeader>
                                   
                                        <form className=" w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>

                                            <div className="w-full space-y-2">
                                                <label>
                                                    Address
                                                </label>
                                                <Input placeholder="Address" 
                                                {...register("address", { required: true })}
                                                        
                                                />

                                            </div>

                                            <div className="w-full space-y-2">
                                                <label>
                                                    Phone Number
                                                </label>
                                                <Input placeholder="Phone Number" 
                                                    {...register("phoneNumber", { required: true })}
                                                
                                                />
                                            </div>
                                        
                                            <DialogFooter>
                                                <Button type="submit">Confirm</Button>
                                            </DialogFooter>
                                        </form>

                                    </DialogContent>
                                </Dialog>
                        
                            </CardFooter>

                            
                        </Card>
                
                </TabsContent>
            </div>

        

          

    </div>

</Tabs >

 
 

 
  )
}

export default Profile