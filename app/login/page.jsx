'use client';

// 导入必要的组件和钩子
import { useForm } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useUserId from '@/hooks/userUserId';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter()
  const {setUserId} = useUserId()
  

  const onSubmit = async(data) => {
    try{
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        const res = await response.json();
        
        if(res.success){
            setUserId(res.userId)
            toast.success(res.message)
            router.push('/')
        
        }else{
            toast.error(res.message)
        } 
        
    }catch(e){
        toast.error("Login failed")
    }
  };

  return (
    <form className="flex h-screen" onSubmit={handleSubmit(onSubmit)}>
     
      <div className="md:basis-1/2 hidden md:block bg-[url('/bg/login.png')] bg-contain bg-no-repeat bg-center">
      </div>

      <div className="md:basis-1/2 w-full flex justify-center">
        <div className="space-y-4 flex item-center justify-center flex-col">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-gray-500 dark:text-gray-400">Please enter your credentials to login</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }})} id="email" placeholder="m@example.com" type="email" />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input {...register('password', { required: 'Password is required' })} id="password" type="password" />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Button className="w-full" type="submit">Login</Button>
          </div>

          <div className="text-center">
            <Link className="underline" href="/auth/register">
              Don't have an account? Register here
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Login;