import * as React from "react";
import {
  InstillStore,
  useInstillStore,
  useQuery,
  useShallow,
} from "@instill-ai/toolkit";
import { useRouter } from "next/navigation";
import { fetchAccessToken } from "./server";
import axios from "axios";

const selector = (store: InstillStore) => ({
  updateAccessToken: store.updateAccessToken,
  updateEnabledQuery: store.updateEnabledQuery,
});

type UseAccessTokenProps = {
  disabledRedirectingVisitor?: boolean;
  forceQueryWithoutAccessToken?: boolean;
};

export function useAppAccessToken(props?: UseAccessTokenProps) {
  const disabledRedirectingVisitor = props?.disabledRedirectingVisitor ?? false;
  const forceQueryWithoutAccessToken =
    props?.forceQueryWithoutAccessToken ?? false;
  const router = useRouter();

  const { updateAccessToken, updateEnabledQuery } = useInstillStore(
    useShallow(selector),
  );

  const query = useQuery({
    queryKey: ["accessToken"],
    queryFn: async (): Promise<string> => {
      try {
        const accessToken = await fetchAccessToken();
        return Promise.resolve(accessToken);
      } catch (error) {
        console.error(
          "Something went wrong when try to get accessToken",
          error,
        );

        if (!disabledRedirectingVisitor) {
          await axios.post("/api/remove-user-cookie", {
            key: "instill-auth-session",
          });
          router.push("/login");
        }

        return Promise.reject(error);
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    if (query.isError) {
      if (forceQueryWithoutAccessToken) {
        updateAccessToken(() => null);
        updateEnabledQuery(() => true);
        return;
      }

      updateAccessToken(() => null);
      updateEnabledQuery(() => false);
      return;
    }

    if (!query.isSuccess || !query.data) {
      updateAccessToken(() => null);
      updateEnabledQuery(() => false);
      return;
    }

    updateAccessToken(() => query.data);
    updateEnabledQuery(() => true);
  }, [
    query.isSuccess,
    query.data,
    query.isError,
    updateAccessToken,
    updateEnabledQuery,
  ]);

  return query;
}
