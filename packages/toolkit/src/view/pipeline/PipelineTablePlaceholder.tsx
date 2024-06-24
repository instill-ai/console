"use client";

import cn from "clsx";
import {
  TablePlaceholderBase,
  type TablePlaceholderBaseProps,
} from "../../components";

export type PipelineTablePlaceholderProps = Pick<
  TablePlaceholderBaseProps,
  "marginBottom" | "enableCreateButton"
>;

export const PipelineTablePlaceholder = (
  props: PipelineTablePlaceholderProps,
) => {
  const { marginBottom, enableCreateButton } = props;
  const width = "w-[136px]";
  const height = "h-[136px]";
  const color = "fill-instillGrey95";
  const position = "my-auto";
  const placeholderItems = [
    {
      id: "pipeline-placeholder-1",
      item: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 30 30"
          className={cn("flex", width, height, color, position)}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.6138 8.07483L8.42246 10.2662L6.23108 8.07483L8.42246 5.88345L10.6138 8.07483ZM13.3445 7.07736H12.3854L11.9983 6.69033L9.80697 4.49895L8.42246 3.11444L7.03795 4.49895L4.84657 6.69033L3.46207 8.07483L4.84657 9.45934L7.03795 11.6507L8.42246 13.0352L9.80697 11.6507L11.9983 9.45934L12.3993 9.05838H13.3445L17.3526 9.05838H18.3131L18.7141 9.45934L20.9055 11.6507L22.29 13.0352L23.6745 11.6507L25.8659 9.45934L27.2504 8.07483L25.8659 6.69033L23.6745 4.49895L22.29 3.11444L20.9055 4.49895L18.7141 6.69033L18.3271 7.07736H17.3526L13.3445 7.07736ZM22.29 10.2662L24.4814 8.07483L22.29 5.88345L20.0986 8.07483L22.29 10.2662ZM13.3907 24.9275V18.9384L7.40163 18.9384L7.40163 24.9275H13.3907ZM15.3487 18.9384V16.9804H13.3907H7.40163H5.44364L5.44364 18.9384L5.44364 24.9275L5.44364 26.8855H7.40163H13.3907H15.3487V24.9275V18.9384ZM17.3298 22.9217L23.3539 22.9217L20.7391 26.2835L22.2847 27.4856L26.0266 22.6746V21.4725L22.0646 16.3784L20.519 17.5805L23.1325 20.9407H17.3298V22.9217Z"
          />
        </svg>
      ),
    },
    {
      id: "pipeline-placeholder-2",
      item: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 30 30"
          className={cn("flex", width, height, color, position)}
        >
          <svg
            width="29"
            height="31"
            viewBox="0 0 29 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="3.5" y="1.5" width="11" height="1" stroke="#2B2B2B" />
            <rect x="3.5" y="27.5" width="11" height="1" stroke="#2B2B2B" />
            <mask id="path-3-inside-1_345_247" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.8752 6H3V24H14.8752V19.4981H22V10.4981L14.8752 10.4981V6Z"
              />
            </mask>
            <path
              d="M3 6V4H1V6H3ZM14.8752 6H16.8752V4H14.8752V6ZM3 24H1V26H3V24ZM14.8752 24V26H16.8752V24H14.8752ZM14.8752 19.4981V17.4981H12.8752V19.4981H14.8752ZM22 19.4981V21.4981H24V19.4981H22ZM22 10.4981H24V8.49807L22 8.49807V10.4981ZM14.8752 10.4981H12.8752V12.4981H14.8752V10.4981ZM3 8H14.8752V4H3V8ZM5 24V6H1V24H5ZM14.8752 22H3V26H14.8752V22ZM12.8752 19.4981V24H16.8752V19.4981H12.8752ZM22 17.4981H14.8752V21.4981H22V17.4981ZM20 10.4981V19.4981H24V10.4981H20ZM14.8752 12.4981L22 12.4981V8.49807L14.8752 8.49807V12.4981ZM12.8752 6V10.4981H16.8752V6H12.8752Z"
              fill="#2B2B2B"
              mask="url(#path-3-inside-1_345_247)"
            />
            <rect
              x="25.5"
              y="9.5"
              width="11"
              height="1"
              transform="rotate(90 25.5 9.5)"
              stroke="#2B2B2B"
            />
          </svg>
        </svg>
      ),
    },
    {
      id: "pipeline-placeholder-3",
      item: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 30 30"
          className={cn("flex", width, height, position)}
          fill="none"
        >
          <rect
            x="25.0669"
            y="19.0467"
            width="8.1334"
            height="8.1334"
            transform="rotate(90 25.0669 19.0467)"
            stroke="#2B2B2B"
            strokeWidth="1.86668"
          />
          <rect
            x="26.6801"
            y="9.11188"
            width="8.03301"
            height="8.033"
            transform="rotate(135 26.6801 9.11188)"
            stroke="#2B2B2B"
            strokeWidth="1.86668"
          />
          <rect
            x="15.4999"
            y="9.85809"
            width="5.00004"
            height="1.00001"
            transform="rotate(-180 15.4999 9.85809)"
            stroke="#2B2B2B"
            strokeWidth="1.00001"
            strokeLinejoin="round"
          />
          <mask id="path-4-inside-1_345_238" fill="white">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.00005 14.1201L6.00005 22.1202H6.0001L6.0001 24.1188L16.0002 24.1188V22.1188L8.00007 22.1188L8.00007 14.1201L6.00005 14.1201Z"
            />
          </mask>
          <path
            d="M6.00005 22.1202H4.13337C4.13337 23.1511 4.96911 23.9869 6.00005 23.9869V22.1202ZM6.00005 14.1201L6.00005 12.2534C5.50498 12.2534 5.03018 12.4501 4.68011 12.8002C4.33004 13.1502 4.13337 13.625 4.13337 14.1201L6.00005 14.1201ZM6.0001 22.1202H7.86678C7.86678 21.6251 7.67011 21.1503 7.32004 20.8002C6.96997 20.4502 6.49517 20.2535 6.0001 20.2535V22.1202ZM6.0001 24.1188H4.13341C4.13341 24.6139 4.33008 25.0887 4.68015 25.4388C5.03022 25.7888 5.50502 25.9855 6.0001 25.9855L6.0001 24.1188ZM16.0002 24.1188L16.0002 25.9855C16.4953 25.9855 16.9701 25.7888 17.3201 25.4388C17.6702 25.0887 17.8669 24.6139 17.8669 24.1188H16.0002ZM16.0002 22.1188H17.8669C17.8669 21.0879 17.0311 20.2521 16.0002 20.2521V22.1188ZM8.00007 22.1188H6.13339C6.13339 23.1497 6.96913 23.9855 8.00007 23.9855L8.00007 22.1188ZM8.00007 14.1201L9.86675 14.1201C9.86675 13.625 9.67009 13.1502 9.32001 12.8002C8.96994 12.4501 8.49515 12.2534 8.00007 12.2534V14.1201ZM7.86674 22.1202L7.86674 14.1201L4.13337 14.1201L4.13337 22.1202H7.86674ZM6.0001 20.2535H6.00005V23.9869H6.0001V20.2535ZM7.86678 24.1188L7.86678 22.1202H4.13341L4.13341 24.1188H7.86678ZM16.0002 22.2521L6.0001 22.2521L6.0001 25.9855L16.0002 25.9855L16.0002 22.2521ZM14.1335 22.1188V24.1188H17.8669V22.1188H14.1335ZM8.00007 23.9855L16.0002 23.9855L16.0002 20.2521L8.00007 20.2521L8.00007 23.9855ZM6.13339 14.1201L6.13339 22.1188H9.86675L9.86675 14.1201L6.13339 14.1201ZM6.00005 15.9868L8.00007 15.9868L8.00007 12.2534L6.00005 12.2534L6.00005 15.9868Z"
            fill="#2B2B2B"
            mask="url(#path-4-inside-1_345_238)"
          />
          <circle
            cx="6.99998"
            cy="9.35478"
            r="4.0667"
            stroke="#2B2B2B"
            strokeWidth="1.86668"
          />
        </svg>
      ),
    },
    {
      id: "pipeline-placeholder-4",
      item: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 30 30"
          className={cn("flex", width, height, color, position)}
        >
          <mask
            id="path-1-outside-1_345_232"
            maskUnits="userSpaceOnUse"
            x="1.27321"
            y="3.04553"
            width="28"
            height="24"
            fill="black"
          >
            <rect fill="white" x="1.27321" y="3.04553" width="28" height="24" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.2663 14.2526L8.24551 7.28565L9.68051 6.04553L17.2669 14.8241V16.0642L10.102 24.3551L8.66698 23.1149L14.6868 16.1492L3.27321 16.1492L3.27321 14.2526L14.2663 14.2526ZM24.7792 15.4441L17.7286 7.28565L19.1636 6.04553L26.75 14.8241V16.0642L19.5851 24.3551L18.1501 23.1149L24.7792 15.4441Z"
            />
          </mask>
          <path
            d="M8.24551 7.28565L7.0054 5.85066L5.5704 7.09077L6.81052 8.52577L8.24551 7.28565ZM14.2663 14.2526V16.1492H18.4121L15.7013 13.0125L14.2663 14.2526ZM9.68051 6.04553L11.1155 4.80541L9.87538 3.37042L8.44039 4.61054L9.68051 6.04553ZM17.2669 14.8241H19.1635V14.1181L18.7019 13.584L17.2669 14.8241ZM17.2669 16.0642L18.7019 17.3043L19.1635 16.7702V16.0642H17.2669ZM10.102 24.3551L8.86186 25.7901L10.2968 27.0302L11.537 25.5952L10.102 24.3551ZM8.66698 23.1149L7.23199 21.8748L5.99187 23.3098L7.42686 24.5499L8.66698 23.1149ZM14.6868 16.1492L16.1218 17.3893L18.8325 14.2526H14.6868V16.1492ZM3.27321 16.1492H1.37661L1.37661 18.0458L3.27321 18.0458L3.27321 16.1492ZM3.27321 14.2526L3.27321 12.356H1.37661L1.37661 14.2526H3.27321ZM17.7286 7.28565L16.4885 5.85066L15.0535 7.09077L16.2936 8.52577L17.7286 7.28565ZM24.7792 15.4441L26.2142 16.6843L27.2859 15.4441L26.2142 14.204L24.7792 15.4441ZM19.1636 6.04553L20.5986 4.80541L19.3585 3.37042L17.9235 4.61054L19.1636 6.04553ZM26.75 14.8241H28.6466V14.1181L28.185 13.584L26.75 14.8241ZM26.75 16.0642L28.185 17.3043L28.6466 16.7702V16.0642H26.75ZM19.5851 24.3551L18.3449 25.7901L19.7799 27.0302L21.0201 25.5952L19.5851 24.3551ZM18.1501 23.1149L16.7151 21.8748L15.475 23.3098L16.91 24.5499L18.1501 23.1149ZM6.81052 8.52577L12.8313 15.4927L15.7013 13.0125L9.68051 6.04553L6.81052 8.52577ZM8.44039 4.61054L7.0054 5.85066L9.48563 8.72064L10.9206 7.48053L8.44039 4.61054ZM18.7019 13.584L11.1155 4.80541L8.24551 7.28565L15.8319 16.0642L18.7019 13.584ZM19.1635 16.0642V14.8241H15.3703V16.0642H19.1635ZM11.537 25.5952L18.7019 17.3043L15.8319 14.8241L8.66698 23.1149L11.537 25.5952ZM7.42686 24.5499L8.86186 25.7901L11.3421 22.9201L9.9071 21.6799L7.42686 24.5499ZM13.2518 14.9091L7.23199 21.8748L10.102 24.3551L16.1218 17.3893L13.2518 14.9091ZM14.6868 14.2526L3.27321 14.2526L3.27321 18.0458L14.6868 18.0458V14.2526ZM5.16981 16.1492L5.16981 14.2526H1.37661L1.37661 16.1492H5.16981ZM3.27321 16.1492L14.2663 16.1492V12.356L3.27321 12.356L3.27321 16.1492ZM16.2936 8.52577L23.3442 16.6843L26.2142 14.204L19.1636 6.04553L16.2936 8.52577ZM17.9235 4.61054L16.4885 5.85066L18.9687 8.72064L20.4037 7.48053L17.9235 4.61054ZM28.185 13.584L20.5986 4.80541L17.7286 7.28565L25.315 16.0642L28.185 13.584ZM28.6466 16.0642V14.8241H24.8534V16.0642H28.6466ZM21.0201 25.5952L28.185 17.3043L25.315 14.8241L18.1501 23.1149L21.0201 25.5952ZM16.91 24.5499L18.3449 25.7901L20.8252 22.9201L19.3902 21.6799L16.91 24.5499ZM23.3442 14.204L16.7151 21.8748L19.5851 24.3551L26.2142 16.6843L23.3442 14.204Z"
            fill="#2B2B2B"
            mask="url(#path-1-outside-1_345_232)"
          />
        </svg>
      ),
    },
    {
      id: "pipeline-placeholder-5",
      item: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 30 30"
          className={cn("flex", width, height, color, position)}
        >
          <g>
            <mask
              id="path-1-outside-1_345_255"
              maskUnits="userSpaceOnUse"
              x="2.83218"
              y="2.94653"
              width="18"
              height="25"
              fill="black"
            >
              <rect
                fill="white"
                x="2.83218"
                y="2.94653"
                width="18"
                height="25"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.93379 5.94653H5.83218V8.04814H7.93379V5.94653ZM10.0354 5.94654H7.93383V8.0477V8.04815V10.1493H10.0354V8.04815V8.0477V5.94654ZM12.1371 8.0477H10.0355V10.1489V10.1493V12.2505H12.137V14.3517H14.2386V12.2505V12.25V10.1489H12.1371V8.0477ZM16.3402 12.25H14.2386V14.3517H16.3402V12.25ZM14.2386 14.3526H16.3402V16.4538V16.4542V18.5554H14.2386V16.4542V16.4538V14.3526ZM18.4419 14.3526H16.3403V16.4542H18.4419V14.3526ZM14.2386 16.4538H12.137V18.555H10.0355V20.6561V20.6566V22.7577H12.1371V20.6566H14.2386V18.5554V18.555V16.4538ZM7.93383 20.6561H10.0354V22.7577H7.93383V20.6561ZM5.83221 22.7587H7.93382V24.8603H5.83221V22.7587ZM10.0354 22.7587H7.93383V24.8603H10.0354V22.7587Z"
              />
            </mask>
            <path
              d="M5.83218 5.94653V3.84493H3.73057V5.94653H5.83218ZM7.93379 5.94653H10.0354V3.84493H7.93379V5.94653ZM5.83218 8.04814H3.73057V10.1497H5.83218V8.04814ZM7.93379 8.04814V10.1497H10.0354V8.04814H7.93379ZM7.93383 5.94654V3.84493H5.83222V5.94654H7.93383ZM10.0354 5.94654H12.137V3.84493H10.0354V5.94654ZM7.93383 10.1493H5.83222V12.2509H7.93383V10.1493ZM10.0354 10.1493V12.2509H12.137V10.1493H10.0354ZM10.0355 8.0477V5.94609H7.93385V8.0477H10.0355ZM12.1371 8.0477H14.2387V5.94609H12.1371V8.0477ZM10.0355 12.2505H7.93385V14.3521H10.0355V12.2505ZM12.137 12.2505H14.2386V10.1489H12.137V12.2505ZM12.137 14.3517H10.0353V16.4533H12.137V14.3517ZM14.2386 14.3517V16.4533H16.3402V14.3517H14.2386ZM14.2386 10.1489H16.3402V8.04728H14.2386V10.1489ZM12.1371 10.1489H10.0355V12.2505H12.1371V10.1489ZM14.2386 12.25V10.1484H12.137V12.25H14.2386ZM16.3402 12.25H18.4418V10.1484H16.3402V12.25ZM14.2386 14.3517H12.137V16.4533H14.2386V14.3517ZM16.3402 14.3517V16.4533H18.4418V14.3517H16.3402ZM16.3402 14.3526H18.4418V12.251H16.3402V14.3526ZM14.2386 14.3526V12.251H12.137V14.3526H14.2386ZM16.3402 18.5554V20.657H18.4418V18.5554H16.3402ZM14.2386 18.5554H12.137V20.657H14.2386V18.5554ZM16.3403 14.3526V12.251H14.2387V14.3526H16.3403ZM18.4419 14.3526H20.5435V12.251H18.4419V14.3526ZM16.3403 16.4542H14.2387V18.5558H16.3403V16.4542ZM18.4419 16.4542V18.5558H20.5435V16.4542H18.4419ZM12.137 16.4538V14.3522H10.0353V16.4538H12.137ZM14.2386 16.4538H16.3402V14.3522H14.2386V16.4538ZM12.137 18.555V20.6566H14.2386V18.555H12.137ZM10.0355 18.555V16.4534H7.93385V18.555H10.0355ZM10.0355 22.7577H7.93385V24.8594H10.0355V22.7577ZM12.1371 22.7577V24.8594H14.2387V22.7577H12.1371ZM12.1371 20.6566V18.555H10.0355V20.6566H12.1371ZM14.2386 20.6566V22.7582H16.3402V20.6566H14.2386ZM10.0354 20.6561H12.137V18.5545H10.0354V20.6561ZM7.93383 20.6561V18.5545H5.83222V20.6561H7.93383ZM10.0354 22.7577V24.8594H12.137V22.7577H10.0354ZM7.93383 22.7577H5.83222V24.8594H7.93383V22.7577ZM7.93382 22.7587H10.0354V20.6571H7.93382V22.7587ZM5.83221 22.7587V20.6571H3.7306V22.7587H5.83221ZM7.93382 24.8603V26.9619H10.0354V24.8603H7.93382ZM5.83221 24.8603H3.7306V26.9619H5.83221V24.8603ZM7.93383 22.7587V20.6571H5.83222V22.7587H7.93383ZM10.0354 22.7587H12.137V20.6571H10.0354V22.7587ZM7.93383 24.8603H5.83222V26.9619H7.93383V24.8603ZM10.0354 24.8603V26.9619H12.137V24.8603H10.0354ZM5.83218 8.04814H7.93379V3.84493H5.83218V8.04814ZM7.93379 8.04814V5.94653H3.73057V8.04814H7.93379ZM7.93379 5.94653H5.83218V10.1497H7.93379V5.94653ZM5.83218 5.94653V8.04814H10.0354V5.94653H5.83218ZM7.93383 8.04815H10.0354V3.84493H7.93383V8.04815ZM10.0354 8.0477V5.94654H5.83222V8.0477H10.0354ZM10.0354 8.04815V8.0477H5.83222V8.04815H10.0354ZM10.0354 10.1493V8.04815H5.83222V10.1493H10.0354ZM10.0354 8.0477H7.93383V12.2509H10.0354V8.0477ZM7.93383 8.04815V10.1493H12.137V8.04815H7.93383ZM7.93383 8.0477V8.04815H12.137V8.0477H7.93383ZM7.93383 5.94654V8.0477H12.137V5.94654H7.93383ZM10.0355 10.1493H12.1371V5.94609H10.0355V10.1493ZM12.1371 10.1489V8.0477H7.93385V10.1489H12.1371ZM12.1371 10.1493V10.1489H7.93385V10.1493H12.1371ZM12.1371 12.2505V10.1493H7.93385V12.2505H12.1371ZM12.137 10.1489H10.0355V14.3521H12.137V10.1489ZM14.2386 14.3517V12.2505H10.0353V14.3517H14.2386ZM14.2386 12.25H12.137V16.4533H14.2386V12.25ZM12.137 12.2505V14.3517H16.3402V12.2505H12.137ZM12.137 12.25V12.2505H16.3402V12.25H12.137ZM12.137 10.1489V12.25H16.3402V10.1489H12.137ZM12.1371 12.2505H14.2386V8.04728H12.1371V12.2505ZM10.0355 8.0477V10.1489H14.2387V8.0477H10.0355ZM14.2386 14.3517H16.3402V10.1484H14.2386V14.3517ZM16.3402 14.3517V12.25H12.137V14.3517H16.3402ZM16.3402 12.25H14.2386V16.4533H16.3402V12.25ZM14.2386 12.25V14.3517H18.4418V12.25H14.2386ZM16.3402 12.251H14.2386V16.4542H16.3402V12.251ZM18.4418 16.4538V14.3526H14.2386V16.4538H18.4418ZM18.4418 16.4542V16.4538H14.2386V16.4542H18.4418ZM18.4418 18.5554V16.4542H14.2386V18.5554H18.4418ZM14.2386 20.657H16.3402V16.4538H14.2386V20.657ZM12.137 16.4542V18.5554H16.3402V16.4542H12.137ZM12.137 16.4538V16.4542H16.3402V16.4538H12.137ZM12.137 14.3526V16.4538H16.3402V14.3526H12.137ZM16.3403 16.4542H18.4419V12.251H16.3403V16.4542ZM18.4419 16.4542V14.3526H14.2387V16.4542H18.4419ZM18.4419 14.3526H16.3403V18.5558H18.4419V14.3526ZM16.3403 14.3526V16.4542H20.5435V14.3526H16.3403ZM12.137 18.5554H14.2386V14.3522H12.137V18.5554ZM14.2386 18.555V16.4538H10.0353V18.555H14.2386ZM10.0355 20.6566H12.137V16.4534H10.0355V20.6566ZM12.1371 20.6561V18.555H7.93385V20.6561H12.1371ZM12.1371 20.6566V20.6561H7.93385V20.6566H12.1371ZM12.1371 22.7577V20.6566H7.93385V22.7577H12.1371ZM12.1371 20.6561H10.0355V24.8594H12.1371V20.6561ZM10.0355 20.6566V22.7577H14.2387V20.6566H10.0355ZM14.2386 18.555H12.1371V22.7582H14.2386V18.555ZM12.137 18.5554V20.6566H16.3402V18.5554H12.137ZM12.137 18.555V18.5554H16.3402V18.555H12.137ZM12.137 16.4538V18.555H16.3402V16.4538H12.137ZM10.0354 18.5545H7.93383V22.7577H10.0354V18.5545ZM12.137 22.7577V20.6561H7.93383V22.7577H12.137ZM7.93383 24.8594H10.0354V20.6561H7.93383V24.8594ZM5.83222 20.6561V22.7577H10.0354V20.6561H5.83222ZM7.93382 20.6571H5.83221V24.8603H7.93382V20.6571ZM10.0354 24.8603V22.7587H5.83221V24.8603H10.0354ZM5.83221 26.9619H7.93382V22.7587H5.83221V26.9619ZM3.7306 22.7587V24.8603H7.93382V22.7587H3.7306ZM7.93383 24.8603H10.0354V20.6571H7.93383V24.8603ZM10.0354 24.8603V22.7587H5.83222V24.8603H10.0354ZM10.0354 22.7587H7.93383V26.9619H10.0354V22.7587ZM7.93383 22.7587V24.8603H12.137V22.7587H7.93383Z"
              fill="#2B2B2B"
              mask="url(#path-1-outside-1_345_255)"
            />
            <mask
              id="path-3-outside-2_345_255"
              maskUnits="userSpaceOnUse"
              x="11.2388"
              y="2.94653"
              width="18"
              height="25"
              fill="black"
            >
              <rect
                fill="white"
                x="11.2388"
                y="2.94653"
                width="18"
                height="25"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.3404 5.94653H14.2388V8.04814H16.3404V8.04815V10.1493H18.442V8.04815V8.0477V5.94654H16.3404V5.94653ZM20.5436 8.0477H18.442V10.1489V10.1493V12.2505H20.5435V14.3517H22.6451H22.6451H24.7467V12.25H22.6451V10.1489H20.5436V8.0477ZM22.6451 14.3526H24.7467V16.4538V16.4542V18.5554H22.6451V20.6566H20.5436V22.7577H18.442V20.6566V20.6561V18.555H20.5435V16.4538H22.6451V14.3526ZM26.8484 14.3526H24.7468V16.4542H26.8484V14.3526ZM16.3404 20.6561H18.442V22.7577H16.3404V20.6561ZM14.2388 22.7587H16.3404H16.3404H18.442V24.8603H16.3404H16.3404H14.2388V22.7587Z"
              />
            </mask>
            <path
              d="M14.2388 5.94653V3.84493H12.1372V5.94653H14.2388ZM16.3404 5.94653H18.442V3.84493H16.3404V5.94653ZM14.2388 8.04814H12.1372V10.1497H14.2388V8.04814ZM16.3404 8.04814H18.442V5.94653H16.3404V8.04814ZM16.3404 10.1493H14.2387V12.2509H16.3404V10.1493ZM18.442 10.1493V12.2509H20.5436V10.1493H18.442ZM18.442 5.94654H20.5436V3.84493H18.442V5.94654ZM16.3404 5.94654H14.2388V8.04815H16.3404V5.94654ZM18.442 8.0477V5.94609H16.3404V8.0477H18.442ZM20.5436 8.0477H22.6452V5.94609H20.5436V8.0477ZM18.442 12.2505H16.3404V14.3521H18.442V12.2505ZM20.5435 12.2505H22.6451V10.1489H20.5435V12.2505ZM20.5435 14.3517H18.4419V16.4533H20.5435V14.3517ZM24.7467 14.3517V16.4533H26.8483V14.3517H24.7467ZM24.7467 12.25H26.8483V10.1484H24.7467V12.25ZM22.6451 12.25H20.5435V14.3517H22.6451V12.25ZM22.6451 10.1489H24.7467V8.04728H22.6451V10.1489ZM20.5436 10.1489H18.442V12.2505H20.5436V10.1489ZM24.7467 14.3526H26.8483V12.251H24.7467V14.3526ZM22.6451 14.3526V12.251H20.5435V14.3526H22.6451ZM24.7467 18.5554V20.657H26.8483V18.5554H24.7467ZM22.6451 18.5554V16.4538H20.5435V18.5554H22.6451ZM22.6451 20.6566V22.7582H24.7467V20.6566H22.6451ZM20.5436 20.6566V18.555H18.442V20.6566H20.5436ZM20.5436 22.7577V24.8594H22.6452V22.7577H20.5436ZM18.442 22.7577H16.3404V24.8594H18.442V22.7577ZM18.442 18.555V16.4534H16.3404V18.555H18.442ZM20.5435 18.555V20.6566H22.6451V18.555H20.5435ZM20.5435 16.4538V14.3522H18.4419V16.4538H20.5435ZM22.6451 16.4538V18.5554H24.7467V16.4538H22.6451ZM24.7468 14.3526V12.251H22.6452V14.3526H24.7468ZM26.8484 14.3526H28.95V12.251H26.8484V14.3526ZM24.7468 16.4542H22.6452V18.5558H24.7468V16.4542ZM26.8484 16.4542V18.5558H28.95V16.4542H26.8484ZM18.442 20.6561H20.5436V18.5545H18.442V20.6561ZM16.3404 20.6561V18.5545H14.2387V20.6561H16.3404ZM18.442 22.7577V24.8594H20.5436V22.7577H18.442ZM16.3404 22.7577H14.2387V24.8594H16.3404V22.7577ZM14.2388 22.7587V20.6571H12.1372V22.7587H14.2388ZM18.442 22.7587H20.5436V20.6571H18.442V22.7587ZM18.442 24.8603V26.9619H20.5436V24.8603H18.442ZM14.2388 24.8603H12.1372V26.9619H14.2388V24.8603ZM14.2388 8.04814H16.3404V3.84493H14.2388V8.04814ZM16.3404 8.04814V5.94653H12.1372V8.04814H16.3404ZM16.3404 5.94653H14.2388V10.1497H16.3404V5.94653ZM18.442 8.04815V8.04814H14.2387V8.04815H18.442ZM18.442 10.1493V8.04815H14.2387V10.1493H18.442ZM18.442 8.0477H16.3404V12.2509H18.442V8.0477ZM16.3404 8.04815V10.1493H20.5436V8.04815H16.3404ZM16.3404 8.0477V8.04815H20.5436V8.0477H16.3404ZM16.3404 5.94654V8.0477H20.5436V5.94654H16.3404ZM16.3404 8.04815H18.442V3.84493H16.3404V8.04815ZM14.2388 5.94653V5.94654H18.442V5.94653H14.2388ZM18.442 10.1493H20.5436V5.94609H18.442V10.1493ZM20.5436 10.1489V8.0477H16.3404V10.1489H20.5436ZM20.5436 10.1493V10.1489H16.3404V10.1493H20.5436ZM20.5436 12.2505V10.1493H16.3404V12.2505H20.5436ZM20.5435 10.1489H18.442V14.3521H20.5435V10.1489ZM22.6451 14.3517V12.2505H18.4419V14.3517H22.6451ZM22.6451 12.25H20.5435V16.4533H22.6451V12.25ZM22.6451 12.25H22.6451V16.4533H22.6451V12.25ZM24.7467 12.25H22.6451V16.4533H24.7467V12.25ZM22.6451 12.25V14.3517H26.8483V12.25H22.6451ZM22.6451 14.3517H24.7467V10.1484H22.6451V14.3517ZM20.5435 10.1489V12.25H24.7467V10.1489H20.5435ZM20.5436 12.2505H22.6451V8.04728H20.5436V12.2505ZM18.442 8.0477V10.1489H22.6452V8.0477H18.442ZM24.7467 12.251H22.6451V16.4542H24.7467V12.251ZM26.8483 16.4538V14.3526H22.6451V16.4538H26.8483ZM26.8483 16.4542V16.4538H22.6451V16.4542H26.8483ZM26.8483 18.5554V16.4542H22.6451V18.5554H26.8483ZM22.6451 20.657H24.7467V16.4538H22.6451V20.657ZM24.7467 20.6566V18.5554H20.5435V20.6566H24.7467ZM20.5436 22.7582H22.6451V18.555H20.5436V22.7582ZM22.6452 22.7577V20.6566H18.442V22.7577H22.6452ZM18.442 24.8594H20.5436V20.6561H18.442V24.8594ZM16.3404 20.6566V22.7577H20.5436V20.6566H16.3404ZM16.3404 20.6561V20.6566H20.5436V20.6561H16.3404ZM16.3404 18.555V20.6561H20.5436V18.555H16.3404ZM20.5435 16.4534H18.442V20.6566H20.5435V16.4534ZM18.4419 16.4538V18.555H22.6451V16.4538H18.4419ZM22.6451 14.3522H20.5435V18.5554H22.6451V14.3522ZM20.5435 14.3526V16.4538H24.7467V14.3526H20.5435ZM24.7468 16.4542H26.8484V12.251H24.7468V16.4542ZM26.8484 16.4542V14.3526H22.6452V16.4542H26.8484ZM26.8484 14.3526H24.7468V18.5558H26.8484V14.3526ZM24.7468 14.3526V16.4542H28.95V14.3526H24.7468ZM18.442 18.5545H16.3404V22.7577H18.442V18.5545ZM20.5436 22.7577V20.6561H16.3404V22.7577H20.5436ZM16.3404 24.8594H18.442V20.6561H16.3404V24.8594ZM14.2387 20.6561V22.7577H18.442V20.6561H14.2387ZM16.3404 20.6571H14.2388V24.8603H16.3404V20.6571ZM16.3404 24.8603H16.3404V20.6571H16.3404V24.8603ZM16.3404 24.8603H18.442V20.6571H16.3404V24.8603ZM16.3404 22.7587V24.8603H20.5436V22.7587H16.3404ZM18.442 22.7587H16.3404V26.9619H18.442V22.7587ZM16.3404 22.7587H16.3404V26.9619H16.3404V22.7587ZM14.2388 26.9619H16.3404V22.7587H14.2388V26.9619ZM12.1372 22.7587V24.8603H16.3404V22.7587H12.1372Z"
              fill="#2B2B2B"
              mask="url(#path-3-outside-2_345_255)"
            />
          </g>
        </svg>
      ),
    },
    {
      id: "pipeline-placeholder-6",
      item: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 30 30"
          className={cn("flex", width, height, color, position)}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M27.5092 13.7457L28.9999 15.1228L27.5092 16.4998L23.4366 20.262L21.4135 22.1308V19.3767V16.206L17.3677 16.206L17.3677 14.183L21.4135 14.183V10.8689V8.11475L23.4366 9.98355L27.5092 13.7457ZM23.4366 16.206H23.4369V14.183H23.4366V12.7377L26.0185 15.1228L23.4366 17.5079V16.206Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.325 13.7457L12.8157 15.1228L11.325 16.4998L7.25235 20.262L5.22931 22.1308V19.3767V16.206L1.18345 16.206L1.18345 14.183L5.22931 14.183V10.8689V8.11475L7.25235 9.98355L11.325 13.7457ZM7.25235 16.206H7.25257V14.183H7.25235V12.7377L9.8343 15.1228L7.25235 17.5079V16.206Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.4169 5.65471L20.9076 7.03177L19.4169 8.40882L15.3443 12.171L13.3212 14.0398V11.2857V8.11579L9.27536 8.11578L9.27536 6.09274L13.3212 6.09274V2.77786V0.0237427L15.3443 1.89255L19.4169 5.65471ZM15.3443 8.11579H15.3445V6.09274H15.3443V4.64666L17.9262 7.03177L15.3443 9.41687V8.11579Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.4169 21.8403L20.9076 23.2173L19.4169 24.5944L15.3443 28.3565L13.3212 30.2253V27.4712V24.3012L9.27536 24.3012L9.27536 22.2782L13.3212 22.2782V18.9634V16.2093L15.3443 18.0781L19.4169 21.8403ZM15.3443 24.3012H15.3445V22.2782H15.3443V20.8322L17.9262 23.2173L15.3443 25.6024V24.3012Z"
          />
        </svg>
      ),
    },
  ];

  return (
    <TablePlaceholderBase
      placeholderItems={placeholderItems}
      placeholderTitle="No pipeline"
      createButtonLink="/pipelines/create"
      createButtonTitle="Set up your first pipeline"
      marginBottom={marginBottom}
      enableCreateButton={enableCreateButton}
    />
  );
};
