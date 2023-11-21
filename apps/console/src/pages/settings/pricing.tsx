import * as React from "react";
import {
  ConsoleCorePageHead,
  PricingPlan,
  PricingPlanLayout,
  Topbar,
} from "../../components";
import { PageBase } from "@instill-ai/toolkit";
import { Logo, Separator } from "@instill-ai/design-system";
import { NextPageWithLayout } from "../_app";
import { useTrackToken } from "../../lib/useTrackToken";

const PricingPage: NextPageWithLayout = () => {
  useTrackToken({ enabled: true });

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  const pricingPlans: PricingPlan[] = [
    {
      name: "Open Source",
      price: "Free",
      subTitle: null,
      subTitleLink: null,
      description:
        "For personal or non-commercial projects without security & scalability features",
      features: [
        "End-to-end unstructured data pipelines for diverse scenarios",
        "Unlimited pre-built data connectors",
        "One-click import & deploy ML models",
        "High-performing backends",
        "Community-based support",
      ],
      featureDescription: (
        <p className="text-base font-normal leading-6 text-[#475467]">
          Self-host and free forever
        </p>
      ),
      cta: (
        <a
          href="https://github.com/instill-ai/vdp"
          className="mb-4 flex h-12 w-full justify-center rounded border border-[#E1E6EF] align-middle hover:border-[#23272F] hover:bg-[#F1F3F9]"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="m-auto font-sans text-base font-semibold leading-4 tracking-[2%] text-[#1D2433]">
            Current Plan
          </span>
        </a>
      ),
      ctaDescription: "Start your unstructured data journey...",
    },
    {
      name: "Pro",
      price: 10,
      subTitle: null,
      subTitleLink: "/docs/latest/quickstart",
      description: "For individual or small teams with advanced features",
      features: [
        "FREE compute resource during Open Alpha",
        "Access our pre-trained ML models",
        "Unlimited API requests",
        "Community-based support",
      ],
      featureDescription: (
        <p className="text-base font-normal leading-6 text-[#475467]">
          Everything in <span className="font-semibold">Open Source</span>
          plus...
        </p>
      ),
      cta: (
        <a
          href="https://console.instill.tech"
          className="mb-4 flex h-12 w-full justify-center rounded bg-[#316FED] align-middle hover:bg-[#1D5BD7] hover:bg-[#1D5BD]"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="m-auto font-sans text-base font-semibold leading-4 tracking-[2%] text-white">
            Choose Pro
          </span>
        </a>
      ),
      ctaDescription: "No credit card needed",
    },
    {
      name: "Team Enterprise",
      price: 39,
      subTitle: "Best value",
      subTitleLink: null,
      description:
        "For organisations with large data volume or the need for customisation",
      featureDescription: (
        <p className="text-base font-normal leading-6 text-[#475467]">
          Everything in <span className="font-semibold">Pro</span> plus...
        </p>
      ),
      features: [
        "Custom model deployment",
        "Dedicated compute resource for high model inference speed",
        "Keep your cost low",
        "Premium support",
      ],
      cta: (
        <a
          href="https://calendly.com/instill-ai/chat-with-us"
          className="mb-4 flex h-12 w-full justify-center rounded bg-[#316FED] align-middle hover:bg-[#1D5BD7] hover:bg-[#1D5BD]"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="m-auto font-sans text-base font-semibold leading-4 tracking-[2%] text-white">
            Choose Team
          </span>
        </a>
      ),
      ctaDescription: "Get expert advice for free",
    },
    {
      name: "Enterprise",
      price: "Custom",
      subTitle: null,
      subTitleLink: null,
      description:
        "For organisations with large data volume or the need for customisation",
      featureDescription: (
        <p className="text-base font-normal leading-6 text-[#475467]">
          Everything in <span className="font-semibold">Team</span> plus...
        </p>
      ),
      features: [
        "Custom model deployment",
        "Dedicated compute resource for high model inference speed",
        "Keep your cost low",
        "Premium support",
      ],
      cta: (
        <a
          href="https://calendly.com/instill-ai/chat-with-us"
          className="mb-4 flex h-12 w-full justify-center rounded bg-[#316FED] align-middle hover:bg-[#1D5BD7] hover:bg-[#1D5BD]"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="m-auto font-sans text-base font-semibold leading-4 tracking-[2%] text-white">
            Book A Meeting
          </span>
        </a>
      ),
      ctaDescription: "Get expert advice for free",
    },
  ];

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="Pricing" />
      <div className="w-full flex flex-col mt-16 gap-x-14">
        <div>
          <p className="product-body-text-1-semibold">
            Choose a plan for your new team
          </p>
          <p className="text-semantic-fg-disabled product-body-text-3-regular">
            Simple pricing to build your unstructured data infrastructure{" "}
          </p>
        </div>
        <Separator className="my-6" />
        <div className="grid grid-flow-row grid-cols-1 gap-y-8 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0 px-8">
          {pricingPlans.map((plan) => (
            <PricingPlanLayout key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

PricingPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="px-28 py-26">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PricingPage;
