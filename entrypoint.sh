#!/bin/bash
echo "DISABLE_USAGE_COLLECTION=$DISABLE_USAGE_COLLECTION"
test -n "$DISABLE_USAGE_COLLECTION"
echo "MGMT_BACKEND_BASE_URL=$MGMT_BACKEND_BASE_URL"
test -n "$MGMT_BACKEND_BASE_URL"
echo "PIPELINE_BACKEND_BASE_URL=$PIPELINE_BACKEND_BASE_URL"
test -n "$PIPELINE_BACKEND_BASE_URL"
echo "CONNECTOR_BACKEND_BASE_URL=$CONNECTOR_BACKEND_BASE_URL"
test -n "$CONNECTOR_BACKEND_BASE_URL"
echo "MODEL_BACKEND_BASE_URL=$MODEL_BACKEND_BASE_URL"
test -n "$MODEL_BACKEND_BASE_URL"
echo "CONSOLE_BASE_URL=$CONSOLE_BASE_URL"
test -n "$CONSOLE_BASE_URL"
echo "API_VERSION=$API_VERSION"
test -n "$API_VERSION"
echo "CONSOLE_EDITION=$CONSOLE_EDITION"
test -n "$CONSOLE_EDITION"

NEXT_PUBLIC_DISABLE_USAGE_COLLECTION=$DISABLE_USAGE_COLLECTION NEXT_PUBLIC_MGMT_BACKEND_BASE_URL=$MGMT_BACKEND_BASE_URL NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL=$PIPELINE_BACKEND_BASE_URL NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL=$CONNECTOR_BACKEND_BASE_URL NEXT_PUBLIC_MODEL_BACKEND_BASE_URL=$MODEL_BACKEND_BASE_URL NEXT_PUBLIC_API_VERSION=$API_VERSION NEXT_PUBLIC_CONSOLE_BASE_URL=$CONSOLE_BASE_URL NEXT_PUBLIC_CONSOLE_EDITION=$CONSOLE_EDITION ./env.sh

node server.js
