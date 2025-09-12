#!/usr/bin/env node

// API Testing Script for File Attachments
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5000';

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    
    return {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      data
    };
  } catch (error) {
    console.error('Request failed:', error.message);
    return { error: error.message };
  }
}

// Create a test lead first
async function createTestLead() {
  console.log('Creating test lead...');
  const leadData = {
    customerName: 'API Test Customer',
    email: 'test@example.com',
    phone: '555-123-4567',
    address: '123 Test Street',
    division: 'single-family',
    projectType: 'siding',
    priority: 'medium',
    status: 'new'
  };

  const response = await makeRequest(`${API_BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData)
  });

  if (response.ok) {
    console.log('✅ Lead created:', response.data.id);
    return response.data.id;
  } else {
    console.error('❌ Failed to create lead:', response.data);
    return null;
  }
}

// Test file upload
async function testFileUpload(leadId) {
  console.log('Testing file upload...');
  
  // Create a test file
  const testContent = 'This is a test file for API testing\nCreated at: ' + new Date().toISOString();
  const testFilePath = 'test-file.txt';
  fs.writeFileSync(testFilePath, testContent);

  try {
    // Create FormData for file upload
    const formData = new FormData();
    const fileBuffer = fs.readFileSync(testFilePath);
    const file = new File([fileBuffer], 'test-file.txt', { type: 'text/plain' });
    
    formData.append('file', file);
    formData.append('leadId', leadId);
    formData.append('uploadedBy', 'API Test');

    const response = await makeRequest(`${API_BASE}/api/attachments/upload`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      console.log('✅ File uploaded:', response.data.id);
      return response.data.id;
    } else {
      console.error('❌ File upload failed:', response.data);
      return null;
    }
  } finally {
    // Clean up test file
    try {
      fs.unlinkSync(testFilePath);
    } catch {}
  }
}

// Test listing attachments
async function testListAttachments(leadId) {
  console.log('Testing attachment listing...');
  
  const response = await makeRequest(`${API_BASE}/api/leads/${leadId}/attachments`);
  
  if (response.ok) {
    console.log('✅ Attachments listed:', response.data.length, 'files');
    return response.data;
  } else {
    console.error('❌ Failed to list attachments:', response.data);
    return [];
  }
}

// Test file download
async function testFileDownload(attachmentId) {
  console.log('Testing file download...');
  
  const response = await fetch(`${API_BASE}/api/attachments/${attachmentId}/download`);
  
  if (response.ok) {
    const contentDisposition = response.headers.get('content-disposition');
    const contentType = response.headers.get('content-type');
    const blob = await response.blob();
    
    console.log('✅ File download successful');
    console.log('  Content-Type:', contentType);
    console.log('  Content-Disposition:', contentDisposition);
    console.log('  File size:', blob.size, 'bytes');
    return true;
  } else {
    console.error('❌ File download failed:', response.status);
    return false;
  }
}

// Test file deletion
async function testFileDelete(attachmentId) {
  console.log('Testing file deletion...');
  
  const response = await makeRequest(`${API_BASE}/api/attachments/${attachmentId}`, {
    method: 'DELETE'
  });
  
  if (response.ok) {
    console.log('✅ File deleted successfully');
    return true;
  } else {
    console.error('❌ File deletion failed:', response.data);
    return false;
  }
}

// Test invalid file type
async function testInvalidFileType(leadId) {
  console.log('Testing invalid file type rejection...');
  
  // Create an invalid file type
  const testFilePath = 'test-invalid.exe';
  fs.writeFileSync(testFilePath, 'fake executable content');

  try {
    const formData = new FormData();
    const fileBuffer = fs.readFileSync(testFilePath);
    const file = new File([fileBuffer], 'test-invalid.exe', { type: 'application/x-executable' });
    
    formData.append('file', file);
    formData.append('leadId', leadId);

    const response = await makeRequest(`${API_BASE}/api/attachments/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok && (response.status === 415 || response.status === 400)) {
      console.log('✅ Invalid file type properly rejected');
      console.log('  Status:', response.status, '- Media type not supported');
      return true;
    } else {
      console.error('❌ Invalid file type was accepted (security risk)');
      console.error('  Expected: 415 or 400, Got:', response.status);
      return false;
    }
  } finally {
    try {
      fs.unlinkSync(testFilePath);
    } catch {}
  }
}

// Main test function
async function runTests() {
  console.log('🧪 Starting File Attachment API Tests\n');
  
  try {
    // Step 1: Create a test lead
    const leadId = await createTestLead();
    if (!leadId) {
      console.error('Cannot continue without a lead ID');
      return;
    }

    // Step 2: Test file upload
    const attachmentId = await testFileUpload(leadId);
    if (!attachmentId) {
      console.error('Cannot continue without an attachment ID');
      return;
    }

    // Step 3: Test listing attachments
    const attachments = await testListAttachments(leadId);
    if (attachments.length === 0) {
      console.error('No attachments found after upload');
      return;
    }

    // Step 4: Test file download
    await testFileDownload(attachmentId);

    // Step 5: Test invalid file type
    await testInvalidFileType(leadId);

    // Step 6: Test file deletion
    await testFileDelete(attachmentId);

    // Step 7: Verify deletion by listing again
    const remainingAttachments = await testListAttachments(leadId);
    if (remainingAttachments.length === 0) {
      console.log('✅ File deletion verified - no attachments remain');
    } else {
      console.error('❌ File deletion failed - attachments still exist');
    }

    console.log('\n🎉 API Tests Complete!');
    
  } catch (error) {
    console.error('Test execution failed:', error);
  }
}

// Run the tests
runTests();