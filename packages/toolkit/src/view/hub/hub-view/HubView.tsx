import { Body } from "./Body";
import { Header } from "./Header";
import { Tab } from "./Tab";

export const HubView = () => {
  return (
    <div className="flex flex-col">
      <Tab />
      <Header />
      <Body />
    </div>
  );
};
