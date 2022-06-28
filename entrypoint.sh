#!/bin/sh

# We use this script to replace all the NEXT_PUBLIC_DISABLE_USAGE_COLLECTION env from "NEXT_PUBLIC_DISABLE_USAGE_COLLECTION"
# to true/false, user could input this variable from docker-compose env config

echo "DISABLE_USAGE_COLLECTION=$DISABLE_USAGE_COLLECTION"
test -n "$DISABLE_USAGE_COLLECTION"
echo "MGMT_API_ENDPOINT=$MGMT_API_ENDPOINT"
test -n "$MGMT_API_ENDPOINT"
echo "PIPELINE_API_ENDPOINT=$PIPELINE_API_ENDPOINT"
test -n "$PIPELINE_API_ENDPOINT"
echo "CONNECTOR_API_ENDPOINT=$CONNECTOR_API_ENDPOINT"
test -n "$CONNECTOR_API_ENDPOINT"
echo "MODEL_API_ENDPOINT=$MODEL_API_ENDPOINT"
test -n "$MODEL_API_ENDPOINT"
echo "API_VERSION=$API_VERSION"
test -n "$API_VERSION"

find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#NEXT_PUBLIC_DISABLE_USAGE_COLLECTION#$DISABLE_USAGE_COLLECTION#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#NEXT_PUBLIC_MGMT_API_ENDPOINT#$MGMT_API_ENDPOINT#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#NEXT_PUBLIC_PIPELINE_API_ENDPOINT#$PIPELINE_API_ENDPOINT#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#NEXT_PUBLIC_CONNECTOR_API_ENDPOINT#$CONNECTOR_API_ENDPOINT#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#NEXT_PUBLIC_MODEL_API_ENDPOINT#$MODEL_API_ENDPOINT#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#NEXT_PUBLIC_API_VERSION#$API_VERSION#g"

echo "Starting Nextjs"
exec "$@"