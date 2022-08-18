import { GrpcIcon, HttpIcon } from "@instill-ai/design-system";

export type ConnectorIconProps = {
  iconName: string;
  iconWidth: string;
  iconHeight: string;
  iconPosition: string;
  iconColor: string;
};

const ConnectorIcon = ({
  iconName,
  iconHeight,
  iconWidth,
  iconPosition,
  iconColor,
}: ConnectorIconProps) => {
  switch (iconName) {
    case "http.svg": {
      return (
        <HttpIcon
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
          color={iconColor}
        />
      );
    }
    case "grpc.svg": {
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
