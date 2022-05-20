import { GrpcIcon, HttpIcon } from "@instill-ai/design-system";
import { FC, ReactElement } from "react";

export type ConnectorIconProps = {
  type: string;
  iconWidth: string;
  iconHeight: string;
  iconPosition: string;
  iconColor: string;
};

const ConnectorIcon: FC<ConnectorIconProps> = ({
  type,
  iconHeight,
  iconWidth,
  iconPosition,
  iconColor,
}) => {
  switch (type) {
    case "HTTP": {
      return (
        <HttpIcon
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
          color={iconColor}
        />
      );
    }
    case "gRPC": {
      return (
        <GrpcIcon
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
          color={iconColor}
        />
      );
    }

    default: {
      return <div>Icon not found</div>;
    }
  }
};

export default ConnectorIcon;
