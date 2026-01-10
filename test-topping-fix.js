// Simple script to test topping fix
const BASE_URL = 'http://localhost:3000';

async function testToppingFunctionality() {
    console.log('🧪 Testing Topping functionality fix...\n');
    
    try {
        // 1. Test getting toppings from pizza data on homepage
        console.log('1. Testing pizza data from homepage:');
        const pizzasResponse = await fetch(`${BASE_URL}/api/pizzas`);
        const pizzasData = await pizzasResponse.json();
        
        if (pizzasData.success && pizzasData.data.length > 0) {
            const firstPizza = pizzasData.data[0];
            console.log('   Pizza ID:', firstPizza.id);
            console.log('   Pizza _ID:', firstPizza._id);
            
            // Test toppings API
            const toppingsResponse = await fetch(`${BASE_URL}/api/pizzas/${firstPizza.id}/toppings`);
            const toppingsData = await toppingsResponse.json();
            
            if (toppingsResponse.ok) {
                console.log('   ✅ Toppings API works');
                console.log('   Number of toppings:', toppingsData.data?.length || 0);
            } else {
                console.log('   ❌ Toppings API failed:', toppingsData.message);
            }
        }
        
        // 2. Test getting pizza data from single page
        console.log('\n2. Testing pizza data from single page:');
        const singlePizzaResponse = await fetch(`${BASE_URL}/api/pizzas/${pizzasData.data[0].id}`);
        const singlePizzaData = await singlePizzaResponse.json();
        
        if (singlePizzaResponse.ok && singlePizzaData.success) {
            const pizza = singlePizzaData.data;
            console.log('   Pizza ID:', pizza.id);
            console.log('   Pizza _ID:', pizza._id);
            
            // Test toppings API
            const toppingsResponse = await fetch(`${BASE_URL}/api/pizzas/${pizza.id || pizza._id}/toppings`);
            const toppingsData = await toppingsResponse.json();
            
            if (toppingsResponse.ok) {
                console.log('   ✅ Toppings API works');
                console.log('   Number of toppings:', toppingsData.data?.length || 0);
            } else {
                console.log('   ❌ Toppings API failed:', toppingsData.message);
            }
        }
        
        console.log('\n✅ Topping functionality test completed');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run test
testToppingFunctionality();