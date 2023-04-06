import axios from "axios";
import { useEffect, useState } from "react";
import type { InstillAiUserCookie, Nullable } from "@instill-ai/toolkit";
import { useRouter } from "next/router";

export const useTrackingToken = () => {
  const [trackingToken, setTrackingToken] = useState<Nullable<string>>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrPatchToken = async () => {
      const instillAiUserCookie = await axios.get<InstillAiUserCookie>(
        "/api/get-user-cookie"
      );

      // we don't have cookie token, redirect to onboarding page
      if (!instillAiUserCookie.data.cookie_token) {
        setTrackingToken("redirect-to-onboard");
        return;
      }

      setTrackingToken(instillAiUserCookie.data.cookie_token);
    };

    fetchOrPatchToken().catch((err) => console.error(err));
  }, [router.asPath]);

  return { data: trackingToken, setData: setTrackingToken };
};
