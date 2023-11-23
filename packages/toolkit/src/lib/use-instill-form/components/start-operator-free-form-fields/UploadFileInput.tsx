import { Input } from "@instill-ai/design-system";

export const UploadFileInput = (
  props: {
    title: string;
    fieldKey: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
) => {
  const { title, fieldKey, ...passThrough } = props;

  return (
    <label
      htmlFor={`${fieldKey}`}
      className="flex cursor-pointer rounded-full bg-semantic-accent-bg px-2 py-0.5 font-sans text-xs font-medium text-semantic-accent-default hover:bg-semantic-accent-bg-alt"
    >
      {title}
      <Input.Root className="hidden">
        <Input.Core
          {...passThrough}
          id={`upload-file-input-${fieldKey}`}
          type="file"
        />
      </Input.Root>
    </label>
  );
};
