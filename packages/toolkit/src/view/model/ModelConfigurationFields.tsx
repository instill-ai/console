import * as React from "react";
import cn from "clsx";
import { BasicTextArea, BasicTextField } from "@instill-ai/design-system";
import { Model, Nullable } from "../../lib";

export type ModelConfigurationFieldsProps = {
  model: Nullable<Model>;

  /**
   * - Default is undefined
   */
  marginBottom?: string;
};

export const ModelConfigurationFields = (
  props: ModelConfigurationFieldsProps
) => {
  const { model, marginBottom } = props;
  return (
    <div className={cn("flex flex-col gap-y-5", marginBottom)}>
      {model?.model_definition === "model-definitions/github" ? (
        <React.Fragment>
          <BasicTextField
            id="model-github-repo-url"
            label="GitHub repository"
            description="The name of a public GitHub repository, e.g.
                      `instill-ai/model-mobilenetv2-dvc`."
            required={true}
            value={model.configuration.repository}
            error={null}
            disabled={true}
          />
          <BasicTextField
            id="model-github-tag"
            label="GitHub repository tag"
            description="The tag of the public GitHub repository, e.g. `v1.0-cpu`."
            required={true}
            value={model.configuration.tag}
            error={null}
            disabled={true}
          />
        </React.Fragment>
      ) : null}
      {model?.model_definition === "model-definitions/local" ? (
        <BasicTextField
          id="model-local-file"
          name="file"
          label="Uploaded model file"
          description="The zip file that contains the model files."
          required={true}
          readOnly={false}
          value={model.configuration.content}
          disabled={true}
        />
      ) : null}
      {model?.model_definition === "model-definitions/artivc" ? (
        <React.Fragment>
          <BasicTextField
            id="model-artivc-gcs-bucket-path"
            label="GCS Bucket Path"
            description="The bucket path string of Google Cloud Storage (GCS), e.g. `gs://mybucket/path/to/mymodel/`."
            required={true}
            value={model.configuration.url}
            error={null}
            disabled={true}
          />
          <BasicTextField
            id="model-artivc-tag"
            label="ArtiVC Tag"
            description="The tag name of ArtiVC source commit, e.g. `v1.0-cpu`."
            required={true}
            value={model.configuration.tag}
            error={null}
            disabled={true}
          />
          <BasicTextArea
            id="model-artivc-credentials"
            label="Credentials JSON"
            key="credentials"
            description="If the GCS bucket path is private, please provide the Google Cloud Application Default credential or service account credential in its JSON format to get access to the model. See ArtiVC Google Cloud Storage setup guide."
            value={model.configuration.credentials}
            error={null}
            disabled={true}
          />
        </React.Fragment>
      ) : null}
      {model?.model_definition === "model-definitions/huggingface" ? (
        <BasicTextField
          id="model-huggingface-repo-url"
          label="HuggingFace model ID"
          description="The name of a public HuggingFace model ID, e.g. `google/vit-base-patch16-224`."
          required={true}
          value={model.configuration.repo_id}
          error={null}
          disabled={true}
        />
      ) : null}
    </div>
  );
};
