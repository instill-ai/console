import { env } from "@/utils";
import { useEffect, useState } from "react";

export const useCreateUpdateDeleteResourceGuard = () => {
  const [enable, setEnable] = useState(false);

  useEffect(() => {
    setEnable(
      env("NEXT_PUBLIC_DISABLE_CREATE_UPDATE_DELETE_RESOURCE") === "true"
        ? true
        : false
    );
  }, []);

  return enable;
};
