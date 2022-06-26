import { useMutation } from "react-query";
import { deployModelInstanceAction } from "@/lib/instill";

const useDeployModelInstance = () => {
  return useMutation(async (modelInstanceName: string) => {
    const modelInstance = await deployModelInstanceAction(modelInstanceName);
    return Promise.resolve(modelInstance);
  });
};

export default useDeployModelInstance;
