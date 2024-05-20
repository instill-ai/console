import { fetchUserModel } from "@instill-ai/toolkit/server";
import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const modelName = searchParams.get("model");
  const userName = searchParams.get("user") || searchParams.get("amp;user");

  const model = await fetchUserModel({
    modelName: `users/${userName}/models/${modelName}`,
    accessToken: null,
  });

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full bg-[#F8F8FA] p-8 bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            'url("' +
            process.env.NEXT_PUBLIC_CONSOLE_BASE_URL +
            '/images/blur.svg")',
        }}
      >
        <div tw="w-full gap-x-2 flex flex-row h-[200px]">
          <div tw="flex w-[840px] break-words text-left">
            <span
              tw="font-sans text-[64px] text-[#1D2433]"
              style={{
                fontWeight: "700",
              }}
            >
              {model.owner?.user?.id}/
              <span
                style={{
                  fontWeight: "700",
                }}
              >
                {model?.id}
              </span>
            </span>
          </div>
          <div tw="flex">
            <img
              src={model.owner?.user?.profile.avatar}
              alt=""
              tw="max-h-[200px] max-w-[200px]"
            />
          </div>
        </div>
        <div tw="flex h-[200px] items-end">
          <a
            href={`${process.env.NEXT_PUBLIC_CONSOLE_BASE_URL}/${userName}/models/${modelName}`}
            target="_blank"
            rel="noreferrer"
            tw="text-[#1D2433CC] text-[32px] font-medium font-sans cursor-pointer"
            style={{ cursor: "pointer" }}
          >
            {model.description.slice(0, 200)}
          </a>
        </div>
        <div tw="flex justify-end items-end h-[100px]">
          <svg
            width="48"
            height="49"
            viewBox="0 0 48 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_1351_24479)">
              <path
                d="M48.0017 45.2517V48.9458H0V0.927246H48.0017V45.2517ZM44.309 45.2517V34.1305H40.6146V45.2517H44.309ZM44.309 30.4363V19.3962H33.187V30.4363H44.309ZM44.309 15.7021V12.0079H33.187V15.7021H44.309ZM44.309 8.3155V4.62138H33.187V8.3155H44.309ZM36.9236 45.2517V34.1305H33.187V45.2517H36.9236ZM29.4943 41.5576V34.1254H25.8455V37.8415H22.1967V41.5576H29.4943ZM29.4943 30.4363V19.3962H25.8455V30.4363H29.4943ZM29.4943 11.9843V4.62138H22.1545V8.27665L22.1325 8.34083H18.4618V15.7021H25.8455V11.986L29.4943 11.9843ZM22.1545 37.7823V34.1305H18.4618V37.7823H22.1545ZM22.1545 30.4363V19.3962H18.4618V30.4363H22.1545ZM14.7691 45.2517V34.1305H3.6927V45.2517H14.7691ZM14.7691 30.4363V19.3962H11.0764V30.4363H14.7691ZM14.7691 15.7021V8.34083H14.7387V4.62475H11.0764V15.7054L14.7691 15.7021ZM7.38539 30.4363V19.3962H3.6927V30.4363H7.38539ZM7.38539 15.7021V4.62138H3.6927V15.7021H7.38539Z"
                fill="#1A1A1A"
              />
              <path
                d="M44.307 34.1306H40.6143V45.2518H44.307V34.1306Z"
                fill="#40A8F5"
              />
              <path
                d="M44.3068 19.3965H33.1865V30.4366H44.3068V19.3965Z"
                fill="#40A8F5"
              />
              <path
                d="M44.3068 12.0073H33.1865V15.7014H44.3068V12.0073Z"
                fill="#FF5353"
              />
              <path
                d="M44.3068 4.62085H33.1865V8.31497H44.3068V4.62085Z"
                fill="#FFDF3A"
              />
              <path
                d="M36.9214 34.1306H33.1865V45.2518H36.9214V34.1306Z"
                fill="#FFDF3A"
              />
              <path
                d="M29.4956 34.1306V41.5577H22.1963V37.8433H25.8451V34.1306H29.4956Z"
                fill="#FF5353"
              />
              <path
                d="M29.4945 19.3965H25.8457V30.4366H29.4945V19.3965Z"
                fill="#FFDF3A"
              />
              <path
                d="M29.4955 4.62085V11.9838H25.845H25.8231V8.27612H22.1523V4.62085H29.4955Z"
                fill="#40A8F5"
              />
              <path
                d="M25.8456 11.984V15.7018H18.4619V8.34058H22.131V11.984H25.8237H25.8456Z"
                fill="#FFDF3A"
              />
              <path
                d="M25.8236 8.27637V11.984H22.1309V8.34055L22.1528 8.27637H25.8236Z"
                fill="#1A1A1A"
              />
              <path
                d="M22.1546 34.1306H18.4619V37.7825H22.1546V34.1306Z"
                fill="#28F77E"
              />
              <path
                d="M22.1546 19.3965H18.4619V30.4366H22.1546V19.3965Z"
                fill="#FF5353"
              />
              <path
                d="M14.7688 34.1306V45.2518H3.69238V34.1306H7.38339H11.0761H14.7688Z"
                fill="#40A8F5"
              />
              <path
                d="M14.7689 19.3965H11.0762V30.4366H14.7689V19.3965Z"
                fill="#40A8F5"
              />
              <path
                d="M14.7689 8.34031V15.7015H11.0762V4.62085H14.7435V8.34031H14.7689Z"
                fill="#FFDF3A"
              />
              <path
                d="M7.38508 19.3965H3.69238V30.4366H7.38508V19.3965Z"
                fill="#FFDF3A"
              />
              <path
                d="M7.38508 4.62085H3.69238V15.7015H7.38508V4.62085Z"
                fill="#FF5353"
              />
            </g>
            <defs>
              <clipPath id="clip0_1351_24479">
                <rect
                  width="48"
                  height="48"
                  fill="white"
                  transform="translate(0 0.92749)"
                />
              </clipPath>
            </defs>
          </svg>
          {/* </span> */}
        </div>
      </div>
    ),
    {
      width: 1110,
      height: 560,
    }
  );
}
