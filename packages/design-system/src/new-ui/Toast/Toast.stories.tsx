import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastProps } from "./Toast";
import { Toaster } from "./Toaster";
import { Button } from "../Button";
import { ToasterToast, useToast } from "./use-toast";
import { LinkButton } from "../LinkButton";
import { Icons } from "../Icons";

const meta: Meta<typeof Toast> = {
  title: "Components/NewUi/Toast",
};

export default meta;

type Story = StoryObj<typeof Toast>;

const ToastWithHook = ({
  variant,
  action,
  icon,
}: {
  variant: ToastProps["variant"];
  action?: ToasterToast["action"];
  icon?: ToasterToast["icon"];
}) => {
  const { toast } = useToast();

  return (
    <>
      <Toaster />
      <Button
        variant="primary"
        size="lg"
        onClick={() => {
          toast({
            title: "Scheduled: Catch up",
            description: "Friday, February 10, 2023 at 5:57 PM",
            size: "large",
            variant,
            action,
            icon,
          });
        }}
      >
        Toast
      </Button>
    </>
  );
};

export const AlertInfo: Story = {
  render: () => <ToastWithHook variant="alert-info" />,
};

export const AlertSuccess: Story = {
  render: () => <ToastWithHook variant="alert-success" />,
};

export const AlertWarning: Story = {
  render: () => <ToastWithHook variant="alert-warning" />,
};

export const AlertError: Story = {
  render: () => <ToastWithHook variant="alert-error" />,
};

export const AlertWithAction: Story = {
  render: () => (
    <ToastWithHook
      variant="alert-error"
      action={
        <Toast.Action altText="UndoAction" asChild>
          <div className="flex flex-row space-x-4">
            <LinkButton variant="secondary" size="md">
              Dismiss
            </LinkButton>
            <LinkButton variant="primary" size="md">
              Dismiss
            </LinkButton>
          </div>
        </Toast.Action>
      }
    />
  ),
};

export const NotificationIcon: Story = {
  render: () => (
    <ToastWithHook
      variant="notification-icon"
      icon={<Icons.Cube01 className="w-5 h-5 stroke-semantic-fg-primary" />}
      action={
        <Toast.Action altText="UndoAction" asChild>
          <div className="flex flex-row space-x-4">
            <LinkButton variant="secondary" size="md">
              Dismiss
            </LinkButton>
            <LinkButton variant="primary" size="md">
              Dismiss
            </LinkButton>
          </div>
        </Toast.Action>
      }
    />
  ),
};
