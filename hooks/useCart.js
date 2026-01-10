import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCart = create(persist((set) => ({
    carts: [],
    totalPrices: 0,

    // 添加商品到购物车
    addItem: (pizza) => {
        set(state => {
            const cart = [...state.carts];
            const pizzaId = pizza.id || pizza._id;
            const existingItemIndex = cart.findIndex(item => {
                const itemId = item.id || item._id;
                return itemId === pizzaId && item.sizeandcrust === pizza.sizeandcrust;
            });
            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += 1;  // 已存在，增加数量
            } else {
                // 确保添加到cart的pizza有id字段
                const pizzaToAdd = { ...pizza, id: pizzaId, quantity: 1, toppings: [], createAt: Date.now() };
                cart.push(pizzaToAdd);  // 不存在，添加新商品
            }
            return {
                carts: cart,
                totalPrices: calculateTotalPrices(cart)  // Update total prices
            };
        });
    },
    
    // 从购物车中移除商品
    removeItem: (pizza) => {
        set(state => {
            const cart = [...state.carts];
            const pizzaId = pizza.id || pizza._id;
            const itemIndex = cart.findIndex(item => {
                const itemId = item.id || item._id;
                return itemId === pizzaId && item.sizeandcrust === pizza.sizeandcrust;
            });
            if (itemIndex === -1) return state;  // 商品不存在于购物车中

            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;  // 数量大于1，减少数量
            } else {
                cart.splice(itemIndex, 1);  // 数量为1，移除商品
            }
            return {
                carts: cart,
                totalPrices: calculateTotalPrices(cart)  // Update total prices
            };
        });
    },

    // 初始化配料到披萨
    initializeToppingToPizza: (pizzaId, topping) => {
        set(state => {
            const cart = [...state.carts];
            const pizzaIndex = cart.findIndex(item => {
                const itemId = item.id || item._id;
                return itemId === pizzaId;
            });
            if (pizzaIndex !== -1) {
                const pizza = { ...cart[pizzaIndex] };
                if (!pizza.toppings) {
                    pizza.toppings = []; // Initialize toppings array if it doesn't exist
                }
                const existingToppingIndex = pizza.toppings.findIndex(t => t.name === topping.name);
                if (existingToppingIndex === -1) {
                    // Only add topping if it doesn't exist, with quantity 0
                    pizza.toppings.push({ ...topping, quantity: 0 });
                    cart[pizzaIndex] = pizza;
                }
                console.log("Initialized topping:", cart);
                return {
                    carts: cart,
                    totalPrices: state.totalPrices
                };
            }
            return state;
        });
    },
    

    // 向披萨添加配料
    addToppingToPizza: (pizzaId, topping) => {
        set(state => {
            const cart = [...state.carts];
            const pizzaIndex = cart.findIndex(item => {
                const itemId = item.id || item._id;
                return itemId === pizzaId;
            });
            if (pizzaIndex !== -1) {
                const pizza = { ...cart[pizzaIndex] };
                if (!pizza.toppings) {
                    pizza.toppings = []; // Initialize toppings array if it doesn't exist
                }
                const existingToppingIndex = pizza.toppings.findIndex(t => t.name === topping.name);
                if (existingToppingIndex !== -1) {
                    // If topping already exists, increment its quantity
                    pizza.toppings = [...pizza.toppings];
                    pizza.toppings[existingToppingIndex] = {
                        ...pizza.toppings[existingToppingIndex],
                        quantity: pizza.toppings[existingToppingIndex].quantity + 1
                    };
                } else {
                    // If topping doesn't exist, add it to the toppings array
                    pizza.toppings = [...pizza.toppings, { ...topping, quantity: 1 }];
                }
                cart[pizzaIndex] = pizza;
                console.log("Added topping:", cart);
                return {
                    carts: cart,
                    totalPrices: calculateTotalPrices(cart)
                };
            }
            return state;
        });
    },
    
    

    // 从披萨中移除配料
    removeToppingFromPizza: (pizzaId, topping) => {
        set(state => {
            const cart = [...state.carts];
            const pizzaIndex = cart.findIndex(item => {
                const itemId = item.id || item._id;
                return itemId === pizzaId;
            });
            if (pizzaIndex !== -1) {
                const pizza = { ...cart[pizzaIndex] };
                if (pizza.toppings && Array.isArray(pizza.toppings)) {
                    const toppingIndex = pizza.toppings.findIndex(t => t.name === topping.name);
                    if (toppingIndex !== -1) {
                        const currentTopping = pizza.toppings[toppingIndex];
                        if (currentTopping.quantity > 0) {
                            pizza.toppings = [...pizza.toppings];
                            if (currentTopping.quantity === 1) {
                                // If quantity becomes 0, keep topping but set quantity to 0
                                pizza.toppings[toppingIndex] = {
                                    ...currentTopping,
                                    quantity: 0
                                };
                            } else {
                                // Decrement quantity
                                pizza.toppings[toppingIndex] = {
                                    ...currentTopping,
                                    quantity: currentTopping.quantity - 1
                                };
                            }
                            cart[pizzaIndex] = pizza;
                            console.log("Removed topping:", cart);
                            return {
                                carts: cart,
                                totalPrices: calculateTotalPrices(cart)
                            };
                        }
                    }
                }
            }
            return state;
        });
    },
    // 清空购物车
    clearCart: () => set({ carts: [], totalPrices: 0 }),

  

}), {
    name: 'cart-storage',  // 使用LocalStorage存储的key
    // getStorage: () => localStorage  // 定义使用的存储方式
}));

export default useCart;

// 计算购物车中的总价格
function calculateTotalPrices(cart) {
    return cart.reduce((acc, item) => {
        // Calculate total price for each pizza including toppings
        const pizzaPrice = item.price + (item.toppings ? item.toppings.reduce((toppingAcc, topping) => toppingAcc + topping.price * topping.quantity, 0) : 0);
        return acc + pizzaPrice * item.quantity;
    }, 0);
}