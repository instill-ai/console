import { GrpcIcon, HttpIcon } from "@instill-ai/design-system";

export const syncDataConnectionOptions = [
  {
    label: "http",
    value: "http",
    startIcon: (
      <HttpIcon
        width="w-[30px]"
        height="h-[30px]"
        color="fill-instillGrey90"
        position="my-auto"
      />
    ),
  },
  {
    label: "gRPC",
    value: "grpc",
    startIcon: (
      <GrpcIcon
        width="w-[30px]"
        height="h-[30px]"
        color="fill-instillGrey90"
        position="my-auto"
      />
    ),
  },
];
