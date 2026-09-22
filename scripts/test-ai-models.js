#!/usr/bin/env node
// AI Models Smoke Test (AGENTS.md Bagian 31.B)
// Test each configured AI provider/model

const https = require('https');
const http = require('http');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const TEST_MESSAGE = 'Halo, ini test. Tolong balas singkat.';

// Mock auth token (untuk local test — ganti dengan real token jika ada auth)
const AUTH_TOKEN = process.env.TEST_AUTH_TOKEN || '';

const MODELS_TO_TEST = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'llama-3.3-70b',
  'ministral-8b',
  'openrouter-free',
];

async function testModel(model) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      message: TEST_MESSAGE,
      model,
      conversationId: `test-${Date.now()}`,
    });

    const url = new URL(`${BASE_URL}/api/companion`);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...(AUTH_TOKEN && { Cookie: `auth-token=${AUTH_TOKEN}` }),
      },
    };

    const client = url.protocol === 'https:' ? https : http;
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode === 200 && json.reply) {
            resolve({ model, status: 'PASS', modelUsed: json.modelUsed, error: null });
          } else {
            resolve({ model, status: 'FAIL', modelUsed: null, error: json.error || `HTTP ${res.statusCode}` });
          }
        } catch (err) {
          resolve({ model, status: 'FAIL', modelUsed: null, error: 'Parse error' });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ model, status: 'FAIL', modelUsed: null, error: err.message });
    });

    req.setTimeout(15000, () => {
      req.destroy();
      resolve({ model, status: 'FAIL', modelUsed: null, error: 'Timeout' });
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🧪 ZYBA AI Models Smoke Test\n');
  console.log(`Testing ${MODELS_TO_TEST.length} models against ${BASE_URL}\n`);
  console.log('MODEL                   | STATUS | ACTUAL MODEL USED       | ERROR');
  console.log('------------------------|--------|-------------------------|------------------');

  const results = [];
  for (const model of MODELS_TO_TEST) {
    const result = await testModel(model);
    results.push(result);
    
    const pad = (s, len) => (s || '').padEnd(len).slice(0, len);
    const statusIcon = result.status === 'PASS' ? '✓' : '✗';
    console.log(
      `${pad(model, 23)} | ${statusIcon} ${result.status.padEnd(4)} | ${pad(result.modelUsed || '-', 23)} | ${result.error || ''}`
    );
  }

  console.log('\n📊 Summary:');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`✓ ${passed} passed`);
  console.log(`✗ ${failed} failed`);

  if (failed > 0) {
    console.log('\n⚠️  Some models failed. Check API keys in .env:');
    console.log('   - GEMINI_API_KEY');
    console.log('   - GROQ_API_KEY');
    console.log('   - MISTRAL_API_KEY');
    console.log('   - OPENROUTER_API_KEY');
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
