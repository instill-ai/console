import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";

export default async function Page() {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return <div />;
}
