import {
  AwsS3Icon,
  GcsIcon,
  GoogleDriveIcon,
  IotIcon,
  MongoDbAtalasIcon,
} from "@instill-ai/design-system";
import { FC } from "react";
import TablePlaceholderBase, {
  TablePlaceholderBaseProps,
} from "../TablePlaceholderBase";

export type SourceTablePlaceholderProps = {
  marginBottom: TablePlaceholderBaseProps["marginBottom"];
  enablePlaceholderCreateButton: TablePlaceholderBaseProps["enableCreateButton"];
};

const SourceTablePlaceholder: FC<SourceTablePlaceholderProps> = ({
  marginBottom,
  enablePlaceholderCreateButton,
}) => {
  const width = "w-[136px]";
  const height = "h-[136px]";

  const placeholderItems = [
    {
      id: "source-gcs",
      item: <GcsIcon position="m-auto" width={width} height={height} />,
    },
    {
      id: "source-mongodb-atalas=1",
      item: (
        <MongoDbAtalasIcon position="m-auto" width={width} height={height} />
      ),
    },
    {
      id: "source-iot",
      item: <IotIcon position="m-auto" width={width} height={height} />,
    },
    {
      id: "source-mongodb-atalas-2",
      item: (
        <MongoDbAtalasIcon position="m-auto" width={width} height={height} />
      ),
    },
    {
      id: "source-aws-s3",
      item: <AwsS3Icon position="m-auto" width={width} height={height} />,
    },
    {
      id: "source-google-drive",
      item: <GoogleDriveIcon position="m-auto" width={width} height={height} />,
    },
  ];

  return (
    <TablePlaceholderBase
      placeholderItems={placeholderItems}
      placeholderTitle="No source"
      createButtonTitle="Configurate your first source"
      createButtonLink="/sources/create"
      marginBottom={marginBottom}
      enableCreateButton={enablePlaceholderCreateButton}
    />
  );
};

export default SourceTablePlaceholder;
