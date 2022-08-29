import { renderWithContext } from "@/lib/test";
import { getByText, render, screen } from "@testing-library/react";
import OnboardingForm from "./OnboardingForm";

test("should not show error message at email field when the form is not dirty", async () => {
  // renderWithContext(<OnboardingForm user={null} />, {});
  // const emailField = screen.getByRole("textbox", {
  //   name: "/your email *",
  // });
  // console.log(emailField);
});
