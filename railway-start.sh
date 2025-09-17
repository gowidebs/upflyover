#!/bin/bash

echo "🚀 Starting Upflyover Backend on Railway..."

# Install missing dependencies if they don't exist
echo "📦 Checking for missing dependencies..."

if ! npm list swagger-jsdoc > /dev/null 2>&1; then
    echo "Installing swagger-jsdoc..."
    npm install swagger-jsdoc@6.2.8 --save
fi

if ! npm list swagger-ui-express > /dev/null 2>&1; then
    echo "Installing swagger-ui-express..."
    npm install swagger-ui-express@5.0.0 --save
fi

if ! npm list express-rate-limit > /dev/null 2>&1; then
    echo "Installing express-rate-limit..."
    npm install express-rate-limit@7.1.5 --save
fi

echo "✅ Dependencies check complete"

# Start the server
echo "🌟 Starting server..."
node server.js