import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import connectDB from '../lib/db.js';
import Topping from '../lib/models/Topping.js';

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

async function addToppingDescriptions() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    
    console.log('Adding descriptions to toppings...');
    
    let updatedCount = 0;
    for (const [name, description] of Object.entries(toppingDescriptions)) {
      const result = await Topping.findOneAndUpdate(
        { name: name },
        { description: description },
        { new: true }
      );
      
      if (result) {
        console.log(`✓ Updated: ${name} - "${description}"`);
        updatedCount++;
      } else {
        console.log(`✗ Not found: ${name}`);
      }
    }
    
    console.log(`\n✅ Successfully updated ${updatedCount} toppings!`);
    process.exit(0);
  } catch (error) {
    console.error('Error adding descriptions:', error);
    process.exit(1);
  }
}

addToppingDescriptions();
