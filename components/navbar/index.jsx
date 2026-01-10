"use client"
import React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import UserMenu from "./user-menu";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react";

import {Menu} from 'lucide-react'


const Navbar = ()=> {
  const pathname = usePathname()
  const [open, setOpen] = useState(false);
  if(pathname === '/auth/login' || pathname === '/auth/register') return null

  return (
    <>
      <div className="md:flex hidden items-center 
                      justify-between px-6 py-3"
                      >
          <NavigationMenu>

              <NavigationMenuList className={cn(
                  "flex flex-col md:flex-row w-full justify-between ",
              )}>

                  <NavigationMenuItem>
                  <Link href="/menu" legacyBehavior passHref>
                      <NavigationMenuLink >
                      <Image src="/logo.png" height={50} width={160} alt=""/>
                      </NavigationMenuLink>
                  </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Home
                      </NavigationMenuLink>
                  </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                  <Link href="/menu" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Menu
                      </NavigationMenuLink>
                  </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                  <Link href="/chefs" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Chefs
                      </NavigationMenuLink>
                  </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                  <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
                  <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 w-[300px] md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                          <NavigationMenuLink asChild >
                          <div
                              className="flex h-full w-full select-none 
                                      flex-col 
                                      p-6
                                      bg-[url('/bg/navbar_bg.jpg')] bg-contain bg-no-repeat bg-center
                                    
                                      "   
                          >
                          
                              <div className="mb-2 mt-4 text-lg font-medium">
                                BlockSlice
                              </div>
                              <p className="text-sm ">
                              Dive into the future of pizza ordering with BlockSlice,
                              where technology meets taste.
                              </p>
                          </div>
                          </NavigationMenuLink>
                      </li>
                      <ListItem href="/about_us" title="About Us">
                        Explore the story behind BlockSlice, your go-to platform for 
                        crypto-powered pizza delivery. Learn how we combine traditional
                        flavors with modern tech to deliver the best experience.
                      </ListItem>
                      <ListItem href="/contact_us" title="Contact Us">
                        Need assistance or have questions? Contact us and let's make 
                        your pizza ordering experience smoother. We're here to help 
                        with your orders, payments, or any inquiries.
                      </ListItem>
                    
                      </ul>
                  </NavigationMenuContent>
                  </NavigationMenuItem>

              </NavigationMenuList>
          </NavigationMenu>

          <UserMenu/>
      </div>


      <div className="flex justify-between p-2 md:hidden">
        <Sheet open={open}>

              <SheetTrigger asChild>
                <Button onClick={()=>setOpen(true)}
                        variant="outline"
                >
                  <Menu />
                </Button>
              </SheetTrigger>

              <SheetContent onClick={()=>setOpen(false)}
                            side={'left'} 
                            className="flex items-start justify-center"
              >
                  <NavigationMenu>

                    <NavigationMenuList className={cn(
                        "flex flex-col",
                      )}>
                      

                        <NavigationMenuItem >
                          <Link href="/" legacyBehavior passHref>
                              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Home
                              </NavigationMenuLink>
                          </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                        <Link href="/menu" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                              Menu
                            </NavigationMenuLink>
                        </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                        <Link href="/menu" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                              Chefs
                            </NavigationMenuLink>
                        </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                        <Link href="/contact_us" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                              Contact Us
                            </NavigationMenuLink>
                        </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                        <Link href="/about_us" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                              About Us
                            </NavigationMenuLink>
                        </Link>
                        </NavigationMenuItem>

                      
                    </NavigationMenuList>
                  </NavigationMenu>
              
                
              </SheetContent>
          </Sheet>

          <UserMenu/>
      </div>

    </>
    
    
  );


}

const ListItem = React.forwardRef(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);

ListItem.displayName = "ListItem";

export default Navbar