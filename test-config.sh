#!/bin/bash

# Test PosterSnaps API with different configurations
echo "🧪 Testing PosterSnaps Configuration Parameter Passing..."

# Test 1: Quote style, Portrait format, Informative content
echo -e "\n1. Testing Quote Style, Portrait Format, Informative Content..."
SESSION_ID="test-config-$(date +%s)"
RESPONSE=$(curl -s -X POST http://localhost:3000/api/generate-poster \
  -H "Content-Type: application/json" \
  -d "{
    \"sessionId\": \"$SESSION_ID\",
    \"inputMode\": \"keyword\",
    \"inputValue\": \"climate change solutions\",
    \"style\": \"quote\",
    \"contentType\": \"informative\", 
    \"outputFormat\": \"portrait\",
    \"minPages\": 2,
    \"maxPages\": 4
  }")

echo "Response: $RESPONSE"
POSTER_ID=$(echo $RESPONSE | jq -r '.posterId')

# Wait and check the generated poster
echo -e "\n2. Checking generated poster configuration..."
sleep 3
POSTER_STATUS=$(curl -s "http://localhost:3000/api/poster/$POSTER_ID")
echo "Poster Status: $POSTER_STATUS"

# Test 2: Pointers style, Story format, Trending content
echo -e "\n3. Testing Pointers Style, Story Format, Trending Content..."
SESSION_ID2="test-config2-$(date +%s)"
RESPONSE2=$(curl -s -X POST http://localhost:3000/api/generate-poster \
  -H "Content-Type: application/json" \
  -d "{
    \"sessionId\": \"$SESSION_ID2\",
    \"inputMode\": \"keyword\",
    \"inputValue\": \"future technology trends\",
    \"style\": \"pointers\",
    \"contentType\": \"trending\", 
    \"outputFormat\": \"story\",
    \"minPages\": 1,
    \"maxPages\": 2
  }")

echo "Response 2: $RESPONSE2"
POSTER_ID2=$(echo $RESPONSE2 | jq -r '.posterId')

# Wait and check the generated poster
echo -e "\n4. Checking second generated poster configuration..."
sleep 3
POSTER_STATUS2=$(curl -s "http://localhost:3000/api/poster/$POSTER_ID2")
echo "Poster Status 2: $POSTER_STATUS2"

echo -e "\n✅ Configuration test completed!"
