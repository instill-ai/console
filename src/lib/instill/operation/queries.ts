import axios from "axios";
import { Operation } from "../types";

export type GetOperationResponse = {
  operation: Operation;
};

export const getOperationQuery = async (
  operationName: string
): Promise<Operation> => {
  try {
    const { data } = await axios.get<GetOperationResponse>(
      `${process.env.NEXT_PUBLIC_MGMT_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/${operationName}`
    );
    return Promise.resolve(data.operation);
  } catch (err) {
    return Promise.reject(err);
  }
};
