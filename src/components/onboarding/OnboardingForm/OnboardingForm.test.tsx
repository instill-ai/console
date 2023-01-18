import { renderWithClient } from "@/lib/test";
import { screen } from "@testing-library/react";
import { OnboardingForm } from "./OnboardingForm";

test("should not show error message at email field when the form is not dirty", async () => {
  renderWithClient(<OnboardingForm user={null} />, {});
  expect(
    screen.queryByRole("textbox", {
      name: "Your email * - ",
    })
  ).toBeNull();
});

test("should disable submission", async () => {
  renderWithClient(<OnboardingForm user={null} />, {});
  expect(
    screen.queryByRole("button", {
      name: "Start",
    })
  ).toBeDisabled();
});
