import { useEffect, useState } from "react";

import { getUserQuery, updateLocalUserMutation } from "@/lib/instill/mgmt";
import { InstillAiUserCookie, Nullable } from "@/types/general";
import axios from "axios";
import { useRouter } from "next/router";

export const useTrackingToken = () => {
  const [trackingToken, setTrackingToken] = useState<Nullable<string>>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrPatchToken = async () => {
      const instillAiUserCookie = await axios.get<InstillAiUserCookie>(
        "/api/get-user-cookie"
      );

      const user = await getUserQuery("users/local-user");

      // Both backend and cookie have user tracking token that means backend haven't been made down during the session.

      if (instillAiUserCookie.data.cookie_token && user.cookie_token) {
        if (instillAiUserCookie.data.cookie_token !== user.cookie_token) {
          console.error("User tracking token conflict, re-initialize cookie");

          await axios.post("/api/set-user-cookie", {
            token: user.cookie_token,
          });
        }
        setTrackingToken(user.cookie_token);
        return;
      }

      // Both backend and cookie don't have tracking token that means user haven't onboard yet.

      if (!instillAiUserCookie.data.cookie_token && !user.cookie_token) {
        setTrackingToken("redirect-to-onboard");
        return;
      }

      // We only have tracking token inside the backend that means our cookie had been expired.

      if (!instillAiUserCookie.data.cookie_token) {
        await axios.post("/api/set-user-cookie", {
          token: user.cookie_token,
        });
        setTrackingToken(user.cookie_token as string);
        return;
      }

      // We only have tracking token inside the cookie that means our backend had been made down.
      await updateLocalUserMutation({
        cookie_token: instillAiUserCookie.data.cookie_token,
      });
      setTrackingToken(instillAiUserCookie.data.cookie_token);
    };

    fetchOrPatchToken().catch((err) => console.error(err));
  }, [router.asPath]);

  return { data: trackingToken, setData: setTrackingToken };
};
