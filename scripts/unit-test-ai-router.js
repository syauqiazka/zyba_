// scripts/unit-test-ai-router.js
// Standalone unit test for CentralAIRouter, Registry, Prompts, and Fallback logic

const path = require('path');
const fs = require('fs');

// Load environment variables from .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

async function run() {
  console.log('🧪 Running ZYBA AI Router Standalone Integration Tests...\n');

  // Import CentralAIRouter
  const { CentralAIRouter } = require('../src/backend/ai/router');
  const { MODEL_REGISTRY, resolveModelDescriptor, getAvailableModels, getDefaultModelForMode } = require('../src/backend/ai/modelRegistry');
  const { buildSystemPrompt } = require('../src/backend/ai/prompts');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Registry & Resolvers Test
  console.log('1. Testing Model Registry & Aliases:');
  assert(MODEL_REGISTRY.length >= 8, 'Registry has at least 8 models configured');

  const resolvedLegacyGemini = resolveModelDescriptor('gemini-3.8-flash');
  assert(resolvedLegacyGemini && resolvedLegacyGemini.id === 'gemini-2.5-flash', 'Legacy gemini-3.8-flash resolves to gemini-2.5-flash');

  const resolvedLegacyGroq = resolveModelDescriptor('llama-3.3-70b');
  assert(resolvedLegacyGroq && resolvedLegacyGroq.id === 'llama-3.3-70b-versatile', 'Legacy llama-3.3-70b resolves to llama-3.3-70b-versatile');

  const resolvedCanonical = resolveModelDescriptor('gemini-2.5-flash');
  assert(resolvedCanonical && resolvedCanonical.provider === 'gemini', 'Canonical gemini-2.5-flash resolves to provider gemini');

  // 2. Mode-aware Prompts Test
  console.log('\n2. Testing Mode-aware System Prompts:');
  const codingPrompt = buildSystemPrompt('coding');
  assert(codingPrompt.systemPrompt.includes('ZYBA Code Assistant'), 'Coding mode contains code assistant system prompt');

  const learningPrompt = buildSystemPrompt('learning');
  assert(learningPrompt.systemPrompt.includes('Learning Mentor'), 'Learning mode contains learning mentor prompt');

  const analysisPrompt = buildSystemPrompt('analysis');
  assert(analysisPrompt.systemPrompt.includes('Deep Analyst'), 'Analysis mode contains deep analyst prompt');

  const companionKina = buildSystemPrompt('companion', 'KINA');
  assert(companionKina.systemPrompt.includes('Kina') && companionKina.systemPrompt.includes('kelinci'), 'Companion mode with KINA includes Kina persona');

  const companionBruno = buildSystemPrompt('companion', 'BRUNO');
  assert(companionBruno.systemPrompt.includes('Bruno') && companionBruno.systemPrompt.includes('beruang'), 'Companion mode with BRUNO includes Bruno persona');

  // 3. CentralAIRouter Execution Test (Live execution with fallback safety)
  console.log('\n3. Testing CentralAIRouter Execution (Live & Fallback Gracefulness):');
  
  // Test Companion Mode
  const compRes = await CentralAIRouter.execute({
    message: 'Halo Kina, aku lagi cemas.',
    mode: 'companion',
    persona: 'KINA',
  });
  assert(typeof compRes.reply === 'string' && compRes.reply.length > 0, `Companion response received (${compRes.reply.slice(0, 40)}...)`);
  assert(compRes.providerStatus === 'API_LIVE' || compRes.providerStatus === 'PERSONA_FALLBACK', 'Valid provider status returned');
  console.log(`     Model Used: ${compRes.modelUsed} | Provider: ${compRes.provider} | Latency: ${compRes.latencyMs}ms | Fallback: ${compRes.isFallback}`);

  // Test Coding Mode
  const codeRes = await CentralAIRouter.execute({
    message: 'Tulis fungsi TypeScript untuk debounce.',
    mode: 'coding',
    model: 'llama-3.3-70b-versatile',
  });
  assert(typeof codeRes.reply === 'string' && codeRes.reply.length > 0, 'Coding mode response received');
  console.log(`     Model Used: ${codeRes.modelUsed} | Provider: ${codeRes.provider} | Latency: ${codeRes.latencyMs}ms | Fallback: ${codeRes.isFallback}`);

  // Test Diagnostics
  console.log('\n4. Testing Provider Diagnostics:');
  const diagnostics = await CentralAIRouter.runDiagnostics();
  assert(Array.isArray(diagnostics) && diagnostics.length === 5, 'Diagnostics checked 5 providers');
  diagnostics.forEach((d) => {
    console.log(`     ${d.provider.padEnd(12)}: Configured=${d.configured}, Authenticated=${d.authenticated}, Latency=${d.latencyMs ?? '-'}ms, Error=${d.error || 'None'}`);
  });

  console.log(`\n🏁 Test Results: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
