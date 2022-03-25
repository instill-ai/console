import { FC } from "react";
import { NavbarRoot } from "./NavbarRoot";

interface Props {}

export const Navbar: FC<Props> = () => {
  return (
    <NavbarRoot>
      <div className="flex flex-row py-4"></div>
    </NavbarRoot>
  );
};
