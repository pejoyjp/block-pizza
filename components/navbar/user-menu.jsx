"use client"
import {
    LogOut,
    ShoppingBag,
    User,
    Truck,
    Pizza,
    MessageCircleQuestion 
  } from "lucide-react"

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import useUser from "@/hooks/useUser"
import useUserId from "@/hooks/userUserId"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BarChart3 } from "lucide-react"


  
const UserMenu =() => {

  
   const {userId, logout} = useUserId()
   const {data} = useUser(userId)
   

   const handleLogout = async ()=>{
    try {
      await logout();
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.clear();
      window.location.reload();
    }
   }

    return (
      <>
        {
          userId ? <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Avatar>
                          <AvatarImage src={data?.user.avatar_url} />
                          <AvatarFallback>{data?.user.username}</AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="w-56 mr-10">
                        <DropdownMenuLabel>{data?.user.username}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>

                        <Link href='/profile'>
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            Profile
                    
                          </DropdownMenuItem>
                        </Link>

                        <Link href='/order'>
                          <DropdownMenuItem>
                            <ShoppingBag  className="mr-2 h-4 w-4" />
                            <span>Order</span>
                          </DropdownMenuItem>
                        </Link>

                        {
                          data?.user.role === "rider" &&  

                          <>

                            <Link href='/delivery'>
                              <DropdownMenuItem>
                                <Truck className="mr-2 h-4 w-4" />
                                <span>Delivery</span>
                              </DropdownMenuItem>
                            </Link>
                          </>
                      

                        }

                        {
                          data?.user.role === "admin" && 
                          <>
                            <Link href='/manage_pizza'>
                              <DropdownMenuItem>
                                <Pizza  className="mr-2 h-4 w-4" />
                                <span>Manage Pizza</span>
                              </DropdownMenuItem>
                            </Link>

                            <Link href='/chart'>
                              <DropdownMenuItem>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                <span>Analysis</span>
                              </DropdownMenuItem>
                            </Link>

                            <Link href='/feedback'>
                              <DropdownMenuItem>
                                <MessageCircleQuestion className="mr-2 h-4 w-4" />
                                <span>Feedback</span>
                              </DropdownMenuItem>
                            </Link>
                          </>
                        

                        }

                       
                          
                        </DropdownMenuGroup>
                
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut 
                                  className="mr-2 h-4 w-4" 
                          />
                          <span>Log out</span>
                        </DropdownMenuItem>
                        
                      </DropdownMenuContent>
                  </DropdownMenu> :

            <Link href='/auth/login'
                  className="border py-2 px-4 rounded-md"
            >
              Login
            </Link>
        }
        
      </>
      

     
    )
  }
  
export default UserMenu