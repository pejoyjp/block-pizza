'use client';

import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { registerUser } from '@/actions/auth'; // Moved to API route
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from 'react';
 

const Register = () => {
  const { register, handleSubmit, formState: { errors } ,setError} = useForm()
  const [role,setRole] = useState("user")
  const router = useRouter()

  const onSubmit = async (data) => {
    let avatarUrl = null;
    
    // Check if avatar is uploaded and Cloudinary is configured
    if (data.avatar[0] && process.env.NEXT_PUBLIC_CLOUDINARY_URL && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      const formData = new FormData();
      formData.append("file", data.avatar[0]);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Network response was not ok.');

        const result = await response.json();
        console.log('Avatar URL:', result.url);
        avatarUrl = result.url;
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload avatar. Proceeding without avatar.');
      }
    } else if (data.avatar[0]) {
      toast.warning('Avatar upload is not configured. Proceeding without avatar.');
    }

    // Register user with or without avatar
    const userData = {...data, avatar: avatarUrl, role}
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const res = await response.json();
      
      if(res.success){
        router.push('/auth/login')
        toast.success(res.message)
      }else{
        toast.error(res.message || "Something went wrong...")
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Registration failed");
    }
  };

  return (
    <form className="flex h-screen" onSubmit={handleSubmit(onSubmit)}>
      <div className="md:basis-1/2 hidden md:block bg-[url('/bg/register.png')] bg-contain bg-no-repeat bg-center">
      </div>

      <div className="md:basis-1/2 w-full flex justify-center">
        <div className="space-y-4 flex item-center justify-center flex-col">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-gray-500 dark:text-gray-400">Enter your information to create an account</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input {...register('name', { required: 'Name is required' })} id="name" placeholder="John Doe" />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }})} id="email" placeholder="m@example.com" type="email" />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input {...register('password', { required: 'Password is required' })}  type="password" />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar</Label>
            <Input {...register('avatar')} type='file' accept='image/*' />
          </div>

          <RadioGroup name="role" defaultValue={role} onValueChange={(value)=>setRole(value)} >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="r1" />
              <Label htmlFor="r1">user</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rider" id="r2" />
              <Label htmlFor="r2">rider</Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Checkbox {...register('terms')} required />
            <Label className="ml-2 leading-none" htmlFor="terms">
              I agree to the
              <Link className="underline pl-2" href="#">
                terms and conditions
              </Link>
            </Label>

        
    
          </div>
          <Link className="underline" href="/auth/login">
              Already have an account? Login here
            </Link>
         

          <Button className="w-full" type="submit">Register</Button>

        </div>
      </div>
    </form>
  )
}

export default Register;
