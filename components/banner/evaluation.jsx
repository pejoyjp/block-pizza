import React from 'react';
import {
    Bitcoin,
    Pizza,
    Heart,
    Handshake 

} from "lucide-react"


const Evaluation = () => {
  const categories = [
    {
      title: "SAVORY SLICES",
      description: "Experience the perfect blend of hand-tossed dough, rich tomato sauce, and fresh toppings. From classic Margherita to spicy Pepperoni, each slice celebrates traditional flavors.",
      icon:<Pizza size={50}/>
    },
    {
      title: "GOURMET GOODNESS",
      description: "Discover gourmet pizzas crafted with wood-fired crusts and luxurious cheeses. Try the Truffle Mushroom or Mediterranean for a taste of culinary excellence.",
      icon:<Heart size={50}/>
    },
    {
      title: "FAMILY FAVORITES",
      description: "Enjoy our family-sized pizzas loaded with generous toppings. Choose from Meat Lovers’ Extravaganza to Veggie Paradise—perfect for sharing and creating memories.",
      icon:<Handshake size={50}/>
    },
    {
      title: "CRYPTO CRAVINGS",
      description: "Pay with cryptocurrency for fast, secure transactions. Indulge in tech-inspired flavors like Blockchain BBQ Chicken or the Satoshi Special.",
      icon:<Bitcoin size={50}/>
    }
  ];

  return (
    <div className=" bg-gray-100 p-4 flex rounded-lg justify-center flex-wrap my-10 ">
      {categories.map((category, index) => (
        <div key={index} className="flex flex-col gap-4 items-center justify-between text-center w-[260px] h-[300px] ">
          {category.icon}
          <h2 className="text-xl font-bold text-red-600">{category.title}</h2>
          
          <p className="text-gray-800 h-[150px] text-sm">{category.description}</p>
         
        </div>
      ))}
    </div>
  );
}

export default Evaluation;
