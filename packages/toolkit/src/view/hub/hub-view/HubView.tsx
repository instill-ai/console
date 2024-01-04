import { UserProfileCardProps } from "../../../components";
import { Body } from "./Body";

export const HubView = ({
  visitorCta,
}: {
  visitorCta?: UserProfileCardProps["visitorCta"];
}) => {
  return (
    <div className="flex flex-col">
      <Body visitorCta={visitorCta} />
    </div>
  );
};
