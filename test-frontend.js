// Simple frontend API test script
const BASE_URL = 'http://localhost:3000';

async function testFrontendDataFlow() {
    console.log('🧪 Testing frontend data flow...\n');
    
    try {
        // 1. Test API response format
        console.log('1. Testing Pizza API response format:');
        const response = await fetch(`${BASE_URL}/api/pizzas`);
        const data = await response.json();
        
        console.log('   API response structure:', {
            success: data.success,
            hasData: !!data.data,
            dataLength: data.data?.length,
            firstPizzaFields: data.data?.[0] ? Object.keys(data.data[0]) : 'N/A'
        });
        
        // 2. Test frontend page
        console.log('\n2. Testing frontend page response:');
        const pageResponse = await fetch(`${BASE_URL}/menu`);
        const pageHtml = await pageResponse.text();
        
        const hasUndefined = pageHtml.includes('undefined');
        const hasPizzaData = pageHtml.includes('Margherita') || pageHtml.includes('Pizza');
        
        console.log('   Page status:', {
            hasUndefinedErrors: hasUndefined,
            hasPizzaData: hasPizzaData,
            pageLength: pageHtml.length
        });
        
        // 3. Check first pizza data
        if (data.data && data.data.length > 0) {
            const firstPizza = data.data[0];
            console.log('\n3. First pizza data structure:');
            console.log('   Field check:', {
                hasId: !!firstPizza.id,
                hasName: !!firstPizza.name,
                hasImg: !!firstPizza.img,
                hasPrice: !!firstPizza.price,
                hasSizeandcrust: !!firstPizza.sizeandcrust,
                sizeandcrustType: typeof firstPizza.sizeandcrust
            });
        }
        
        console.log('\n✅ Frontend data flow test completed');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run test
testFrontendDataFlow();