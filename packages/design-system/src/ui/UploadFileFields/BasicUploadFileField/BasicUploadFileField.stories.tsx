import * as React from "react";
import { Meta, StoryFn } from "@storybook/react";
import BasicUploadFileField from "./BasicUploadFileField";

const meta: Meta<typeof BasicUploadFileField> = {
  title: "Components/Ui/Input/BasicUploadFileField",
  component: BasicUploadFileField,
};

export default meta;

const Template: StoryFn<typeof BasicUploadFileField> = (args) => (
  <BasicUploadFileField {...args} />
);
export const Playground: StoryFn<typeof BasicUploadFileField> = Template.bind(
  {}
);

Playground.args = {
  error: "",
  disabled: false,
  readOnly: false,
  required: true,
  onChange: () => undefined,
  id: "upload-file-field-base-playground",
  label: "upload-file-field-base-playground",
  placeholder: "Upload a file",
  uploadButtonText: "Upload",
  description:
    "this is a description about upload file field  <a href='#'>setup guide</a>",
  additionalMessageOnLabel: "text label",
};

export const DemoFileReader: StoryFn<typeof BasicUploadFileField> = () => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) return;

    const reader = new FileReader();

    const inputFileList = event.target.files;

    if (inputFileList) {
      reader.readAsDataURL(inputFileList[0]);

      reader.onloadend = () => {
        console.error(reader.result);
      };
    }
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={(event) => onSubmitHandler(event)}>
      <BasicUploadFileField
        description="this is a description about upload file field  <a href='#'>setup guide</a>"
        onChange={onChange}
        required={true}
        id="upload-file-field-base-playground"
        label="upload-file-field-base-playground"
        placeholder="Upload a file"
        uploadButtonText="Upload"
      />
    </form>
  );
};
