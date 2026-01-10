// Simple API Test Script
const BASE_URL = 'http://localhost:3000';

// Color output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Logging functions
const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`)
};

// Test single API
async function testAPI(name, url, method = 'GET', body = null) {
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    log.info(`Testing: ${name} - ${method} ${url}`);
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    log.success(`${name} - Success`);
    
    // Show data summary
    if (Array.isArray(data)) {
      log.info(`  Returned ${data.length} records`);
      if (data.length > 0) {
        console.log(`  Sample data:`, JSON.stringify(data[0], null, 2).substring(0, 200) + '...');
      }
    } else if (data.data && Array.isArray(data.data)) {
      log.info(`  Returned ${data.data.length} records`);
      if (data.data.length > 0) {
        console.log(`  Sample data:`, JSON.stringify(data.data[0], null, 2).substring(0, 200) + '...');
      }
    } else {
      console.log(`  Response:`, JSON.stringify(data, null, 2).substring(0, 300) + '...');
    }
    
    return { success: true, data };
    
  } catch (error) {
    log.error(`${name} - Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main test function
async function runTests() {
  console.log(`${colors.blue}🚀 Starting API Tests...${colors.reset}\n`);
  
  const tests = [
    {
      name: 'Health Check',
      url: `${BASE_URL}/api/health`
    },
    {
      name: 'Get All Pizzas',
      url: `${BASE_URL}/api/pizzas`
    },
    {
      name: 'Get Popular Pizzas',
      url: `${BASE_URL}/api/pizzas?popular=true`
    },
    {
      name: 'Create New Pizza',
      url: `${BASE_URL}/api/pizzas`,
      method: 'POST',
      body: {
        name: 'API Test Pizza',
        veg: true,
        price: 5.99,
        description: 'API Test Pizza',
        img: 'https://example.com/test.png',
        popular: false,
        inch9: 7.99,
        inch12: 9.99
      }
    }
  ];

  let passed = 0;
  let failed = 0;
  let createdPizzaId = null;

  for (const test of tests) {
    const result = await testAPI(
      test.name, 
      test.url, 
      test.method || 'GET', 
      test.body || null
    );
    
    if (result.success) {
      passed++;
      // If creating pizza, save ID for subsequent tests
      if (test.name === 'Create New Pizza' && result.data && result.data.data) {
        createdPizzaId = result.data.data;
        log.info(`  Created Pizza ID: ${createdPizzaId}`);
      }
    } else {
      failed++;
    }
    
    console.log(''); // Empty line separator
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
  }

  // If pizza created successfully, test related APIs
  if (createdPizzaId) {
    console.log(`${colors.blue}🔍 Testing Pizza Related APIs...${colors.reset}\n`);
    
    const pizzaTests = [
      {
        name: 'Get Pizza by ID',
        url: `${BASE_URL}/api/pizzas/${createdPizzaId}`
      },
      {
        name: 'Get Pizza Toppings',
        url: `${BASE_URL}/api/pizzas/${createdPizzaId}/toppings`
      },
      {
        name: 'Update Pizza',
        url: `${BASE_URL}/api/pizzas/${createdPizzaId}`,
        method: 'PUT',
        body: {
          name: 'Updated Test Pizza',
          veg: true,
          price: 6.99,
          description: 'Updated Test Pizza',
          img: 'https://example.com/updated.png',
          popular: true,
          inch9: 8.99,
          inch12: 10.99
        }
      },
      {
        name: 'Delete Pizza',
        url: `${BASE_URL}/api/pizzas/${createdPizzaId}`,
        method: 'DELETE'
      }
    ];

    for (const test of pizzaTests) {
      const result = await testAPI(
        test.name, 
        test.url, 
        test.method || 'GET', 
        test.body || null
      );
      
      if (result.success) {
        passed++;
      } else {
        failed++;
      }
      
      console.log(''); // Empty line separator
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }
  }

  // Output test results
  console.log(`${colors.blue}📊 Test Results Summary:${colors.reset}`);
  console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
  
  if (failed === 0) {
    log.success('🎉 All API tests passed!');
  } else {
    log.warning(`⚠️  ${failed} tests failed`);
  }
}

// Start tests
runTests().catch(error => {
  log.error(`Test execution failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});