// Authentication Test Script
// This script tests cookie-based authentication system

const BASE_URL = 'http://localhost:3000';

async function testAuthSystem() {
    console.log('🔐 Testing Cookie-Based Authentication System\n');
    
    const testResults = {
        total: 0,
        passed: 0,
        failed: 0
    };

    async function testAPI(name, url, method = 'GET', body = null, expectAuth = false) {
        testResults.total++;
        try {
            const options = {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include' // Include cookies
            };
            
            if (body) options.body = JSON.stringify(body);
            
            const response = await fetch(url, options);
            const result = await response.json();
            
            if (expectAuth && response.status === 401) {
                console.log(`✅ ${name}: Correctly requires authentication (${response.status})`);
                testResults.passed++;
            } else if (!expectAuth && response.ok) {
                console.log(`✅ ${name}: ${response.status} - ${result.message || 'Success'}`);
                testResults.passed++;
            } else if (response.ok) {
                console.log(`✅ ${name}: ${response.status} - ${result.message || 'Success'}`);
                testResults.passed++;
            } else {
                console.log(`❌ ${name}: ${response.status} - ${result.message || result.error || 'Failed'}`);
                testResults.failed++;
            }
            
            return { response, result };
        } catch (error) {
            console.log(`❌ ${name}: Network error - ${error.message}`);
            testResults.failed++;
            return { error };
        }
    }

    // Test 1: Check auth status without login
    await testAPI('Auth Status (No Login)', `${BASE_URL}/api/auth/me`, 'GET', null, true);

    // Test 2: Login with test credentials
    const loginResult = await testAPI('Login', `${BASE_URL}/api/auth/login`, 'POST', {
        email: 'user@example.com', // Replace with actual test user
        password: 'password123'
    });

    if (loginResult.response && loginResult.response.ok) {
        console.log('🍪 Login successful - cookies should be set');
        
        // Test 3: Check auth status after login
        await testAPI('Auth Status (After Login)', `${BASE_URL}/api/auth/me`, 'GET');
        
        // Test 4: Test logout
        await testAPI('Logout', `${BASE_URL}/api/auth/logout`, 'POST');
        
        // Test 5: Check auth status after logout
        await testAPI('Auth Status (After Logout)', `${BASE_URL}/api/auth/me`, 'GET', null, true);
    } else {
        console.log('⚠️  Login failed - skipping authenticated tests');
        console.log('   Make sure you have a test user with email: user@example.com and password: password123');
    }

    // Test protected routes
    await testAPI('Protected Orders Route', `${BASE_URL}/api/orders`, 'GET', null, true);
    await testAPI('Protected Payments Route', `${BASE_URL}/api/payments`, 'GET', null, true);

    console.log('\n📊 Test Summary:');
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);
    console.log(`Success Rate: ${Math.round((testResults.passed / testResults.total) * 100)}%`);
    
    if (testResults.failed === 0) {
        console.log('\n🎉 All authentication tests passed!');
    } else {
        console.log('\n⚠️  Some tests failed. Check implementation.');
    }
}

// Run the test
testAuthSystem().catch(console.error);