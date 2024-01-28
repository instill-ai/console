import { ReferenceHintTag } from "../../../../components";

export const ListField = ({
  componentID,
  path,
  title,
  instillFormat,
  description,
}: {
  componentID?: string;
  path: string;
  title: string;
  instillFormat: string;
  description?: string;
}) => {
  return (
    <div className="flex flex-col gap-y-1">
      <p className="text-semantic-fg-secondary product-body-text-4-medium">
        {`${title} [${instillFormat}]`}
      </p>
      <div className="flex">
        <ReferenceHintTag.Root>
          <ReferenceHintTag.Label className="text-semantic-accent-default">
            {componentID ? `${componentID}.` + path : path}
          </ReferenceHintTag.Label>
        </ReferenceHintTag.Root>
      </div>
      {description ? (
        <p className="text-[#1D243380] product-body-text-4-regular">
          {description}
        </p>
      ) : null}
    </div>
  );
};
