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
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const pizzaNutritionData = {
  'Chicken Supreme': {
    calories: 320,
    protein: 14,
    carbohydrates: 30,
    fat: 14,
    fiber: 1.5,
    sodium: 750,
    sugar: 6,
    serving_size: '1 slice'
  },
  'Chicken Tikka Supreme': {
    calories: 310,
    protein: 13,
    carbohydrates: 28,
    fat: 15,
    fiber: 1,
    sodium: 800,
    sugar: 5,
    serving_size: '1 slice'
  },
  'Tandoori Paneer': {
    calories: 260,
    protein: 11,
    carbohydrates: 27,
    fat: 12,
    fiber: 2,
    sodium: 650,
    sugar: 3,
    serving_size: '1 slice'
  },
  'Triple Chicken Feast': {
    calories: 350,
    protein: 15,
    carbohydrates: 26,
    fat: 18,
    fiber: 1,
    sodium: 900,
    sugar: 2,
    serving_size: '1 slice'
  },
  'Veggie Kebab Surprise': {
    calories: 230,
    protein: 9,
    carbohydrates: 29,
    fat: 9,
    fiber: 3,
    sodium: 560,
    sugar: 4,
    serving_size: '1 slice'
  },
  'Double Chicken Sausage': {
    calories: 340,
    protein: 15,
    carbohydrates: 27,
    fat: 17,
    fiber: 1,
    sodium: 880,
    sugar: 2,
    serving_size: '1 slice'
  },
  'Margherita': {
    calories: 250,
    protein: 10,
    carbohydrates: 30,
    fat: 10,
    fiber: 2,
    sodium: 600,
    sugar: 3,
    serving_size: '1 slice'
  },
  'Veggie Supreme': {
    calories: 220,
    protein: 9,
    carbohydrates: 28,
    fat: 9,
    fiber: 3,
    sodium: 550,
    sugar: 4,
    serving_size: '1 slice'
  },
  'Double Paneer Supreme': {
    calories: 270,
    protein: 11,
    carbohydrates: 26,
    fat: 14,
    fiber: 1,
    sodium: 620,
    sugar: 2,
    serving_size: '1 slice'
  },
  'Chicken Tikka': {
    calories: 300,
    protein: 13,
    carbohydrates: 29,
    fat: 14,
    fiber: 1,
    sodium: 780,
    sugar: 5,
    serving_size: '1 slice'
  }
};

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

async function addPizzaNutrition() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully!\n');
    
    console.log('Adding nutrition information to pizzas...\n');
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    for (const [name, nutrition] of Object.entries(pizzaNutritionData)) {
      const result = await Pizza.findOneAndUpdate(
        { name: name },
        { nutrition: nutrition },
        { new: true }
      );
      
      if (result) {
        console.log(`✓ Updated: ${name}`);
        console.log(`  → Calories: ${nutrition.calories}, Protein: ${nutrition.protein}g, Carbs: ${nutrition.carbohydrates}g, Fat: ${nutrition.fat}g\n`);
        updatedCount++;
      } else {
        console.log(`✗ Not found: ${name}\n`);
        notFoundCount++;
      }
    }
    
    console.log(`\n✅ Successfully updated ${updatedCount} pizzas!`);
    if (notFoundCount > 0) {
      console.log(`⚠️  ${notFoundCount} pizzas not found in database`);
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error adding nutrition information:', error.message);
    process.exit(1);
  }
}

addPizzaNutrition();