import { Nullable } from "../../../type";
import { createInstillAxiosClient, getQueryString } from "../../helper";
import { CreditConsumptionChartRecord } from "./types";

export type ListCreditConsumptionChartRecordResponse = {
  creditConsumptionChartRecords: CreditConsumptionChartRecord[];
  totalAmount: number;
};

export async function ListCreditConsumptionChartRecord({
  owner,
  start,
  stop,
  aggregationWindow,
  accessToken,
}: {
  owner: Nullable<string>;
  start: Nullable<string>;
  stop: Nullable<string>;
  aggregationWindow: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);

    const queryString = getQueryString({
      baseURL: `/metrics/credit/charts`,
      owner: owner ?? undefined,
      start: start ?? undefined,
      stop: stop ?? undefined,
      aggregationWindow: aggregationWindow ?? undefined,
      pageSize: null,
      nextPageToken: null,
    });

    const { data } =
      await client.get<ListCreditConsumptionChartRecordResponse>(queryString);

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}
