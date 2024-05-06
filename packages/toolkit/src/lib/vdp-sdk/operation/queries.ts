import { Operation } from "./types";
import { createInstillAxiosClient } from "../helper";
import { Nullable } from "../../type";

export type GetModelOperationResponse = {
  operation: Operation;
};

export async function getOperationQuery({
  operationName,
  accessToken,
}: {
  operationName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, true);

    const { data } = await client.get<GetModelOperationResponse>(
      `/${operationName}`
    );
    return Promise.resolve(data.operation);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function checkUntilOperationIsDoen({
  operationName,
  accessToken,
}: {
  operationName: string;
  accessToken: Nullable<string>;
}): Promise<boolean> {
  try {
    const operation = await getOperationQuery({
      operationName,
      accessToken,
    });

    if (operation.done) {
      return Promise.resolve(true);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = await checkUntilOperationIsDoen({
        operationName,
        accessToken,
      });
      return Promise.resolve(result);
    }
  } catch (err) {
    return Promise.reject(err);
  }
}
