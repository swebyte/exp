#!/usr/bin/env node

/**
 * Simple MCP test client
 *
 * This script demonstrates how to call MCP tools directly
 * Usage: node test-mcp.js <tool_name> [args_json]
 *
 * Examples:
 *   node test-mcp.js list_blog_posts '{"limit":3}'
 *   node test-mcp.js get_blog_post '{"id":1}'
 *   node test-mcp.js list_experience '{"limit":5}'
 *   node test-mcp.js ai_query '{"question":"How many users do I have?"}'
 */

import { spawn } from 'child_process';

const toolName = process.argv[2];
const toolArgs = process.argv[3] ? JSON.parse(process.argv[3]) : {};

if (!toolName) {
  console.log('Usage: node test-mcp.js <tool_name> [args_json]');
  console.log('\nAvailable tools:');
  console.log('  - list_blog_posts');
  console.log('  - get_blog_post');
  console.log('  - list_experience');
  console.log('  - get_experience');
  console.log('  - list_users');
  console.log('  - query_database');
  console.log('  - get_schema');
  console.log('  - ai_query');
  console.log('\nExamples:');
  console.log('  node test-mcp.js list_blog_posts \'{"limit":3}\'');
  console.log('  node test-mcp.js ai_query \'{"question":"What tables exist?"}\'');
  process.exit(1);
}

// Create MCP request
const request = {
  jsonrpc: '2.0',
  method: 'tools/call',
  params: {
    name: toolName,
    arguments: toolArgs,
  },
  id: 1,
};

console.log('Sending request to MCP server...');
console.log('Tool:', toolName);
console.log('Arguments:', JSON.stringify(toolArgs, null, 2));
console.log('');

// Spawn the MCP server process
const mcpServer = spawn('node', ['mcp-server/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
});

let responseData = '';

mcpServer.stdout.on('data', (data) => {
  responseData += data.toString();
});

mcpServer.stderr.on('data', (data) => {
  // Server logs go to stderr
  const log = data.toString();
  if (log.includes('running on stdio') || log.includes('connected')) {
    console.log('✓', log.trim());
  }
});

mcpServer.on('close', (code) => {
  if (responseData) {
    try {
      const response = JSON.parse(responseData);

      if (response.result) {
        console.log('\n=== RESULT ===');

        if (response.result.content && response.result.content[0]) {
          const content = response.result.content[0].text;

          try {
            // Try to parse as JSON for pretty printing
            const jsonData = JSON.parse(content);
            console.log(JSON.stringify(jsonData, null, 2));
          } catch {
            // Not JSON, print as-is
            console.log(content);
          }
        }
      } else if (response.error) {
        console.error('\n=== ERROR ===');
        console.error(response.error.message);
      }
    } catch (err) {
      console.error('Failed to parse response:', err.message);
      console.log('Raw response:', responseData);
    }
  }
});

// Send request to MCP server
mcpServer.stdin.write(JSON.stringify(request) + '\n');
mcpServer.stdin.end();
