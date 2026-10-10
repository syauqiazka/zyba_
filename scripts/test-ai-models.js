#!/usr/bin/env node
// AI Models & Multi-Mode Integration Test (SPEC TAHAP KEDELAPAN — AGENTS.md 19, 21)

const https = require('https');
const http = require('http');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const AUTH_TOKEN = process.env.TEST_AUTH_TOKEN || '';

const TEST_CASES = [
  {
    name: "Gemini 2.5 Flash (Resmi)",
    model: "gemini-2.5-flash",
    mode: "companion",
    persona: "KINA",
    message: "Halo Kina, aku lagi ngerasa agak overwhelmed sama tugas kuliah.",
  },
  {
    name: "Groq Llama 3.3 70B (Resmi)",
    model: "llama-3.3-70b-versatile",
    mode: "coding",
    persona: "OLLIE",
    message: "Bagaimana cara melakukan debouncing fungsi di JavaScript?",
  },
  {
    name: "Mistral 8B (Resmi)",
    model: "ministral-8b-latest",
    mode: "companion",
    persona: "RUBI",
    message: "Halo Rubi, mau cerita santai dong hari ini.",
  },
  {
    name: "OpenRouter Gemma 4 31B (Resmi)",
    model: "gemma-4-31b-free",
    mode: "learning",
    persona: "OLLIE",
    message: "Bisa jelaskan konsep rekursi secara sederhana dengan analogi?",
  },
  {
    name: "Legacy Alias Mapping (gemini-3.8-flash -> gemini-2.5-flash)",
    model: "gemini-3.8-flash",
    mode: "companion",
    persona: "BRUNO",
    message: "Halo Bruno, dadaku rasanya deg-degan cemas.",
  },
  {
    name: "Mode Analysis Deep Test",
    model: "llama-3.3-70b-versatile",
    mode: "analysis",
    persona: "OLLIE",
    message: "Analisis faktor-faktor penyebab burnout pada mahasiswa tingkat akhir.",
  },
];

async function runTestCase(testCase) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      message: testCase.message,
      model: testCase.model,
      mode: testCase.mode,
      persona: testCase.persona,
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
    const startTime = Date.now();
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const latency = Date.now() - startTime;
        try {
          const json = JSON.parse(data);
          if (res.statusCode === 200 && json.reply) {
            resolve({
              ...testCase,
              status: 'PASS',
              modelUsed: json.modelUsed,
              isFallback: json.isFallback,
              fallbackReason: json.fallbackReason,
              latency,
              error: null,
            });
          } else {
            resolve({
              ...testCase,
              status: 'FAIL',
              modelUsed: json.modelUsed || null,
              latency,
              error: json.error || `HTTP ${res.statusCode}`,
            });
          }
        } catch (err) {
          resolve({ ...testCase, status: 'FAIL', modelUsed: null, latency, error: 'JSON Parse Error' });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ ...testCase, status: 'FAIL', modelUsed: null, latency: Date.now() - startTime, error: err.message });
    });

    req.setTimeout(15000, () => {
      req.destroy();
      resolve({ ...testCase, status: 'FAIL', modelUsed: null, latency: 15000, error: 'Timeout' });
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🧪 ZYBA AI Infrastructure & Multi-Mode Test Suite\n');
  console.log(`Target: ${BASE_URL}\n`);
  console.log('TEST CASE                           | STATUS | MODEL USED        | FALLBACK | LATENCY | NOTES');
  console.log('------------------------------------|--------|-------------------|----------|---------|------------------');

  const results = [];
  for (const tc of TEST_CASES) {
    const r = await runTestCase(tc);
    results.push(r);

    const pad = (s, len) => (String(s || '')).padEnd(len).slice(0, len);
    const statusIcon = r.status === 'PASS' ? '✓' : '✗';
    const fallbackStr = r.isFallback ? 'YES' : 'NO';
    console.log(
      `${pad(r.name, 35)} | ${statusIcon} ${r.status.padEnd(4)} | ${pad(r.modelUsed || '-', 17)} | ${pad(fallbackStr, 8)} | ${pad(r.latency + 'ms', 7)} | ${r.error || r.fallbackReason || 'OK'}`
    );
  }

  console.log('\n📊 Summary:');
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`✓ ${passed} Passed`);
  console.log(`✗ ${failed} Failed`);
}

main();
