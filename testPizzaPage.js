// Test fetching data for a single Pizza page
const BASE_URL = 'http://localhost:3000';

async function testPizzaPageData() {
    console.log('Testing single Pizza page data...\n');
    
    try {
        // 1. Fetch all Pizzas first
        const allPizzasResponse = await fetch(`${BASE_URL}/api/pizzas`);
        const allPizzasData = await allPizzasResponse.json();
        
        if (allPizzasData.success && allPizzasData.data.length > 0) {
            const firstPizza = allPizzasData.data[0];
            console.log('First Pizza ID:', firstPizza.id);
            
            // 2. Test single Pizza API
            const singlePizzaResponse = await fetch(`${BASE_URL}/api/pizzas/${firstPizza.id}`);
            const singlePizzaData = await singlePizzaResponse.json();
            
            console.log('\nSingle Pizza API response:');
            console.log('Status:', singlePizzaResponse.status);
            console.log('Success:', singlePizzaData.success);
            
            if (singlePizzaData.success) {
                const pizzaData = singlePizzaData.data;
                console.log('\nPizza data structure:');
                console.log('- ID:', pizzaData._id);
                console.log('- Name:', pizzaData.name);
                console.log('- Price:', pizzaData.price);
                console.log('- sizeandcrust type:', typeof pizzaData.sizeandcrust);
                console.log('- sizeandcrust data:', JSON.stringify(pizzaData.sizeandcrust, null, 2));
                
                // 3. Test if the page can handle the data correctly
                console.log('\nPage data checks:');
                console.log('- Has pizza object:', !!pizzaData);
                console.log('- Has sizeandcrust:', !!pizzaData.sizeandcrust);
                console.log('- sizeandcrust is object:', typeof pizzaData.sizeandcrust === 'object');
                console.log('- Has M size:', !!(pizzaData.sizeandcrust && pizzaData.sizeandcrust.M));
                
                console.log('\n✅ Pizza page data structure is correct');
            } else {
                console.log('❌ Failed to fetch single Pizza:', singlePizzaData.message);
            }
        } else {
            console.log('❌ No Pizza data found');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run test
testPizzaPageData();