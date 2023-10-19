#!/bin/bash
# Because we store the script within a shell script file, you need to grant permission like `sudo chmod 755 './scripts/docker-build.sh'` at the root.

docker run --rm -t \
  --network instill-network \
  --entrypoint ./entrypoint.sh \
  -p 3000:3000 \
  -e NEXT_PUBLIC_CONSOLE_BASE_URL='http://localhost:3000' \
  -e NEXT_PUBLIC_API_VERSION='v1alpha' \
  -e NEXT_PUBLIC_API_GATEWAY_URL='http://localhost:8080' \
  -e NEXT_SERVER_API_GATEWAY_URL='http://localhost:8080' \
  -e NEXT_PUBLIC_INSTILL_AI_USER_COOKIE_NAME='instill-ai-user' \
  -e NEXT_PUBLIC_DISABLE_CREATE_UPDATE_DELETE_RESOURCE=false \
  -e NEXT_PUBLIC_SET_SECURE_COOKIE=false \
  --name instill-console \
  instill-console
