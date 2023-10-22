import { Nullable } from "../../../lib";
import {
  SubscriptionStatusLabel,
  SubscriptionStatusLabelProps,
} from "./SubscriptionStatusLabel";
import { NoBgSquareProgress } from "@instill-ai/design-system";

export type BillingCardProps = {
  productName: Nullable<string>;
  status: SubscriptionStatusLabelProps["status"];
  daysLeft: Nullable<number>;
  price: Nullable<number>;
  featureList: Nullable<string[]>;
  isLoadingPortalLink: boolean;
  redirectToCustomerPortal: Nullable<() => void>;
};

export const BillingCard = (props: BillingCardProps) => {
  const {
    productName,
    status,
    daysLeft,
    price,
    featureList,
    isLoadingPortalLink,
    redirectToCustomerPortal,
  } = props;

  return (
    <div className="flex w-full flex-col border border-[#EAECF0] bg-white rounded-sm">
      <div className="grid grid-flow-row grid-cols-2 gap-x-8 border-b border-b-[#EAECF0] p-6">
        <div className="flex flex-col">
          <div className="mb-2 flex flex-row gap-x-2">
            <div className="text-lg font-semibold leading-7">{productName}</div>
            <SubscriptionStatusLabel status={status} />
          </div>
          <p className="mb-2 text-sm font-medium leading-5 text-[#475467]">
            During the Open Alpha phase, we invite you to freely explore all
            available features. Rest assured, there will be absolutely no
            charges incurred during this period.
          </p>
          <div className="mb-3">
            {status === "canceled" ? (
              <p className="text-base font-semibold leading-5 text-[#475467]">{`Renew your plan before ${status} to keep using VDP`}</p>
            ) : null}
            {status === "incomplete_expired" ? (
              <p className="text-base font-semibold leading-5 text-[#475467]">
                Renew your subscription today!
              </p>
            ) : null}
            {status === "trialing" ? (
              daysLeft ? (
                <p className="text-base font-semibold leading-5 text-[#475467]">{`${daysLeft} days free trials left`}</p>
              ) : null
            ) : null}
          </div>
          <div></div>
        </div>
        <div className="mb-auto ml-auto flex flex-row">
          <span className=" my-auto text-[42px] font-semibold leading-[45px] -tracking-[1.75%] text-[#101828]">
            $
          </span>
          <span className="my-auto text-[56px] font-semibold leading-[60px] -tracking-[2%] text-[#101828]">
            {price}
          </span>
          <span className="mt-auto pb-1 text-base font-semibold leading-6 text-[#475467]">
            per month
          </span>
        </div>
      </div>
      <div className="flex flex-col py-4">
        {status === "active" ||
        status === "trialing" ||
        status === "open_alpha" ? (
          <div className="mb-4 flex flex-col px-8 pb-10 pt-8">
            <div className="mb-6 text-base font-semibold leading-6 text-[#101828]">
              FEATURES
            </div>
            <div className="flex flex-col gap-y-4">
              {featureList
                ? featureList.map((feature) => (
                    <div key={feature} className="flex flex-row gap-x-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeOpacity={0.8}
                        className="stroke-[#1D2433]"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <div className="my-auto text-base font-medium leading-6 text-[#475467]">
                        {feature}
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>
        ) : null}
        <div className="flex px-6">
          <div className="ml-auto flex flex-row gap-x-2">
            {isLoadingPortalLink ? (
              <NoBgSquareProgress blockSize={24} isLoading={true} />
            ) : null}
            {redirectToCustomerPortal ? (
              <button
                onClick={() => redirectToCustomerPortal()}
                className="group ml-auto flex flex-row gap-x-2 rounded px-3 py-2 hover:bg-[#F0F5FF]"
              >
                <span className="text-sm font-semibold leading-[14px] tracking-[2%] text-[#40A8F5] group-hover:text-[#1D5BD7]">
                  {status === "active" || status === "trialing"
                    ? "Billing Portal"
                    : "Renew Now"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="fill-none stroke-[#40A8F5]"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
