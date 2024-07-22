import { generate } from "./generate";

function main() {
  generate("protobufs/openapiv2/vdp/service.swagger.yaml", {
    baseUrl: "http://localhost:8080",
    output: "mocks/vdp",
  });
  generate("protobufs/openapiv2/core/service.swagger.yaml", {
    baseUrl: "http://localhost:8080",
    output: "mocks/core",
  });
  generate("protobufs/openapiv2/model/service.swagger.yaml", {
    baseUrl: "http://localhost:8080",
    output: "mocks/model",
  });
}

main();
