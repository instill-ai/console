#!/bin/sh

# We use this script to replace all the NEXT_PUBLIC_DISABLE_USAGE_COLLECTION env from "NEXT_PUBLIC_DISABLE_USAGE_COLLECTION"
# to true/false, user could input this variable from docker-compose env config

echo "DISABLE_USAGE_COLLECTION=$DISABLE_USAGE_COLLECTION"
test -n "$NEXT_PUBLIC_DISABLE_USAGE_COLLECTION"

find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#NEXT_PUBLIC_DISABLE_USAGE_COLLECTION#$DISABLE_USAGE_COLLECTION#g"

echo "Starting Nextjs"
exec "$@"