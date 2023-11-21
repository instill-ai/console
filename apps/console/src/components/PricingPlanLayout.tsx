import cn from "clsx";
import { ReactElement } from "react";
import { useRouter } from "next/router";
import { Nullable } from "@instill-ai/toolkit";

export type PricingPlanLayoutProps = {
  plan: PricingPlan;
};

export type PricingPlan = {
  name: string;
  price: number | string;
  subTitle: Nullable<string>;
  subTitleLink: Nullable<string>;
  description: string;
  features: string[];
  featureDescription: ReactElement;
  cta: ReactElement;
  ctaDescription: string | ReactElement;
};

export const PricingPlanLayout = (props: PricingPlanLayoutProps) => {
  const { plan } = props;
  const router = useRouter();
  return (
    <div
      style={{
        boxShadow:
          plan.name === "Cloud Starter"
            ? "0px 8px 32px rgba(0, 0, 0, 0.16)"
            : "0px 4px 12px rgba(0, 0, 0, 0.16)",
      }}
      className={cn(
        "flex flex-col rounded-2xl border",
        plan.subTitle ? "border-[#1D5BD7]" : "border-[#EAECF0]"
      )}
    >
      <div className="flex flex-col border-b border-[#EAECF0] p-8">
        <div className="mb-4 flex h-8 flex-row">
          <p className="my-auto mr-auto font-sans text-lg font-semibold leading-7 text-[#475467]">
            {plan.name}
          </p>
          {plan.subTitle ? (
            <span
              onClick={
                plan.subTitleLink
                  ? () => {
                      if (!plan.subTitleLink) return;
                      router.push(plan.subTitleLink, undefined, {
                        scroll: false,
                      });
                    }
                  : undefined
              }
              className={cn(
                "rounded-full bg-[#F0F5FF] px-3 py-1 text-[#1D5BD7]",
                plan.subTitleLink ? "cursor-pointer" : ""
              )}
            >
              {plan.subTitle}
            </span>
          ) : null}
        </div>
        <div className="mb-4 flex flex-row">
          {typeof plan.price === "number" ? (
            <span className=" my-auto text-[42px] font-semibold leading-[45px] -tracking-[1.75%] text-[#101828]">
              $
            </span>
          ) : null}
          <span className="my-auto text-[56px] font-semibold leading-[60px] -tracking-[2%] text-[#101828]">
            {plan.price}
          </span>
          {typeof plan.price === "number" ? (
            <span className="mt-auto pb-1 text-base font-semibold leading-6 text-[#475467]">
              per month
            </span>
          ) : null}
        </div>
        <p className="mb-8 h-[72px] font-sans text-base font-normal leading-6 text-[#1D2433] text-opacity-80">
          {plan.description}
        </p>
        {plan.cta}
        <p className="h-8 text-center text-sm font-medium leading-5 text-[#1D2433] text-opacity-80">
          {plan.ctaDescription}
        </p>
      </div>
      <div className="flex flex-col p-8">
        <div className="mb-6 flex flex-col gap-y-1">
          <p className="text-base font-semibold uppercase leading-6 text-[#101828]">
            Features
          </p>
          {plan.featureDescription}
        </div>
        <div className="flex flex-col gap-y-4">
          {plan.features.map((feature) => (
            <div key={feature} className="flex flex-row gap-x-3">
              <div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                    stroke="#1D2433"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-base font-normal leading-6 text-[#475467]">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
