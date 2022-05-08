import { FC } from "react";
import { Form, Formik } from "formik";
import { SingleSelect, TextField } from "../../formik/FormikField";

import { PrimaryButton } from "@/components/ui/Buttons";
import { mockAsyncDataConnectionOptions } from "../MockData";

const CreateSourceForm: FC = () => {
  return (
    <Formik
      initialValues={{ name: null, type: null }}
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
              label="Source type"
              instanceId="source-type"
              disabled={false}
              readOnly={false}
              options={mockAsyncDataConnectionOptions}
              required={true}
              description={"Setup Guide"}
            />
            <PrimaryButton
              type="submit"
              disabled={formik.isValid ? false : true}
            >
              Set up Source
            </PrimaryButton>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreateSourceForm;
