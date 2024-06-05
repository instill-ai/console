"use client";

import * as React from "react";
import { SelectOption } from "@instill-ai/design-system";

import {
  DashboardAvailableTimeframe,
  GeneralAppPageProp,
  Nullable,
  getPreviousTimeframe,
  getTimeInRFC3339Format,
  getTriggersSummary,
  useAppEntity,
  usePipelineTriggerRecords,
} from "../../lib";
import { PageTitle } from "../../components";
import { useParams } from "next/navigation";

export type ApplicationsPageMainViewProps = GeneralAppPageProp;

export const ApplicationsPageMainView = (
  props: ApplicationsPageMainViewProps
) => {
  const { accessToken, enableQuery, router } = props;

  const entity = useAppEntity();

  return (
    <div className="flex flex-col">
      <PageTitle
        title=""
        breadcrumbs={["Applications", "Pipeline Details"]}
        className="mb-1"
      />

    </div>
  );
};
