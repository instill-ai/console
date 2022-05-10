import { FC } from "react";
import { Form, Formik } from "formik";

import { SingleSelect, TextField } from "@/components/formik";
import { mockModelSourceOptions } from "../MockData";
import GitHubModelFlow from "./GitHubModelFlow";
import LocalModelFlow from "./LocalModelFlow";

export type CreateModelFormValue = {
  name: string;
  type: "github" | "local";
  githubRepo: string;
  instance: string;
  description: string;
  file: string;
};

const CreateModelForm: FC = () => {
  return (
    <Formik
      initialValues={{
        name: null,
        type: null,
        githubRepo: null,
        instance: null,
        description: null,
        file: null,
      }}
      onSubmit={(values) => console.log(values)}
    >
      {(formik) => {
        return (
          <Form className="flex flex-col gap-y-5">
            <TextField
              name="name"
              label="Name"
              description="Pick a name to help you identify this source in Instill"
              disabled={false}
              readOnly={false}
              required={true}
              placeholder=""
              type="text"
              autoComplete="off"
            />
            <SingleSelect
              name="type"
              label="Model source"
              instanceId="model-source-type"
              disabled={false}
              readOnly={false}
              options={mockModelSourceOptions}
              required={true}
              description={"Setup Guide"}
            />
            {formik.values.type === "github" ? <GitHubModelFlow /> : null}
            {formik.values.type === "local" ? <LocalModelFlow /> : null}
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreateModelForm;
