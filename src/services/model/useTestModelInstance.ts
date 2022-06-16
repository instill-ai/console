import {
  testModelInstance,
  TestModelInstancePayload,
} from "@/lib/instill/model/actions";
import { useMutation } from "react-query";

const useTestModelInstance = () => {
  return useMutation(async (payload: TestModelInstancePayload) => {
    const result = await testModelInstance(payload);
    return result;
  });
};

export default useTestModelInstance;
