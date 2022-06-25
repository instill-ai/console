import { FC } from "react";
import { Formik } from "formik";

import { FormBase, TextField } from "@/components/formik";
import { ModelInstance } from "@/lib/instill";
import { Nullable } from "@/types/general";

export type ConfigureModelInstanceFormProps = {
  modelInstance: ModelInstance;
  marginBottom: Nullable<string>;
};

type ConfigureModelInstanceFormValue = {
  repo: Nullable<string>;
  tag: Nullable<string>;
  repoUrl: Nullable<string>;
};

const ConfigureModelInstanceForm: FC<ConfigureModelInstanceFormProps> = ({
  modelInstance,
  marginBottom,
}) => {
  const modelInstanceConfiguration = JSON.parse(modelInstance.configuration);
  const { repository, tag, html_url } = modelInstanceConfiguration;
  return (
    <Formik
      initialValues={
        {
          repo: repository ? repository : null,
          repoUrl: html_url ? html_url : null,
          tag: tag ? tag : null,
        } as ConfigureModelInstanceFormValue
      }
      enableReinitialize={true}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values, errors }) => {
        return (
          <FormBase marginBottom={marginBottom} gapY="gap-y-5" padding={null}>
            <TextField
              id="repo"
              name="repo"
              label="GitHub repository"
              additionalMessageOnLabel={null}
              description="The URL of a GitHub repositories/organizations, e.g. 'instill-ai/yolov4'."
              value={values.repo}
              error={errors.repo || null}
              additionalOnChangeCb={null}
              disabled={true}
              readOnly={false}
              required={true}
              placeholder=""
              type="text"
              autoComplete="off"
            />
            <TextField
              id="tag"
              name="tag"
              label="Tag"
              additionalMessageOnLabel={null}
              description="Tag of the GitHub repository, e.g., 'v0.1.0'."
              value={values.tag}
              error={errors.tag || null}
              additionalOnChangeCb={null}
              disabled={true}
              readOnly={false}
              required={true}
              placeholder=""
              type="text"
              autoComplete="off"
            />
            <TextField
              id="repoUrl"
              name="repoUrl"
              label="GitHub repository URL"
              additionalMessageOnLabel={null}
              description="GitHub repository URL, e.g., 'https://github.com/instill-ai/protobufs/tree/v2.0.0'."
              value={values.repoUrl}
              error={errors.repoUrl || null}
              additionalOnChangeCb={null}
              disabled={true}
              readOnly={false}
              required={true}
              placeholder=""
              type="text"
              autoComplete="off"
            />
          </FormBase>
        );
      }}
    </Formik>
  );
};

export default ConfigureModelInstanceForm;
