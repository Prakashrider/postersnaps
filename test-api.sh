#!/bin/bash

# Test the PosterSnaps API
echo "🚀 Testing PosterSnaps API..."

# Test 1: Health check
echo "1. Health check..."
curl -s http://localhost:3000/api/health | jq .

# Test 2: Generate a poster
echo -e "\n2. Generating poster..."
SESSION_ID="test-session-$(date +%s)"
RESPONSE=$(curl -s -X POST http://localhost:3000/api/generate-poster \
  -H "Content-Type: application/json" \
  -d "{
    \"sessionId\": \"$SESSION_ID\",
    \"inputMode\": \"keyword\",
    \"inputValue\": \"artificial intelligence trends\",
    \"style\": \"narrative\",
    \"contentType\": \"trending\", 
    \"outputFormat\": \"square\",
    \"minPages\": 1,
    \"maxPages\": 2
  }")

echo $RESPONSE | jq .
POSTER_ID=$(echo $RESPONSE | jq -r '.posterId')

# Test 3: Check poster status
echo -e "\n3. Checking poster status..."
sleep 2
curl -s "http://localhost:3000/api/poster/$POSTER_ID" | jq .

echo -e "\n✅ Test completed!"
