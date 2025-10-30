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

  // Handle plain error objects from fetch-based SDK client
  // Format: {code: number, message: string, details: any[]}
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    // If details exist and not empty, show details
    if (
      "details" in error &&
      Array.isArray(error.details) &&
      error.details.length > 0
    ) {
      return JSON.stringify(error.details, null, "\t");
    }
    // Otherwise show the message
    return error.message;
  }

  return null;
}
