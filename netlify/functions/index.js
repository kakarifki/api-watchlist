// This file ensures the functions directory is properly bundled

// Re-export the main API handler
exports.api = require('./api').handler;

// Export the test handler
exports.testPrisma = require('./test-prisma').handler;