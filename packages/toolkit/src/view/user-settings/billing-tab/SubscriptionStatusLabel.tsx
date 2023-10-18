import cn from "clsx";
import Stripe from "stripe";
import { Nullable } from "../../../lib";

export type SubscriptionStatusLabelProps = {
  status: Nullable<Stripe.Subscription.Status | "open_alpha">;
};

export const SubscriptionStatusLabel = (
  props: SubscriptionStatusLabelProps
) => {
  const { status } = props;
  let textColor;
  let bgColor;
  let label;

  switch (status) {
    case "open_alpha":
      textColor = "text-[#40A8F5]";
      bgColor = "bg-[#F0F5FF]";
      label = "Open Alpha";
      break;
    case "active":
      textColor = "text-[#40A8F5]";
      bgColor = "bg-[#F0F5FF]";
      label = "Active";
      break;
    case "canceled":
      textColor = "text-[#FF4D4F]";
      bgColor = "bg-[#FEF1F2]";
      label = "Canceled";
      break;
    case "incomplete_expired":
      textColor = "text-[#FF4D4F]";
      bgColor = "bg-[#FEF1F2]";
      label = "Expired";
      break;
    case "incomplete":
      textColor = "text-[#344054]";
      bgColor = "bg-[#F2F4F7]";
      label = "Incomplete";
      break;
    case "past_due":
      textColor = "text-[#FF4D4F]";
      bgColor = "bg-[#FEF1F2]";
      label = "Past Due";
      break;
    case "trialing":
      textColor = "text-[#344054]";
      bgColor = "bg-[#F2F4F7]";
      label = "Trialing";
      break;
    case "unpaid":
      textColor = "text-[#FF4D4F]";
      bgColor = "bg-[#FEF1F2]";
      label = "Unpaid";
      break;
    default:
      textColor = "text-[#344054]";
      bgColor = "bg-[#F2F4F7]";
      label = "Unknown";
  }

  return (
    <p
      className={cn(
        "rounded-full px-2 pt-1 align-middle text-sm font-medium leading-5",
        textColor,
        bgColor
      )}
    >
      {label}
    </p>
  );
};
