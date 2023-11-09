// import axios from "axios";
// import Stripe from "stripe";
// import { useEffect, useState } from "react";
// import { NoBgSquareProgress } from "@instill-ai/design-system";
// import { useUser, env, type Nullable } from "@instill-ai/toolkit";
// import Router from "next/router";

// import { useAccessToken, useStripeData } from "@/lib";
import { TabBase } from "../TabBase";
import { BillingCard } from "./BillingCard";

export const BillingTab = () => {
  // const defaultStarterPlanPrice = 10;
  // const accessToken = useAccessToken();
  // const instillUser = useUser({
  //   accessToken: accessToken.isSuccess ? accessToken.data : null,
  //   enabled: accessToken.isSuccess,
  // });
  // const stripeData = useStripeData({
  //   enabled: instillUser.isSuccess && accessToken.isSuccess,
  //   customerId:
  //     env("NEXT_PUBLIC_ENABLE_STRIPE_TEST_MODE") &&
  //     env("NEXT_PUBLIC_STRIPE_TEST_CUSTOMER_ID")
  //       ? env("NEXT_PUBLIC_STRIPE_TEST_CUSTOMER_ID")
  //       : instillUser.data?.customer_id,
  // });

  // const [daysLeft, setDaysLeft] = useState<Nullable<number>>(null);
  // const [isLoadingPortalLink, setIsLoadingPortalLink] = useState(false);

  // useEffect(() => {
  //   if (!stripeData.isSuccess || stripeData.data.subscriptions.length === 0) {
  //     return;
  //   }

  //   // Set days left in trial
  //   const trialEndTimeStamp =
  //     stripeData.data.subscriptions[0]?.trial_end || null;
  //   const now = new Date().getTime();

  //   if (trialEndTimeStamp && now < trialEndTimeStamp * 1000) {
  //     setDaysLeft(
  //       Math.floor((trialEndTimeStamp * 1000 - now) / (1000 * 60 * 60 * 24))
  //     );
  //   }
  // }, [stripeData]);

  // const redirectToCustomerPortal = () => {
  //   if (!instillUser.isSuccess || !stripeData.isSuccess) return;

  //   setIsLoadingPortalLink(true);

  //   axios
  //     .post("/api/create-custom-portal-link", {
  //       customerId:
  //         env("NEXT_PUBLIC_ENABLE_STRIPE_TEST_MODE") &&
  //         env("NEXT_PUBLIC_STRIPE_TEST_CUSTOMER_ID")
  //           ? env("NEXT_PUBLIC_STRIPE_TEST_CUSTOMER_ID")
  //           : instillUser.data?.customer_id,
  //     })
  //     .then(({ data }) => {
  //       Router.push(data.url);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     })
  //     .finally(() => {
  //       setIsLoadingPortalLink(false);
  //     });
  // };

  // if (stripeData.isLoading) {
  //   return (
  //     <TabLayout
  //       title="Billing"
  //       description="Manage your billing and payment details."
  //     >
  //       <div className="flex min-h-[500px] w-full border border-[#EAECF0] bg-white lg:min-w-[600px]">
  //         <div className="m-auto flex flex-col gap-y-2.5">
  //           <div className="m-auto flex h-[72px] w-[72px] bg-instillBlue10">
  //             <NoBgSquareProgress
  //               isLoading={true}
  //               blockSize={52}
  //               position="m-auto"
  //             />
  //           </div>
  //           <p className="mx-auto text-instillGrey50 text-instill-small">
  //             loading...
  //           </p>
  //         </div>
  //       </div>
  //     </TabLayout>
  //   );
  // }

  // if (stripeData.isError || !stripeData) {
  //   return (
  //     <TabLayout
  //       title="Billing"
  //       description="Manage your billing and payment details."
  //     >
  //       <div className="flex min-h-[500px] w-full border border-[#EAECF0] bg-white lg:min-w-[600px]">
  //         <p className="m-auto text-sm font-normal leading-5 text-[#475467]">
  //           Something went wrong, Please try again later. Or contact us.
  //         </p>
  //       </div>
  //     </TabLayout>
  //   );
  // }

  // if (stripeData?.data.subscriptions.length === 0) {
  //   return (
  //     <TabLayout
  //       title="Billing"
  //       description="Manage your billing and payment details."
  //     >
  //       <BillingCardLayout
  //         status={"unpaid"}
  //         productName={"Starter Plan"}
  //         daysLeft={null}
  //         price={defaultStarterPlanPrice}
  //         featureList={null}
  //         isLoadingPortalLink={isLoadingPortalLink}
  //         redirectToCustomerPortal={redirectToCustomerPortal}
  //       />
  //     </TabLayout>
  //   );
  // }

  return (
    <TabBase
      title="Billing"
      description="Manage your billing and payment details."
    >
      <div className="flex w-full max-w-[720px]">
        <BillingCard
          status="open_alpha"
          productName="Starter Plan"
          daysLeft={null}
          price={0}
          featureList={[
            "Access to all our state-of-the-art pre-trained models",
            "Unlimited API requests",
            "Free compute resource during open alpha",
            "Basic Discord and email support",
          ]}
          isLoadingPortalLink={false}
          redirectToCustomerPortal={null}
        />
      </div>
    </TabBase>
  );
};
