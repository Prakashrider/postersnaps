#!/bin/bash

echo "🧪 Testing Netlify Functions Migration..."

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Install it with: npm install -g netlify-cli"
    exit 1
fi

echo "✅ Netlify CLI found"

# Test build
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Test functions (requires netlify dev)
echo "🚀 To test functions locally, run:"
echo "   netlify dev"
echo ""
echo "🌐 Then test endpoints:"
echo "   curl http://localhost:8888/api/health"
echo "   curl -X POST http://localhost:8888/api/check-auth -H 'Content-Type: application/json' -d '{}'"
echo ""
echo "✅ Migration complete!"
