import { generate } from "./generate";

function main() {
  generate("protobufs/openapi/v2/service.swagger.yaml", {
    baseUrl: "http://localhost:8080",
    output: "mocks",
  });
}

main();
