#!/usr/bin/env sh

# Opcional: timezone (funciona em Debian/Ubuntu; no Alpine remova esta seção)
if [ "$SET_CONTAINER_TIMEZONE" = "true" ] && [ -n "$CONTAINER_TIMEZONE" ]; then
  echo "$CONTAINER_TIMEZONE" > /etc/timezone
  ln -sf "/usr/share/zoneinfo/$CONTAINER_TIMEZONE" /etc/localtime
  echo "Timezone set to $CONTAINER_TIMEZONE"
else
  echo "Timezone not modified"
fi

echo "Installing dependencies (if needed)..."
npm install --silent

echo "Starting server ..."
cross-env NODE_ENV=development nodemon --inspect=0.0.0.0 server.js | npx pino-pretty
