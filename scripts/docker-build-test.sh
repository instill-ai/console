#!/bin/bash

docker build \
  -f Dockerfile.playwright \
  --build-arg TEST_USER='root' \
  -t instill-console-integration .
