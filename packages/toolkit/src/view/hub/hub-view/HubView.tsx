import { UserProfileCardProps } from "../../../components";
import { Body } from "./Body";
import { Header } from "./Header";
import { Tab } from "./Tab";

export const HubView = ({
  visitorCta,
}: {
  visitorCta?: UserProfileCardProps["visitorCta"];
}) => {
  return (
    <div className="flex flex-col">
      <Header />
      <Body visitorCta={visitorCta} />
    </div>
  );
};
