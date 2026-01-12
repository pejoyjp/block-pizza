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
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const toppingDescriptions = {
  'Extra Cheese': 'Generous amounts of melted mozzarella cheese for that perfect cheesy pull',
  'Mushrooms': 'Fresh sliced mushrooms with earthy flavor and tender texture',
  'Onions': 'Caramelized sweet onions that add sweetness and depth',
  'Black Olives': 'Briny and savory Mediterranean black olives',
  'Green Peppers': 'Crispy green bell peppers for a fresh crunch',
  'Pepperoni': 'Classic spicy Italian sausage with a kick',
  'Sausage': 'Savory Italian-style sausage crumble',
  'Bacon': 'Crispy smoked bacon bits for a smoky flavor',
  'Jalapeños': 'Spicy jalapeño peppers for heat lovers'
};

const toppingSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  is_veg: { type: Boolean, required: true },
  description: { type: String, default: '' }
}, { timestamps: true });

const Topping = mongoose.models.Topping || mongoose.model('Topping', toppingSchema);

async function addToppingDescriptions() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully!\n');
    
    console.log('Adding descriptions to toppings...\n');
    
    let updatedCount = 0;
    for (const [name, description] of Object.entries(toppingDescriptions)) {
      const result = await Topping.findOneAndUpdate(
        { name: name },
        { description: description },
        { new: true }
      );
      
      if (result) {
        console.log(`✓ Updated: ${name}`);
        console.log(`  → "${description}"\n`);
        updatedCount++;
      } else {
        console.log(`✗ Not found: ${name}\n`);
      }
    }
    
    console.log(`✅ Successfully updated ${updatedCount} toppings!`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error adding descriptions:', error.message);
    process.exit(1);
  }
}

addToppingDescriptions();
