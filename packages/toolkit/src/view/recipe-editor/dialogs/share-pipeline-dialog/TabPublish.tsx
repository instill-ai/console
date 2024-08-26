"use client";

import * as React from "react";
import { Nullable } from "instill-sdk";

import { Button } from "@instill-ai/design-system";

import {
  InstillStore,
  useInstillStore,
  useNamespacePipeline,
  useShallow,
} from "../../../../lib";
import { UnpublishPipelineDialog } from "./UnpublishPipelineDialog";

const selector = (store: InstillStore) => ({
  updateDialogPublishPipelineIsOpen: store.updateDialogPublishPipelineIsOpen,
  updateDialogSharePipelineIsOpen: store.updateDialogSharePipelineIsOpen,
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const TabPublish = ({
  pipelineName,
}: {
  pipelineName: Nullable<string>;
}) => {
  const {
    updateDialogPublishPipelineIsOpen,
    updateDialogSharePipelineIsOpen,
    accessToken,
    enabledQuery,
  } = useInstillStore(useShallow(selector));

  const pipeline = useNamespacePipeline({
    namespacePipelineName: pipelineName,
    enabled: enabledQuery && !!pipelineName,
    accessToken,
  });

  const pipelineIsPublic = React.useMemo(() => {
    if (!pipeline.isSuccess) {
      return false;
    }

    const toplevelRule = pipeline.data.sharing.users["*/*"];

    if (toplevelRule && toplevelRule.enabled) {
      return true;
    } else {
      return false;
    }
  }, [pipeline.data, pipeline.isSuccess]);

  return (
    <div className="flex w-full flex-col">
      {pipelineIsPublic ? <InstillhubGrayBanner /> : <InstillHubBanner />}
      <div className="flex flex-row gap-x-2 px-6 py-3">
        <svg
          width="32"
          height="33"
          viewBox="0 0 32 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="my-auto"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 4.5H11.9997V16.5H19.9994V4.5H27.999V20.5H23.9992V24.5H19.9994V28.5H11.9997V24.5H7.99984V20.5H4V4.5ZM10.0008 6.50005V18.5H6.00092V6.50005H10.0008ZM14.0005 18.5001V22.5001H10.0007V18.5001H14.0005ZM18.0004 26.5V22.5001H22.0002V18.5001H18.0004V22.5H14.0006V26.5H18.0004ZM26.0001 18.5V6.50005H22.0002V18.5H26.0001Z"
            fill="#2B2B2B"
          />
          <path d="M17.998 26.5V22.5H13.9982V26.5H17.998Z" fill="#FFDF3A" />
          <path d="M13.998 22.5V18.5H9.99821V22.5H13.998Z" fill="#28F77E" />
          <path d="M22 22.5V18.5H18.0002V22.5H22Z" fill="#FFDF3A" />
          <path
            d="M9.99609 18.5V6.5H5.99626L5.99626 18.5H9.99609Z"
            fill="#F7F7F7"
          />
          <path d="M25.998 18.5V6.5H21.9982V18.5H25.998Z" fill="#40A8F5" />
        </svg>
        <p className="my-auto line-clamp-2 text-semantic-fg-secondary product-body-text-4-regular">
          {pipelineIsPublic
            ? "Remove your pipeline from the amazing community of builders 😔"
            : " Publish this pipeline to the Community for the public to use or clone."}
        </p>
        {pipelineIsPublic ? (
          <UnpublishPipelineDialog pipelineName={pipelineName} />
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={async () => {
              updateDialogSharePipelineIsOpen(() => false);
              updateDialogPublishPipelineIsOpen(() => true);
            }}
          >
            {pipelineIsPublic ? "Unpublish" : "Publish"}
          </Button>
        )}
      </div>
    </div>
  );
};

const InstillHubBanner = () => {
  return (
    <svg
      width="480"
      height="218"
      viewBox="0 0 480 218"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_414_71763)">
        <rect
          width="480"
          height="217"
          transform="translate(0 0.5)"
          fill="white"
        />
        <g clipPath="url(#clip1_414_71763)">
          <rect
            width="480"
            height="217"
            transform="translate(0 0.5)"
            fill="white"
          />
          <g clipPath="url(#clip2_414_71763)">
            <path
              d="M-3.90433e-06 89.8206L0 0.5L266.434 0.500012L266.434 89.8206L-3.90433e-06 89.8206Z"
              fill="#F1F2F2"
            />
            <path
              d="M-2.22708e-06 140.771L0 89.8213L192.811 89.8213L192.811 140.771L-2.22708e-06 140.771Z"
              fill="#FBBB3C"
            />
            <path
              d="M192.812 89.8206L192.812 0.5L304.361 0.500005L304.361 89.8206L192.812 89.8206Z"
              fill="#FBBB3C"
            />
            <path
              d="M-2.14605e-06 189.866L0 140.771L192.811 140.771L192.811 189.866L-2.14605e-06 189.866Z"
              fill="#E02E3D"
            />
            <path
              d="M192.812 173.501L192.812 89.8213L304.362 89.8213L304.362 173.501L192.812 173.501Z"
              fill="#E02E3D"
            />
            <path
              d="M304.363 136.757L304.363 89.8213L373.425 89.8213L373.425 136.757L304.363 136.757Z"
              fill="#E02E3D"
            />
            <path
              d="M304.363 89.8206L304.363 0.5L414.424 0.500005L414.424 89.8206L304.363 89.8206Z"
              fill="#E02E3D"
            />
            <path
              d="M-1.20791e-06 217.5L0 189.866L192.811 189.866L192.811 217.5L-1.20791e-06 217.5Z"
              fill="#6E35DE"
            />
            <path
              d="M192.812 203.452L192.812 173.5L304.362 173.5L304.362 203.452L192.812 203.452Z"
              fill="#6E35DE"
            />
            <path
              d="M304.363 191.41L304.363 136.755L373.425 136.755L373.425 191.41L304.363 191.41Z"
              fill="#6E35DE"
            />
            <path
              d="M373.426 173.501L373.426 89.8213L416.409 89.8213L416.409 173.501L373.426 173.501Z"
              fill="#6E35DE"
            />
            <path
              d="M416.406 140.771L416.406 89.8213L442.08 89.8213L442.08 140.771L416.406 140.771Z"
              fill="#6E35DE"
            />
            <path
              d="M411.998 89.8206L411.998 0.5L458.904 0.500002L458.904 89.8206L411.998 89.8206Z"
              fill="#6E35DE"
            />
            <path
              d="M458.904 89.8206L458.904 0.5L480 0.500001L480 89.8206L458.904 89.8206Z"
              fill="#1E4EAE"
            />
            <path
              d="M442.08 140.771L442.08 89.8213L480 89.8213L480 140.771L442.08 140.771Z"
              fill="#1E4EAE"
            />
            <path
              d="M416.406 171.958L416.406 140.771L458.905 140.771L458.905 171.958L416.406 171.958Z"
              fill="#1E4EAE"
            />
            <path
              d="M416.406 191.41L416.406 171.956L442.915 171.956L442.915 191.41L416.406 191.41Z"
              fill="#F1F2F2"
            />
            <path
              d="M373.426 203.693L373.426 173.5L416.409 173.5L416.409 203.693L373.426 203.693Z"
              fill="#1E4EAE"
            />
            <path
              d="M304.363 217.5L304.363 191.41L373.425 191.41L373.425 217.5L304.363 217.5Z"
              fill="#1E4EAE"
            />
            <path
              d="M192.812 217.5L192.812 203.452L304.362 203.452L304.362 217.5L192.812 217.5Z"
              fill="#1E4EAE"
            />
            <path
              d="M458.904 191.41L458.904 140.771L480 140.771L480 191.41L458.904 191.41Z"
              fill="#F1F2F2"
            />
            <path
              d="M442.914 203.693L442.914 171.956L458.904 171.956L458.904 203.693L442.914 203.693Z"
              fill="#F1F2F2"
            />
            <path
              d="M416.406 217.5L416.406 191.41L442.915 191.41L442.915 217.5L416.406 217.5Z"
              fill="#F1F2F2"
            />
            <path
              d="M373.426 217.5L373.426 203.693L416.409 203.693L416.409 217.5L373.426 217.5Z"
              fill="#F1F2F2"
            />
            <path
              d="M458.904 203.693L458.904 191.41L480 191.41L480 203.693L458.904 203.693Z"
              fill="#F1F2F2"
            />
            <path
              d="M442.914 217.5L442.914 203.693L480 203.693L480 217.5L442.914 217.5Z"
              fill="#F1F2F2"
            />
          </g>
          <path
            d="M24.424 41.5H22.312V30.332H27.336C29.4 30.332 30.648 31.724 30.648 33.788C30.648 35.868 29.4 37.244 27.336 37.244H24.424V41.5ZM24.424 32.172V35.42H27.144C27.96 35.42 28.456 34.972 28.456 34.156V33.42C28.456 32.604 27.96 32.172 27.144 32.172H24.424ZM37.746 41.5V40.108H37.666C37.378 40.94 36.706 41.692 35.33 41.692C33.618 41.692 32.658 40.508 32.658 38.428V33.148H34.706V38.22C34.706 39.372 35.138 39.996 36.114 39.996C36.93 39.996 37.746 39.564 37.746 38.668V33.148H39.794V41.5H37.746ZM42.4802 41.5V29.66H44.5282V34.524H44.5922C44.8962 33.564 45.7922 32.956 46.8962 32.956C49.0082 32.956 50.1762 34.524 50.1762 37.308C50.1762 40.108 49.0082 41.692 46.8962 41.692C45.7922 41.692 44.9122 41.052 44.5922 40.108H44.5282V41.5H42.4802ZM46.2402 39.996C47.2962 39.996 48.0322 39.228 48.0322 38.044V36.604C48.0322 35.42 47.2962 34.636 46.2402 34.636C45.2642 34.636 44.5282 35.164 44.5282 35.98V38.636C44.5282 39.5 45.2642 39.996 46.2402 39.996ZM55.546 41.5H54.442C53.05 41.5 52.394 40.764 52.394 39.484V29.66H54.442V39.868H55.546V41.5ZM58.4411 31.932C57.5931 31.932 57.2411 31.5 57.2411 30.908V30.588C57.2411 29.996 57.5931 29.564 58.4411 29.564C59.2731 29.564 59.6411 29.996 59.6411 30.588V30.908C59.6411 31.5 59.2731 31.932 58.4411 31.932ZM57.4171 41.5V33.148H59.4651V41.5H57.4171ZM64.895 41.692C63.311 41.692 62.271 41.116 61.439 40.156L62.687 38.94C63.295 39.644 64.031 40.076 64.975 40.076C65.951 40.076 66.367 39.708 66.367 39.116C66.367 38.636 66.079 38.332 65.343 38.236L64.511 38.124C62.719 37.9 61.727 37.116 61.727 35.596C61.727 33.98 62.991 32.956 64.895 32.956C66.527 32.956 67.359 33.436 68.159 34.268L66.959 35.468C66.479 34.956 65.775 34.572 64.959 34.572C64.079 34.572 63.695 34.924 63.695 35.436C63.695 35.996 63.999 36.252 64.783 36.38L65.631 36.492C67.455 36.748 68.335 37.564 68.335 38.956C68.335 40.572 66.975 41.692 64.895 41.692ZM70.4634 41.5V29.66H72.5114V34.54H72.5914C72.9274 33.644 73.6314 32.956 74.9274 32.956C76.6394 32.956 77.5994 34.14 77.5994 36.22V41.5H75.5514V36.428C75.5514 35.244 75.1514 34.636 74.1754 34.636C73.3274 34.636 72.5114 35.084 72.5114 35.98V41.5H70.4634ZM86.8989 41.5C85.4909 41.5 84.7389 40.732 84.7389 39.372V34.78H83.5069V33.148H84.1469C84.7549 33.148 84.9469 32.86 84.9469 32.284V30.86H86.7869V33.148H88.4989V34.78H86.7869V39.868H88.3709V41.5H86.8989ZM93.8447 41.692C91.4607 41.692 89.9727 39.996 89.9727 37.308C89.9727 34.636 91.4607 32.956 93.8447 32.956C96.2447 32.956 97.7327 34.636 97.7327 37.308C97.7327 39.996 96.2447 41.692 93.8447 41.692ZM93.8447 40.044C94.9167 40.044 95.5887 39.356 95.5887 38.092V36.54C95.5887 35.292 94.9167 34.604 93.8447 34.604C92.7887 34.604 92.1167 35.292 92.1167 36.54V38.092C92.1167 39.356 92.7887 40.044 93.8447 40.044ZM106.578 41.5C105.17 41.5 104.418 40.732 104.418 39.372V34.78H103.186V33.148H103.826C104.434 33.148 104.626 32.86 104.626 32.284V30.86H106.466V33.148H108.178V34.78H106.466V39.868H108.05V41.5H106.578ZM110.274 41.5V29.66H112.322V34.54H112.402C112.738 33.644 113.442 32.956 114.738 32.956C116.45 32.956 117.41 34.14 117.41 36.22V41.5H115.362V36.428C115.362 35.244 114.962 34.636 113.986 34.636C113.138 34.636 112.322 35.084 112.322 35.98V41.5H110.274ZM123.376 41.692C120.912 41.692 119.44 39.98 119.44 37.308C119.44 34.668 120.864 32.956 123.312 32.956C125.92 32.956 127.12 34.876 127.12 37.164V37.836H121.568V38.044C121.568 39.244 122.256 40.06 123.6 40.06C124.608 40.06 125.216 39.58 125.728 38.924L126.832 40.156C126.144 41.1 124.928 41.692 123.376 41.692ZM123.344 34.492C122.272 34.492 121.568 35.292 121.568 36.444V36.572H124.992V36.428C124.992 35.276 124.4 34.492 123.344 34.492ZM27.304 61.5H24.904L21.256 50.332H23.416L25.128 55.772L26.12 59.484H26.168L27.144 55.772L28.856 50.332H30.952L27.304 61.5ZM32.8351 61.5V50.332H36.8991C39.8111 50.332 41.7151 52.204 41.7151 55.916C41.7151 59.628 39.8111 61.5 36.8991 61.5H32.8351ZM34.9471 59.628H36.8991C38.4671 59.628 39.4751 58.7 39.4751 56.796V55.036C39.4751 53.132 38.4671 52.204 36.8991 52.204H34.9471V59.628ZM46.2984 61.5H44.1864V50.332H49.2104C51.2744 50.332 52.5224 51.724 52.5224 53.788C52.5224 55.868 51.2744 57.244 49.2104 57.244H46.2984V61.5ZM46.2984 52.172V55.42H49.0184C49.8344 55.42 50.3304 54.972 50.3304 54.156V53.42C50.3304 52.604 49.8344 52.172 49.0184 52.172H46.2984ZM63.1936 61.692C60.2496 61.692 58.3776 59.756 58.3776 55.996C58.3776 52.236 60.2496 50.14 63.1936 50.14C65.1936 50.14 66.4896 50.988 67.2736 52.716L65.4656 53.676C65.1456 52.684 64.4416 52.012 63.1936 52.012C61.6256 52.012 60.6176 53.148 60.6176 55.052V56.812C60.6176 58.732 61.6256 59.82 63.1936 59.82C64.4576 59.82 65.2416 59.052 65.6096 58.044L67.3216 59.052C66.5216 60.716 65.1936 61.692 63.1936 61.692ZM72.6272 61.692C70.2432 61.692 68.7552 59.996 68.7552 57.308C68.7552 54.636 70.2432 52.956 72.6272 52.956C75.0272 52.956 76.5152 54.636 76.5152 57.308C76.5152 59.996 75.0272 61.692 72.6272 61.692ZM72.6272 60.044C73.6992 60.044 74.3712 59.356 74.3712 58.092V56.54C74.3712 55.292 73.6992 54.604 72.6272 54.604C71.5712 54.604 70.8992 55.292 70.8992 56.54V58.092C70.8992 59.356 71.5712 60.044 72.6272 60.044ZM80.6989 61.5H78.6509V53.148H80.6989V54.54H80.7789C81.0989 53.66 81.7709 52.956 83.0189 52.956C84.1549 52.956 85.0349 53.516 85.4349 54.636H85.4669C85.7709 53.708 86.6989 52.956 88.0269 52.956C89.6589 52.956 90.5869 54.14 90.5869 56.22V61.5H88.5389V56.428C88.5389 55.228 88.1069 54.636 87.1949 54.636C86.3949 54.636 85.6429 55.084 85.6429 55.98V61.5H83.5949V56.428C83.5949 55.228 83.1629 54.636 82.2509 54.636C81.4669 54.636 80.6989 55.084 80.6989 55.98V61.5ZM95.222 61.5H93.174V53.148H95.222V54.54H95.302C95.622 53.66 96.294 52.956 97.542 52.956C98.678 52.956 99.558 53.516 99.958 54.636H99.99C100.294 53.708 101.222 52.956 102.55 52.956C104.182 52.956 105.11 54.14 105.11 56.22V61.5H103.062V56.428C103.062 55.228 102.63 54.636 101.718 54.636C100.918 54.636 100.166 55.084 100.166 55.98V61.5H98.118V56.428C98.118 55.228 97.686 54.636 96.774 54.636C95.99 54.636 95.222 55.084 95.222 55.98V61.5ZM112.689 61.5V60.108H112.609C112.321 60.94 111.649 61.692 110.273 61.692C108.561 61.692 107.601 60.508 107.601 58.428V53.148H109.649V58.22C109.649 59.372 110.081 59.996 111.057 59.996C111.873 59.996 112.689 59.564 112.689 58.668V53.148H114.737V61.5H112.689ZM119.471 61.5H117.423V53.148H119.471V54.54H119.551C119.887 53.644 120.591 52.956 121.887 52.956C123.599 52.956 124.559 54.14 124.559 56.22V61.5H122.511V56.428C122.511 55.244 122.111 54.636 121.135 54.636C120.287 54.636 119.471 55.084 119.471 55.98V61.5ZM128.174 51.932C127.326 51.932 126.974 51.5 126.974 50.908V50.588C126.974 49.996 127.326 49.564 128.174 49.564C129.006 49.564 129.374 49.996 129.374 50.588V50.908C129.374 51.5 129.006 51.932 128.174 51.932ZM127.15 61.5V53.148H129.198V61.5H127.15ZM134.499 61.5C133.091 61.5 132.339 60.732 132.339 59.372V54.78H131.107V53.148H131.747C132.355 53.148 132.547 52.86 132.547 52.284V50.86H134.387V53.148H136.099V54.78H134.387V59.868H135.971V61.5H134.499ZM141.86 57.564L143.316 53.148H145.236L141.876 62.988C141.46 64.188 140.868 64.7 139.492 64.7H138.26V63.068H139.764L140.148 61.9L137.156 53.148H139.188L140.644 57.564L141.188 59.676H141.284L141.86 57.564Z"
            fill="#1D2433"
            fillOpacity="0.8"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_414_71763">
          <rect
            width="480"
            height="217"
            fill="white"
            transform="translate(0 0.5)"
          />
        </clipPath>
        <clipPath id="clip1_414_71763">
          <rect
            width="480"
            height="217"
            fill="white"
            transform="translate(0 0.5)"
          />
        </clipPath>
        <clipPath id="clip2_414_71763">
          <rect
            width="217"
            height="480"
            fill="white"
            transform="matrix(-4.37114e-08 1 1 4.37114e-08 0 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

const InstillhubGrayBanner = () => {
  return (
    <svg
      width="480"
      height="217"
      viewBox="0 0 480 217"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_510_44145)">
        <rect width="480" height="217" fill="white" />
        <g clipPath="url(#clip1_510_44145)">
          <path
            d="M-3.90433e-06 89.3206L0 0L266.434 1.16462e-05L266.434 89.3206L-3.90433e-06 89.3206Z"
            fill="#F1F2F2"
          />
          <path
            d="M-2.22708e-06 140.271L0 89.3213L192.811 89.3213L192.811 140.271L-2.22708e-06 140.271Z"
            fill="#C5C5C5"
          />
          <path
            d="M192.812 89.3206L192.812 0L304.361 4.87592e-06L304.361 89.3206L192.812 89.3206Z"
            fill="#C5C5C5"
          />
          <path
            d="M-2.14605e-06 189.366L0 140.271L192.811 140.271L192.811 189.366L-2.14605e-06 189.366Z"
            fill="#757575"
          />
          <path
            d="M192.812 173.001L192.812 89.3213L304.362 89.3213L304.362 173.001L192.812 173.001Z"
            fill="#757575"
          />
          <path
            d="M304.363 136.257L304.363 89.3213L373.425 89.3213L373.425 136.257L304.363 136.257Z"
            fill="#757575"
          />
          <path
            d="M304.363 89.3206L304.363 0L414.424 4.81091e-06L414.424 89.3206L304.363 89.3206Z"
            fill="#757575"
          />
          <path
            d="M-1.20791e-06 217L0 189.366L192.811 189.366L192.811 217L-1.20791e-06 217Z"
            fill="#5D5D5D"
          />
          <path
            d="M192.812 202.952L192.812 173L304.362 173L304.362 202.952L192.812 202.952Z"
            fill="#5D5D5D"
          />
          <path
            d="M304.363 190.91L304.363 136.255L373.425 136.255L373.425 190.91L304.363 190.91Z"
            fill="#5D5D5D"
          />
          <path
            d="M373.426 173.001L373.426 89.3213L416.409 89.3213L416.409 173.001L373.426 173.001Z"
            fill="#5D5D5D"
          />
          <path
            d="M416.406 140.271L416.406 89.3213L442.08 89.3213L442.08 140.271L416.406 140.271Z"
            fill="#5D5D5D"
          />
          <path
            d="M411.998 89.3206L411.998 0L458.904 2.05032e-06L458.904 89.3206L411.998 89.3206Z"
            fill="#5D5D5D"
          />
          <path
            d="M458.904 89.3206L458.904 0L480 9.22122e-07L480 89.3206L458.904 89.3206Z"
            fill="#545454"
          />
          <path
            d="M442.08 140.271L442.08 89.3213L480 89.3213L480 140.271L442.08 140.271Z"
            fill="#545454"
          />
          <path
            d="M416.406 171.458L416.406 140.271L458.905 140.271L458.905 171.458L416.406 171.458Z"
            fill="#545454"
          />
          <path
            d="M416.406 190.91L416.406 171.456L442.915 171.456L442.915 190.91L416.406 190.91Z"
            fill="#F1F2F2"
          />
          <path
            d="M373.426 203.193L373.426 173L416.409 173L416.409 203.193L373.426 203.193Z"
            fill="#545454"
          />
          <path
            d="M304.363 217L304.363 190.91L373.425 190.91L373.425 217L304.363 217Z"
            fill="#545454"
          />
          <path
            d="M192.812 217L192.812 202.952L304.362 202.952L304.362 217L192.812 217Z"
            fill="#545454"
          />
          <path
            d="M458.904 190.91L458.904 140.271L480 140.271L480 190.91L458.904 190.91Z"
            fill="#F1F2F2"
          />
          <path
            d="M442.914 203.193L442.914 171.456L458.904 171.456L458.904 203.193L442.914 203.193Z"
            fill="#F1F2F2"
          />
          <path
            d="M416.406 217L416.406 190.91L442.915 190.91L442.915 217L416.406 217Z"
            fill="#F1F2F2"
          />
          <path
            d="M373.426 217L373.426 203.193L416.409 203.193L416.409 217L373.426 217Z"
            fill="#F1F2F2"
          />
          <path
            d="M458.904 203.193L458.904 190.91L480 190.91L480 203.193L458.904 203.193Z"
            fill="#F1F2F2"
          />
          <path
            d="M442.914 217L442.914 203.193L480 203.193L480 217L442.914 217Z"
            fill="#F1F2F2"
          />
        </g>
        <path
          d="M22.314 29.832H24.394V36.696C24.394 38.44 25.002 39.32 26.602 39.32C28.202 39.32 28.81 38.44 28.81 36.696V29.832H30.89V36.424C30.89 39.704 29.722 41.192 26.586 41.192C23.45 41.192 22.314 39.704 22.314 36.424V29.832ZM35.6809 41H33.6329V32.648H35.6809V34.04H35.7609C36.0969 33.144 36.8009 32.456 38.0969 32.456C39.8089 32.456 40.7689 33.64 40.7689 35.72V41H38.7209V35.928C38.7209 34.744 38.3209 34.136 37.3449 34.136C36.4969 34.136 35.6809 34.584 35.6809 35.48V41ZM43.3592 44.2V32.648H45.4072V34.024H45.4712C45.7752 33.064 46.6712 32.456 47.7752 32.456C49.8872 32.456 51.0552 34.024 51.0552 36.808C51.0552 39.608 49.8872 41.192 47.7752 41.192C46.6712 41.192 45.7912 40.552 45.4712 39.608H45.4072V44.2H43.3592ZM47.1192 39.496C48.1752 39.496 48.9112 38.728 48.9112 37.544V36.104C48.9112 34.92 48.1752 34.136 47.1192 34.136C46.1432 34.136 45.4072 34.664 45.4072 35.48V38.136C45.4072 39 46.1432 39.496 47.1192 39.496ZM58.2649 41V39.608H58.1849C57.8969 40.44 57.2249 41.192 55.8489 41.192C54.1369 41.192 53.1769 40.008 53.1769 37.928V32.648H55.2249V37.72C55.2249 38.872 55.6569 39.496 56.6329 39.496C57.4489 39.496 58.2649 39.064 58.2649 38.168V32.648H60.3129V41H58.2649ZM62.9992 41V29.16H65.0472V34.024H65.1112C65.4152 33.064 66.3112 32.456 67.4152 32.456C69.5272 32.456 70.6952 34.024 70.6952 36.808C70.6952 39.608 69.5272 41.192 67.4152 41.192C66.3112 41.192 65.4312 40.552 65.1112 39.608H65.0472V41H62.9992ZM66.7592 39.496C67.8152 39.496 68.5512 38.728 68.5512 37.544V36.104C68.5512 34.92 67.8152 34.136 66.7592 34.136C65.7832 34.136 65.0472 34.664 65.0472 35.48V38.136C65.0472 39 65.7832 39.496 66.7592 39.496ZM76.0649 41H74.9609C73.5689 41 72.9129 40.264 72.9129 38.984V29.16H74.9609V39.368H76.0649V41ZM78.96 31.432C78.112 31.432 77.76 31 77.76 30.408V30.088C77.76 29.496 78.112 29.064 78.96 29.064C79.792 29.064 80.16 29.496 80.16 30.088V30.408C80.16 31 79.792 31.432 78.96 31.432ZM77.936 41V32.648H79.984V41H77.936ZM85.4139 41.192C83.8299 41.192 82.7899 40.616 81.9579 39.656L83.2059 38.44C83.8139 39.144 84.5499 39.576 85.4939 39.576C86.4699 39.576 86.8859 39.208 86.8859 38.616C86.8859 38.136 86.5979 37.832 85.8619 37.736L85.0299 37.624C83.2379 37.4 82.2459 36.616 82.2459 35.096C82.2459 33.48 83.5099 32.456 85.4139 32.456C87.0459 32.456 87.8779 32.936 88.6779 33.768L87.4779 34.968C86.9979 34.456 86.2939 34.072 85.4779 34.072C84.5979 34.072 84.2139 34.424 84.2139 34.936C84.2139 35.496 84.5179 35.752 85.3019 35.88L86.1499 35.992C87.9739 36.248 88.8539 37.064 88.8539 38.456C88.8539 40.072 87.4939 41.192 85.4139 41.192ZM90.9823 41V29.16H93.0303V34.04H93.1103C93.4463 33.144 94.1503 32.456 95.4463 32.456C97.1583 32.456 98.1183 33.64 98.1183 35.72V41H96.0703V35.928C96.0703 34.744 95.6703 34.136 94.6943 34.136C93.8463 34.136 93.0303 34.584 93.0303 35.48V41H90.9823ZM105.226 41V34.264H103.994V32.648H105.226V31.448C105.226 29.976 106.026 29.16 107.53 29.16H108.986V30.792H107.274V32.648H108.986V34.264H107.274V41H105.226ZM112.772 41H110.724V32.648H112.772V34.376H112.852C113.06 33.496 113.732 32.648 115.06 32.648H115.508V34.584H114.868C113.492 34.584 112.772 34.968 112.772 35.88V41ZM120.559 41.192C118.175 41.192 116.687 39.496 116.687 36.808C116.687 34.136 118.175 32.456 120.559 32.456C122.959 32.456 124.447 34.136 124.447 36.808C124.447 39.496 122.959 41.192 120.559 41.192ZM120.559 39.544C121.631 39.544 122.303 38.856 122.303 37.592V36.04C122.303 34.792 121.631 34.104 120.559 34.104C119.503 34.104 118.831 34.792 118.831 36.04V37.592C118.831 38.856 119.503 39.544 120.559 39.544ZM128.63 41H126.582V32.648H128.63V34.04H128.71C129.03 33.16 129.702 32.456 130.95 32.456C132.086 32.456 132.966 33.016 133.366 34.136H133.398C133.702 33.208 134.63 32.456 135.958 32.456C137.59 32.456 138.518 33.64 138.518 35.72V41H136.47V35.928C136.47 34.728 136.038 34.136 135.126 34.136C134.326 34.136 133.574 34.584 133.574 35.48V41H131.526V35.928C131.526 34.728 131.094 34.136 130.182 34.136C129.398 34.136 128.63 34.584 128.63 35.48V41ZM147.815 41C146.407 41 145.655 40.232 145.655 38.872V34.28H144.423V32.648H145.063C145.671 32.648 145.863 32.36 145.863 31.784V30.36H147.703V32.648H149.415V34.28H147.703V39.368H149.287V41H147.815ZM151.511 41V29.16H153.559V34.04H153.639C153.975 33.144 154.679 32.456 155.975 32.456C157.687 32.456 158.647 33.64 158.647 35.72V41H156.599V35.928C156.599 34.744 156.199 34.136 155.223 34.136C154.375 34.136 153.559 34.584 153.559 35.48V41H151.511ZM164.613 41.192C162.149 41.192 160.677 39.48 160.677 36.808C160.677 34.168 162.101 32.456 164.549 32.456C167.157 32.456 168.357 34.376 168.357 36.664V37.336H162.805V37.544C162.805 38.744 163.493 39.56 164.837 39.56C165.845 39.56 166.453 39.08 166.965 38.424L168.069 39.656C167.381 40.6 166.165 41.192 164.613 41.192ZM164.581 33.992C163.509 33.992 162.805 34.792 162.805 35.944V36.072H166.229V35.928C166.229 34.776 165.637 33.992 164.581 33.992ZM27.386 61H24.986L21.338 49.832H23.498L25.21 55.272L26.202 58.984H26.25L27.226 55.272L28.938 49.832H31.034L27.386 61ZM32.9172 61V49.832H36.9812C39.8932 49.832 41.7972 51.704 41.7972 55.416C41.7972 59.128 39.8932 61 36.9812 61H32.9172ZM35.0292 59.128H36.9812C38.5492 59.128 39.5572 58.2 39.5572 56.296V54.536C39.5572 52.632 38.5492 51.704 36.9812 51.704H35.0292V59.128ZM46.3804 61H44.2684V49.832H49.2924C51.3564 49.832 52.6044 51.224 52.6044 53.288C52.6044 55.368 51.3564 56.744 49.2924 56.744H46.3804V61ZM46.3804 51.672V54.92H49.1004C49.9164 54.92 50.4124 54.472 50.4124 53.656V52.92C50.4124 52.104 49.9164 51.672 49.1004 51.672H46.3804ZM63.2757 61.192C60.3317 61.192 58.4597 59.256 58.4597 55.496C58.4597 51.736 60.3317 49.64 63.2757 49.64C65.2757 49.64 66.5717 50.488 67.3557 52.216L65.5477 53.176C65.2277 52.184 64.5237 51.512 63.2757 51.512C61.7077 51.512 60.6997 52.648 60.6997 54.552V56.312C60.6997 58.232 61.7077 59.32 63.2757 59.32C64.5397 59.32 65.3237 58.552 65.6917 57.544L67.4037 58.552C66.6037 60.216 65.2757 61.192 63.2757 61.192ZM72.7093 61.192C70.3253 61.192 68.8373 59.496 68.8373 56.808C68.8373 54.136 70.3253 52.456 72.7093 52.456C75.1093 52.456 76.5973 54.136 76.5973 56.808C76.5973 59.496 75.1093 61.192 72.7093 61.192ZM72.7093 59.544C73.7813 59.544 74.4533 58.856 74.4533 57.592V56.04C74.4533 54.792 73.7813 54.104 72.7093 54.104C71.6533 54.104 70.9813 54.792 70.9813 56.04V57.592C70.9813 58.856 71.6533 59.544 72.7093 59.544ZM80.7809 61H78.7329V52.648H80.7809V54.04H80.8609C81.1809 53.16 81.8529 52.456 83.1009 52.456C84.2369 52.456 85.1169 53.016 85.5169 54.136H85.5489C85.8529 53.208 86.7809 52.456 88.1089 52.456C89.7409 52.456 90.6689 53.64 90.6689 55.72V61H88.6209V55.928C88.6209 54.728 88.1889 54.136 87.2769 54.136C86.4769 54.136 85.7249 54.584 85.7249 55.48V61H83.6769V55.928C83.6769 54.728 83.2449 54.136 82.3329 54.136C81.5489 54.136 80.7809 54.584 80.7809 55.48V61ZM95.304 61H93.256V52.648H95.304V54.04H95.384C95.704 53.16 96.376 52.456 97.624 52.456C98.76 52.456 99.64 53.016 100.04 54.136H100.072C100.376 53.208 101.304 52.456 102.632 52.456C104.264 52.456 105.192 53.64 105.192 55.72V61H103.144V55.928C103.144 54.728 102.712 54.136 101.8 54.136C101 54.136 100.248 54.584 100.248 55.48V61H98.2V55.928C98.2 54.728 97.768 54.136 96.856 54.136C96.072 54.136 95.304 54.584 95.304 55.48V61ZM112.771 61V59.608H112.691C112.403 60.44 111.731 61.192 110.355 61.192C108.643 61.192 107.683 60.008 107.683 57.928V52.648H109.731V57.72C109.731 58.872 110.163 59.496 111.139 59.496C111.955 59.496 112.771 59.064 112.771 58.168V52.648H114.819V61H112.771ZM119.553 61H117.505V52.648H119.553V54.04H119.633C119.969 53.144 120.673 52.456 121.969 52.456C123.681 52.456 124.641 53.64 124.641 55.72V61H122.593V55.928C122.593 54.744 122.193 54.136 121.217 54.136C120.369 54.136 119.553 54.584 119.553 55.48V61ZM128.256 51.432C127.408 51.432 127.056 51 127.056 50.408V50.088C127.056 49.496 127.408 49.064 128.256 49.064C129.088 49.064 129.456 49.496 129.456 50.088V50.408C129.456 51 129.088 51.432 128.256 51.432ZM127.232 61V52.648H129.28V61H127.232ZM134.582 61C133.174 61 132.422 60.232 132.422 58.872V54.28H131.19V52.648H131.83C132.438 52.648 132.63 52.36 132.63 51.784V50.36H134.47V52.648H136.182V54.28H134.47V59.368H136.054V61H134.582ZM141.942 57.064L143.398 52.648H145.318L141.958 62.488C141.542 63.688 140.95 64.2 139.574 64.2H138.342V62.568H139.846L140.23 61.4L137.238 52.648H139.27L140.726 57.064L141.27 59.176H141.366L141.942 57.064Z"
          fill="#1D2433"
          fillOpacity="0.8"
        />
      </g>
      <defs>
        <clipPath id="clip0_510_44145">
          <rect width="480" height="217" fill="white" />
        </clipPath>
        <clipPath id="clip1_510_44145">
          <rect
            width="217"
            height="480"
            fill="white"
            transform="matrix(-4.37114e-08 1 1 4.37114e-08 0 0)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
