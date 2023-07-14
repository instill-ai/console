#!/bin/bash
# Because we store the script within a shell script file, you need to grant permission like `sudo chmod 755 './scripts/docker-build.sh'` at the root.

docker build \
  -f Dockerfile.playwright \
  --build-arg TEST_USER='root' \
  -t instill-console-integration .
