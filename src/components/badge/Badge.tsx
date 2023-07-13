import React, { ReactElement } from "react";
import { Tag } from "@instill-ai/design-system";

type BadgeProps = {
  statusname: string;
  label?: string;
  iconElement?: ReactElement;
  className?: string;
};

export const Badge = (props: BadgeProps) => {
  const { statusname, label, iconElement, className } = props;

  switch (statusname) {
    case "STATE_ERROR":
    case "errored":
      return (
        <Tag variant="lightRed" className={className} size="sm">
          {iconElement}
          {label || "Error"}
        </Tag>
      );

    case "STATE_ACTIVE":
    case "completed":
      return (
        <Tag variant="lightGreen" className={className} size="sm">
          {iconElement}
          {label || "Active"}
        </Tag>
      );

    case "STATE_INACTIVE":
      return (
        <Tag variant="default" className={className} size="sm">
          {iconElement}
          {label || "Inactive"}
        </Tag>
      );

    case "STATE_UNSPECIFIED":
      return (
        <Tag variant="default" className={className} size="sm">
          {iconElement}
          {label || "Unknown"}
        </Tag>
      );

    default:
      return (
        <Tag variant="default" className={className} size="sm">
          Unknown
        </Tag>
      );
  }
};
