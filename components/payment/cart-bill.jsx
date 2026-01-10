import React, { useState,useEffect } from 'react'
import { CardElement, useElements, useStripe  } from "@stripe/react-stripe-js";

import { CardTitle, CardDescription, CardHeader, CardFooter, Card, CardContent } from "@/components/ui/card"
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import {TruckIcon} from 'lucide-react'
import useCart from '@/hooks/useCart';
import { format } from 'date-fns';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
  } from "@/components/ui/dialog"

import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import useSWR from 'swr'
import useUserId from '@/hooks/userUserId';
import { useRouter } from 'next/navigation';
import { Textarea } from '../ui/textarea';
import { useForm } from 'react-hook-form';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


const CARD_ELEMENT_OPTIONS = {
  style: {
      base: {
          color: "black",
    
          fontSmoothing: "antialiased",
          
          "::placeholder": {
              color: "gray",
          },
          padding: '10px', 
      },
      invalid: {
          color: "red",
          ":focus": {
              color: "black",
          },
      },
  },
};

const CartBill = ({user}) => {
    const {carts,totalPrices,clearCart} = useCart()
    const [method,setMethod] = useState('card')
    const elements = useElements();
    const stripe = useStripe();
    const [error, setError] = useState();
    const [txs, setTxs] = useState([]);
    const [ethPrice, setEthPrice] = useState(null);
    const [ethPriceError, setEthPriceError] = useState(null);
    const [currentNetwork, setCurrentNetwork] = useState(null);
    const {userId, isAuthenticated} = useUserId()
    const [contact,setContact] = useState()
    const [open,setOpen] = useState(false)
    const [instruction,setInstruction] = useState("")
    const route = useRouter()
    const [deliveryMethod,setDeliverytMethod] = useState('Standard Delivery')
  
    const { register, handleSubmit, formState: { errors },reset } = useForm();
   
    const { data: contacts, mutate,isLoading } = useSWR(
        userId ? `${userId}contact` : null,
        async () => {
            if (!userId) return null;
            const response = await fetch(`/api/users/${userId}/contacts`);
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch contacts');
            }
            return result;
        },
        { revalidateOnFocus: false } 
    );


    useEffect(() => {
        if (contacts && contacts.data && contacts.data.length > 0) {
            setContact(contacts.data[0]);
        }
    }, [contacts]);

  

    useEffect(() => {
        const fetchETHPrice = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if(data && data.ethereum && data.ethereum.usd) {
                    setEthPrice(data.ethereum.usd);
                    setEthPriceError(null);
                } else {
                    throw new Error('Invalid response from CoinGecko API');
                }
            } catch (error) {
                console.error("Error fetching ETH price:", error);
                setEthPriceError(error.message || 'Failed to fetch ETH price');
            }
        };

        fetchETHPrice();
    }, []);

    useEffect(() => {
        const checkNetwork = async () => {
            if (window.ethereum) {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const network = await provider.getNetwork();
                    const chainId = typeof network.chainId === 'number' ? network.chainId : network.chainId.toNumber();
                    setCurrentNetwork({ name: network.name, chainId });
                    console.log('Current network on load:', { name: network.name, chainId });
                } catch (error) {
                    console.error('Error checking network:', error);
                }
            }
        };
        
        checkNetwork();
        
        if (window.ethereum) {
            window.ethereum.on('chainChanged', (chainId) => {
                window.location.reload();
            });
            
            window.ethereum.on('accountsChanged', (accounts) => {
                window.location.reload();
            });
        }
        
        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners('chainChanged');
                window.ethereum.removeAllListeners('accountsChanged');
            }
        };
    }, []);




  
    const onSubmit = async(data) => {
        // You can integrate the API call here to submit the data
        if (!userId) {
            toast.error('Please login to save contact information');
            return;
        }
        
        try{
            console.log(data);
            const response = await fetch(`/api/users/${userId}/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to upload contact');
            }
            toast.success("Uploaded successfully")
            setOpen(false)
            mutate()
            reset()
    
        }catch(e){
            toast.error(e.message)
        }
    
      };

  
    const startPayment = async ({ setError, setTxs, ether, addr }) => {
        try {
            if (!window.ethereum)
                throw new Error("No crypto wallet found. Please install it.");
    
            await window.ethereum.send("eth_requestAccounts");
            
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const network = await provider.getNetwork();
            
            console.log('Current network:', {
                chainId: network.chainId,
                chainIdType: typeof network.chainId,
                name: network.name
            });
            
            const currentChainId = typeof network.chainId === 'number' 
                ? network.chainId 
                : network.chainId.toNumber();
            
            if (currentChainId !== 11155111) {
                const networkNames = {
                    1: 'Ethereum Mainnet',
                    5: 'Goerli Testnet',
                    11155111: 'Sepolia Testnet'
                };
                const currentNetworkName = networkNames[currentChainId] || 'Unknown Network';
                throw new Error(`Current network: ${currentNetworkName} (Chain ID: ${currentChainId}). Please switch to Sepolia Testnet.`);
            }
            
            const signer = provider.getSigner();
            ethers.utils.getAddress(addr);
            
            let tx;
            try {
                tx = await signer.sendTransaction({
                    to: addr,
                    value: ethers.utils.parseEther(ether)
                });
            } catch (parseError) {
                if (parseError.code === 'NUMERIC_FAULT') {
                    throw new Error(`Invalid ETH amount: ${ether}. Please try again.`);
                }
                throw parseError;
            }
            
            setTxs([tx]);
            toast.success("Transaction sent! Waiting for confirmation...");

            const receipt = await tx.wait();
    
            if (receipt.status === 1) {
                toast.success("Transaction confirmed!");
                return true;
            } else {
                throw new Error("Transaction failed");
            }
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const switchToSepolia = async () => {
        try {
            if (!window.ethereum) {
                throw new Error("No crypto wallet found. Please install it.");
            }

            const sepoliaChainId = '0xaa36a7'; // 11155111 in hex

            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: sepoliaChainId }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: sepoliaChainId,
                            chainName: 'Sepolia Test Network',
                            nativeCurrency: {
                                name: 'Ethereum',
                                symbol: 'ETH',
                                decimals: 18,
                            },
                            rpcUrls: [process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL],
                            blockExplorerUrls: ['https://sepolia.etherscan.io'],
                        }],
                    });
                } else {
                    throw switchError;
                }
            }
        } catch (error) {
            console.error("Failed to switch to Sepolia:", error);
            throw error;
        }
    };

    const totalPriceWithShipping = totalPrices + 5

    const handleChange = (value)=>{
        setMethod(value)
        
    }

    const handleDeliveryChange = (value)=>{
        setDeliverytMethod(value)
    }


  const onEthPay = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to make a payment');
            route.push('/login');
            return;
        }
        
        if (!ethPrice) {
            toast.error('Failed to fetch ETH price. Please try again.');
            return;
        }

        if (!contact) {
            toast.error('Please add shipping information');
            return;
        }
        
        setError();
        try {
            const etherAmount = (totalPriceWithShipping / ethPrice).toFixed(18);
            console.log('Payment amount:', {
                usd: totalPriceWithShipping,
                ethPrice: ethPrice,
                etherAmount: etherAmount
            });
            
            const loadingToast = toast.loading(`Paying ${etherAmount} ETH...`);
            
            const paymentSuccessful = await startPayment({
                setError,
                setTxs,
                ether: etherAmount,
                addr: "0xB57dB21caDC3ce2CA8D59c79aee7474B33ff6E06"
            });

            if (paymentSuccessful) {
                toast.dismiss(loadingToast);
                const data = {
                    userId,
                    instruction,
                    paymentStatus: "done",
                    totalPrice: totalPriceWithShipping,
                    status: "Processing",
                    paymentMethod: method,
                    deliveryMethod:deliveryMethod,
                    deliveryAddress: contact.address,
                    contactPhone: contact.phone_number
                };

                const paymentResponse = await fetch('/api/payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                const paymentRes = await paymentResponse.json();
                if (!paymentResponse.ok) {
                    throw new Error(paymentRes.error || 'Payment failed');
                }
                
                const orderResponse = await fetch(`/api/orders/${paymentRes.orderId}/pizzas`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pizzas: carts }),
                });
                const orderRes = await orderResponse.json();
                if (!orderResponse.ok) {
                    throw new Error(orderRes.error || 'Failed to save order pizzas');
                }
                console.log(orderRes);

                if (paymentRes.success && orderRes.success) {
                    toast.success(paymentRes.message);
                    clearCart();
                    route.push('/payment/payment-success');
                } else {
                    toast.error(paymentRes.error);
                }
            } else {
                toast.error("Payment failed");
            }
        } catch (e) {
            if (e.message.includes('switch to Sepolia')) {
                toast.error((t) => (
                    <div>
                        <p>{e.message}</p>
                        <button 
                            onClick={() => {
                                toast.dismiss(t.id);
                                switchToSepolia().then(() => {
                                    toast.success('Switched to Sepolia network!');
                                }).catch(err => {
                                    toast.error(err.message);
                                });
                            }}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Switch to Sepolia
                        </button>
                    </div>
                ), { duration: 10000 });
            } else {
                toast.error(e.message);
            }
        }
    };


    const handleCardPay = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to make a payment');
            route.push('/login');
            return;
        }
        
        const cardElement = elements?.getElement(CardElement);
        if (!stripe || !cardElement) {
            toast.error("Stripe or card element not loaded");
            return;
        }

        try {

            const response = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: totalPriceWithShipping }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to verify payment');
            }
            const { clientSecret } = result; 
            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            if (paymentResult.error) {
                throw new Error(paymentResult.error.message);
            } else {
                const data = {
                    userId,
                    instruction,
                    paymentStatus:"done",
                    totalPrice:totalPriceWithShipping,
                    status:"Processing",
                    paymentMethod:method,
                    deliveryMethod:deliveryMethod,
                    deliveryAddress:contact.address,
                    contactPhone:contact.phone_number
                }


                const paymentResponse = await fetch('/api/payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                const paymentRes = await paymentResponse.json();
                if (!paymentResponse.ok) {
                    throw new Error(paymentRes.error || 'Payment failed');
                }

                const orderResponse = await fetch(`/api/orders/${paymentRes.orderId}/pizzas`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pizzas: carts }),
                });
                const orderRes = await orderResponse.json();
                if (!orderResponse.ok) {
                    throw new Error(orderRes.error || 'Failed to save order pizzas');
                }
                console.log(orderRes);

                if(paymentRes.success && orderRes.success ){
                    toast.success(paymentRes.message)
                    clearCart()
                    route.push('/payment/payment-success')

                }else{
                    toast.error(paymentRes.error)
                }
            }

        } catch (error) {
        toast.error(`Payment failed: ${error.message}`);
        }
    };




  return (
    <Card className="overflow-hidden  basis-1/3" x-chunk="dashboard-05-chunk-4">
        <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
                Order 
            </CardTitle>
            <CardDescription>Date: {format(Date.now(), 'yyyy-MM-dd HH:mm')}</CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-1">
            <Button className="h-8 gap-1" size="sm" variant="outline">
                <TruckIcon className="h-3.5 w-3.5" />
            </Button>
            
            </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
            <div className="font-semibold">Order Details</div>
            <div className="grid gap-3">
                {
                    carts.map((cart)=>(
                        <Accordion type="single" collapsible className="w-full">
                            
                            <AccordionItem value="item-1" key={cart.id}>
                   
                                    <AccordionTrigger className="flex">
                                       
                                        <span className="text-muted-foreground">
                                                {cart.name} 
                                            
                                        </span>

                                        <span> x{cart.quantity}</span>

                                        <span>{ cart.sizeandcrust === "M" ? "6 " :
                                                cart.sizeandcrust === "L" ? "9" :
                                                cart.sizeandcrust === "XL" ? "12" : ""}
                                        </span>

                                        <span> ${(cart.price).toFixed(2)}</span>

                                    </AccordionTrigger>


                           
                                

                                <AccordionContent>
                                    {
                                        cart.toppings.map(topping => (

                                            topping.total_price !== 0 &&
                                           
                                            <div key={topping.name} className='flex justify-between'>
                                                <p>
                                                    {topping.name}
                                                </p>
                                        
                                                <div className='flex w-20 justify-between'>
                                                    <p>
                                                        x{topping.quantity}
                                                    </p>
                                        
                                                    <p>
                                                        ${topping.total_price}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    
                                </AccordionContent>
                                
                            </AccordionItem>
                    
                        </Accordion>

                ))


            }
                            
               
            </div>
            <Separator className="my-2" />
            <ul className="grid gap-3">
                
                <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>$5.00</span>
                </li>
                <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>$0</span>
                </li>
                <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span>${totalPriceWithShipping.toFixed(2)}</span>
                </li>
            </ul>
            </div>
            <Separator className="my-4" />


                <Dialog open={open}>
                    <DialogTrigger asChild>
                        <div className='hover:bg-slate-200 p-2 cursor-pointer rounded-md'
                             onClick={()=>setOpen(true)}
                        >
                            <div>
                                <div className="font-semibold">Shipping Information</div>
                                <address className="grid gap-0.5 not-italic text-muted-foreground">
                                    
                                    <span>
                                        {contact?.address}
                                    </span>
                                    
                                </address>
                            </div>


                            
                            <div className="font-semibold mt-4">
                                <dt>
                                    Phone
                                </dt>

                                <dd className='not-italic text-muted-foreground'>
                                    <span>{contact?.phone_number}</span>
                                </dd>
                            
                            </div>
                    
                        </div>

                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md" setOpen={setOpen}>


                        {
                            !contact ?  
                            
                            <form className=" w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="w-full space-y-2">
                                        <label>
                                            Address
                                        </label>
                                        <Input placeholder="Address" 
                                        {...register("address", { required: true })}
                                                
                                        />

                                    </div>

                                    <div className="w-full space-y-2">
                                        <label>
                                            Phone Number
                                        </label>
                                        <Input placeholder="Phone Number" 
                                            {...register("phoneNumber", { required: true })}
                                        
                                        />
                                    </div>
                                
                                    <DialogFooter>
                                        <Button type="submit">Confirm</Button>
                                    </DialogFooter>
                            </form> : 

                            <div>
                                <DialogHeader>
                                    <DialogTitle>Choose your address</DialogTitle>
                                </DialogHeader>

                                {contacts?.data.map(contact=>(
                                <div key={contact.id} 
                                className='mt-2 cursor-pointer rounded-md hover:bg-slate-200'>
                                    <div className='space-y-2  p-2'
                                        onClick={()=>{
                                            setContact(contact);
                                            setOpen(false)
                                        }}
                                    >
                                        <p>
                                            address: {contact.address}
                                        </p>
                                        <p>
                                            phone: {contact.phone_number}
                                        </p>
                                    
                                    </div>
                                    <Separator/>
                                </div>
                                ))}
                            </div>
                        }

                        
                        
                    </DialogContent>

                </Dialog>
          
           




            <Separator className="my-4" />
            {
                user && 
                <div className="grid gap-3">
                    <div className="font-semibold">Customer Information</div>
                    <dl className="grid gap-3">

                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Customer</dt>
                            <dd>{user.username}</dd>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Email</dt>
                            <dd>
                                <a href="#">{user.email}</a>
                            </dd>
                        </div>

                        <div className="">
                            <p className="text-muted-foreground">
                                Special Instructions
                            </p>

                            <Textarea onChange ={(e)=>setInstruction(e.target.value)}
                                      className="mt-3 text-sm" 
                                      value={instruction}
                            />

                              
                          
                        </div>
                    </dl>
                </div>
            }
           
            <Separator className="my-4" />

            <div className=' space-y-4'>
                <div className="flex justify-between items-center">
                    <div className="font-semibold">
                        Delivery Method
                    </div>
                    
                    <Select onValueChange={(value)=>handleDeliveryChange(value)} defaultValue={deliveryMethod}>
                        <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="Card" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem
                                        value="Standard Delivery">
                                Standard Delivery
                            </SelectItem>

                            <SelectItem value="Contactless Delivery">
                                Contactless Delivery
                            </SelectItem>
                        </SelectContent>

                    </Select>

                </div>
            </div>

            <Separator className="my-4" />

            <div className=' space-y-4'>
                <div className="flex justify-between items-center">
                    <div className="font-semibold">
                        Payment Method
                    </div>
                    
                    <Select onValueChange={(value)=>handleChange(value)} defaultValue={method}>
                        <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="Card" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem
                                        value="card">
                                Card
                            </SelectItem>

                            <SelectItem value="eth">
                                Eth
                            </SelectItem>
                        </SelectContent>

                    </Select>

                </div>

                {
                    method === "card" ? 
                    <>

                        <img src='/bg/bankcard.png' className=' rounded-md'/>
                
                            <CardElement options={CARD_ELEMENT_OPTIONS}
                                            
                            />
                

                        <div className=' w-full'>
                            <Button className="w-full"
                                     onClick={handleCardPay}
                            
                            >
                                Pay with card
                            </Button>
                        </div>
                    </>:

                    <>
                        <img src='/bg/eth.png' className='rounded-md'/>
                        {currentNetwork && (
                            <div className={`text-xs px-2 py-1 rounded ${
                                currentNetwork.chainId === 11155111 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                Network: {currentNetwork.name} (Chain ID: {currentNetwork.chainId})
                                {currentNetwork.chainId !== 11155111 && ' - Please switch to Sepolia!'}
                            </div>
                        )}
                        {ethPrice ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">ETH Price:</span>
                                    <span>${parseFloat(ethPrice).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">ETH Amount:</span>
                                    <span>{(totalPriceWithShipping / ethPrice).toFixed(6)} ETH</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">USD Value:</span>
                                    <span>${totalPriceWithShipping.toFixed(2)}</span>
                                </div>
                            </div>
                        ) : ethPriceError ? (
                            <div className="text-sm text-red-500">
                                Failed to load ETH price: {ethPriceError}
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                Loading ETH price...
                            </div>
                        )}
                        <div className=' w-full'>
                            <Button className="w-full"
                                    onClick={onEthPay}
                                    disabled={!ethPrice}
                            >
                                Pay with Eth
                            </Button>
                        </div>
                        {
                            error &&   <p className=' text-white bg-red-500 rounded-md whitespace-normal p-2 break-words'>
                                {error}
                            </p>
                        }
                      

                    
                    </>
                }
               
                

            </div>
          
        </CardContent>

        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
                BlockSlice©
        
            </div>
        
        </CardFooter>
    </Card>

  )
}

export default CartBill