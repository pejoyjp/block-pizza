import React from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import FadeInUpContainer from '../animation/FadeInUpContainer'
import Link from 'next/link'

const Banner = () => {
  return (
    <div className='flex w-full '>

        <div className='md:basis-3/5 flex gap-10 flex-col justify-center items-center '>
            
            <div className='w-4/6'>
                <h2 className='text-3xl font-bold '>
                    Secure a Slice with 
                    <span className='pl-2 font-extrabold'>
                        Blockchain
                    </span>.
                </h2>

                <p className='mt-6'>
                    BlockSlice combines blockchain technology with
                    mouthwatering pizzas, offering a secure way to 
                    satisfy your cravings
                </p>
            </div>
           
            <div className='w-4/6'>
                <Button className={cn('w-24')}>
                    <Link href="/menu">View Menu</Link>
                    
                </Button>
            </div>
           
         
        </div>

        <div className="md:basis-2/5 hidden md:flex justify-center items-center">
            <FadeInUpContainer>
                <Image src='/bg/pizza.png' height={500} width={500} alt=''/>
            </FadeInUpContainer>
            
        </div>
    </div>
  )
}

export default Banner