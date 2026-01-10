import React from 'react'

const data = [
   {    name:"Jin ",
        des:`Hi, my name is Jin,  Thank you!`,
        img:'/chefs/myself.png'
    },
   
]

const Chefs = () => {
    return (
        <div className="flex flex-col gap-4">
            {data.map((chef, index) => (
                <div key={index} className="flex items-center flex-col md:flex-row p-2">
                    <img className="w-[300px] object-cover" src={chef.img} alt={chef.name} />
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">{chef.name}</div>
                        <p className="text-gray-700 text-base">
                            {chef.des}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Chefs