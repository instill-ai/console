import { FC } from "react";
import FormBase, { FormBaseProps } from "../FormBase";
import { FormField } from "../FormData";

export type OnBoardingFormProps = Omit<FormBaseProps, "fields">;

const OnBoardingForm: FC<OnBoardingFormProps> = ({
  onInputChangeHandler,
  onSubmitHandler,
}) => {
  const fields: FormField[] = [
    {
      id: "onboarding-email",
      component: "text",
      type: "email",
      label: "Your email",
      description: "Fill your emil address",
      disabled: false,
      readonly: false,
      placeholder: "",
      required: false,
    },
    {
      id: "onboarding-username",
      component: "text",
      type: "text",
      label: "Username",
      description: "Pick a username",
      disabled: false,
      readonly: false,
      placeholder: "",
      required: true,
    },
    {
      id: "onboarding-company-name",
      component: "text",
      label: "Your company",
      description: "Fill your company name",
      disabled: false,
      readonly: false,
      placeholder: "",
      required: false,
    },
    {
      id: "onboarding-company-role",
      component: "select",
      label: "Your role",
      description: "Pick a role closest to your job in your company",
      disabled: false,
      readonly: false,
      placeholder: "",
      required: false,
      options: [
        {
          label: "Manager (who make decisions)",
          value: "Manager",
        },
        {
          label:
            "AI Researcher (who devises ML algorithms, train and evaluate models)",
          value: "AI Researcher",
        },
        {
          label:
            "AI Engineer (who prepare dataset and make models delivered by AI Researchers production-ready)",
          value: "AI Engineer",
        },
        {
          label:
            "Data Engineer (who builds data pipeline for data analytics or applications)",
          value: "Data Engineer",
        },
        {
          label:
            "Data Scientist (who analyses data for distilling business value)",
          value: "Data Scientist",
        },
        {
          label:
            "Analytics Engineer (who possesses skills of both Data Scientist and Data Engineer)",
          value: "Analytics Engineer",
        },
        {
          label: "Hobbyist (I love Vision AI!)",
          value: "Hobbyist",
        },
      ],
    },
    {
      id: "onboarding-data-collection",
      component: "toggle",
      label: "Anonymize usage data collection",
      description: "We collect data only for product improvements",
      disabled: false,
      readonly: false,
      placeholder: "",
      required: true,
    },
    {
      id: "onboarding-subscribe-newsletter",
      component: "toggle",
      label: "Newsletter subscription",
      description:
        "Receive the latest news from Instill AI: open source updates, community highlights, blog posts, useful tutorials and more! You can unsubscribe any time.",
      disabled: false,
      readonly: false,
      placeholder: "",
      required: true,
    },
  ];

  return (
    <FormBase
      fields={fields}
      onInputChangeHandler={onInputChangeHandler}
      onSubmitHandler={onSubmitHandler}
    />
  );
};

export default OnBoardingForm;
