import * as React from "react";

import { env } from "../../server";

export function useCreateUpdateDeleteResourceGuard() {
  const [enable, setEnable] = React.useState(false);

  React.useEffect(() => {
    setEnable(env("NEXT_PUBLIC_DISABLE_CREATE_UPDATE_DELETE_RESOURCE"));
  }, []);

  return enable;
}
