import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { getUserQuery, updateLocalUserMutation } from "@/lib/instill/mgmt";
import { Nullable } from "@/types/general";

const useTrackingToken = () => {
  const [trackingToken, setTrackingToken] = useState<Nullable<string>>(null);

  useEffect(() => {
    const fetchOrPatchToken = async () => {
      const user = await getUserQuery("users/local-user");
      if (user.cookie_token) {
        setTrackingToken(user.cookie_token);
        return;
      }

      const newTrackingToken = uuidv4();

      const newUser = await updateLocalUserMutation({
        name: "users/local-user",
        cookie_token: newTrackingToken,
      });

      setTrackingToken(newTrackingToken);
    };

    fetchOrPatchToken().catch((err) => console.error(err));
  }, []);

  return trackingToken;
};

export default useTrackingToken;
