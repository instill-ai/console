import {
  testModelInstance,
  TestModelInstancePayload,
} from "@/lib/instill/model/actions";
import { useMutation } from "react-query";

export const useTestModelInstance = () => {
  return useMutation(async (payload: TestModelInstancePayload) => {
    const result = await testModelInstance(payload);
    return result;
  });
};
