import {
  GitHubIcon,
  GoogleSheetIcon,
  GrpcIcon,
  HttpIcon,
  LocalUploadIcon,
  ModelInstanceIcon,
  MySqlIcon,
} from "@instill-ai/design-system";

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

export const mockAsyncDataConnectionOptions = [
  {
    label: "Google Sheet",
    value: "googleSheet",
    startIcon: (
      <GoogleSheetIcon width="w-[30px]" height="h-[30px]" position="my-auto" />
    ),
  },
  {
    label: "MySQL",
    value: "mySql",
    startIcon: (
      <MySqlIcon width="w-[30px]" height="h-[30px]" position="my-auto" />
    ),
  },
];

export const mockModelSourceOptions = [
  {
    label: "GitHub",
    value: "github",
    startIcon: (
      <GitHubIcon
        width="w-[30px]"
        height="h-[30px]"
        color="fill-instillGrey90"
        position="my-auto"
      />
    ),
  },
  {
    label: "Local",
    value: "local",
    startIcon: (
      <LocalUploadIcon
        width="w-[30px]"
        height="h-[30px]"
        color="fill-instillGrey90"
        position="my-auto"
      />
    ),
  },
];

export const mockModelInstances = [
  {
    label: "v1.0.0",
    value: "v1.0,0",
    startIcon: (
      <ModelInstanceIcon
        color="fill-instillGrey90"
        width="w-[30px]"
        height="h-[30px]"
        position="my-auto"
      />
    ),
  },
];
