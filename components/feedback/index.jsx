"use client"

import { useForm } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Textarea } from "@/components/ui/textarea"
// Removed actions import - using API route instead
import { toast } from 'react-hot-toast';

const Feedback = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async(data) => {
      try{
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const res = await response.json();
        if (!response.ok) {
          throw new Error(res.error || 'Failed to submit feedback');
        }
        if(res.success){
          toast.success(res.message)
        }
      }catch(e){
        toast.error(e.message)
      }
    
      
    };



  return (
    <form className="flex" onSubmit={handleSubmit(onSubmit)}>
      <div className="md:basis-1/2 hidden md:flex justify-center items-center">
        <Image height={400} width={300} alt='' src="/bg/feedback_bg.png"/>
      </div>

      <div className="md:basis-1/2 w-full flex justify-center">
        <div className="space-y-4 flex item-center justify-center flex-col">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Feedback</h1>
            <p className="text-gray-500 dark:text-gray-400">Please provide your feedback below</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input {...register('name', { required: 'Name is required' })} id="name" placeholder="John Doe" type="text" />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }})} id="email" placeholder="m@example.com" type="email" />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea  {...register('feedback', { required: 'Feedback is required' })} id="feedback" placeholder="Your feedback" type="text" />
            {errors.feedback && <p className="text-red-500">{errors.feedback.message}</p>}
          </div>

          <div className="space-y-2">
            <Button className="w-full" type="submit">Submit Feedback</Button>
          </div>

        
        </div>
      </div>
    </form>
  )
}

export default Feedback;