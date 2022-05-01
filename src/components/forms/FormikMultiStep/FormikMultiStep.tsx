/**
 * Solution:
 * https://github.com/jaredpalmer/formik/blob/master/examples/MultistepWizard.js
 */

// FormikMultiStep is a single Formik instance whose children are each page of the
// multi-step form. The form is submitted on each forward transition (can only
// progress with valid input), whereas a backwards step is allowed with
// incomplete data. A snapshot of form state is used as initialValues after each
// transition. Each page has an optional submit handler, and the top-level
// submit is called when the final page is submitted.

import { Form, Formik, FormikHelpers } from "formik";
import React from "react";

type FormValue = Record<string, any>;

export type FormikMultiStepProps = {
  initialValues: FormValue;
  getProgressionIndicator: (stepNumber: number) => React.ReactElement;
  onSubmit: (values: any, formikHelpers: FormikHelpers<FormValue>) => void;
  enableBackToPrevious: boolean;
};

export const FormikMultiStep: React.FC<FormikMultiStepProps> = ({
  children,
  initialValues,
  onSubmit,
  enableBackToPrevious,
  getProgressionIndicator,
}) => {
  const [stepNumber, setStepNumber] = React.useState(0);
  const steps = React.Children.toArray(children) as React.ReactElement[];

  const [snapshot, setSnapshot] = React.useState(initialValues);

  const step = steps[stepNumber];
  const totalSteps = steps.length;
  const isLastStep = stepNumber === totalSteps - 1;

  const next = (values: Record<string, any>) => {
    setSnapshot(values);
    setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
  };

  const previous = (values: Record<string, any>) => {
    setSnapshot(values);
    setStepNumber(Math.max(stepNumber - 1, 0));
  };

  const handleSubmit = async (
    values: FormValue,
    formikHelpers: FormikHelpers<FormValue>
  ) => {
    if (step.props.onSubmit) {
      await step.props.onSubmit(values, formikHelpers);
    }
    if (isLastStep) {
      return onSubmit(values, formikHelpers);
    } else {
      formikHelpers.setTouched({});
      next(values);
    }
  };

  return (
    <Formik
      initialValues={snapshot}
      onSubmit={handleSubmit}
      validationSchema={step.props.validationSchema}
    >
      {(formik) => (
        <Form>
          <div>{getProgressionIndicator(stepNumber)}</div>
          {step}
          <div>
            {stepNumber > 0 && enableBackToPrevious && (
              <button onClick={() => previous(formik.values)} type="button">
                Back
              </button>
            )}
            <div>
              <button disabled={formik.isSubmitting} type="submit">
                {isLastStep ? "Submit" : "Next"}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
