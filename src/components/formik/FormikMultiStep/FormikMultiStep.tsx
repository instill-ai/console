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

import { Formik, FormikHelpers, FormikProps } from "formik";
import { Dispatch, RefObject, SetStateAction, Children, useState } from "react";
import FormBase from "../FormBase";

type FormValue = Record<string, any>;

export type FormikMultiStepProps = {
  stepNumber: number;
  setStepNumber: Dispatch<SetStateAction<number>>;
  initialValues: FormValue;
  getProgressionIndicator: (stepNumber: number) => React.ReactElement;
  onSubmit: (values: any, formikHelpers: FormikHelpers<FormValue>) => void;
  enableBackToPrevious: boolean;
  formikInnerRef?: RefObject<FormikProps<Record<string, any>>>;
};

export const FormikMultiStep: React.FC<FormikMultiStepProps> = ({
  stepNumber,
  setStepNumber,
  children,
  initialValues,
  onSubmit,
  getProgressionIndicator,
  formikInnerRef,
}) => {
  const steps = Children.toArray(children) as React.ReactElement[];

  const [snapshot, setSnapshot] = useState(initialValues);

  const step = steps[stepNumber];
  const totalSteps = steps.length;
  const isLastStep = stepNumber === totalSteps - 1;

  const next = (values: Record<string, any>) => {
    setSnapshot(values);
    setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
  };

  // const previous = (values: Record<string, any>) => {
  //   setSnapshot(values);
  //   setStepNumber(Math.max(stepNumber - 1, 0));
  // };

  const handleSubmit = async (
    values: FormValue,
    formikHelpers: FormikHelpers<FormValue>
  ) => {
    if (step.props.multiGroup) {
      const dataFlag = (document.activeElement as HTMLButtonElement).dataset
        .flag;
      if (dataFlag) {
        await step.props.onSubmit[dataFlag](values);
      }
      return;
    }

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
      innerRef={formikInnerRef}
      initialValues={snapshot}
      onSubmit={handleSubmit}
      validationSchema={
        step.props.validationSchema ? step.props.validationSchema : undefined
      }
    >
      {() => {
        return (
          <FormBase marginBottom={null} padding="pb-20" gapY={null}>
            <div className="mb-15">{getProgressionIndicator(stepNumber)}</div>
            {step}
          </FormBase>
        );
      }}
    </Formik>
  );
};
