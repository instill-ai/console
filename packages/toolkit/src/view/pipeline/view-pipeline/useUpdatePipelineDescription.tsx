import * as React from "react";
import { useToast } from "@instill-ai/design-system";
import {
  InstillStore,
  UpdateUserPipelinePayload,
  useEntity,
  useInstillStore,
  useShallow,
  useUpdateUserPipeline,
} from "../../../lib";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

export const useUpdatePipelineDescription = ({
  value,
  hasUnsavedChanges,
  setHasUnsavedChanges,
}: {
  value: string;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { accessToken } = useInstillStore(useShallow(selector));
  const { toast } = useToast();

  const entityObject = useEntity();

  const updatePipeline = useUpdateUserPipeline();

  React.useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(async () => {
      if (!entityObject.isSuccess) return;

      try {
        const payload: UpdateUserPipelinePayload = {
          name: entityObject.pipelineName,
          readme: value,
        };

        await updatePipeline.mutateAsync({ payload, accessToken });

        toast({
          size: "small",
          title: "Update pipeline readme successfully",
          variant: "alert-success",
        });

        setHasUnsavedChanges(false);
      } catch (err) {
        toast({
          size: "small",
          title:
            "Something went wrong, Please refresh the page and try again later",
          variant: "alert-error",
        });

        console.error(err);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [value, hasUnsavedChanges, setHasUnsavedChanges]);
};
