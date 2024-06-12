"use client";

import * as React from "react";
import * as semver from "semver";

import {
  InstillStore,
  Nullable,
  useRouteInfo,
  useInstillStore,
  useShallow,
} from "../../../../lib";
import { useSortedReleases } from "../../lib";
import { RadioGroup, Tag } from "@instill-ai/design-system";
import { UseReleasePipelineFormReturn } from "./ReleaseMenu";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export type Semver = "major" | "minor" | "patch";

export const SemverSelect = ({
  form,
}: {
  form: UseReleasePipelineFormReturn;
}) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const [selectedSemver, setSelectedSemver] = React.useState<Semver>("major");
  const [version, setVersion] = React.useState<Nullable<string>>(null);

  const routeInfo = useRouteInfo();

  const releases = useSortedReleases({
    pipelineName: routeInfo.data.pipelineName,
    enabledQuery: enabledQuery && routeInfo.isSuccess,
    accessToken,
  });

  React.useEffect(() => {
    let newVersion: Nullable<string> = null;

    if (releases.length === 0) {
      switch (selectedSemver) {
        case "major":
          newVersion = "v1.0.0";
          break;
        case "minor":
          newVersion = "v0.1.0";
          break;
        case "patch":
          newVersion = "v0.0.1";
          break;
      }
      setVersion(newVersion);
      form.setValue("id", newVersion);
      return;
    }

    const latestReleaseID = releases[0].id;

    switch (selectedSemver) {
      case "major":
        newVersion = semver.inc(latestReleaseID, "major");
        break;
      case "minor":
        newVersion = semver.inc(latestReleaseID, "minor");
        break;
      case "patch":
        newVersion = semver.inc(latestReleaseID, "patch");
        break;
    }

    if (!newVersion) {
      return;
    }

    setVersion(newVersion);
    form.setValue("id", `v${newVersion}`);
  }, [releases, selectedSemver, form]);

  return (
    <div className="flex w-full flex-row gap-x-3 py-2">
      <div className="flex flex-row gap-x-2">
        <p className="my-auto product-body-text-3-semibold">Version</p>
        <div className="w-[50px]">
          <Tag className="my-auto" variant="lightBlue" size="sm">
            {version}
          </Tag>
        </div>
      </div>
      <RadioGroup.Root
        onValueChange={(value) => setSelectedSemver(value as Semver)}
        className="!flex flex-row gap-x-2"
        defaultValue="major"
      >
        <div className="flex items-center space-x-2">
          <RadioGroup.Item value="major" id="major" />
          <SelectLabel htmlFor="major" title="Major" />
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroup.Item value="minor" id="minor" />
          <SelectLabel htmlFor="minor" title="Minor" />
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroup.Item value="patch" id="patch" />
          <SelectLabel htmlFor="patch" title="Patch" />
        </div>
      </RadioGroup.Root>
    </div>
  );
};

const SelectLabel = ({
  htmlFor,
  title,
}: {
  htmlFor: string;
  title: string;
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className="text-semantic-fg-primary product-body-text-3-semibold"
    >
      {title}
    </label>
  );
};
