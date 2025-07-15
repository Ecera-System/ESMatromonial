// Test script to verify URL construction
const serverUrl = process.env.SERVER_URL || "http://localhost:5000";
const token = "test-token-123";
const verificationUrl = `${serverUrl}/api/v1/verification/email/verify?token=${token}`;
const resetUrl = `${serverUrl}/reset-password/${token}`;

console.log("Environment variables:");
console.log("SERVER_URL:", process.env.SERVER_URL);
console.log("CLIENT_URL:", process.env.CLIENT_URL);

console.log("\nConstructed URLs:");
console.log("Verification URL:", verificationUrl);
console.log("Reset URL:", resetUrl);

console.log("\nURL validation:");
console.log("Verification URL valid:", verificationUrl.startsWith("http://"));
console.log("Reset URL valid:", resetUrl.startsWith("http://"));
