export const FormLabel = ({
  title,
  optional,
}: {
  title: string;
  optional?: boolean;
}) => {
  return (
    <div className="mb-2 flex flex-row justify-between">
      <p className="my-auto text-semantic-fg-primary product-body-text-3-semibold">
        {title}
      </p>
      {optional ? (
        <p className="my-auto text-semantic-fg-secondary product-body-text-4-regular">
          Optional
        </p>
      ) : null}
    </div>
  );
};
