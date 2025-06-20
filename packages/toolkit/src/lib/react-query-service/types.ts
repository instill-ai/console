import { QueryObserverOptions } from "@tanstack/react-query";
import { Nullable } from "instill-sdk";

export type QueryBaseProps<T = unknown> = {
  accessToken: Nullable<string>;
  enabled: boolean;
  refetchInterval?: QueryObserverOptions<T>["refetchInterval"];
};
