#!/bin/bash

echo "Testing Netlify Functions..."

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s "http://localhost:8888/.netlify/functions/health" | jq .

# Test generate-poster endpoint
echo "2. Testing generate-poster endpoint..."
curl -s -X POST "http://localhost:8888/.netlify/functions/generate-poster" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-123",
    "inputMode": "keyword",
    "inputValue": "Test Poster",
    "style": "narrative",
    "contentType": "trending", 
    "outputFormat": "square",
    "minPages": 1,
    "maxPages": 2
  }' | jq .

# Wait a moment for poster generation
echo "3. Waiting for poster generation..."
sleep 2

# Test poster endpoint (using a sample ID)
echo "4. Testing poster endpoint with sample ID..."
curl -s "http://localhost:8888/.netlify/functions/poster?id=test-poster-id" | jq .

echo "Testing complete!"
