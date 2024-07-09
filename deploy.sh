#!/bin/bash
set -e

# Load environment variables
source .env

# Build Vue SPA
echo "Building Vue SPA..."
cd apps/anon-vue-client
bun run build
cd ../..

# Deploy Vue SPA
echo "Deploying Vue SPA..."
ssh -i $EC2_KEY_PATH $EC2_USER@$EC2_HOST "sudo mkdir -p /var/www/anon-app"
scp -i $EC2_KEY_PATH -r apps/anon-vue-client/dist/* $EC2_USER@$EC2_HOST:/var/www/anon-app/

# Deploy WebSocket server
echo "Deploying WebSocket server..."
ssh -i $EC2_KEY_PATH $EC2_USER@$EC2_HOST "mkdir -p /home/ec2-user/anon-app-websocket"
scp -i $EC2_KEY_PATH -r apps/websocket-server/* $EC2_USER@$EC2_HOST:/home/ec2-user/websocket-server/

# SSH into the instance and update the WebSocket server
ssh -i $EC2_KEY_PATH $EC2_USER@$EC2_HOST << 'ENDSSH'
cd /home/ec2-user/websocket-server
bun install
pm2 restart websocket-server || pm2 start "bun run src/index.ts" --name websocket-server
ENDSSH

echo "Deployment completed!"
