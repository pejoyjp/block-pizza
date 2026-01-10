// Comprehensive API Test Script
const BASE_URL = 'http://localhost:3000';

// Color output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

// Logging functions
const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`${colors.cyan}🔧 ${msg}${colors.reset}`)
};

// Test results statistics
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Store test data
let testData = {
  userId: null,
  pizzaId: null,
  orderId: null,
  authToken: null
};

// Test single API
async function testAPI(name, url, method = 'GET', body = null, headers = {}) {
  testResults.total++;
  
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    log.info(`Testing: ${name} - ${method} ${url}`);
    
    const response = await fetch(url, options);
    const data = await response.text();
    
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      parsedData = data;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${data}`);
    }
    
    log.success(`${name} - Success`);
    
    // Show data summary
    if (typeof parsedData === 'object' && parsedData !== null) {
      if (Array.isArray(parsedData)) {
        log.info(`  Returned ${parsedData.length} records`);
      } else if (parsedData.data && Array.isArray(parsedData.data)) {
        log.info(`  Returned ${parsedData.data.length} records`);
      } else {
        const preview = JSON.stringify(parsedData, null, 2).substring(0, 200);
        console.log(`  Response: ${preview}${preview.length >= 200 ? '...' : ''}`);
      }
    }
    
    testResults.passed++;
    testResults.details.push({ name, status: 'PASS', response: parsedData });
    return { success: true, data: parsedData };
    
  } catch (error) {
    log.error(`${name} - Failed: ${error.message}`);
    testResults.failed++;
    testResults.details.push({ name, status: 'FAIL', error: error.message });
    return { success: false, error: error.message };
  }
}

// Database connection test
async function testDatabaseConnection() {
  log.section('Testing Database Connection');
  
  const result = await testAPI('Health Check', `${BASE_URL}/api/health`);
  
  if (result.success) {
    log.success('Database connection is normal');
  } else {
    log.error('Database connection failed');
  }
  
  console.log('');
  return result.success;
}

// User related API tests
async function testUserAPIs() {
  log.section('Testing User Related APIs');
  
  // Register test user
  const timestamp = Date.now();
  const testEmail = `test${timestamp}@example.com`;
  const registerResult = await testAPI(
    'User Registration',
    `${BASE_URL}/api/auth/register`,
    'POST',
    {
      name: `API Test User ${timestamp}`,
      email: testEmail,
      password: 'test123456',
      phone: '1234567890'
    }
  );
  
  if (registerResult.success && registerResult.data.data) {
    testData.userId = registerResult.data.data;
    log.info(`Created User ID: ${testData.userId}`);
  }
  
  // User login
  const loginResult = await testAPI(
    'User Login',
    `${BASE_URL}/api/auth/login`,
    'POST',
    {
      email: testEmail,
      password: 'test123456'
    }
  );
  
  if (loginResult.success && loginResult.data.token) {
    testData.authToken = loginResult.data.token;
    log.info(`Auth Token: ${testData.authToken.substring(0, 20)}...`);
  }
  
  // Get user info
  if (testData.userId) {
    await testAPI(
      'Get User Info',
      `${BASE_URL}/api/users/${testData.userId}`
    );
    
    // Get user contacts
    await testAPI(
      'Get User Contacts',
      `${BASE_URL}/api/users/${testData.userId}/contacts`
    );
    
    // Create contact
    const contactResult = await testAPI(
      'Create User Contact',
      `${BASE_URL}/api/users/${testData.userId}/contacts`,
      'POST',
      {
        name: 'Test Contact',
        phone: '9876543210',
        address: 'Test Address'
      }
    );
    
    // If contact created successfully, test getting single contact
    if (contactResult.success && contactResult.data.data) {
      await testAPI(
        'Get Single Contact',
        `${BASE_URL}/api/users/${testData.userId}/contacts/${contactResult.data.data}`
      );
    }
  }
  
  console.log('');
}

// Pizza related API tests
async function testPizzaAPIs() {
  log.section('Testing Pizza Related APIs');
  
  // Get all pizzas
  await testAPI('Get All Pizzas', `${BASE_URL}/api/pizzas`);
  
  // Get popular pizzas
  await testAPI('Get Popular Pizzas', `${BASE_URL}/api/pizzas?popular=true`);
  
  // Create new pizza
  const createResult = await testAPI(
    'Create New Pizza',
    `${BASE_URL}/api/pizzas`,
    'POST',
    {
      name: 'API Test Pizza',
      veg: true,
      price: 15.99,
      description: 'API Test Pizza',
      img: 'https://example.com/test-pizza.png',
      popular: false,
      inch9: 12.99,
      inch12: 18.99
    }
  );
  
  if (createResult.success && createResult.data.data) {
    testData.pizzaId = createResult.data.data;
    log.info(`Created Pizza ID: ${testData.pizzaId}`);
    
    // Get pizza by ID
    await testAPI(
      'Get Pizza by ID',
      `${BASE_URL}/api/pizzas/${testData.pizzaId}`
    );
    
    // Get pizza toppings
    await testAPI(
      'Get Pizza Toppings',
      `${BASE_URL}/api/pizzas/${testData.pizzaId}/toppings`
    );
    
    // Update pizza
    await testAPI(
      'Update Pizza',
      `${BASE_URL}/api/pizzas/${testData.pizzaId}`,
      'PUT',
      {
        name: 'Updated Test Pizza',
        veg: true,
        price: 17.99,
        description: 'Updated Test Pizza Description',
        img: 'https://example.com/updated-pizza.png',
        popular: true,
        inch9: 14.99,
        inch12: 20.99
      }
    );
  }
  
  console.log('');
}

// Order related API tests
async function testOrderAPIs() {
  log.section('Testing Order Related APIs');
  
  // Get all orders
  await testAPI('Get All Orders', `${BASE_URL}/api/orders`);
  
  // Get order pizzas
  await testAPI('Get Order Pizzas', `${BASE_URL}/api/orders/pizzas`);
  
  // Create new order
  if (testData.userId && testData.pizzaId) {
    const orderData = {
      userId: testData.userId,
      pizzas: [
        {
          pizzaId: testData.pizzaId,
          size: '12',
          quantity: 2,
          toppings: []
        }
      ],
      totalAmount: 35.98,
      address: 'Test Delivery Address',
      phone: '1234567890'
    };
    
    const createOrderResult = await testAPI(
      'Create New Order',
      `${BASE_URL}/api/orders`,
      'POST',
      orderData
    );
    
    if (createOrderResult.success && createOrderResult.data.data) {
      testData.orderId = createOrderResult.data.data;
      log.info(`Created Order ID: ${testData.orderId}`);
      
      // Get order by ID
      await testAPI(
        'Get Order by ID',
        `${BASE_URL}/api/orders/${testData.orderId}`
      );
      
      // Get order pizzas
      await testAPI(
        'Get Order Pizzas',
        `${BASE_URL}/api/orders/${testData.orderId}/pizzas`
      );
      
      // Complete order
      await testAPI(
        'Complete Order',
        `${BASE_URL}/api/orders/${testData.orderId}/complete`,
        'POST'
      );
    }
  }
  
  // Get user orders
  if (testData.userId) {
    await testAPI(
      'Get User Orders',
      `${BASE_URL}/api/orders/user/${testData.userId}`
    );
    
    await testAPI(
      'Get User Latest Order',
      `${BASE_URL}/api/orders/user/${testData.userId}/latest`
    );
  }
  
  // Test rider related API (using valid ObjectId)
  const riderId = '507f1f77bcf86cd799439011';
  await testAPI(
    'Get Rider Orders',
    `${BASE_URL}/api/orders/rider/${riderId}`
  );
  
  console.log('');
}

// Payment related API tests
async function testPaymentAPIs() {
  log.section('Testing Payment Related APIs');
  
  // Create payment intent
  const paymentData = {
    userId: testData.userId || '507f1f77bcf86cd799439011',
    instruction: 'Test order instructions',
    paymentStatus: 'pending',
    totalPrice: 25.00,
    status: 'Pending',
    paymentMethod: 'card',
    deliveryAddress: 'Test Delivery Address 123',
    contactPhone: '1234567890',
    deliveryMethod: 'delivery'
  };
  
  const paymentResult = await testAPI(
    'Create Payment Intent',
    `${BASE_URL}/api/payment`,
    'POST',
    paymentData
  );
  
  // Verify payment
  if (paymentResult.success && paymentResult.data.client_secret) {
    await testAPI(
      'Verify Payment',
      `${BASE_URL}/api/payment/verify`,
      'POST',
      {
        payment_intent_id: 'pi_test_123',
        orderId: testData.orderId || 'test-order-123'
      }
    );
  }
  
  console.log('');
}

// Feedback related API tests
async function testFeedbackAPIs() {
  log.section('Testing Feedback Related APIs');
  
  // Submit feedback
  await testAPI(
    'Submit Feedback',
    `${BASE_URL}/api/feedback`,
    'POST',
    {
      name: 'API Test User',
      email: 'test@example.com',
      feedback: 'This is an API test feedback',
      rating: 5
    }
  );
  
  // Get all feedback
  await testAPI('Get All Feedback', `${BASE_URL}/api/feedback`);
  
  console.log('');
}

// Clean up test data
async function cleanupTestData() {
  log.section('Cleaning Up Test Data');
  
  // Delete created pizza
  if (testData.pizzaId) {
    await testAPI(
      'Delete Test Pizza',
      `${BASE_URL}/api/pizzas/${testData.pizzaId}`,
      'DELETE'
    );
  }
  
  console.log('');
}

// Generate test report
function generateReport() {
  console.log(`${colors.cyan}📊 API Test Report${colors.reset}`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`${colors.green}Passed: ${testResults.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${testResults.failed}${colors.reset}`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`);
  console.log(`${'='.repeat(50)}`);
  
  if (testResults.failed > 0) {
    console.log(`${colors.red}Failed Tests:${colors.reset}`);
    testResults.details
      .filter(test => test.status === 'FAIL')
      .forEach(test => {
        console.log(`  ❌ ${test.name}: ${test.error}`);
      });
    console.log('');
  }
  
  console.log(`${colors.blue}Test Recommendations:${colors.reset}`);
  if (testResults.failed === 0) {
    log.success('🎉 All API tests passed! System is running normally.');
  } else {
    log.warning(`⚠️  ${testResults.failed} APIs need to be fixed`);
    console.log('Suggestions:');
    console.log('1. Check database connection status');
    console.log('2. Check API route configuration');
    console.log('3. Check data model definitions');
    console.log('4. Check permission validation logic');
  }
}

// Main test function
async function runComprehensiveTests() {
  console.log(`${colors.blue}🚀 Starting Comprehensive API Tests...${colors.reset}\n`);
  
  try {
    // 1. Database connection test
    const dbConnected = await testDatabaseConnection();
    
    if (!dbConnected) {
      log.error('Database connection failed, stopping tests');
      return;
    }
    
    // 2. User related API tests
    await testUserAPIs();
    
    // 3. Pizza related API tests
    await testPizzaAPIs();
    
    // 4. Order related API tests
    await testOrderAPIs();
    
    // 5. Payment related API tests
    await testPaymentAPIs();
    
    // 6. Feedback related API tests
    await testFeedbackAPIs();
    
    // 7. Clean up test data
    await cleanupTestData();
    
  } catch (error) {
    log.error(`Error during test execution: ${error.message}`);
    console.error(error);
  } finally {
    // 8. Generate test report
    generateReport();
  }
}

// Start tests
if (require.main === module) {
  runComprehensiveTests().catch(error => {
    log.error(`Test startup failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
}

module.exports = { runComprehensiveTests, testAPI };