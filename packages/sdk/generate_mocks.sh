#!/bin/bash

rm -rf protobufs

# Clone the repository
git clone --depth 1 --branch "${1:-main}" https://github.com/instill-ai/protobufs.git

cd protobufs

## Back to the root of the SDK
cd ..

rm -rf mocks

## Create folder for each service

mkdir -p mocks/vdp
mkdir -p mocks/artifact
mkdir -p mocks/model
mkdir -p mocks/core

## Generate the mock server handles using the openapi spec

# npx msw-auto-mock --base-url http://localhost:8080 --max-array-length 5 protobufs/openapiv2/vdp/service.swagger.yaml -o ./mocks/vdp
# npx msw-auto-mock --base-url http://localhost:8080 --max-array-length 5 protobufs/openapiv2/artifact/service.swagger.yaml -o ./mocks/artifact
# npx msw-auto-mock --base-url http://localhost:8080 --max-array-length 5 protobufs/openapiv2/model/service.swagger.yaml -o ./mocks/model
# npx msw-auto-mock --base-url http://localhost:8080 --max-array-length 5 protobufs/openapiv2/core/service.swagger.yaml -o ./mocks/core

tsx generate-mocks/main.ts
