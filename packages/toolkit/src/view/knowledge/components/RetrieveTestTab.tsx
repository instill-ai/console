import * as React from "react";
import { Button, Icons, Switch, Input, Tag } from "@instill-ai/design-system";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";

type RetrieveTestTabProps = {
  knowledgeBase: KnowledgeBase;
};

export const RetrieveTestTab = ({ knowledgeBase }: RetrieveTestTabProps) => {
  return (
    <div className="mb-5 flex items-center justify-between">
      <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-2">
        {knowledgeBase.name}
      </p>
      {/* Coming in V2 */}
      <Button variant="primary" size="lg">
        Export Report
      </Button>
    </div>
  );
};
