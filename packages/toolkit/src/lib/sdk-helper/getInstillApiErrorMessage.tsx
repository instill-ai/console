import { AxiosError, isAxiosError } from "axios";
import { InstillError } from "instill-sdk";

/* eslint-disable  @typescript-eslint/no-explicit-any */

export function getInstillApiErrorMessage(
  error: AxiosError<any, any> | unknown,
) {
  if (isAxiosError(error)) {
    if (!error.response) {
      return null;
    }

    if (!error.response.data.details && !error.response.data.message) {
      return null;
    }

    if (error.response.data.details.length === 0) {
      return error.response.data.message;
    }

    return JSON.stringify(error.response?.data.details, null, "\t");
  }

  if (error instanceof InstillError) {
    return error.response?.message ?? error.message;
  }

  return null;
}
