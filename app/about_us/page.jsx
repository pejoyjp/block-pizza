import React from 'react'



const About = () => {
    return (
        <div className="py-8">
            <div className='flex justify-center'>
                <img src="/bg/feedback_bg.png" className=' w-52 h-52' alt="" />
            </div>
           


            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center pb-12">
                    <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900">
                        About BlockSlice
                    </h1>
                    <p className="text-gray-600 mt-4">
                        Revolutionizing pizza ordering with blockchain technology.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">Our Mission</h2>
                        <p className="text-gray-700">
                            At BlockSlice, our mission is to seamlessly integrate cutting-edge blockchain technology into everyday life, starting with how you order your favorite pizzas. We're committed to providing a secure, innovative, and user-friendly platform that allows you to use cryptocurrencies for everyday transactions, enhancing your dining experience.
                        </p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">What We Do</h2>
                        <p className="text-gray-700">
                            BlockSlice leverages the unique features of blockchain technology to offer a pizza ordering service that is not only fast and reliable but also transparent and rewarding. We ensure that every transaction is recorded on the blockchain, providing unmatched security and the convenience of digital payments.
                        </p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">Our Technology</h2>
                        <p className="text-gray-700">
                            We utilize a decentralized platform built on blockchain to process orders and payments. This technology ensures that every transaction is secure and private, with no intermediaries. Our system is designed to support multiple cryptocurrencies, making it flexible and accessible to all users.
                        </p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">Meet the Team</h2>
                        <p className="text-gray-700">
                            Our team is made up of passionate individuals from diverse backgrounds in tech, culinary arts, and business. We are united by our shared goal of bringing innovation to the food industry, ensuring that every meal ordered through BlockSlice is a step towards a more connected and tech-savvy culinary world.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
