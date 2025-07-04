import { generateAIContent } from './services/openai.js';

// Test different configurations to ensure they produce different results
async function testConfigurations() {
  console.log('🧪 Testing different configurations...\n');

  // Test 1: Narrative style, trending content
  console.log('Test 1: Narrative + Trending');
  const narrative = await generateAIContent({
    input: 'artificial intelligence',
    inputMode: 'keyword',
    style: 'narrative',
    contentType: 'trending',
    metadata: null,
    minPages: 1,
    maxPages: 1,
    variation: 1,
    totalPosters: 1
  });
  console.log('Result:', {
    headline: narrative.headline,
    subtitle: narrative.subtitle.substring(0, 50) + '...',
    bulletCount: narrative.bulletPoints.length
  });

  // Test 2: Quote style, informative content
  console.log('\nTest 2: Quote + Informative');
  const quote = await generateAIContent({
    input: 'artificial intelligence',
    inputMode: 'keyword',
    style: 'quote',
    contentType: 'informative',
    metadata: null,
    minPages: 1,
    maxPages: 1,
    variation: 1,
    totalPosters: 1
  });
  console.log('Result:', {
    headline: quote.headline,
    subtitle: quote.subtitle.substring(0, 50) + '...',
    bulletCount: quote.bulletPoints.length
  });

  // Test 3: Pointers style, awareness content
  console.log('\nTest 3: Pointers + Awareness');
  const pointers = await generateAIContent({
    input: 'artificial intelligence',
    inputMode: 'keyword',
    style: 'pointers',
    contentType: 'awareness',
    metadata: null,
    minPages: 1,
    maxPages: 1,
    variation: 1,
    totalPosters: 1
  });
  console.log('Result:', {
    headline: pointers.headline,
    subtitle: pointers.subtitle.substring(0, 50) + '...',
    bulletCount: pointers.bulletPoints.length
  });

  // Compare results
  console.log('\n📊 Configuration Impact Analysis:');
  console.log('- Narrative subtitle:', narrative.subtitle.substring(0, 30) + '...');
  console.log('- Quote subtitle:', quote.subtitle.substring(0, 30) + '...');
  console.log('- Pointers subtitle:', pointers.subtitle.substring(0, 30) + '...');
  
  console.log('\n✅ Configuration test completed!');
}

testConfigurations().catch(console.error);
