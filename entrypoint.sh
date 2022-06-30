#!/bin/sh

# We have built our production bundle with something like NEXT_PUBLIC_...=NEXT_PUBLIC_...
# Upon build nextjs will replace all the process.env.NEXT_PUBLIC_... with NEXT_PUBLIC_...
# Then we use this script to replace all NEXT_PUBLIC_... to the desired variable

# Caveat: Because upon the very first time we run this script, it will replace all the NEXT_PUBLIC_... to target value
# So it won't have any effect you run anytime onward, the script can't recognize what is your desired value, so it 
# can't dynamic change that for you, in other word, if you change the env variable in docker-compose, you need to re-build 
# the whole container.

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