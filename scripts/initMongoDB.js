import connectDB from '../lib/db.js';
import Pizza from '../lib/models/Pizza.js';
import Topping from '../lib/models/Topping.js';

// 初始化披萨数据
const pizzasData = [
  {
    name: 'Margherita',
    veg: true,
    price: 3.00,
    description: 'Cheese',
    quantity: 1,
    img: 'https://i.postimg.cc/rsqyVShm/Margherita.png',
    is_popular: true,
    sizeandcrust: { "M": { "price": 3.00 }, "L": { "price": 5.00 }, "XL": { "price": 7.00 } }
  },
  {
    name: 'Tandoori Paneer',
    veg: true,
    price: 7.00,
    description: 'Spiced paneer, Onion, Green Capsicum & Red Paprika in Tandoori Sauce',
    quantity: 1,
    img: 'https://i.postimg.cc/d1PtXMrG/Tandoori-Paneer.png',
    is_popular: true,
    sizeandcrust: { "M": { "price": 7.00 }, "L": { "price": 9.00 }, "XL": { "price": 12.00 } }
  },
  {
    name: 'Veggie Supreme',
    veg: true,
    price: 8.00,
    description: 'Black Olives, Green Capsicum, Mushroom, Onion, Red Paprika, Sweet Corn',
    quantity: 1,
    img: 'https://i.postimg.cc/kGwJBBZy/Veggie-Supreme.png',
    is_popular: true,
    sizeandcrust: { "M": { "price": 8.00 }, "L": { "price": 9.00 }, "XL": { "price": 10.00 } }
  },
  {
    name: 'Double Paneer Supreme',
    veg: true,
    price: 6.00,
    description: 'Spiced Paneer, Herbed Onion & Green Capsicum, Red Paprika',
    quantity: 1,
    img: 'https://i.postimg.cc/d0TV4Qkq/Double-Paneer-Supreme.png',
    is_popular: false,
    sizeandcrust: { "M": { "price": 6.00 }, "L": { "price": 7.00 }, "XL": { "price": 9.00 } }
  },
  {
    name: 'Veggie Kebab Surprise',
    veg: true,
    price: 4.00,
    description: 'Veg Kebab, Onion, Green Capsicum, Tomato & Sweet Corn in Tandoori Sauce',
    quantity: 1,
    img: 'https://i.postimg.cc/FRysXPV8/Veggie-Kebab-Surprise.png',
    is_popular: false,
    sizeandcrust: { "M": { "price": 4.00 }, "L": { "price": 6.00 }, "XL": { "price": 8.00 } }
  },
  {
    name: 'Chicken Supreme',
    veg: false,
    price: 7.00,
    description: 'Herbed Chicken, Schezwan Chicken Meatball, Chicken Tikka',
    quantity: 1,
    img: 'https://i.postimg.cc/BQqt4Gyg/Chicken-Supreme.png',
    is_popular: true,
    sizeandcrust: { "M": { "price": 7.00 }, "L": { "price": 9.00 }, "XL": { "price": 12.00 } }
  },
  {
    name: 'Chicken Tikka Supreme',
    veg: false,
    price: 6.00,
    description: 'Chicken Tikka, Chicken Malai Tikka, Onion, Red Paprika',
    quantity: 1,
    img: 'https://i.postimg.cc/7Zh6JnqJ/Chicken-Tikka-Supreme.png',
    is_popular: true,
    sizeandcrust: { "M": { "price": 6.00 }, "L": { "price": 8.00 }, "XL": { "price": 11.00 } }
  },
  {
    name: 'Triple Chicken Feast',
    veg: false,
    price: 8.00,
    description: 'Schezwan Chicken Meatball Herbed Chicken, Chicken Sausage, Geen Capsicum, Onion, Red Paprika',
    quantity: 1,
    img: 'https://i.postimg.cc/zX0vfcY1/Triple-Chicken-Feast.png',
    is_popular: false,
    sizeandcrust: { "M": { "price": 8.00 }, "L": { "price": 10.00 }, "XL": { "price": 13.00 } }
  },
  {
    name: 'Chicken Tikka',
    veg: false,
    price: 7.00,
    description: 'Chicken Tikka, Onion, Tomato',
    quantity: 1,
    img: 'https://i.postimg.cc/t4cg3ngS/Chicken-Tikka.png',
    is_popular: false,
    sizeandcrust: { "M": { "price": 7.00 }, "L": { "price": 8.00 }, "XL": { "price": 9.00 } }
  },
  {
    name: 'Double Chicken Sausage',
    veg: false,
    price: 5.00,
    description: 'Chicken Sausage',
    quantity: 1,
    img: 'https://i.postimg.cc/BbC6Hh8H/Double-Chicken-Sausage.png',
    is_popular: false,
    sizeandcrust: { "M": { "price": 5.00 }, "L": { "price": 6.00 }, "XL": { "price": 7.00 } }
  }
];

// 初始化配料数据（URL未变更，保持原数据）
const toppingsData = [
  { name: 'Extra Cheese', price: 1.50, is_veg: true },
  { name: 'Mushrooms', price: 0.75, is_veg: true },
  { name: 'Onions', price: 0.50, is_veg: true },
  { name: 'Black Olives', price: 0.75, is_veg: true },
  { name: 'Green Peppers', price: 0.50, is_veg: true },
  { name: 'Pepperoni', price: 1.25, is_veg: false },
  { name: 'Sausage', price: 1.25, is_veg: false },
  { name: 'Bacon', price: 1.50, is_veg: false },
  { name: 'Jalapeños', price: 0.60, is_veg: true }
];

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    
    console.log('Clearing existing data...');
    await Pizza.deleteMany({});
    await Topping.deleteMany({});
    
    console.log('Inserting pizzas...');
    await Pizza.insertMany(pizzasData);
    
    console.log('Inserting toppings...');
    await Topping.insertMany(toppingsData);
    
    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();