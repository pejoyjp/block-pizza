import React from 'react'
import {
    Facebook,
    Github,
    Twitter,
    Linkedin,
    Instagram
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

const Footer = () => {
    return (
      <footer className='pt-6'>
        <Separator />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        <div className='flex flex-col items-center'>
            <h2 className="text-lg font-bold">BlockSlice</h2>
            <p className="mt-2 text-gray-400 text-center">
              123 Pizza Street<br/>
              Flavor Town, Yum 90210<br/>
              Email: support@blockslice.pizza
            </p>
          </div>

          <div className='flex flex-col items-center'>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-2 text-center">
              <li><a href="/about" className="hover:text-gray-300 ">About Us</a></li>
              <li><a href="/menu" className="hover:text-gray-300">Menu</a></li>
              <li><a href="/order" className="hover:text-gray-300">Order Now</a></li>
              <li><a href="/contact" className="hover:text-gray-300">Contact</a></li>
            </ul>
          </div>

          <div className='flex flex-col items-center'>
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex mt-2 space-x-4">
              <Facebook className="hover:text-blue-300 h-4 w-4 cursor-pointer"/>
              <Twitter className="hover:text-blue-300 mr-2 h-4 w-4 cursor-pointer"/>
              <Instagram className="hover:text-blue-300 mr-2 h-4 w-4 cursor-pointer"/>
              <Linkedin className="hover:text-blue-300 mr-2 h-4 w-4 cursor-pointer"/>

            </div>
          </div>

        </div>
        
        <div className="mt-4 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} BlockSlice. All rights reserved.
        </div>
      </footer>
    );
  };
  
  export default Footer;