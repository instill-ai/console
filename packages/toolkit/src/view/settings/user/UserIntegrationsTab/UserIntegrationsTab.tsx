"use client";

import * as React from "react";

import { Icons, Input, Nullable } from "@instill-ai/design-system";

import { Setting } from "../..";
import { GeneralAppPageProp } from "../../../../lib";
import { AvailableConnection } from "./AvailableConnection";
import { ExistingConnection } from "./ExistingConnection";
import { Section } from "./Section";

export type UserIntegrationsTabProps = GeneralAppPageProp;

export const UserIntegrationsTab = (/* props: UserIntegrationsTabProps */) => {
  const [searchInputValue, setSearchInputValue] =
    React.useState<Nullable<string>>(null);

  return (
    <Setting.TabRoot>
      <Setting.TabHeader
        title="Integration"
        description="Easily configure and protect your connections"
      />
      <div className="flex flex-row gap-x-4 mt-1" style={{ width: "400px" }}>
        <Input.Root className="w-full">
          <Input.LeftIcon>
            <Icons.SearchSm className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
          </Input.LeftIcon>
          <Input.Core
            value={searchInputValue ?? ""}
            placeholder="Search connections"
            onChange={(event) => {
              setSearchInputValue(event.target.value);
            }}
            className="!leading-[22px]"
          />
        </Input.Root>
      </div>
      <Section title="Connected (3)">
        <ExistingConnection id="hello" />
        <ExistingConnection id="bye" />
      </Section>
      <Section title="All">
        <AvailableConnection id="oi" />
        <AvailableConnection id="ai" />
      </Section>
    </Setting.TabRoot>
  );
};
