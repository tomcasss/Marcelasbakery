// Quick JWT testing script
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'test-secret-key-change-in-production-very-long-string';
const JWT_REFRESH_SECRET = 'test-refresh-secret-key-change-in-production-very-long-string';

// Test token generation
console.log('Testing JWT Token Generation...\n');

const accessToken = jwt.sign(
  { adminId: 'admin' },
  JWT_SECRET,
  { expiresIn: '15m' }
);

const refreshToken = jwt.sign(
  { adminId: 'admin' },
  JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);

console.log('✓ Access Token Generated:');
console.log(accessToken);
console.log('\n✓ Refresh Token Generated:');
console.log(refreshToken);

// Test token verification
console.log('\n\nTesting JWT Token Verification...\n');

try {
  const decodedAccess = jwt.verify(accessToken, JWT_SECRET);
  console.log('✓ Access Token Verified Successfully:');
  console.log(decodedAccess);
} catch (err) {
  console.error('✗ Access Token Verification Failed:', err.message);
}

try {
  const decodedRefresh = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  console.log('\n✓ Refresh Token Verified Successfully:');
  console.log(decodedRefresh);
} catch (err) {
  console.error('✗ Refresh Token Verification Failed:', err.message);
}

// Test with wrong secret
console.log('\n\nTesting Invalid Token Verification (should fail)...\n');

try {
  jwt.verify(accessToken, 'wrong-secret');
  console.log('✗ Should have failed with wrong secret');
} catch (err) {
  console.log('✓ Correctly rejected token with wrong secret:', err.message);
}

console.log('\n✅ JWT Testing Complete!');
