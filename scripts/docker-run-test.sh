#!/bin/bash
# Because we store the script within a shell script file, you need to grant permission like `sudo chmod 755 './scripts/docker-build.sh'` at the root.

docker run -t --rm \
  -e NEXT_PUBLIC_GENERAL_API_VERSION=v1beta \
  -e NEXT_PUBLIC_MODEL_API_VERSION=v1alpha \
  -e NEXT_PUBLIC_CONSOLE_EDITION=local-ce:test \
  -e NEXT_PUBLIC_CONSOLE_BASE_URL=http://console:3000 \
  -e NEXT_PUBLIC_BASE_API_GATEWAY_URL=http://api-gateway:8080 \
  -e NEXT_SERVER_BASE_API_GATEWAY_URL=http://api-gateway:8080 \
  -e NEXT_PUBLIC_SELF_SIGNED_CERTIFICATION=false \
  -e NEXT_PUBLIC_INSTILL_AI_USER_COOKIE_NAME=instill-ai-user \
  --network instill-network \
  --entrypoint /bin/bash \
  --name console-integration-test \
  console-playwright:latest
