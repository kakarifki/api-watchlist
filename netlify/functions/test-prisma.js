// Test file to verify Prisma client import
const { PrismaClient } = require('../../src/generated/prisma');

exports.handler = async function(event, context) {
  console.log('Testing Prisma client import');
  
  try {
    // Just create a client instance to verify it works
    const prisma = new PrismaClient();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Prisma client imported successfully' })
    };
  } catch (error) {
    console.error('Error importing Prisma client:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to import Prisma client', 
        error: error.message,
        stack: error.stack
      })
    };
  }
};