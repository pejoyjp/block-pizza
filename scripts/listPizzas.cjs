const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envConfig = fs.readFileSync(envPath, 'utf8');

envConfig.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    process.env[key.trim()] = valueParts.join('=').trim();
  }
});

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable inside .env');
}

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  veg: { type: Boolean, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: null },
  quantity: { type: Number, default: 1 },
  img: { type: String, default: null },
  is_popular: { type: Boolean, default: false },
  sizeandcrust: { type: mongoose.Schema.Types.Mixed, default: null },
  nutrition: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbohydrates: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    serving_size: { type: String, default: '1 slice' }
  }
}, { timestamps: true });

const Pizza = mongoose.models.Pizza || mongoose.model('Pizza', pizzaSchema);

async function listPizzas() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully!\n');
    
    console.log('Fetching all pizzas from database...\n');
    
    const pizzas = await Pizza.find({}).select('name veg price');
    
    console.log(`Found ${pizzas.length} pizzas:\n`);
    
    pizzas.forEach((pizza, index) => {
      console.log(`${index + 1}. ${pizza.name}`);
      console.log(`   Veg: ${pizza.veg}, Price: $${pizza.price}\n`);
    });
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error listing pizzas:', error.message);
    process.exit(1);
  }
}

listPizzas();